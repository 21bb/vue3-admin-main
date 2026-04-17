<template>

  <el-card class="box-card">
    <!--卡片顶部添加品牌按钮-->
    <el-button type="primary" size="default" icon="Plus" @click="addTrademark">添加品牌</el-button>
    <!--表格组件：用于展示已有的品牌数据-->
    <!--
    table
    ---border；可以设置表格纵向是否有边框
    table-column
    ---label:某一个列表
    ---width:设置这列宽度
    ---align:设置这一列对齐方式
    -->
    <el-table style="margin: 10px 0px" border :data="trademarkArr">
      <el-table-column label="序号" width="80px" align="center" type="index">
        <!-- prop: 对应数据对象中的键名 -->

      </el-table-column>
      <el-table-column label="品牌名称" prop="tmName"> </el-table-column>
      <el-table-column label="品牌LOGO">

        <template #default="{ row }">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px">
        </template>
      </el-table-column>
      <el-table-column label="品牌操作">
        <template #default="{ row }">
          <el-button type="primary" size="small" icon="Edit" @click="updateTrademark(row)">修改</el-button>
          <el-popconfirm :title="`您确定要删除${row.tmName}吗?`" width="250px" icon="Delete" @confirm="removeTrademark(row.id)">
            <template #reference>
              <el-button type="danger" size="small" icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!--分页器组件-->
    <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[1, 2, 3]" :background="true"
      layout="prev, pager, next, jumper, ->, sizes, total" :total="total" @current-change="getHasTrademark" />
  </el-card>
  <!--对话框组件：在添加品牌于修改已有品牌的业务时候使用结构-->
  <!--v-model:属性用户控制对话框的显示与隐藏的 true显示 false隐藏
  title:设置对话框左上角标题-->
  <el-dialog v-model="dialogFormVisible" :title="trademarkParams.id ? '修改品牌' : '添加品牌'">
    <el-form style="width:80%;" :model="trademarkParams" :rules="rules" ref="formRef">
      <el-form-item label="品牌名称" label-width="100px" prop="tmName">
        <el-input placeholder="请您输入品牌名称" v-model="trademarkParams.tmName"></el-input>
      </el-form-item>
      <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
        <!-- 上传组件 -->
        <el-upload class="avatar-uploader" action="/api/admin/product/fileUpload" :show-file-list="false"
          :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :headers="headers">
          <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
          <div v-else class="avatar-uploader-icon">
            <el-icon size="28" color="#8c939d">
              <Plus />
            </el-icon>
          </div>
        </el-upload>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
      <el-button type="primary" size="default" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import useUserStore from '@/store/modules/user'
