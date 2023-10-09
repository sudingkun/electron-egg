const _ = require("lodash");
const Log = require('ee-core/log');
const path = require("path");
const UtilsPs = require("ee-core/ps");
const fs = require("fs");
const Conf = require("ee-core/config");
const minimist = require("minimist")
let env = minimist(process.argv).env


/**
 * 加载配置插件
 * @class
 */
class LoadAddon {

    constructor() {
        this.config = [];

    }

    /**
     * 创建
     */
    create() {
        try {
            Log.info('[addon:load] load');
            const cfg = Conf.getValue('addons.load');
            if (env === undefined) {
                env = 'prod'
            }


            cfg.name = _.replace(cfg.name, "${env}", env);

            // do some things
            // 加载配置文件，获取需要的模块信息
            let configPath = path.join(UtilsPs.getExtraResourcesDir(), cfg.name);

            Log.info(configPath)
            if (!fs.existsSync(configPath)) throw new Error('config does not exist');

            let configFile = fs.readFileSync(configPath);

            let configList = JSON.parse(configFile.toString());

            Log.info(configList)

            this.config = configList;
        } catch (err) {
            Log.error('[class LoadAddon] throw error:', err);
        }
    }

    getConfig() {
        return this.config;
    }
}

LoadAddon.toString = () => '[class LoadAddon]';
module.exports = LoadAddon;