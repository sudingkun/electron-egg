'use strict';

const {Service} = require('ee-core');
const Log = require("ee-core/log");
const MyJavaServerAddon = require("../addon/myJavaServer");


/**
 * 示例服务（service层为单例）
 * @class
 */
class JavaService extends Service {

    constructor(ctx) {
        super(ctx);
        this.javaServerMap = new Map()
    }


    /**
     * 启动java项目
     */
    async startJavaServer(javaCfg) {
        Log.info("startJavaServer {}", javaCfg);
        let data = {
            code: 0,
            msg: '',
            server: ''
        }
        if (!javaCfg.enable) {
            data.code = -1;
            data.msg = 'addon not enabled!';
            return data;
        }

        let myJavaServer;
        if (this.javaServerMap.has(javaCfg.id)) {
            myJavaServer = this.javaServerMap.get(javaCfg.id)
        } else {
            myJavaServer = new MyJavaServerAddon();
        }
        await myJavaServer.createServer(javaCfg);
        data.server = `http://localhost:${javaCfg.port}/collect`;
        this.javaServerMap.set(javaCfg.id, myJavaServer)
        return data;
    }


    /**
     * 关闭java项目
     */
    async closeJavaServer(javaCfg) {
        let data = {
            code: 0,
            msg: '',
        }
        Log.info("closeJavaServer {}", javaCfg);

        if (!javaCfg.enable) {
            data.code = -1;
            data.msg = 'addon not enabled!';
            return data;
        }

        let myJavaServer = this.javaServerMap.get(javaCfg.id)
        if(myJavaServer){
            await myJavaServer.kill();
        }

        this.javaServerMap.delete(javaCfg.id)

        return data;
    }

}

JavaService.toString = () => '[class JavaService]';
module.exports = JavaService;