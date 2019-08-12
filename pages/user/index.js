/* 1 页面打开的时候 判断  有没有用户的信息
      1.没有信息就跳转到login 登录页面  去获取拥护信息 
        1.信息获取到  存入缓存中
        2.在跳转回来
*/
import { getStorageUserInfo } from "../../utils/storage.js"    
Page({
  data: {
    userinfo:{},
    // 收藏的商品的数量
    collectLegnth:0
  },
  // 打开页面就会加载
  onShow(){
    // 1.获取存储中的用户信息
    const userinfo = getStorageUserInfo();
    // 判断有没有存在用户信息
    // 跳转到login 登录页面  去获取拥护信息
    if(!userinfo){
      wx.navigateTo({
        url: "pages/login/index",
      });
      return;
    }
    // 2.给data赋值
    const collect = wx.getStorageSync("collect")||[];
    this.setData({
      userinfo,
      collectLegnth:collect.length
    })
      
  }
});
  