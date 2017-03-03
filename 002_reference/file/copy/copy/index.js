"use strict";

// モジュール
var path = require("path");
var fs = require("fs");

// 変数の初期化
var curDir = process.argv[1];
var p1 = path.resolve(curDir, "../test.txt");
var p2 = path.resolve(curDir, "../copy1.txt");
var p3 = path.resolve(curDir, "../copy2.txt");

//------------------------------------------------------------

// コピー1 シンプル
var copy1 = function(p1, p2) {
	// 読み込みと書き込みのストリーム作成
	var r = fs.createReadStream(p1),
		w = fs.createWriteStream(p2);

	// パイプで実行
	r.pipe(w);
};

// コピー2 丁寧
var copy2 = function(p1, p2, callback) {
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

//------------------------------------------------------------

// 実行
console.log("--------------------");
copy1(p1, p2);
copy2(p1, p3, function(res) {
	console.log(res);
});
console.log("--------------------");

