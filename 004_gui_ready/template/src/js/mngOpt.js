"use strict";

// モジュールの読み込み
var path = require("path");
var fs = require("fs");

//----------------------------------------
// 公開モジュールの構築
var mngOpt = {};

// テキスト読み込み 同期
mngOpt.read = function(p) {
	var txt = "";
	try {
		txt = fs.readFileSync(p, "utf8");
	} catch(e) {
		console.log("[Err] : " + e);
	}
	return txt;
};

// テキスト書き込み 同期
mngOpt.write = function(p, txt) {
	var res = "ok";
	try {
		fs.writeFileSync(p, txt, "utf8");
	} catch(e) {
		console.log("[Err] : " + e);
		res = "err";
	}
	return res;
};

// 設定
mngOpt.Opt = function(p) {
	this.p = p;
	this.d = {};

	// 読み込み
	this.load = function() {
		var txt = mngOpt.read(this.p);
		try {
			this.d = JSON.parse(txt);
		} catch(e) {
			console.error("[JSON Err]", e, this.p);
		}
	};

	// 書き込み
	this.save = function() {
		var txt = JSON.stringify(this.d, null, "\t");
		mngOpt.write(this.p, txt);
	};
};

//----------------------------------------
// エクスポート
module.exports = mngOpt;
