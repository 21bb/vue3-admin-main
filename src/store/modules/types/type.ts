import { CateforyObj } from "@/api/product/attr/type";
import type { RouteRecordRaw } from "vue-router";
//定义小仓库数据state类型
export interface UserState{
  token:string|null;
  menuRoutes:[],
  username:string,
  avatar:string,
}
//定义分类仓库state对象的ts类型
export interface CategoryState{
  c1Id:string|number,
  c1Arr:CateforyObj[],
  c2Arr:CateforyObj[],
  c2Id:string|number,
  c3Arr:CateforyObj[],
  c3Id:string|number
}