const {app: electronApp} = require('electron');
const Log = require('ee-core/log');
const Conf = require('ee-core/config');
const is = require('ee-core/utils/is');
const path = require("path");
const UtilsPs = require("ee-core/ps");
const fs = require("fs");
const {exec, execSync} = require("child_process");


/**
 * 唤醒插件
 * @class
 */
class MysqlAddon {

    constructor() {
        this.cfg = null;
    }

    /**
     * 创建
     */
    async create() {
        try {
            Log.info('[addon:mysql] load');
            this.cfg = Conf.getValue('addons.mysql');
            Log.info('[addon:mysql] cfg: ', this.cfg);
            if (this.cfg.enable === false) {
                return;
            }

            let cmdStr = '';
            let softwarePath = path.join(UtilsPs.getExtraResourcesDir(), this.cfg.dbVersion);

            Log.info("[addon:mysql] file path:", softwarePath);
            if (!fs.existsSync(softwarePath)) {
                throw new Error('mysql program does not exist');
            }

            let isRunning = await this.isRun()
            if (isRunning) {
                Log.info("[addon:mysql] mysql server is running");
                return;
            }


            if (is.windows()) {
                softwarePath = path.join(softwarePath, "bin", "mysqld.exe");
                cmdStr = `${softwarePath} --console`;
                Log.info("[addon:mysql] cmdStr:", cmdStr);
                exec(cmdStr);
            } else if (is.macOS()) {
                // macOs 为开发环境，不需要启动
                Log.info('[addon:mysql] env is macOs not start');
            }
        } catch (e) {
            Log.error('[addon:mysql] throw error: ', e);
        }

    }

    /**
     * 关闭服务
     */
    async kill() {
        Log.info("[addon:mysql] start kill");
        let cmdStr = '';
        if (is.windows()) {
            cmdStr = 'taskkill /f /t /im mysqld.exe';
            Log.info("[addon:mysql] kill cmdStr:", cmdStr);
            exec(cmdStr);
        } else if (is.macOS()) {
            Log.info('[addon:mysql]  env is macOs not kill');
        }
    }

    /**
     * 服务是否运行中
     */
    async isRun() {
        Log.info("[addon:mysql] check running");
        let cmdStr = '';
        if (is.windows()) {
            try {
                cmdStr = 'tasklist | findstr mysqld.exe';
                const data = execSync(cmdStr);
                Log.info("[addon:mysql]  ", data.toString());
                if (data && data.toString().includes('mysqld.exe')) {
                    Log.info("[addon:mysql] isRun");
                    return true;
                }
            } catch (e) {
                Log.error('[addon:mysql] Error:', e);
                return false;
            }

        } else if (is.macOS()) {
            Log.info('[addon:mysql]  env is macOs isRun');
            return true;
        }
        return false;

    }


}

MysqlAddon.toString = () => '[class MysqlAddon]';
module.exports = MysqlAddon;