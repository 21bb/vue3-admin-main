export interface ResponseData{
  code:number,
  message:string,
  ok:boolean
}
//定义SKU对象的ts类型
export interface Attr{
  attrId:number|string,
  valueId:number|string,
}
export interface saleArr{
  saleAttrId:string|number,
  saleAttrValueId:string|number,
}
export interface SkuData {
  category3Id:string|number,
  spuId:string|number,
  tmId:string|number,
  skuName:string,
  price:string|number,
  weight:string|number,
  skuDesc:string,
  skuAttrValueList?:Attr[],
  skuSaleAttrValueList?:saleArr[],
  skuDefaultImg:string,
}
//获取SKU接口返回的数据ts类型
export interface SkuResponseData extends ResponseData{
  data:{
    records:SkuData[],
    total:number,
    size:number,
    current:number,
    orders:[],
    optimizeCountSql:boolean,
    hitCount:boolean,
    countId:null,
    maxLimit:null,
    searchCount:boolean,
    pages:number
  }
}