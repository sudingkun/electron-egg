#!/bin/bash
# 获取脚本所在的绝对路径
script_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)

cd "$script_dir/frontend" || exit
npm install && npm run build

#移动前端资源文件
cd ../
npm run rd

npm install

#下载jdk
sh download_jdk.sh

#egg打包
npm run build-wz-all
