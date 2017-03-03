"use strict";

// モジュール
var path = require("path");
var fs = require("fs");
var gui = require("nw.gui");
var mngOpt = require("./js/mngOpt.js");
var co = require("co");
var moment = require("moment");

// 変数の初期化
var appDir = process.cwd();
if (process.execPath != process.env.NW_PATH) {
	appDir = path.dirname(process.execPath);
}
var pOpt = path.resolve(appDir, "../dat/opt.json");
var pLog = path.resolve(appDir, "../log") + path.sep;

//------------------------------------------------------------

// タイトル
document.title = gui.App.manifest.name;

// 設定の読み込み
var opt = new mngOpt.Opt(pOpt);
opt.load();

// DOM準備後に処理
$(function() {
	$(window).resize(resize).resize();	// リサイズ
	$("#btnStrt").click(strt);	// 巡回開始
});

//------------------------------------------------------------

// リサイズ
var resize = function() {
	// ウィンドウの横幅と高さを取得
	var wWin = $(window).innerWidth();
	var hWin = $(window).innerHeight();

	// 自動で調整
	$("#columnOut").css("height", hWin + "px");
	$("#brwsrOut").css({height: hWin + "px", width: wWin - 200 + "px"});
	$("#prgrs").css({height: hWin - 90 + "px"});
};

// ログ表示
var log = function(msg) {
	$("#prgrs")
	.val($("#prgrs").val() + "\n" + msg)
	.animate({scrollTop: 99999}, "fast");
};

// スリープ
var sleep = function(msec) {
	return new Promise(function(resolve) {
		setTimeout(resolve, msec);
	});
};

//------------------------------------------------------------

// 実行開始
var isStrt = false;
var strt = function() {
	// 実行開始
	if (isStrt) {return}	// 排他処理
	isStrt = true;

	// ジェネレーターを利用して同期風に処理
	var urlGgl = "https://www.google.co.jp/webhp?hl=ja";
	co(function*() {
		// ページを開く
		$("#brwsr").attr("src", urlGgl);
		yield sleep(2000);		// 2秒待つ

		// キーワードを検索していく
		log("[Start] " + opt.d.words.length);
		for (var i = 0; i < opt.d.words.length; i ++) {
			// キーワードの取得
			var kw = opt.d.words[i];
			log("[Kw." + i + "] " + kw);

			// 変数の初期化
			var $cntn = $("#brwsr").contents();
			var $inpt = $cntn.find("input[type=text]").eq(0);
			var $btn = $cntn.find("button").eq(0);

			// 検索処理
			$inpt.focus().val(kw);	// インプットにフォーカスしないと
									// ボタンが押せない
			yield sleep(1000);		// 1秒待つ
			$btn.click();			// ボタンをクリック
			yield sleep(2000);		// 2秒待つ
			saveRank(kw);			// 順位を保存

			// 1～6秒待機
			yield sleep(1000 + Math.random() * 5000 | 0);
		}
		log("[End] " + opt.d.words.length);
		isStrt = false;	// 実行終了
	});
};

//------------------------------------------------------------

// 順位を保存
var saveRank = function(kw) {
	log("[Save Rank] " + kw);

	// 変数の初期化
	var arr = [];
	var $cntn = $("#brwsr").contents();

	// 検索結果の抜き出し
	$cntn.find(".g").find("a:first").each(function(i, x) {
		var $this = $(this);
		var url = $this.data("href") || $this.attr("href");
			// マウスのクリックで、hrefのURLをdata-hrefに
			// 待避させる挙動をしているので、有効な方を取る
		var ttl = $this.text();
		arr.push([url, ttl]);
	});

	// 後ろから10個だけ有効にする
	if (arr.length > 10) {arr = arr.slice(-10)}

	// CSV用に変換
	arr = arr.map(function(x, i) {
		return arrToCsv([i + 1, x[0], x[1]]);
	});

	// CSVの保存
	var csv = arr.join("\n");
	var fnm = moment().format("YYYY-MM-DD_HH-mm-ss_") + kw + ".csv";
	mngOpt.write(pLog + fnm, csv);
};

// CSV用の変換
var arrToCsv = function(arr) {
	arr.forEach(function(x, i, a) {
		a[i] = '"' + ("" + x).replace(/"/g, '""') + '"'
	});
	return arr.join(",");
};

