#!/bin/bash

rm -rf build/extraResources/zulu-11.jdk/*
# 下载 mac JDK 到项目目录
MAC_JDK_URL="https://cdn.azul.com/zulu/bin/zulu11.66.19-ca-jdk11.0.20.1-macosx_aarch64.tar.gz"
TARGET_DIR="build/extraResources/zulu-11.jdk"

echo "Downloading MAC JDK..."
curl -L $MAC_JDK_URL -o jdk.tar.gz
# tar 解压获取 jdk.tar.gz 里面的 zulu-11.jdk 目录下的文件
tar -xf jdk.tar.gz -C $TARGET_DIR --strip-components=2
rm jdk.tar.gz

echo "MAC JDK downloaded successfully."

rm -rf build/extraResources/jdk-11.0.2/*
# 下载 win JDK 到项目目录
WIN_JDK_URL="https://download.java.net/java/GA/jdk11/9/GPL/openjdk-11.0.2_windows-x64_bin.zip"
TARGET_DIR="build/extraResources"

echo "Downloading WIN JDK..."
curl -L $WIN_JDK_URL -o jdk.zip
# tar 解压获取 jdk.tar.gz 里面的 jdk-11.0.2 目录下的文件
unzip jdk.zip -d $TARGET_DIR

rm jdk.zip

echo "WIN JDK downloaded successfully."


