/* 会封装所以项目的中用到的代码 */

// 获取本地存储中的购物车的数据
export const getStorageCart =()=>{
    return wx.getStorageSync("cart");
}

/** 设置购物车到本地存储中来
*  @param {object} cart 要填充的数据
*/
export const setStorageCart =(cart)=>{
    wx.setStorageSync("cart",cart);
}
  // 获取本地存储中的商品分类的数据
export const getStorageCate =()=>{
    return wx.getStorageSync("cates");
}

/** 设置商品分类的数据到本地存储中来
*  @param {object} cates 要填充的数据
*/
export const setStorageCate =(cates)=>{
    wx.setStorageSync("cates",cates);
}
  // 获取缓存中的地址信息
  export const getStorageAddress =()=>{
    return wx.getStorageSync("address");
}

/** 把地址信息  存到本地存储中来
*  @param {object} address 要存入购物车对象
*/
export const setStorageAddress =(address)=>{
    wx.setStorageSync("address",address);
}


/** 把token  存到本地存储中来
*  @param {object} token 要存入token
*/
export const setStorageToken =(token)=>{
    wx.setStorageSync("token",token);
}
  // 获取缓存中的token
  export const getStorageToken =()=>{
    return wx.getStorageSync("token");
}
/** 把用户信息  存到本地存储中来
*  @param {object} userinfo 要存入用户信息
*/
export const setStorageUserInfo=(userinfo)=>{
    wx.setStorageSync("userinfo",userinfo);
}
  // 获取缓存中的userinfo
  export const getStorageUserInfo =()=>{
    return wx.getStorageSync("userinfo");
}