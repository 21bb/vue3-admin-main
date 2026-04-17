//创建用户相关的小仓库
import {defineStore} from 'pinia';
//创建用户小仓库
//引入接口
import { reqLogin,reqUserInfo,reqLogout} from '@/api/user';
import type { UserState } from './types/type';
import type { loginFormData,loginResponseData,userInfoRespnseData } from "@/api/user/type"
//引入操作本地存储的工具方法
import { SET_TOKEN ,GET_TOKEN,REMOVE_TOKEN} from '@/utils/token';
//引入路由(常量路由)
import {constantRoute} from '@/router/routes'
let useUserStore=defineStore('User',{
  //小仓库存储数据的地方
  state:():UserState=>{
    return {
      token:GET_TOKEN(),
      menuRoutes:constantRoute,//仓库存储生成菜单需要数组（路由）
      username:'',
      avatar:'',
    }
  },
  //异步|逻辑的地方
  actions:{
    //用户登录方法
    async userLogin(data: loginFormData) {
      //登录请求
      let result: loginResponseData = await reqLogin(data);
      if (result.code == 200) {
        //pinia仓库存储一下token
        //由于pinia/vuex存储数据其实利用js对象
        this.token = (result.data as string);
        //本地持久化存储
        SET_TOKEN(result.data as string);
        //能保证当前async函数返回一个成功的promise
        return 'ok';
      } else {
        return Promise.reject(new Error(result.message));
      }
    },
    //获取用户信息方法
    async userInfo() {
      //获取用户信息进行存储仓库当中[用户头像、名字]
      let result: userInfoRespnseData = await reqUserInfo();
      //如果获取用户信息成功，存储一下用户信息
      if (result.code == 200) {
        this.username = result.data.name;
        this.avatar = result.data.avatar;
        return 'ok';
      } else {
        return Promise.reject(new Error(result.message));
      }
    },
    //退出登录
    async userLogout() {
      let result: any = await reqLogout();
      if (result.code == 200) {
        this.token = '';
        this.username = '';
        this.avatar = '';
        REMOVE_TOKEN();
        return 'ok';
      } else {
        return Promise.reject(new Error(result.message));
      }
    }

   },
  
  getters:{
    
  }
})
//对外暴露获取小仓库的方法
export default useUserStore;