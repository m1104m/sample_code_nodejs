"use strict";

// モジュール
var path = require("path");
var gui = require("nw.gui");
var mngOpt = require("./js/mngOpt.js");

// 変数の初期化
var appDir = process.cwd();
if (process.execPath != process.env.NW_PATH) {
	appDir = path.dirname(process.execPath);
}
var pOpt = path.resolve(appDir, "../dat/opt.json");

//------------------------------------------------------------

// タイトル
document.title = gui.App.manifest.name;

// 設定の読み込み
var opt = new mngOpt.Opt(pOpt);
opt.load();

// DOM準備後に処理
$(function() {
	// タイトル表示
	$("#title").text(document.title);

	// 設定を表示
	var $cntn = $("#contents");
	for (var key in opt.d) {
		$cntn.append($("<div>").text(key + " : " + opt.d[key]));
	}
	$cntn.append("<hr>");

	// アプリ ディレクトリを表示
	$cntn.append($("<div>").text("AppDir : " + appDir));
	$cntn.append("<hr>");

	// 引数を表示
	for (var i = 0; i < gui.App.argv.length; i ++) {
		$cntn.append($("<div>").text(gui.App.argv[i]));
	}
});

// ウィンドウ
var win = gui.Window.get();
win.on("close", function() {
	// ウィンドウを閉じた時の処理

	// 設定を書き換えて保存
	opt.d.lastTime = new Date().toString();
	opt.save();

	// closeイベントの処理を追加した際は、自分で閉じる必要がある
	this.close(true);
});

