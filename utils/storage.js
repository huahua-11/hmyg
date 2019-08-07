/* 会封装所以项目的中用到的代码 */

// 获取本地存储中的购物车的数据
export const getStorageCart =()=>{
    return wx.getStorageSync("cart");
}

/** 设置购物车到本地存储中来
*  @param {Object} obj 要填充的数据
*/
export const setStorageCart =(obj)=>{
    wx.setStorageSync("cart",obj);
}
  // 获取本地存储中的商品分类的数据
export const getStorageCate =()=>{
    return wx.getStorageSync("cates");
}

/** 设置商品分类的数据到本地存储中来
*  @param {Object} obj 要填充的数据
*/
export const setStorageCate =(obj)=>{
    wx.setStorageSync("cates",obj);
}