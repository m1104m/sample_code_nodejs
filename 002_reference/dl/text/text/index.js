"use strict";

// モジュール
var path = require("path");
var fs = require("fs");
var http = require("http");
var https = require("https");

// 変数の初期化
var curDir = process.argv[1];
var p = path.resolve(curDir, "../dl.txt");
var url = "http://www.yahoo.co.jp/";

//------------------------------------------------------------

// テキスト書き込み 同期
var write = function(p, txt) {
	var res = "ok";
	try {
		fs.writeFileSync(p, txt, "utf8");
	} catch(e) {
		console.log("[Err] : " + e);
		res = "err";
	}
	return res;
};

//------------------------------------------------------------

// 実行
console.log("--------------------");

// URLをテキストとして取得
var req = http.get(url, function(res) {
	var txt = "";

	// エンコーディングの指定
	res.setEncoding("utf8");

	// データの受け取り
	res.on("data", function(d) {
		console.log("data: ", d.length);
		txt += d;
	});

	// 終了
	res.on("end", function() {
		console.log("[End]");
		write(p, txt);
	});
});

// エラー時の処理
req.on("error", function(err) {
    console.log("[Err]", err);
});

console.log("--------------------");

