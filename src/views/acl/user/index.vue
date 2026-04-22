<template>
  <div>
    <el-card style="height:80px">
      <el-form :inline="true" class="form">
        <el-form-item label="用户名：">
          <el-input placeholder="请你输入搜索用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="default">搜索</el-button>
          <el-button type="primary" size="default">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin:10px 0px;">
      <el-button type="primary" size="default" @click="addUser">添加用户</el-button>
      <el-button type="primary" size="default">批量删除</el-button>

      <el-table style="margin:10px 0px;" border :data="userArr">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column label="#" align="center"></el-table-column>
        <el-table-column label="ID" prop="id" align="center" width="80" />
        <el-table-column label="用户名" prop="username" align="center" width="120" />
        <el-table-column label="用户名称" prop="name" align="center" width="120" />
        <el-table-column label="用户角色" prop="roleName" align="center" width="150" />
        <el-table-column label="创建时间" prop="createTime" align="center" width="180" />
        <el-table-column label="更新时间" prop="updateTime" align="center" width="180" />

        <!-- 修复：操作列插槽 -->
        <el-table-column label="操作" width="260px" align="center">
          <template #default="scope">
            <el-button type="primary" size="small" icon="User">分配角色</el-button>
            <el-button type="primary" size="small" icon="Edit" @click="updateUser(scope.row)">编辑</el-button>
            <el-button type="primary" size="small" icon="Delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 7, 9, 11]"
        layout="prev, pager, next, jumper, ->, sizes, total" :total="total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </el-card>

    <!-- 修复：drawer 必须绑定 v-model -->
    <el-drawer v-model="drawer" size="500px">
      <template #header>
        <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
      </template>
      <template #default>
        <el-form label-width="80px" :model="userParams" :rules="rules" ref="formRef">
          <el-form-item label="用户姓名" prop="username">
            <el-input v-model="userParams.username"></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="name">
            <el-input v-model="userParams.name"></el-input>
          </el-form-item>
          <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
            <el-input v-model="userParams.password"></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="display:flex;justify-content:flex-end;gap:10px;">
          <el-button @click="drawer = false">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, nextTick } from 'vue'
import { reqAddOrUpdateUser, reqUserInfo } from '@/api/acl/user/index'
import type { UserResponseData, Records, User } from '@/api/acl/user/type';
import { ElMessage } from 'element-plus';

let pageNo = ref<number>(1);
let pageSize = ref<number>(5);
let total = ref<number>(0);
let userArr = ref<Records[]>([]);
let drawer = ref<boolean>(false);
//获取form组件实例
let formRef = ref<any>();
let userParams = reactive<User>({
  id: undefined,
  username: '',
  name: '',
  password: ''
})

onMounted(() => {
  getHasUser();
});

const getHasUser = async (pager = 1) => {
  pageNo.value = pager;
  let result: UserResponseData = await reqUserInfo(pageNo.value, pageSize.value);
  total.value = result.data.total;
  userArr.value = result.data.records;
};

const handleSizeChange = () => {
  getHasUser(1);
}

const handleCurrentChange = (val: number) => {
  getHasUser(val);
}

const addUser = () => {
  drawer.value = true;
  Object.assign(userParams, { username: '', name: '', password: '' });
  //清除上一次的错误的提示信息
  nextTick(() => {
    formRef.value.clearValidate('username');
    formRef.value.clearValidate('name');
    formRef.value.clearValidate('password');
  });
}

const updateUser = (row: User) => {
  drawer.value = true;
  Object.assign(userParams, row);
  //清除上一次的错误的提示信息
  nextTick(() => {
    formRef.value.clearValidate('username');
    formRef.value.clearValidate('name');
  });
}

const save = async () => {
  const valid = await formRef.value?.validate();
  if (!valid) return;

  let result: any = await reqAddOrUpdateUser(userParams);
  if (result.code == 200) {
    ElMessage.success('更新成功，即将跳转到登录页');

    // ==============================================
    // ✅ 修改的是 admin → 直接清空登录状态 + 跳登录页
    // ==============================================
    if (userParams.id == 1) {
      // 清空本地登录信息（必须加，否则会自动跳首页）
      localStorage.clear();
      // 强制跳转到登录页
      window.location.href = '/login';
      return;
    }

    drawer.value = false;
    getHasUser(pageNo.value);
  } else {
    ElMessage.error('操作失败');
  }
};
//校验用户名字回调函数
const validatorUsername = (rule: any, value: any, callBack: any) => {
  //用户名字|昵称。长度至少五位
  if (value.trim().length >= 5) {
    callBack();
  } else {
    callBack(new Error('用户名字至少五位'))
  }
}
//校验用户名字回调函数
const validatorname = (rule: any, value: any, callBack: any) => {
  //用户名字|昵称。长度至少五位
  if (value.trim().length >= 5) {
    callBack();
  } else {
    callBack(new Error('用户昵称至少五位'))
  }
}
//校验用户名字回调函数
const validatorPassword = (rule: any, value: any, callBack: any) => {
  //用户名字|昵称。长度至少五位
  if (value.trim().length >= 6) {
    callBack();
  } else {
    callBack(new Error('用户密码至少六位'))
  }
}
//表单校验的规则对象
const rules = {
  //用户名字
  username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
  //用户昵称
  name: [{ required: true, trigger: 'blur', validator: validatorname }],
  //用户密码
  password: [{ required: true, trigger: 'blur', validator: validatorPassword }]
}
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>