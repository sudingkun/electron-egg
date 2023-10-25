'use strict';

const {Controller} = require('ee-core');
const Addon = require('ee-core/addon');
const Services = require('ee-core/services');


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

    async startJavaServer(javaCfg) {
        return await Services.get('java').startJavaServer(javaCfg);
    }

    /**
     * 关闭java项目
     */
    async closeJavaServer(javaCfg) {
        return await Services.get('java').closeJavaServer(javaCfg);
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