import type { TradeMark } from '@/api/product/trademark/type';
import { ElMessage, type UploadProps } from 'element-plus'
import { ref, onMounted, reactive, nextTick } from 'vue'
import { reqHasTrademark, reqAddOrUpdateTrademark, reqDeleteTrademark } from '@/api/product/trademark';
import type { Records, TradeMarkResponData } from '@/api/product/trademark/type'
//获取el-form组件实例
let formRef = ref();
//当前页码
let pageNo = ref<number>(1);
//每一页展示多少数据
let limit = ref<number>(3);
//存储已有品牌数据总数
let total = ref<number>(0);
//存储已有品牌的数据
let trademarkArr = ref<Records>([])
let dialogFormVisible = ref<boolean>(false);
//存储上传图片的地址
let imageUrl = ref<string>('')
// 获取用户相关的小仓库：获取仓库内部token，登录成功以后携带给服务器
const userStore = useUserStore()
const headers = { Token: userStore.token }
const getHasTrademark = async (pager = 1) => {
  pageNo.value = pager;
  let result: TradeMarkResponData = await reqHasTrademark(pageNo.value, limit.value);
  if (result.code == 200) {
    //存储已有品牌个数
    total.value = result.data.total;
    trademarkArr.value = result.data.records;
  }

}
onMounted(() => {
  getHasTrademark();
});
const addTrademark = () => {
  //清空数据
  trademarkParams.tmName = '';
  trademarkParams.logoUrl = '';
  trademarkParams.id = 0;
  dialogFormVisible.value = true;
  //第一种写法：ts的问号语法
  //formRef.value?.clearValidate('tmName');
  //formRef.value?.clearValidate('logoUrl');
  nextTick(() => {
    //nextTick用于获取更新后的Dom
    formRef.value.clearValidate('tmName');
    formRef.value.clearValidate('logoUrl');
  })
};
//修改已有品牌的按钮的回调
//row:当前已有的品牌
const updateTrademark = (row: TradeMark) => {
  //清空校验规则错误提示信息
  nextTick(() => {
    //nextTick用于获取更新后的Dom
    formRef.value.clearValidate('tmName');
    formRef.value.clearValidate('logoUrl');
  })
  //填充数据
  Object.assign(trademarkParams, row);
  //imageUrl.value = row.logoUrl;
  dialogFormVisible.value = true;
  //trademarkParams.id = row.id;
  //trademarkParams.tmName = row.tmName;
  //trademarkParams.logoUrl = row.logoUrl;
}
//对话框底部取消按钮
const cancel = () => {
  dialogFormVisible.value = false;
}
const confirm = async () => {
  //在你发请求之前，要对整个表单进行校验
  //validate方法返回的是一个promise，如果校验失败，会返回一个rejected状态的promise
  try {
    await formRef.value.validate();
    //校验通过：发送请求
    let result: any = await reqAddOrUpdateTrademark(trademarkParams);
    if (result.code == 200) {
      //关闭对话框
      dialogFormVisible.value = false;
      //弹出提示信息
      ElMessage({
        type: 'success',
        message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功'
      });
      //再次获取已有的品牌数据
      getHasTrademark(trademarkParams.id ? pageNo.value : 1);
    } else {
      //添加失败
      ElMessage({
        type: 'error',
        message: trademarkParams.id ? '修改品牌失败' : '添加品牌失败'
      });
      //关闭对话框
      dialogFormVisible.value = false;
    }
  } catch (error) {
    //校验未通过：控制台打印错误信息，或者不做处理
    console.log('表单校验失败', error);
  }
}
//定义新增品牌数据
let trademarkParams = reactive<TradeMark>({
  tmName: '',
  logoUrl: ''
})
// 上传图片组件->上传图片之前触发的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  //钩子是在图片上传成功之前触发，上传文件之前可以约束文件类型与大小
  //要求：上传文件格式必须是png|jpg|gif 4m
  if (rawFile.type == 'image/png' || rawFile.type == 'image/jpeg' || rawFile.type == 'image/gif') {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true;
    } else {
      ElMessage({
        type: 'error',
        message: "上传文件大小小于4M"
      })
      return false;
    }
  } else {
    ElMessage({
      type: 'error',
      message: "上传文件格式务必PNG|JPG|GIF"
    })
    return false;
  }

}
//图片上传成功钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {


  trademarkParams.logoUrl = response.data;
  //response:即为当前这次上传图片post请求服务器返回的数据
  //收集上传图片的地址，添加一个新的品牌的时候 带给服务器
  //图片上传成功，清除掉对应图片校验结果
  formRef.value.clearValidate('logoUrl');
}
//品牌自定义校验
const validatorTmName = (rule: any, value: any, callBack: any) => {
  //自定义校验规则
  //是当表单元素触发blur时候，会触发此方法
  if (value.trim().length >= 2) {
    callBack();
  } else {
    //校验未通过时
    callBack(new Error('品牌名称位数大于等于两位'))
  }

}
//品牌logo图片的自定义校验规则方法
const validatorLogoUrl = (rule: any, value: any, callBack: any) => {
  if (value) {
    callBack();
  } else {
    callBack(new Error('LOGO图片务必上传'))
  }

}
//表单校验规则对象
const rules = {
  tmName: [
    //required:这个字段务必要校验，表单项前面出来五角星
    //trigger:代表触发校验规则时机[blur,change]
    { required: true, trigger: 'blur', validator: validatorTmName }
  ],
  logoUrl: [
    { required: true, validator: validatorLogoUrl }
  ]
}
//气泡确认框确定按钮的回调
const removeTrademark = async (id: number) => {
  //点击确定按钮：发送删除请求
  let result = await reqDeleteTrademark(id);
  if (result.code == 200) {
    //弹出提示信息
    ElMessage({ 
      type: 'success',
      message: '删除品牌成功'
    });
    //再次获取已有的品牌数据
    getHasTrademark(trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1);
  } else {
    ElMessage({
      type: 'error',
      message: '删除品牌失败'
    });
  }
}
</script>
<style scoped lang="scss">
:deep(.avatar-uploader) {
  border: 2px dashed #d9d9d9 !important;
  border-radius: 6px;
  cursor: pointer;
  width: 178px !important;
  height: 178px !important;

  /* 让内部内容居中 */
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.avatar-uploader:hover) {
  border-color: #409EFF !important;
}

.avatar-uploader-icon {
  /* 内部图标完全居中 */
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 30px;
  color: #8c939d;
}

.avatar {
  width: 178px;
  height: 178px;
  object-fit: cover;
}
</style>