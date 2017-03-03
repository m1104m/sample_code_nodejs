"use strict";

// モジュール
var path = require("path");
var fs = require("fs");

// 変数の初期化
var curDir = process.argv[1];
var p1 = path.resolve(curDir, "../run.bat");
var p2 = path.resolve(curDir, "../exist");
var p3 = path.resolve(curDir, "../dummy");

//------------------------------------------------------------

// 存在確認1 access 使用 非同期
var exist1 = function(p) {
	fs.access(p, fs.R_OK | fs.W_OK, function(err) {
		console.log("--< exist1 >------------------");
		if (err) {
			console.log("[no access]", p);
		} else {
			console.log("[can read/write]", p);
		}
	});
};

// 存在確認2 accessSync 使用 同期
var exist2 = function(p) {
	console.log("--< exist2 >------------------");
	try {
		fs.accessSync(p, fs.R_OK | fs.W_OK);
		console.log("[can read/write]", p);
	} catch(e) {
		console.log("[no access]", p);
	}
};

// 存在確認3 stat 使用 非同期
var exist3 = function(p) {
	fs.stat(p, function(err, stats) {
		console.log("--< exist3 >------------------");
		if (err) {
			console.log("[error]", p);
		} else {
			console.log("[ok]", p);
			console.log(JSON.stringify(stats, null, "  "));
			console.log("File : ", stats.isFile() ? "o" : "x");
			console.log("Dir : ", stats.isDirectory() ? "o" : "x");
		}
	});
};

// 存在確認4 statSync 使用 同期
var exist4 = function(p) {
	console.log("--< exist4 >------------------");
	try {
		var stats = fs.statSync(p);
		console.log("[ok]", p);
		console.log(JSON.stringify(stats, null, "  "));
		console.log("File : ", stats.isFile() ? "o" : "x");
		console.log("Dir : ", stats.isDirectory() ? "o" : "x");
	} catch(e) {
		console.log("[error]", p);
	}
};

//------------------------------------------------------------

var execType = 1;

// 非同期実行
if (execType == 1) {
	exist1(p1);
	exist1(p2);
	exist1(p3);
}

if (execType == 3) {
	exist3(p1);
	exist3(p2);
	exist3(p3);
}

// 同期実行
console.log("////////////////////");

if (execType == 2) {
	exist2(p1);
	exist2(p2);
	exist2(p3);
}

if (execType == 4) {
	exist4(p1);
	exist4(p2);
	exist4(p3);
}

console.log("////////////////////");

