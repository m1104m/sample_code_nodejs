"use strict";

// モジュール
var path = require("path");
var fs = require("fs");

// 変数の初期化
var curDir = process.argv[1];
var p1 = path.resolve(curDir, "../src.png");
var p2 = path.resolve(curDir, "../dst.png");

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

// 実行
console.log("--------------------");

// バイナリ読み込み
var bin = read(p1);
console.log(bin.length);
console.log(bin);

// カラーマップを書き換え(RGBを2回分)
bin[13] = 0xff;
bin[14] = 0x80;
bin[15] = 0x00;

bin[16] = 0x00;
bin[17] = 0x80;
bin[18] = 0xff;

// バイナリ書き込み
write(p2, bin);

console.log("--------------------");

