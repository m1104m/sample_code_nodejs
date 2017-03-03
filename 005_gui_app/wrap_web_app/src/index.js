"use strict";

// モジュール
var path = require("path");
var fs = require("fs");
var gui = require("nw.gui");

// 変数の初期化
var pSvPth = "img.png";
var pSvDir = ".";

//------------------------------------------------------------

// バイナリ書き込み 同期
var write = function(p, bin) {
	var res = "ok";
	try {
		fs.writeFileSync(p, bin);
	} catch(e) {
		console.log("[Err] : " + e);
		res = "err";
	}
	return res;
};

//------------------------------------------------------------

// DOM準備後に処理
$(function() {
	$(window).resize(resize).resize();	// リサイズ
	$("iframe").load(appendUI);	// UIの追加
});

//------------------------------------------------------------

// リサイズ
var resize = function() {
	var hWin = $(window).innerHeight();		// ウィンドウ高さ
	$("iframe").css("height", hWin + "px");	// 自動で調整
};

// UIの追加
var appendUI = function() {
	var $cntn = $("iframe").eq(0).contents();

	// タイトル表示
	document.title = $cntn.get(0).title;

	// CSSを追加
	$cntn.find("body").css("font-family", "メイリオ");

	// ボタンを追加
	var $btn = $('<button type="button" id="btnSv" '
		+ 'class="btn btn-primary btn-block">保存</button><br>')
		.click(sv);
	$cntn.find(".container").append($btn);

	// ファイル ボタンを追加
	var $btnf = $('<input type="file" id="inptFl">')
		.css("display", "none").appendTo("body");
};

// 保存
var sv = function() {
	var $cntn = $("iframe").eq(0).contents();

	// 変換画像がまだなければ終了
	var $img = $cntn.find("#outArea img").eq(0);
	if ($img.size() == 0) {return}

	// 画像をバッファに
	var dat = $img.attr("src");
	dat = dat.substr(dat.indexOf(",") + 1);
	var buf = new Buffer(dat, "base64");

	// ファイル ダイアログを開いて保存
	$("#inptFl")
	.val("")	// 空にしておかないと正しく反映されない
	.attr("nwsaveas", pSvPth)
	.attr("nwworkingdir", pSvDir)
	.unbind("change")
	.change(function(evnt) {
		var p = $(this).val();	// パス取得
		write(p, buf);		// バイナリ書き込み
		pSvDir = path.dirname(p);
		pSvPth = p;
			// NW.jsのバグっぽい挙動
			// nwworkingdirを使う際は、nwsaveasは
			// フルパスでないと正しく反映されない
	})
	.click();
};

