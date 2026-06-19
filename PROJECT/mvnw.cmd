@echo off
SET MAVEN_VERSION=3.9.6
SET MAVEN_HOME=%USERPROFILE%\.m2\wrapper\dists\apache-maven-%MAVEN_VERSION%
SET MAVEN_ZIP=%MAVEN_HOME%-bin.zip
SET MAVEN_BIN=%MAVEN_HOME%\bin\mvn.cmd
SET DOWNLOAD_URL=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/%MAVEN_VERSION%/apache-maven-%MAVEN_VERSION%-bin.zip

IF NOT EXIST "%MAVEN_BIN%" (
    echo Downloading Maven %MAVEN_VERSION%...
    mkdir "%MAVEN_HOME%" 2>nul
    powershell -Command "Invoke-WebRequest -Uri '%DOWNLOAD_URL%' -OutFile '%MAVEN_ZIP%'"
    powershell -Command "Expand-Archive -Path '%MAVEN_ZIP%' -DestinationPath '%USERPROFILE%\.m2\wrapper\dists'"
    echo Maven downloaded successfully.
)

"%MAVEN_HOME%\bin\mvn.cmd" %*
