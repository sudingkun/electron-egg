@echo off
setlocal

cd /d %~dp0

if exist mysql (
    rmdir mysql
)


mklink /d mysql %~dp0%\..\..\..\mysql-8.0.30-winx64

endlocal