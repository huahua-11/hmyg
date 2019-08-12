/* 
1、支付页面的动态标签是  只需要显示  checked  为true的元素
2、想要获取订单编号 
  1.先获取token
    1.token 需要   授权页面 来获取
*/
import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from "../../request/index.js";
import { requestPayment, showToast } from "../../utils/asyncWx";

import { getStorageToken } from "../../utils/storage.js";
Page({
  data: {
    address:{},
    cart:{},
    // 总价格
    totalPrice: 0,
    // 总数量 勾选了的中数量 
    totalNum: 0,
  },
  onShow(){
    const address = wx.getStorageSync("address") || {};
    const cart = wx.getStorageSync("cart") || {};
    // 把参数转换为数组
    // 把的对象中的值 提取出来 变成一个数组 
    let cartArr = Object.values(cart);
     // 计算总价格
    let totalPrice=0;
     // 总数量 购买的总数量
    let totalNum= 0;
    cartArr.forEach(v => {
      if(v.checked){
        // 选中
        totalPrice +=v.goods_price * v.num;
        totalNum +=v.num;
      }
    });  
    this.setData({cart,totalPrice,totalNum,address})
  },
  //点击支付
  async handleOrderPay(){
    try{
      const cart = this.data.cart;
      // 1。获取本地存储的中的token
      const token = getStorageToken();
      // 2.判断有没有值
      if(!token){
        // 2.1跳转到 授权页面
        wx.navigateTo({
          url: '/pages/auth/index'
        });
      }
      // 正常往下执行
      else{
        // 3.准备订单的参数
        // 3.1准备请求头
        let header = { Authorization:token };
        // 3.2获取订单编号的请求头参数
        // 订单总价格
        let order_price =this.data.totalPrice;
        // 订单的地址
        let consignee_addr = this.data.address.all;
        // 订单的商品（属性checked = true）数组
        let goods = [];
        for (const key in cart) {
          if (cart.hasOwnProperty(key)) {
            if(cart[key].checked){
              goods.push({
                goods_id:cart[key].goods_id,
                goods_number:cart[key].goods_number,
                goods_price:cart[key].goods_price
              });
            }
          }
        }
        // 把订单要的参数封装成一个对象
        let orderParams = {order_price,consignee_addr,goods};
        // 3.3发送post请求来获取订单数据
        const {order_number} = await request({url:"/my/orders/create",data:orderParams,method:"post",header:header});
        // 4.获取支付的参数pay
        const {pay} = await request({url:"/my/orders/req_unifiedorder",data:{order_number},method:"post",header:header});
        // 5.调用微信支付
        const res = await requestPayment(pay);
        // 6.查询一下我们的第三方服务里面的订单状况  也会成功(更新订单)
        const res2 = await request({url:"/my/orders/chkOrder",data:{order_number},method:"post",header:header});
        // console.log(res)
        await showToast({title:"支付成功！"});
        // 7.订单详情
        wx.navigateTo({
          url: '/pages/order/index'
        });
          
      }
    }
    catch(error){
      console.log("error");
      // 发送异步请求 把error 发送到我们的服务器来分析系计错误
      await showToast({title:"支付失败"})
    }
  }
}) 