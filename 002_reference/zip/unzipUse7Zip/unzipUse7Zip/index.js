"use strict";

// モジュール
var path = require("path");
var fs = require("fs");
var exec = require("child_process").exec;
var util = require("util");

// 変数の初期化
var curDir = process.argv[1];
var p1 = path.resolve(curDir, "../srcFiles.zip");
var p2 = path.resolve(curDir, "../dstFiles");
var p7Zip = path.resolve(curDir, "../7z-extra/7za.exe");

//------------------------------------------------------------

// 展開
var doUnzip = function(pSrc, pDst) {
	// コマンドの初期化
	var cmd = util.format(
		'start /b /wait /low "" "%s" x "%s" -y -o"%s"',
		p7Zip, pSrc, pDst + path.sep
	);
	console.log(cmd);

	// 非同期で実行
	exec(cmd, function() {});
};

//------------------------------------------------------------

// 実行
console.log("--------------------");

doUnzip(p1, p2);

console.log("--------------------");

