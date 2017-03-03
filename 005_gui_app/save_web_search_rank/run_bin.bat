@ECHO OFF

:: バッチファイルのディレクトリを取得
set THIS_DIR=%~dp0

:: 開始
start "" "%THIS_DIR%bin\nw.exe" %*

:: デバッグ時はpauseを有効にする
:: pause
exit

