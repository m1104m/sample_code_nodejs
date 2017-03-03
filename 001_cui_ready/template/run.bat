@ECHO OFF

:: バッチファイルのディレクトリを取得
set THIS_DIR=%~dp0

:: package.json のあるサブディレクトリを探索
:: for /d でディレクトリのみ
for /d %%a in ("%THIS_DIR%*") do (
	if exist "%%a\package.json" set APP_DIR=%%a
)

echo -- app dir ----------
echo %APP_DIR%
echo.

:: アプリのパスを作成
set APP_PTH="%APP_DIR%\."

:: 開始
:: 環境変数にnodeのパスを登録している場合は1行目、
:: 登録せずに、node\node.exeを使う場合は、2行目を有効にする。
node %APP_PTH% %*
::"%THIS_DIR%node\node.exe" %APP_PTH% %*

:: デバッグ時はpauseを有効にする
pause
exit
