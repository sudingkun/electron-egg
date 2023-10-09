import {specialIpcRoute} from '~/api/main';
import {ipc} from '~/utils/ipcRenderer';

function mysqlIsRunning() {
    const result = ipc.sendSync(specialIpcRoute.mysqlRunStatus);
    console.log('mysqlIsRunning ', result)
    return result.flag;
}


/** 启动服务，如果成功，返回 ok，失败返回错误信息 */
export async function startServer(config) {
    console.log("startServer", config)
    if (await isRunning(config)) {
        return 'ok';
    }
    if (!mysqlIsRunning()) {
        return '数据库启动异常，请退出重新启动';
    }

    const result = ipc.sendSync(specialIpcRoute.startJavaServer, config);
    console.log(result)
    if (result.code === 0) {
        return (await checkRunning(config, 4)) ? 'ok' : '启动中。。。';
    } else {
        return result.msg
    }
}

export async function closeServer(config) {
    const result = ipc.sendSync(specialIpcRoute.closeJavaServer, config);
    console.log(result)
    await wait(1500);
    return result.code === 0 ? 'ok' : result.msg;
}

export function getConfig() {
    return ipc.sendSync(specialIpcRoute.getConfig);
}


export async function isRunning(config) {
    try {
        const response = await fetch(config.url, {method: 'GET', mode: 'no-cors'});
        return true;
    } catch (error) {
        return false;
    }
}

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function checkRunning(config, maxAttempts) {
    let attempts = 0;
    let port = config.port


    async function checkAndRetry() {
        const running = await isRunning(config);

        if (running) {
            console.log(`Port ${port} is running!`);
            return true;
        } else if (attempts <= maxAttempts) {
            attempts++;
            console.log(`Port ${port} not running. Retrying in 3 seconds...`);
            await wait(3000);
            return await checkAndRetry();
        } else {
            console.log(`Port ${port} not running after ${maxAttempts} attempts.`);
            return false;
        }
    }

    return await checkAndRetry();
}



