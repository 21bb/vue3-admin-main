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
      <el-form :inline="true">
        <el-form-item v-for="(item,index)in attrArr" :key="item.id" :label="item.attrName">
          <el-select style="width: 200px">
            <el-option v-for="(attrValue,index)in item.attrValueList" :key="attrValue.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

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
      <el-button size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
//引入请求api
import { reqAttr } from '@/api/product/attr';
import { reqSpuImageList, reqSpuHasSaleAttr } from '@/api/product/spu';

//取消按钮的回调
const cancel = () => {
  $emit('changeScene', { flag: 0, params: '' });
}
//平台属性
let attrArr = ref<any>([]);
//销售属性
let saleArr = ref<any>([]);
//照片的数据
let imgArr = ref<any>([]);
//当前子组件的方法对外暴露
const initSkuData = async (c1Id: number | string, c2Id: number | string, spu: any) => {
  let result: any = await reqAttr(c1Id, c2Id, spu.category3Id);
  //获取对应的销售属性
  let result1: any = await reqSpuHasSaleAttr(spu.id);
  //获取照片墙的数据
  let result2: any = await reqSpuImageList(spu.id);
  //平台属性
  attrArr.value = result.data;
  //销售属性
  saleArr.value = result1.data;
  //图片属性
  imgArr.value = result2.data;




}
defineExpose({
  initSkuData
})
let $emit = defineEmits(['changeScene']);
</script>

<style scoped></style>