<template>
  <!--顶部左侧静态-->
  <el-icon style="margin-right:10px " @click="changeIcon">
    <component :is="LayOutSettingStore.fold ? 'fold' : 'Expand'"></component>
  </el-icon>
  <!--左侧面包屑-->
  <el-breadcrumb separator-icon="ArrowRight">
    <!--面包屑动态展示路由名字与标题-->
    <el-breadcrumb-item v-for="(item, index) in $route.matched" :key="index" v-show="item.meta.title" :to="item.path">
      <el-icon>
        <component :is="item.meta.icon"></component>
      </el-icon>
      <!--图标-->
      <span style="margin:0px 2px;">{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script lang="ts">
export default {
  name: 'Breadcrumb'
}
</script>
<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref, reactive } from 'vue'
import useLayOutSettingStore from '@/store/modules/setting';
//获取layout配置相关的 仓库
let LayOutSettingStore = useLayOutSettingStore();
let $route = useRoute();
//点击图标的方法
const changeIcon = () => {
  LayOutSettingStore.fold = !LayOutSettingStore.fold;
}
</script>

<style scoped></style>