const server = require("./server");
const { app: electronApp } = require('electron');
const Log = require('ee-core/log');
const GetPort = require('ee-core/utils/get-port');

/**
 * java server插件
 * @class
 */
class MyJavaServerAddon {

  constructor() {
    this.cfg = null;
    this.myJavaServer = null;
  }

  /**
   * 创建java服务
   *
   * @function 
   * @since 1.0.0
   */
  async createServer (cfg) {

    this.cfg = cfg;
    // await this.createJavaPorts();

    this.myJavaServer = new server();
    await this.myJavaServer.create(this.cfg);

    // kill
    electronApp.on("before-quit", async () => {
      Log.info("[addon:myJavaServer] before-quit: kill-----------");
      await this.myJavaServer.kill();
    });

    return;
  }

  /**
   * todo 检查服务是否启动
   *
   * @function 
   * @since 1.0.0
   */
  async check () {
    Log.info("进入-----检查服务是否启动------"+this.myJavaServer);
    if(this.myJavaServer == undefined){
      Log.info("[addon:myJavaServer:check] status-----------"+false);
      return false;
    }
    
    const flag = await this.myJavaServer.isRun(this.cfg);
    Log.info("[addon:myJavaServer:check] status-----------"+flag);

    return flag;    
  }

  /**
   * 创建服务端口
   *
   * @function 
   * @since 1.0.0
   */
  async createJavaPorts() {
    if (!this.cfg.enable) {
      return;
    }
    const javaPort = await GetPort({ port: this.cfg.port });
    this.cfg.port = javaPort;

  }

  /**
   * 杀掉进程
   *
   * @function 
   * @since 1.0.0
   */
  async kill() {
    if (!this.cfg.enable) {
      return;
    }
    await this.myJavaServer.kill();
  }
}

MyJavaServerAddon.toString = () => '[class MyJavaServerAddon]';
module.exports = MyJavaServerAddon;