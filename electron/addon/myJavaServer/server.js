const _ = require("lodash");
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const {exec, execSync} = require("child_process");
const ps = require("./ps");
const Log = require('ee-core/log');
const is = require('ee-core/utils/is');
const UtilsPs = require('ee-core/ps');

/**
 * java server
 */
class MyJavaServer {
    constructor() {
        this.options;
    }

    /**
     * 创建服务
     */
    async create(cfg) {
        this.options = cfg;
        if (this.options.enable == false) {
            return;
        }

        let port = parseInt(this.options.port);
        assert(typeof port === "number", "java port required, and must be a number");

        try {
            if (await this.isRun(cfg)) {
                Log.info("[addon:myJavaServer] java server is running");
                return;
            }


            const jarName = this.options.name;
            let softwarePath = path.join(UtilsPs.getExtraResourcesDir(), jarName);
            let javaOptStr = this.options.opt;
            let jrePath = path.join(UtilsPs.getExtraResourcesDir(), this.options.jreVersion);
            let cmdStr = '';

            Log.info("[addon:myJavaServer] jar file path:", softwarePath);
            if (!fs.existsSync(softwarePath)) throw new Error('java program does not exist');

            // 替换opt参数
            javaOptStr = _.replace(javaOptStr, "${port}", port);
            javaOptStr = _.replace(javaOptStr, "${path}", path.join(UtilsPs.getExecDir(), 'logs'));

            if (is.windows()) {
                jrePath = path.join(jrePath, "bin", "javaw.exe");
                cmdStr = `${jrePath} -jar ${softwarePath} ${javaOptStr}`;
            } else if (is.macOS()) {
                // 如果提示：不受信任，请执行：  sudo spctl --master-disable
                // jrePath = path.join(jrePath, "Contents", "Home", "bin", "java");
                //cmdStr = `nohup ${jrePath} -jar ${javaOptStr} ${softwarePath} >/dev/null 2>&1 &`;
                cmdStr = `java -jar ${javaOptStr} ${softwarePath}`;
            } else {
                // todo linux
            }

            Log.info("[addon:myJavaServer] cmdStr:", cmdStr);
            exec(cmdStr);

        } catch (err) {
            Log.error('[addon:myJavaServer] throw error:', err);
        }
    }

    /**
     * 关闭服务
     */
    async kill() {
        const jarName = this.options.name;
        if (is.windows()) {
            const resultList = ps.lookup({
                command: "java",
                where: 'caption="javaw.exe"',
                arguments: jarName,
            });

            resultList.forEach((item) => {
                ps.kill(item.pid, "SIGKILL", (err) => {
                    if (err) {
                        throw new Error(err);
                    }
                    Log.info("[addon:myJavaServer] java程序退出 pid: ", item.pid);
                });
            });

        } else if (is.macOS()) {
            const cmd = `ps -ef | grep java | grep ${jarName} | grep -v grep | awk '{print $2}' | xargs kill -15`;
            const result = execSync(cmd);
            Log.info("[addon:myJavaServer] {} kill:", cmd, result != null ? result.toString() : '');
        } else {
            // todo linux
        }
    }

    /**
     * 服务是否运行中
     */
    async isRun(cfg) {
        const jarName = cfg.name;
        if (is.windows()) {
            const resultList = ps.lookup({
                command: "java",
                where: 'caption="javaw.exe"',
                arguments: jarName,
            });

            Log.info("[addon:myJavaServer] resultList:", resultList);
            return resultList.length > 0;
        } else if (is.macOS()) {
            const cmd = `ps -ef | grep java | grep ${jarName} | grep -v grep | awk '{print $2}' `;
            Log.info("[addon:myJavaServer:isRun] cmdStr:", cmd);
            const result = execSync(cmd);
            Log.info('[addon:myJavaServer:isRun] result:', result.toString());
            //不等于空说明正在运行
            return result.toString() !== ""
        } else {
            // todo linux
        }
    }
}

module.exports = MyJavaServer;