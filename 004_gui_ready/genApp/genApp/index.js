"use strict";

// モジュール
var path = require("path");
var fs = require("fs");
var execSync = require("child_process").execSync;
var util = require("util");

// 変数の初期化
var curDir = process.argv[1];
var pAppZip = path.resolve(curDir, "../app.zip");
var pAppNw = path.resolve(curDir, "../app.nw");
var p7Zip = path.resolve(curDir, "../7z-extra/7za.exe");

// 出力先の初期化
var pArg = process.argv[2];
var pBin = path.resolve(pArg, "../bin") + path.sep;

// NW.jsのパスの初期化
var pNW = {};
pNW.nw_exe     = process.env.NW_PATH;
pNW.dir        = path.dirname(pNW.nw_exe) + path.sep;
pNW.nw_pak     = pNW.dir + "nw.pak";
pNW.icudtl_dat = pNW.dir + "icudtl.dat";

// NW.jsのパスの初期化
var pOut = {};
pOut.dir        = path.resolve(curDir, "../output") + path.sep;
pOut.nw_exe     = pOut.dir + "nw.exe";
pOut.nw_pak     = pOut.dir + "nw.pak";
pOut.icudtl_dat = pOut.dir + "icudtl.dat";

//------------------------------------------------------------

// ディレクトリ走査
var walk = function(p, callback) {
	// 一覧を取得
	try {
		var files = fs.readdirSync(p);
	} catch(e) {
		console.log("[Err Walk] : " + e);
		return;
	}

	// 一覧を処理
	files.forEach(function(f) {
		var fp = path.join(p, f); // フルパスに
		if(fs.statSync(fp).isDirectory()) {
			walk(fp, callback); // ディレクトリなら再帰
		} else {
			callback(fp); // コールバックで通知
		}
	});
};

// バイナリ読み込み 同期
var read = function(p) {
	var bin = "";
	try {
		bin = fs.readFileSync(p);
	} catch(e) {
		console.log("[Err] : " + e);
	}
	return bin;
};

// バイナリ書き込み 同期
var write = function(p, bin) {
	var res = "ok";
	try {
		fs.writeFileSync(p, bin);
	} catch(e) {
		console.log("[Err] : " + e);
		res = "err";
	}
	return res;
};

// コピー 丁寧
var copy = function(p1, p2, callback) {
	// 読み込みと書き込みのストリーム作成
	var r = fs.createReadStream(p1),
		w = fs.createWriteStream(p2);

	// 実行時関数
	var isFirst = true;
	var done = function(res) {
		if (! isFirst) {return}
		if (typeof callback === "function") {callback(res)}
		isFirst = false;
	}

	// イベントの登録
	r.on("error", function (err) {done(err)});
	w.on("error", function (err) {done(err)});
	w.on("close", function (ex)  {done("end")});

	// パイプで実行
	r.pipe(w);
};

// 削除 同期
var del = function(p) {
	try {
		fs.unlinkSync(p);
	} catch(e) {
	}
};


// ディレクトリか確認
var isDir = function(p) {
	try {
		var stats = fs.statSync(p);
		return stats.isDirectory();
	} catch(e) {
		return false;
	}
};

//------------------------------------------------------------

// ZIP化
var doZip = function(pSrc, pDst) {
	// ディレクトリ内の一覧を作成
	var pSrcs = []
	var arr = fs.readdirSync(pSrc);
	for (var i = 0; i < arr.length; i ++) {
		 pSrcs.push(path.resolve(pSrc, arr[i]));
	}

	// コマンドの初期化
	var cmd = util.format(
		'"%s" a -mcu=on -tzip "%s" "%s"',
		p7Zip, pDst, pSrcs.join('" "')
	);

	// 同期で実行
	execSync(cmd);
};

//------------------------------------------------------------

// 引数の有効性を確認
if (pArg === undefined) {process.exit(0)}	// 引数がないので終了
if (! isDir(pArg)) {process.exit(0)}	// ディレクトリでないので終了

// ZIP圧縮
console.log("[ZIP圧縮]");
doZip(pArg, pAppZip);
copy(pAppZip, pAppNw);
del(pAppZip);

// NW.js関連ファイルのコピー
console.log("[NW.js関連ファイルのコピー]");
copy(pNW.nw_pak, pOut.nw_pak);
copy(pNW.icudtl_dat, pOut.icudtl_dat);
copy(pNW.nw_exe, pOut.nw_exe, function(res) {
	// NW.jsとapp.nwの結合
	console.log("[NW.jsとapp.nwの結合]");
	var data = read(pAppNw);
	fs.appendFile(pOut.nw_exe, data, function() {});
	del(pAppNw);

	// binへの転送
	if (isDir(pBin)) {
		// フォルダ内を走査
		console.log("[binへの転送]");
		walk(pOut.dir, function(pRes) {
			var pSrc = pRes;
			var pDst = pBin + path.basename(pRes);
			copy(pSrc, pDst, function(res) {
				del(pSrc);	// 転送後削除
			});
		});
	}
});
