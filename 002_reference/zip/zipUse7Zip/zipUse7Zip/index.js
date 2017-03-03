"use strict";

// モジュール
var path = require("path");
var fs = require("fs");
var exec = require("child_process").exec;
var util = require("util");

// 変数の初期化
var curDir = process.argv[1];
var p1 = path.resolve(curDir, "../srcFiles");
var p2 = path.resolve(curDir, "../srcFiles.zip");
var p7Zip = path.resolve(curDir, "../7z-extra/7za.exe");

//------------------------------------------------------------

// ZIP化
var doZip = function(pSrc, pDst) {
	// コマンドの初期化
	var cmd = util.format(
		'start /b /wait /low "" "%s" a -mcu=on -tzip "%s" "%s"',
			// -mcu=on UTF-8
		//'start /b /wait /low "" "%s" a -mcl=on -tzip "%s" "%s"',
			// -mcl=on ローカルな文字コード
		p7Zip, pDst, pSrc
	);
	console.log(cmd);

	// 非同期で実行
	exec(cmd, function() {});
};

//------------------------------------------------------------

// 実行
console.log("--------------------");

doZip(p1, p2);

console.log("--------------------");

