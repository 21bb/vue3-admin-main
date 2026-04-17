import { createApp } from 'vue'
import App from '@/App.vue'
//引入element-plus插件与样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// @ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
//svg插件需要配置代码
import 'virtual:svg-icons-register'
import gloalComponent from '@/components'
import '@/styles/index.scss'
import axios from 'axios';
//引入路由
import router from './router'
import pinia from './store'
//引入路由鉴权
import './permisstion'
console.log(gloalComponent);
const app=createApp(App)
app.use(ElementPlus,{
  locale:zhCn
}
);
//注册路由
app.use(router)
//安装仓库
app.use(pinia);
app.use(gloalComponent);
app.mount('#app')