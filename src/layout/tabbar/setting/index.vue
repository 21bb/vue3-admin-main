<template>
  <el-button size="small" icon="Refresh" circle @click="updateRefresh"></el-button>
  <el-button size="small" icon="FullScreen" circle @click="FullScreen"></el-button>
  <el-button size="small" icon="Setting" circle></el-button>
  <img :src="userStore.avatar" style="width:24px;height: 24px;margin:0px 10px;border-radius: 50%;" alt="">
  <!--下拉菜单-->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon-right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script lang="ts">
export default {
  name: 'Setting'
}
</script>
<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
//获取用户相关的小仓库
import useUserStore from '@/store/modules/user';
import { ref, reactive } from 'vue'
//获取骨架的小仓库
import useLayOutSettingStore from '@/store/modules/setting';
import { FullScreen } from '@element-plus/icons-vue/dist/types';
let layoutSettingStore = useLayOutSettingStore();
let userStore = useUserStore();
//获取路由器对象
let $router = useRouter();
//获取路由对象
let $route = useRoute();
const updateRefresh = () => {
  layoutSettingStore.refresh = !layoutSettingStore.refresh
};
//全屏按钮点击的回调
const FullScreen = () => {
  //DOM对象的一个 属性：可以用来判断当前是不是全屏模式：[全屏：true,不是全屏;false]
  let full = document.fullscreenElement;
  //切换为全屏模式
  if (!full) {
    //文档根节点的方法requestFullscreen,实现全屏模式
    document.documentElement.requestFullscreen();
  } else {
    //变为不是全屏模式-.退出全屏模式
    document.exitFullscreen();
  }

}
//退出登录点击回调
const logout = async () => {
  //第一件事：需要向服务器发请求[退出登录接口]
  //第二件事：仓库当中关于用于相关的数据清空[token|username|avatar]
  //第三件事：跳转到登录界面
  await userStore.userLogout();
  //跳转到登录页面
  $router.push({ path: '/login', query: { redirect: $route.path } });

}

</script>

<style scoped></style>