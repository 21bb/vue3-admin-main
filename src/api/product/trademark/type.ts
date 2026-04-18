export interface ResponseData{
  code:number,
  message:string,
  ok:boolean
}
//已有的品牌的ts数据类型
export interface  TradeMark{
  id?:number,
  tmName:string,
  logoUrl:string
}
export type Records =TradeMark[];
//获取已有全部品牌的数据ts类型
export interface TradeMarkResponData extendsData{
  data:{
    records:number;
    total:number
    size:number
    current:number
    searchCount:boolean
    pages:number
  }
}