<template>
  <el-form label-width="100px">
    <el-form-item label="SKU名称">
      <el-input placeholder="SKU名称"></el-input>
    </el-form-item>

    <el-form-item label="价格(元)">
      <el-input placeholder="价格(元)" type="number"></el-input>
    </el-form-item>

    <el-form-item label="重量(克)">
      <el-input placeholder="重量(克)" type="number"></el-input>
    </el-form-item>

    <el-form-item label="SKU描述">
      <el-input placeholder="SKU描述" type="textarea"></el-input>
    </el-form-item>

    <!-- 平台属性 -->
    <el-form-item label="平台属性">
      <el-select style="width: 200px">
        <el-option label="256GB" value="256"></el-option>
        <el-option label="512GB" value="512"></el-option>
        <el-option label="1TB" value="1024"></el-option>
      </el-select>
    </el-form-item>

    <!-- 图片列表 -->
    <el-form-item label="图片名称">
      <el-table border>
        <el-table-column type="selection" width="80px" align="center"></el-table-column>
        <el-table-column label="图片" prop="url"></el-table-column>
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="操作"></el-table-column>
      </el-table>
    </el-form-item>

    <!-- 按钮区域 -->
    <el-form-item>
      <el-button type="primary" size="default">保存</el-button>
      <el-button size="default">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

</script>

<style scoped></style>