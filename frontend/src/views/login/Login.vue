<script setup lang="js">
import {ref, computed, toRaw} from "vue";
import {ElNotification} from 'element-plus'

import {startServer, closeServer, isRunning, getConfig} from "./index";


let configList = ref([
  {
    id: 1,
    server_name: '新澳门',
    enable: true,
    url: 'http://localhost:8888',
  },
  {
    id: 2,
    server_name: '旧澳门',
    url: 'http://localhost:7777',
  }
])

configList = ref(getConfig());
console.log(configList.value)

configList.value = configList.value.filter(item => item.enable)

configList.value.forEach(item => {
  item.start = false
  item.status = 'stop'
  item.loading = false
})


async function click(item) {
  // 启动服务
  if (!item.start) {
    item.status = 'starting'
    item.loading = true

    const result = await startServer(toRaw(item));

    item.loading = false;

    if (result === 'ok') {
      item.start = true;
      item.status = 'running';
    } else {
      item.status = 'stop'

      ElNotification({
        title: `启动${item.server_name}失败，请稍后再试`,
        message: result,
        duration: 0
      })
    }
  } else if (item.start) {
    // 关闭服务
    item.status = 'closing'
    item.loading = true;

    const result = await closeServer(toRaw(item));

    item.loading = false;
    if (result === 'ok') {
      item.start = false;
      item.status = 'stop';
    } else {
      ElNotification({
        title: `关闭${item.server_name}失败`,
        message: result,
        duration: 0
      })
    }

  }


}


const color = computed(() => (item) => {
  if (item.status === 'running') return '#d1edc4'
  if (item.status === 'starting') return '#d9ecff'
  if (item.status === 'closing') return '#f4f4f5'
  return '#f4f4f5'
})


</script>
<template>
  <div class="container">
    <el-card v-for="item in configList" :key="item.id" class="task task-item custom-card" shadow="hover"
             :style="item.style">
      <h2>{{ item.server_name }}</h2>

      <ul>
        <li>
          <h4>地址</h4>
          <p v-copy="item.url">{{ item.url }}</p>
        </li>
      </ul>

      <div class="bottom">
        <div class="state">
          <el-tag v-if="item.status === 'running'" size="small" type="success">运行中</el-tag>
          <el-tag v-else-if="item.status ==='starting'" size="small">启动中</el-tag>
          <el-tag v-else-if="item.status ==='closing'" size="small" type="info">关闭中</el-tag>
          <el-tag v-else size="small" type="info">未启动</el-tag>
        </div>

        <div class="handler">
          <el-button :loading="item.loading" :color="color(item)"
                     icon="switch-button" circle @click="click(item)"/>
        </div>
      </div>

    </el-card>
  </div>
</template>

<style scoped>

ul {
  padding-inline-start: 0;
}

.container {
  min-width: 100%;
  display: flex;
  justify-content: center;
  background-color: #f6f8f9;
}

.custom-card {
  height: 90%;
  width: 90%;
  margin: 20px;
  background-color: #ffffff;
  border-radius: 13px;
}


.task-item h2 {
  color: #3c4a54;
  padding-bottom: 15px;
}

.task-item li {
  list-style-type: none;
  margin-bottom: 10px;
}

.task-item li h4 {
  font-weight: normal;
  color: #999;
}

.task-item li p {
  margin-top: 5px;
}
.task-item li p:hover {
  cursor: pointer;
  user-select: all; /* 使文本可以被选中 */
}

.task-item .bottom {
  border-top: 1px solid #EBEEF5;
  text-align: right;
  padding-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-add i {
  font-size: 30px;
}

.task-add p {
  font-size: 12px;
  margin-top: 20px;
}

.dark .task-item .bottom {
  border-color: var(--el-border-color-light);
}


</style>