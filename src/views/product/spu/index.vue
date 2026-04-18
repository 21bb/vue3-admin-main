<template>
  <div>
    <!--三级分类-->
    <Category :scene="scene"></Category>
    <el-card style="margin :10px 0px">
      <!--v-if|v-show：都可以实现显示与隐藏-->
      <div v-show="scene == 0">
        <el-button @click="addSpu" type="primary" size="default" icon="Plus"
          :disabled="categoryStore.c3Id ? false : true">添加SPU</el-button>
        <el-table style="margin:10px 0px;" border :data="records">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column label="SPU描述" prop="description" show-overflow-tooltip></el-table-column>
          <el-table-column label="SPU操作">
            <!--row即为已有的SPU对象-->
            <template #="{ row, $index }">
              <el-button type="primary" size="default" icon="Plus" title="添加SKU" @click="addSku(row)"></el-button>
              <el-button type="primary" size="default" icon="Edit" title="修改SPU" @click="updateSpu(row)"></el-button>
              <el-button type="primary" size="default" icon="View" title="查看SKU列表" @click="findSku(row)"></el-button>
              <el-button type="primary" size="default" icon="Delete" title="删除SPU"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--分页器-->
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[1, 2, 3]"
          :background="true" layout="total, sizes, prev, pager, next, jumper,->,sizes,total" :total="total"
          @current-change="getHasSpu" @size-change="changeSize" />
      </div>
      <!--添加SPU|修改SPU子组件-->
      <SpuForm ref="spu" v-show="scene == 1" @changeScene="changeScene"></SpuForm>
      <!--添加SKU子组件-->
      <SkuForm ref="sku" v-show="scene == 2" @changeScene="changeScene"></SkuForm>
      <!--dialog对话框：展示已有的SKU数据-->
      <el-dialog v-model="show" title="SKU列表">
        <el-table border :data="skuArr">
          <el-table-column label="SKU名字" prop="skuName"></el-table-column>
          <el-table-column label="SKU价格" prop="price"></el-table-column>
          <el-table-column label="SKU重量" prop="weight"></el-table-column>
          <el-table-column label="SKU图片">
            <template #="{ row, $index }">
              <img :src="row.skuDefaultImg" style="width:100px;height:100px;">
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reqHasSpu, reqSkulist } from '@/api/product/spu';
import { HasSpuResponseData, Records, SpuData, SkuInfoData, SkuData } from '@/api/product/spu/type';
import { ref, reactive, watch } from 'vue'
//引入分类的仓库
import useCategoryStore from '@/store/category';
import SkuForm from './skuForm.vue';
import SpuForm from './spuForm.vue';
let categoryStore = useCategoryStore();
//场景的数据
let scene = ref<number>(0);//0：显示已有SPU  1：添加或者修改已有SPU 2：添加SKU的结构
//分页器默认页码
let pageNo = ref<number>(1);
//每一页展示几条数据
let pageSize = ref<number>(3);
//存储已有的SPU数据
//let records = ref<Records>([]);
//let records = ref<Records>([]);
let records = ref<any[]>([]);
//存储已有SPU总个数
let total = ref<number>(0);
//获取子组件实例SpuForm
let spu = ref<any>();
//存储全部的数据
let skuArr = ref<SkuData[]>([])
let show = ref<boolean>(false)
//获取子组件实例SkuForm
let sku = ref<any>();
//监听三级分类ID变化
watch(() => categoryStore.c3Id, () => {
  //务必保证有三级分类ID
  if (!categoryStore.c3Id) return;
  getHasSpu();
})
//此方法执行;可以获取一个三级分类下全部的已有的SPU
const getHasSpu = async (pager = 1) => {
  pageNo.value = pager;
  let result: HasSpuResponseData = await reqHasSpu(pageNo.value, pageSize.value, categoryStore.c3Id);
  if (result.code == 200) {
    records.value = result.data.records;
    total.value = result.data.total;
  }

}
//分页器下拉菜单发生变化的时候触发
const changeSize = () => {
  getHasSpu();
}
//添加新的spu按钮的回调
const addSpu = () => {
  //切换为场景1：添加与修改已有SPU结构->SpuForm
  scene.value = 1;
  //调用子组件实例方法初始化添加SPU的数据
  spu.value.initAddSpu(categoryStore.c3Id);
}
//子组件spuForm绑定自定义事件：目的是让子组件通知父组件切换场景为0
const changeScene = (obj: any) => {
  console.log(obj);

  //子组件SpuForm点击取消变为场景0：展示已有的SPU
  scene.value = obj.flag;
  //再次获取全部的已有SPU
  if (obj.params == 'update') {
    //更新留在当前页
    getHasSpu(pageNo.value);
  } else {
    //添加留在第一页
    getHasSpu()
  }

}
//修改已有的SPU的按钮的回调
const updateSpu = (row: SpuData) => {
  //切换为场景1：添加与修改已有的SPU结构-> SpuForm
  scene.value = 1;
  //调用子组件实例方法获取完整已有的SPU的数据
  spu.value.initHasSpuData(row);

}
//添加SKU按钮的回调
const addSku = (row: SpuData) => {
  //点击添加SKU按钮切换场景
  scene.value = 2;
  //调用子组件的方法初始化添加SKU的数据
  sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row);
}
//查看SKU列表的数据
const findSku = async (row: SpuData) => {
  let result = await reqSkulist((row.id as number));
  if (result.code == 200) {
    skuArr.value = result.data;
    //显示对话框
    show.value = true;
  }

}
</script>

<style scoped></style>