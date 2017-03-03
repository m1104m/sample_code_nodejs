"use strict";

// モジュール
var execSync = require("child_process").execSync;
var Encoding = require("encoding-japanese");

//------------------------------------------------------------

// 実行 非同期
var exec = function(p) {
	try {
		execSync(p);
	} catch(e) {
		var buf = e.stderr;
		console.log("buf", buf);

		// JavaScriptで読める形式に変換
		var txt = Encoding.convert(buf,
			{to: "UNICODE", from: "SJIS", type: "string"}
		);

		// 出力
		console.log("[Err] : " + txt);
	}
};

//------------------------------------------------------------

// 実行
console.log("--------------------");

var cmd = "hoge";
console.log(cmd);
exec(cmd);

console.log("--------------------");

