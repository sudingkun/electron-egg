'use strict';

const {Controller} = require('ee-core');
const Addon = require('ee-core/addon');
const Conf = require("ee-core/config");
const Log = require("ee-core/log");

/**
 * Index
 * @class
 */
class IndexController extends Controller {

    constructor(ctx) {
        super(ctx);
    }


    /**
     * getConfig
     */
    getConfig() {
        return Addon.get('load').getConfig();
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

        await Addon.get('myJavaServer').createServer(javaCfg);

        data.server = `http://localhost:${javaCfg.port}/collect`;

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

        await Addon.get('myJavaServer').kill();

        return data;
    }


    /**
     * java运行状态
     */
    async javaRunStatus() {
        let data = {
            code: 0,
            msg: '',
            flag: false
        }
        data.flag = await Addon.get('myJavaServer').check();

        return data;
    }

    /**
     * java运行状态
     */
    async mysqlRunStatus() {
        let data = {
            code: 0,
            msg: '',
            flag: false
        }
        data.flag = await Addon.get('mysql').isRun();

        return data;
    }


}

IndexController.toString = () => '[class IndexController]';
module.exports = IndexController;  