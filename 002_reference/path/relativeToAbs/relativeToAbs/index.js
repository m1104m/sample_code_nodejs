"use strict";

// モジュール
var path = require("path");

// 変数の初期化
var curDir = process.argv[1];
var datDir = path.resolve(curDir, "../dat");

// 出力
console.log("--------------------");
console.log("curDir", curDir);
console.log("datDir", datDir);
console.log("--------------------");

