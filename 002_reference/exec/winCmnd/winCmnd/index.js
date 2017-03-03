"use strict";

// モジュール
var path = require("path");
var execSync = require("child_process").execSync;

// 変数の初期化
var curDir = process.argv[1];
var p1 = path.resolve(curDir, "../test.txt");
var p2 = path.resolve(curDir, "../copy.txt");

//------------------------------------------------------------

// 実行 同期
var exec = function(p) {
	try {
		execSync(p);
	} catch(e) {
		console.log("[Err] : " + e);
	}
};

//------------------------------------------------------------

// 実行
console.log("--------------------");

var cmd = 'copy /Y "' + p1 + '" "' + p2 + '"';
console.log(cmd);
exec(cmd);

console.log("--------------------");

