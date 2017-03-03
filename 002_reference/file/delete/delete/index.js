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

// コピー シンプル
var copy = function(p1, p2, callback) {
	// 読み込みと書き込みのストリーム作成
	var r = fs.createReadStream(p1),
		w = fs.createWriteStream(p2);

	// パイプで実行
	r.pipe(w);
};

// 削除1 非同期
var del1 = function(p, callback) {
	fs.unlink(p, function(err) {
		if (err) {
			callback(err);
		} else {
			callback("ok");
		}
	});
};

// 削除2 同期
var del2 = function(p, callback) {
	try {
		fs.unlinkSync(p);
		callback("ok");
	} catch(e) {
		callback(e);
	}
};

//------------------------------------------------------------

// 実行
console.log("--------------------");
copy(p1, p2);
copy(p1, p3);

setTimeout(function() {
	del1(p2, function(res) {
		console.log("del1", res);
	});
}, 2000)
setTimeout(function() {
	del2(p3, function(res) {
		console.log("del2", res);
	});
}, 4000)
console.log("--------------------");


