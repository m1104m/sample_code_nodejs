"use strict";

// モジュール
var path = require("path");
var fs = require("fs");
var exec = require("child_process").exec;

// 変数の初期化
var curDir = process.argv[1];
var pOut = path.resolve(curDir, "../path.txt");

// 引数の初期化
var pArg = process.argv[2];

//------------------------------------------------------------

// ディレクトリ走査
var walk = function(p, callback) {
	// 一覧を取得
	try {
		var files = fs.readdirSync(p);
	} catch(e) {
		console.log("[Err Walk] : " + e);
		return;
	}

	// 一覧を処理
	files.forEach(function(f) {
		var fp = path.join(p, f); // フルパスに
		if(fs.statSync(fp).isDirectory()) {
			callback(fp, "d"); // ディレクトリもコールバックで通知
			walk(fp, callback); // ディレクトリなら再帰
		} else {
			callback(fp, "f"); // ファイルならコールバックで通知
		}
	});
};

// テキスト書き込み 同期
var write = function(p, txt) {
	var res = "ok";
	try {
		fs.writeFileSync(p, txt, "utf8");
	} catch(e) {
		console.log("[Err] : " + e);
		res = "err";
	}
	return res;
};

// ディレクトリか確認
var isDir = function(p) {
	try {
		var stats = fs.statSync(p);
		return stats.isDirectory();
	} catch(e) {
		return false;
	}
};

//------------------------------------------------------------

// 引数の有効性を確認
if (pArg === undefined) {process.exit(0)}	// 引数がないので終了
if (! isDir(pArg)) {process.exit(0)}	// ディレクトリでないので終了

// 引数を走査
var fArr = [];
var dArr = [];
walk(pArg, function(fp, typ) {
	var arr = typ == "d" ? dArr : fArr;
	arr.push(path.relative(pArg, fp));
});

// 出力文字列の作成
var txt = ""
	+ "[root]\n"
	+ pArg + "\n\n"
	+ "[directory]\n"
	+ dArr.join("\n") + "\n\n"
	+ "[file]\n"
	+ fArr.join("\n") + "\n\n";
write(pOut, txt);

// 関連付けで開く
var cmd = 'start "" "' + pOut + '"';
exec(cmd, function() {});

