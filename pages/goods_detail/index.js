/* 
1点击轮播图图片 放大预览
  1.绑定点击事件
  2、调用微信内置  wx.previewImage
2.点击加入购物车
  1、思考购物车数据怎么存储  格式是什么样的  本地存储
  {
    1、华为的商品id ： 华为商品信息
    2、OPPO的商品id ： OPPO商品信息
  }
  2、先获取本地存储购物车对象 || {}  cart
  3、给购车对象  添加新的属性和值
  cart.height:=100;
  goodsid
  cat.100=200;
  cart[goodsis]=200
  4、给本地存储  填写进去即可
3.修改商品详情  富文本本文中图片格式
  1、获取到的数据，图片格式  webp
  2、有些iPhone手机不支持
  3、最好的解决方式， 是让后台统一修改
  4、但是后台  暂时改变了
  5、我们前端可以暂时先处理
 */

import {request} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
import {getStorageCart ,setStorageCart } from "../../utils/storage.js";

Page({
  data: {
    //获取商品详情数组
    goodsInfo:{}
  },
  // 全局的商品对象
  GoodsObj:{},
  onLoad: function (options) {
    this.getGoodsDetail(options.goods_id)
  },
  //获取商品详情信息
async  getGoodsDetail(goods_id){
  const result = await request({url: "/goods/detail",data:{goods_id}});
    this.GoodsObj = result;
    // console.log(this.GoodsObj)
    this.setData({
      goodsInfo:{
        goods_name: result.goods_name,
        goods_price: result.goods_price,
        pics: result.pics,
        // 全部替换 .webp ->  .jpg
        goods_introduce: result.goods_introduce.replace(/\.webp/g,'.jpg')
      }
    })
},
//点击轮播图图片 放大预览
handlePreviewImage(e){
    // console.log(e)
  const {index} = e.currentTarget.dataset;
  // urls需要预览图片链接列表
  const urls = this.data.goodsInfo.pics.map(v=>v.pics_big);
  // 当前显示图片的链接
  const current = urls[index];
  wx.previewImage({
    current,
    urls
  });
},
//加入购物车
handleCartAdd(){
  console.count("成功加入购物车")
  //1、获取本地存储购物车对象
  // let cart = wx.getStorageSync("cart") || {};
  let cart = getStorageCart ()||{};
  //2、判断是否加入过购物车
  if(cart[this.GoodsObj.goods_id]){
    // 2.1加入过购物车
    cart[this.GoodsObj.goods_id].num++;
  }else{
    // 2.2没有加入购物车，  第一次加入
    cart[this.GoodsObj.goods_id]=this.GoodsObj;
    // console.log(this.GoodsObj)
    cart[this.GoodsObj.goods_id].num=1;
    cart[this.GoodsObj.goods_id].checked=true;
  }
  // 3、把数据存储到本地存储中去
  // wx.setStorageSync("cart", cart);
  setStorageCart(cart);
  // 4、弹出成功的提示
  wx.showToast({
    title: '成功加入购物车',
    icon: 'success',
    // 遮罩层  蒙版
    // mask：true 但是用户点击 安妮的时候没有反应
    mask: true
  });
    
}
})