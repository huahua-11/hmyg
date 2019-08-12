/* 
1. 获取用户信息 
   返回  encryptedData,rawData,iv,signature
2. 小程序登录  
   返回 code
3. 提交数据到自己 的后台 执行post请求 提交数据 
       encryptedData,rawData,iv,signature code
4. 将token和用户数据rawData存入本地存储

*/
import { login} from "../../utils/asyncWx";
import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from "../../request/index.js";
import {setStorageToken} from "../../utils/storage"
Page({
  data: {
    
  },
  async handleGetUserInfo(e){
    
    // 1.获取参数 encryptedData,rawData,iv,signature 
    const {encryptedData,rawData,iv,signature} = e.detail;
    // 2.获取登陆后的code属性
    const {code} = await login();
    // 把要的参数封装成一个对象
    const postParams = {encryptedData,rawData,iv,signature,code}
    //3/ 发送请求获取token值
    const {token }= await request({url: "/users/wxlogin",method: "post", data:postParams})
    // console.log(res) 
    // 4.将token和用户数据rawData存入本地存储
    setStorageToken(token)
    // 5.从哪来回哪去  
    wx.navigateBack({
      delta: 1
    });
  }
});
  