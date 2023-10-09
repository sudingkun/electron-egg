
cd frontend || exit
npm install

#前端打包
cd ../ && npm run build-frontend

#移动前端资源文件
npm run rd

npm install

#egg打包
npm run build-wz-all
