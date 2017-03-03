"use strict";

// モジュール
var path = require("path");
var fs = require("fs");
var gui = require("nw.gui");
var moment = require("moment");

// 変数の初期化
var appDir = process.cwd();
if (process.execPath != process.env.NW_PATH) {
	appDir = path.dirname(process.execPath);
}
var pLog = path.resolve(appDir, "../log") + path.sep;
var win = gui.Window.get();

//------------------------------------------------------------

// タイトル
document.title = gui.App.manifest.name;

// DOM準備後に処理
$(function() {
	$("#btnUrl").click(loadUrl);	// URL読み込み
	$("#btnCptr").click(cptr);		// キャプチャー
});

//------------------------------------------------------------

// URL読み込み
var loadUrl = function() {
	var url = $("#brwsr").attr("src");
	var res = prompt("URLを入力してください", url);
	if (! res) {return}	// キャンセル時は処理終了
	$("#brwsr").attr("src", res);
};

// キャプチャー
var cptr = function() {
	win.capturePage(function(uri) {
		var img = new Image();
		img.onload = function() {
			// 変数の初期化
			var $brwsr = $("#brwsr");
			var w = $brwsr.width();
			var h = $brwsr.height();
			var x = $brwsr.position().top;
			var y = $brwsr.position().left;

			// キャンバスを作成して画像を貼り付け
			var cnvs = $('<canvas>')
				.attr("width", w).attr("height", h).get(0);
			var ctx = cnvs.getContext("2d");
			ctx.drawImage(img, -x, -y);

			// キャンバスをバッファにして保存
			svCnvs(cnvs);
			flshBck();	// 終了を通知
		};
		img.src = uri;
	}, {format: "png", datatype: "datauri"});
};

// キャンバスをバッファにして保存
var svCnvs = function(cnvs) {
	// 画像をバッファに
	var dat = cnvs.toDataURL();
	dat = dat.substr(dat.indexOf(",") + 1);
	var buf = new Buffer(dat, "base64");

	// 保存
	var pth = pLog
		+ moment().format("YYYY-MM-DD_HH-mm-ss_")
		+ ".png";
	fs.writeFile(pth, buf, "base64");
}

// 背景をフラッシュさせる
var flshBck = function() {
	var srcCol = $("body").css("background-color");
	$("body").css("background-color", "orange");
	setTimeout(function() {
		$("body").css("background-color", srcCol);
	}, 300);
};
