<template>
  <div class="logn" v-if="setting.lognHidden">
    <img :src="setting.logn" alt="图标">
    <p>{{ setting.title }}</p>
  </div>
</template>
<script lang="ts">
export default {
  name: 'Login'
}
</script>
<script setup lang="ts">
import { ref, reactive } from 'vue'
//引入设计标题和login
import setting from '@/setting';
</script>

<style scoped lang="scss">
.logn {
  width: 100%;
  height: $base-menu-login-height;
  color: white;
  display: flex;
  align-items: center;
  padding: 10px;

  img {
    width: 40px;
    height: 40px;
  }

  p {
    font-size: $base-login-title-fontSize;
    margin-left: 10px;
  }
}
</style>