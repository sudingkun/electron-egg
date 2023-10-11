#!/bin/bash

# 获取脚本所在的绝对路径
script_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
cd "$script_dir/build/extraResources" || exit

jdk_dir="$script_dir/build/extraResources/jdk-11.0.2"

if [ -d "$jdk_dir" ] && [ "$(ls -A "$jdk_dir")" ]; then
    echo "目录非空"
    exit 0
fi

# 下载 win JDK
echo "Downloading WIN JDK..."
jdk_url="https://download.java.net/java/GA/jdk11/9/GPL/openjdk-11.0.2_windows-x64_bin.zip"
filename=$(basename "$jdk_url")

curl -LO $jdk_url

# 解压获取 jdk
unzip "$filename"

rm "$filename"

echo "WIN JDK downloaded successfully."


