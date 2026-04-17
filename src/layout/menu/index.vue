<!--这是菜单组件-->
<template>

  <template v-for="(item, index) in menuList" :key="item.path">
    <template v-if="!item.children">
      <!--没有子路由-->
      <el-menu-item :index="item.path" v-if="!item.meta.hidden" @click="goRoute">
        <template #title>
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
          <span>{{ item.meta.title }}</span>
        </template>
      </el-menu-item>
    </template>


    <!--有子路由但是只有一个-->

    <template v-if="item.children && item.children.length == 1">
      <el-menu-item :index="item.children[0].path" :key="item.children[0].path" v-if="!item.children[0].meta.hidden"
        @click="goRoute($event)">
        <template #title>
          <el-icon>
            <component :is="item.children[0].meta.icon"></component>
          </el-icon>
          <span>{{ item.children[0].meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!--有子路由且个数大于1个-->

    <el-sub-menu :index="item.path" v-if="item.children && item.children.length > 1">
      <template #title>
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <Menu :menuList="item.children"></Menu>
    </el-sub-menu>

  </template>
</template>
<style scoped></style>
<script setup lang="ts">
//获取父组件传递过来的全部路由数组
defineProps(['menuList'])
//点击菜单的回调
//获取路由器对象
import { useRouter } from 'vue-router'
let $router = useRouter();
const goRoute = (vc) => {
  //路由跳转
  $router.push(vc.index)

}
</script>
<script lang="ts">
export default {
  name: 'Menu'
}
</script>
<style scoped></style>
