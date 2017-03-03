"use strict";

// モジュール
var path = require("path");
var fs = require("fs");
var express = require("express");
var exec = require("child_process").exec;

// 引数の初期化
var pArg = process.argv[2];

//------------------------------------------------------------

// ファイルか確認
var isFile = function(p) {
	try {
		var stats = fs.statSync(p);
		return stats.isFile();
	} catch(e) {
		return false;
	}
};

//------------------------------------------------------------

// 引数の有効性を確認
if (pArg === undefined) {process.exit(0)}	// 引数がないので終了
if (! isFile(pArg)) {process.exit(0)}	// ファイルでなければ終了

// 変数の初期化
var app = express();
var dir = path.dirname(pArg);

// 静的ディレクトリを指定
app.use(express.static(dir));

// 受付開始
var port = "80";
app.listen(port, function(){
	console.log("[Express] mode: %s", app.settings.env);
});

// 表示
console.log("[start] サーバーを起動します。");
console.log("[dir]", dir);
console.log("[url]", url);

// 変数の初期化
var host = "127.0.0.1";
var url = "http://" + host + ":" + port + "/" + path.basename(pArg);

// 関連付けで開く
var cmd = 'start "" "' + url + '"';
exec(cmd, function() {});

