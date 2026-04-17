<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form class="login_form" :model="loginForm" :rules="rules" ref="loginForms">
          <h1>Hello</h1>
          <h2>欢迎来到硅谷甄选</h2>
          <el-form-item prop="username">
            <el-input :prefix-icon="User" v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" :prefix-icon="Lock" v-model="loginForm.password" show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" class='login_btn' type="primary" size="default" @click="login">登录</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue';
import { ElNotification } from 'element-plus';
//收集账号与密码的数据
let loginForm = reactive({ username: 'admin', password: 'atguigu123' })
import useUserStore from '@/store/modules/user';

//引入获取当前时间的函数
import { getTime } from '@/utils/time';
let userStore = useUserStore();
//获取路由器
let $router = useRouter();
//定义变量控制按钮加载效果
let $route = useRoute();
let loading = ref(false)
//获取el-form组件
let loginForms = ref()
//登录按钮回调
const login = async () => {
  //保证所有表单项校验通过在发请求
  await loginForms.value.validate();

  //加载效果：开始加载
  loading.value = true;
  //点击登录按钮以后？
  //通知仓库发登录请求
  //请求成功->首页展示数据的地方
  //请求失败->弹出登录失败信息
  try {//可以写.then语法
    await userStore.userLogin(loginForm);
    //登录成功跳转首页
    //编程式导航跳转到展示数据首页
    //判断登录的时候，路由路径当中是否有query参数，如果有就往query参数跳转，没有就跳转到首页
    let redirect: any = $route.query.redirect;
    $router.push({ path: redirect || '/' });
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `Hi,${getTime()}好`
    });
    //登录成功加载效果也消失
    loading.value = false;
  } catch (error) {
    //登录失败加载效果消失
    loading.value = false;
    ElNotification({
      type: 'error',
      message: (error as Error).message
    })
  }


}
//自定义校验规则函数
const validatorUserName = (rules: any, value: any, callback: any) => {
  //rules：即为校验规则对象
  //value:即为表单元素文本内容
  //函数：如果符合条件callback放行通过即可
  //如果不符合提哦啊金callback方法。注入错误提示信息
  if (value.length >= 5) {
    callback();
  } else {
    callback(new Error('账号长度至少五位'))
  }
  console.log(callback);

}
const validatorPassword = (rules: any, value: any, callback: any) => {
  if (value.length >= 6) {
    callback();
  } else {
    callback(new Error('密码长度至少六位'))
  }
  console.log(callback);


}
//定义表单校验需要配置对象
const rules = {
  username: [
    //规则对象属性：
    //required,代表这个字段务必要校验的
    //min:文本长度最少多少位
    //max:文本长度最多多少位
    //message:错误的提示信息
    //trigger:触发校验表单的时机 change-> 文本发生变化触发校验，blur-> 失去焦点的时候触发校验规则
    //{ required: true, min: 6, max: 10, message: '账号长度至少六位', trigger: 'change' }
    { trigger: 'change', validator: validatorUserName }
  ],
  password: [
    { trigger: 'change', validator: validatorPassword }
  ]
}
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;

  .login_form {
    position: relative;
    width: 80%;
    top: 30vh;
    background: url("@/assets/images/login_form.png ") no-repeat;
    background-size: cover;
    padding: 40px;

    h1 {
      color: white;
      font-size: 40px;
    }

    h2 {
      font-size: 20px;
      color: white;
      margin: 20px 0px;
    }

    .login_btn {
      width: 100%;
    }
  }
}
</style>