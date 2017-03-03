"use strict";

// モジュール
var http = require("http");
var url = require("url");

// 変数の初期化
var message = {
	200: "OK",
	404: "Not Found",
	500: "Internal Server Error",
	501: "Not Implemented"
};
var port = "80";
var host = "127.0.0.1";

//------------------------------------------------------------

// エラー送信
var sendError = function(req, res, statusCode) {
	res.writeHead(statusCode, {"Content-Type": "text/html"});
	res.write("<!DOCTYPE html><html><body>"
		+ "<h1>" + message[statusCode] + "</h1>"
		+ "</body></html>");
	res.end();
};

// 通常送信
var sendNormal = function(req, res) {
	var u = url.parse(req.url);
	var statusCode = 200;

	// 「ファイルがない」エラーを返したい場合
	// sendError(req, res, 404);
	// return;

	res.writeHead(statusCode, {"Content-Type": "text/html"});
	res.write("<!DOCTYPE html><html><body>"
		+ "<h1>" + message[statusCode] + "</h1>"
		+ "<pre>" + JSON.stringify(u, null, "  ") + "</pre>"
		+ "</body></html>");
	res.end();
};

// サーバーの作成
var genServer = function() {
	// サーバーの作成
	http.createServer(function(req, res) {
		if (req.method == "GET") {
			sendNormal(req, res);	// GET時
		} else {
			sendError(req, res, 501);	// その他
		}
	}).listen(port, host);
};

//------------------------------------------------------------

// 実行
console.log("--------------------");
console.log("[Start Server]");
genServer();
console.log("[End Server]");
console.log("--------------------");

// ブラウザで、試しに開くURL
// http://localhost/test1/test2/test3.html?a=b&c=d
// http://127.0.0.1:80/test1/test2/test3.html?a=b&c=d
// 終了したい場合は、コマンドプロンプトで［Ctrl］+［c］で終了可能。

