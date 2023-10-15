const {app: electronApp} = require('electron');
const Log = require('ee-core/log');
const Conf = require('ee-core/config');
const is = require('ee-core/utils/is');
const path = require("path");
const UtilsPs = require("ee-core/ps");
const fs = require("fs");
const {exec, execSync} = require("child_process");
const Ps = require("ee-core/ps");


/**
 * 唤醒插件
 * @class
 */
class MysqlAddon {

    constructor() {
        this.cfg = null;
    }


    init() {
        this.cfg = Conf.getValue('addons.mysql');
        if (this.cfg.enable === false || Ps.isDev()) {
            return;
        }
        let softwarePath = path.join(UtilsPs.getExtraResourcesDir(), this.cfg.path);
        Log.info("[addon:mysql] file path:", softwarePath);
        if (!fs.existsSync(softwarePath)) {
            if (!this.cfg.linkPath) {
                throw new Error('mysql program does not exist');
            }

            let linkPath = path.join(UtilsPs.getExtraResourcesDir(), this.cfg.linkPath)
            Log.warn("mysql program does not exist, try to create symbolic link ", linkPath);
            try {
                //fs.mkdirSync(softwarePath, {recursive: true});
                fs.symlinkSync(linkPath, softwarePath, 'junction');
                console.log('Symbolic link created successfully!');
                this.cfg.softwarePath = softwarePath;
            } catch (e) {
                Log.error('[addon:mysql] symlinkSync', e);
            }
        } else {
            this.cfg.softwarePath = softwarePath;
        }

    }

    /**
     * 创建
     */
    async create() {
        try {
            this.init();
            Log.info('[addon:mysql] cfg: ', this.cfg);

            let cmdStr = '';
            let softwarePath = this.cfg.softwarePath;
            if (!softwarePath) {
                return;
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