"use strict";

// モジュール
var path = require("path");
var fs = require("fs");
var JSZip = require("jszip");

// 変数の初期化
var curDir = process.argv[1];
var p1 = path.resolve(curDir, "../srcFiles");
var p2 = path.resolve(curDir, "../srcFiles.zip");

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
			callback(fp); // ファイルならコールバックで通知
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

//------------------------------------------------------------

// ZIP化
var doZip = function(pSrc, pDst) {
	// JSZipの初期化
	var zip = new JSZip();

	// フォルダ内を走査
	walk(pSrc, function(pRes) {
		// ファイル読み込み
		var d = read(pRes);

		// 基準ディレクトリからの相対パス
		var pDif = path.relative(pSrc, pRes);
		pDif = pDif.replace(/\\/g, "/");

		// ZIPに格納
		zip.file(pDif, d);
	});

	// データをバッファに格納して書き込み
	var arr = zip.generate({type : "uint8array"});
	var buf = new Buffer(arr.length);
	for (var i = 0; i < arr.length; i ++) {buf[i] = arr[i]}
	write(pDst, buf);
};

//------------------------------------------------------------

// 実行
console.log("--------------------");

doZip(p1, p2);

console.log("--------------------");

