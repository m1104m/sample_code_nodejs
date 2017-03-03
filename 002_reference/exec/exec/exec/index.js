"use strict";

// モジュール
var path = require("path");
var exec = require("child_process").exec;
var execSync = require("child_process").execSync;

// 変数の初期化
var curDir = process.argv[1];
var p = path.resolve(curDir, "../test.txt");

//------------------------------------------------------------

// 実行1 非同期
var exec1 = function(p) {
	exec(p, function(err, stdout, stderr) {
		if (err) {
			console.log("[Err] : " + err);
		} else {
			console.log("[Stdout] : " + stdout);
		}
	});
};

// 実行2 同期
var exec2 = function(p) {
	try {
		execSync(p);
	} catch(e) {
		console.log("[Err] : " + e);
	}
};

//------------------------------------------------------------

// 実行種類
var execType = 1;
var cmd;

// 実行
console.log("--------------------");

if (execType == 1) {
	cmd = 'notepad "' + p + '"';
	console.log(cmd);
	exec1(cmd);
	exec2(cmd);
}

if (execType == 2) {
	cmd = 'hoge';
	console.log(cmd);
	exec1(cmd);
	exec2(cmd);
}

console.log("--------------------");

