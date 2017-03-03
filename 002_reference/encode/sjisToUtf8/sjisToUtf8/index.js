"use strict";

// モジュール
var path = require("path");
var fs = require("fs");
var Encoding = require("encoding-japanese");

// 変数の初期化
var curDir = process.argv[1];
var p1 = path.resolve(curDir, "../test.txt");
var p2 = path.resolve(curDir, "../copy1.txt");
var p3 = path.resolve(curDir, "../copy2.txt");

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

// SJISからUTF8にコンバート
(function() {
	// バイナリ読み込み
	var bin = read(p1);
	console.log(Encoding.detect(bin));	// 文字コード判定
	console.log("bin : ", bin);

	// SJISからUNICODEにコンバート
	// UNICODE は JavaScript の String.charCodeAt() の値を持つ配列
	var txt = Encoding.convert(bin,
		{to: "UNICODE", from: "SJIS", type: "string"}
	);
	console.log("txt : ", txt);

	// バイナリ書き込み
	write(p2, txt);
})();

// UTF8からSJISにコンバート
(function() {
	// バイナリ読み込み
	var bin = read(p2);
	console.log(Encoding.detect(bin));
	console.log("bin : ", bin);

	// UTF8からSJISにコンバート
	var arr = Encoding.convert(bin,
		{to: "SJIS", from: "UTF8", type: "array"}
	);
	var buf = new Buffer(arr.length);
	for (var i = 0; i < arr.length; i ++) {buf[i] = arr[i]}
	console.log("buf : ", buf);

	// バイナリ書き込み
	write(p3, buf);
})();

console.log("--------------------");

