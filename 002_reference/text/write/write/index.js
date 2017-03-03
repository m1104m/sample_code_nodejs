"use strict";

// モジュール
var path = require("path");
var fs = require("fs");

// 変数の初期化
var curDir = process.argv[1];
var p1 = path.resolve(curDir, "../test1.txt");
var p2 = path.resolve(curDir, "../test2.txt");

//------------------------------------------------------------

// テキスト書き込み1 非同期
var write1 = function(p, txt, callback) {
	fs.writeFile(p, txt, "utf8", function(err) {
		var res = "ok";
		if (err) {
			console.log("[Err] : " + err);
			res = "err";
		}
		callback(res);
	});
};

// テキスト書き込み2 同期
var write2 = function(p, txt) {
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

var txt = "あいうえお\nかきくけこ\n";

// 非同期実行
write1(p1, txt, function(res) {
	console.log("--< read1 >------------------");
	console.log(res);
});

// 同期実行
console.log("--< read2 >------------------");
var res = write2(p2, txt);
console.log(res);

