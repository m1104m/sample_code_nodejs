"use strict";

// モジュール
var path = require("path");
var fs = require("fs");
var JSZip = require("jszip");

// 変数の初期化
var curDir = process.argv[1];
var p1 = path.resolve(curDir, "../srcFiles.zip");
var p2 = path.resolve(curDir, "../dstFiles");

//------------------------------------------------------------

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

// 展開
var doUnzip = function(pSrc, pDst) {
	// JSZipの初期化
	var zip = new JSZip();

	// データの読み込み
	var d = read(pSrc);
	zip.load(d);
	//console.log(zip.files);	// 情報出力

	// 展開
	for (var key in zip.files) {
		// パスの取り出し
		var p = zip.files[key].name;

		if (p.indexOf("..") >= 0) {return}	// 不正対策
		if (p.indexOf(":") >= 0) {return}	// 不正対策

		// 出力
		var pOut = path.resolve(pDst, p);
		var d = zip.file(key)._data.getContent();
		mkDirs(pOut);	// 階層付きディレクトリ作成
		write(pOut, d);
	}
};

// 階層付きディレクトリ作成
// p - 要ファイル名。path.dirname は、/や\以降を、1つ取り除くだけの挙動をするため。
var mkDirs = function(p) {
	// ディレクトリ名を取り出し、最上階層なら終了
	var dirNm = path.dirname(p);

	// ディレクトリが存在していれば終了
	try {
		var stats = fs.statSync(dirNm);
		return;
	} catch(e) {}

	// 再帰
	mkDirs(dirNm);
	fs.mkdirSync(dirNm);
}

//------------------------------------------------------------

// 実行
console.log("--------------------");

doUnzip(p1, p2);

console.log("--------------------");

