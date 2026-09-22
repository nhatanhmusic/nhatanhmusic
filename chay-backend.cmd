@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0backend"

rem Backend can JDK 21. Tren may nay `java` trong PATH la JDK 17, nen phai goi
rem thang java cua JAVA_HOME — neu khong se bao "UnsupportedClassVersionError".
set "JAVA_BIN=%JAVA_HOME%\bin\java.exe"
if not exist "%JAVA_BIN%" (
  echo [LOI] Khong tim thay "%JAVA_BIN%".
  echo       Dat bien moi truong JAVA_HOME tro toi mot ban JDK 21 roi chay lai.
  exit /b 1
)

if not exist "target\nhatanh-backend-0.1.0.jar" (
  echo === Chua co ban dong goi, dang build ===
  call mvn -B -DskipTests package || exit /b 1
)

echo === Backend chay o http://localhost:8080 ===
echo === Swagger: http://localhost:8080/swagger-ui.html ===
"%JAVA_BIN%" -jar "target\nhatanh-backend-0.1.0.jar"
