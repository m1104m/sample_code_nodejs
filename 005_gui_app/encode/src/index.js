"use strict";

// モジュール
var path = require("path");
var fs = require("fs");
var gui = require("nw.gui");
var mngOpt = require("./js/mngOpt.js");
var Encoding = require("encoding-japanese");

// 変数の初期化
var appDir = process.cwd();
if (process.execPath != process.env.NW_PATH) {
	appDir = path.dirname(process.execPath);
}
var pOpt = path.resolve(appDir, "../dat/opt.json");
var pOptSttc = path.resolve(appDir, "../dat/optStatic.json");

//------------------------------------------------------------

// タイトル
document.title = gui.App.manifest.name;

// 設定の読み込み
var opt = new mngOpt.Opt(pOpt);
opt.load();

var optSttc = new mngOpt.Opt(pOptSttc);
optSttc.load();

// DOM準備後に処理
$(function() {
	// エンコードリストの初期化
	initSelect("#selInpt", optSttc.d.encodeLst.frm, opt.d.encodeSel.frm);
	initSelect("#selOutpt", optSttc.d.encodeLst.to, opt.d.encodeSel.to);

	// パスの初期化
	$("#pthInpt").val(path.resolve(optSttc.d.pathDflt));
	if (opt.d.pathLast  != "") {$("#pthInpt").val(path.resolve(opt.d.pathLast))}

	// 参照
	$("#btnInpt").click(refInpt);

	// 実行
	$("#btnExec").click(exec);

	// ドラッグ＆ドロップの準備
	initDAandD();
});

//------------------------------------------------------------

// 存在確認 同期
var exist = function(p) {
	try {
		fs.accessSync(p, fs.R_OK | fs.W_OK);
		return true;
	} catch(e) {
		return false;
	}
};

// バイナリ読み込み 同期
var read = function(p) {
	var bin = "";
	try {
		bin = fs.readFileSync(p);
	} catch(e) {
		console.log("[Err] : " + e);
	}
	return bin;
};

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

// selectの初期化
var initSelect = function(slctr, arr, dflt) {
	var $tgt = $(slctr);
	arr.forEach(function(x) {
		$('<option>').attr("value", x).text(x).appendTo($tgt);
	});
	$tgt.val(dflt);
};

// 参照 入力
var refInpt = function() {
	opnFlDlg(false, $("#pthInpt").val(), function(pth) {
		if (!pth) {return}	// キャンセル
		$("#pthInpt").val(pth);
	});
};

// ファイル ダイアログを開く
var opnFlDlg = function(isSv, pth, callback) {
	// 変数の初期化
	var $inptFl = $("#inptFl");
	var bsDir = path.dirname(pth);

	// 保存時か否か
	if (isSv) {
		$inptFl.attr("nwsaveas", pth);	// nwsaveasを設定
			// NW.jsのバグっぽい挙動
			// nwworkingdirを使う際は、nwsaveasは
			// フルパスでないと正しく反映されない
	} else {
		$inptFl.removeAttr("nwsaveas");	// nwsaveasを削除
	}

	// イベントを設定して開く
	$inptFl
	.val("")	// 空にしておかないと正しく反映されない
	.attr("nwworkingdir", bsDir)
	.unbind("change")
	.change(function(evnt) {
		callback($(this).val());
	})
	.click();
}

// ドラッグ＆ドロップの準備
var initDAandD = function() {
	window.ondragover  = function () {return false};
	window.ondragleave = function () {return false};
	var err = function() {
		window.focus();	// アラートが他のウィンドウの下に出る対策
		alert("ファイルパスとして認識できませんでした。");
	};
	window.ondrop = function(e) {
		e.preventDefault();
		if (e.dataTransfer.files.length == 0) {err(); return}

		var pth = e.dataTransfer.files[0].path;
		if (! exist(pth)) {err(); return}

		$("#pthInpt").val(pth);
	};
};

// 実行
var exec = function() {
	// 変数の初期化
	var encFrm = $("#selInpt").val();
	var encTo  = $("#selOutpt").val();

	// 入力パスの存在確認
	var pthInpt = $("#pthInpt").val();
	if (! exist(pthInpt)) {
		alert("入力パスにアクセスできません。");
		return;
	}

	// 出力先を、保存ダイアログで取得
	var pthOutpt = pthInpt.replace(/(\.[^\.]+)$/, "_" + encTo + "$1");
	opnFlDlg(true, pthOutpt, function(pthRes) {
		if (!pthRes) {return}	// キャンセル

		// エンコードの変換
		var bin = read(pthInpt);	// バイナリ読み込み
		var arr = Encoding.convert(bin,
			{to: encTo, from: encFrm, type: "array"}
		);
		var buf = new Buffer(arr.length);
		for (var i = 0; i < arr.length; i ++) {buf[i] = arr[i]}
		write(pthRes, buf);		// バイナリ書き込み

		// 設定を書き換えて保存
		opt.d.encodeSel.frm = encFrm;
		opt.d.encodeSel.to  = encTo;
		opt.d.pathLast = pthInpt;
		opt.save();
	});
};

