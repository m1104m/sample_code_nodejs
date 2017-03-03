"use strict";

// モジュール
var path = require("path");
var fs = require("fs");

// 変数の初期化
var curDir = process.argv[1];
var p = path.resolve(curDir, "../");

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

//------------------------------------------------------------

// 実行
console.log("--------------------");
walk(p, function(fp) {
	console.log(path.relative(p, fp));
});
console.log("--------------------");

