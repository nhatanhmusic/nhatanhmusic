@echo off
setlocal
cd /d "%~dp0backend"
call mvn -B -DskipTests package
