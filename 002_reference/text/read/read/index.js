"use strict";

// モジュール
var path = require("path");
var fs = require("fs");

// 変数の初期化
var curDir = process.argv[1];
var p = path.resolve(curDir, "../test.txt");

//------------------------------------------------------------

// テキスト読み込み1 非同期
var read1 = function(p, callback) {
	fs.readFile(p, "utf8", function(err, data) {
		var txt = null;
		if (err) {
			console.log("[Err] : " + err);
		} else {
			txt = data;
		}
		callback(txt);
	});
};

// テキスト読み込み2 同期
var read2 = function(p) {
	var txt = null;
	try {
		txt = fs.readFileSync(p, "utf8");
	} catch(e) {
		console.log("[Err] : " + e);
	}
	return txt;
};

//------------------------------------------------------------

// 非同期実行
read1(p, function(txt) {
	console.log("--< read1 >------------------");
	console.log(txt);
});

// 同期実行
console.log("--< read2 >------------------");
var txt = read2(p);
console.log(txt);

