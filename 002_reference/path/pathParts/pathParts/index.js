"use strict";

// モジュール
var path = require("path");

// 変数の初期化
var curDir = process.argv[1];
var pth = path.resolve(curDir, "../run.bat");

// 出力
console.log("--------------------");
console.log("path",     pth);
console.log("dirname",  path.dirname(pth));
console.log("extname",  path.extname(pth));
console.log("basename", path.basename(pth));
console.log("basename", path.basename(pth, path.extname(pth)));
console.log("path.sep", path.sep);
console.log("--------------------");

