<template>
    <svg :style ="{width,height}">
    <use :xlink:href="prefix+name" :href="prefix+name"></use>
  </svg>
</template>
<script setup lang="ts">
defineProps({
  prefix:{
    type:String,
    default:'#icon-'
  },
  name:String,
  width:{
    type:String,
    default:'30px'
  },
  height:{
    type:String,
    default:'30px'
  }
})
</script>