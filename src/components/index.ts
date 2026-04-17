//引入项目中的全局组件
import SvgIcon from './SvgIcon/index.vue';
import Pagination from './Pagination/index.vue'
import Category from './Category/index.vue'
const allGlobalComponent={SvgIcon,Pagination,Category};
//引入element-plus提供全部图标组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

//对外暴露插件对象
export default{
  install(app:any){
   Object.keys(allGlobalComponent).forEach(key =>{
    app.component(key,allGlobalComponent[key]);
   });
   for(const [key,component] of Object.entries(ElementPlusIconsVue)){
    app.component(key,component)
   }

  }
}