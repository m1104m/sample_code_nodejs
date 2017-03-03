"use strict";

// モジュール
var path = require("path");
var fs = require("fs");
var http = require("http");
var https = require("https");

// 変数の初期化
var curDir = process.argv[1];
var p = path.resolve(curDir, "../dl.png");
var url = "https://www.google.co.jp/images/nav_logo195.png";

// pipeでテキストも保存可能
//var p = path.resolve(curDir, "../dl.txt");
//var url = "https://www.google.co.jp/webhp?hl=ja";

//------------------------------------------------------------

// 実行
console.log("--------------------");

// URLをテキストとして取得
https.get(url, function(res) {
	var w = fs.createWriteStream(p);

	// データの受け取り
	res.pipe(w);

	// 終了
	res.on("end", function() {
		console.log("[End]");
		w.close();
	});
}).on("error", function(err) {
	// エラー時の処理
    console.log("[Err]", err.message);
});

console.log("--------------------");

