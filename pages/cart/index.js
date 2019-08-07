/* 
1、给收获地址  按钮添加一个点击事件
  1、调用小程序自带的 获取收获地址的api  wx.chooseAddress
  2、正常流程
    1、先调用  获取（wx-getSetting） 用户对下程序的授权  接口 有返回值 scope 存放  用户带该应用的权限信息
    2、对权限scope 进行判断
      1 scope可能是 undefined ：用户从来没有点击过  收货按钮
        1、直接获取用户的收货地址 

      2 scope 可能是true ： 用户曾经给过应用  去权限
        1、直接获取用户的收货地址
      3 scope 可能是false ：用户曾经点击  取消 权限
        1、先打开用户 授权页面（openSetting） 让自己 重新授权
        2、再去获取收货地址信息
    3、把收货信息存入 本地存储中  方便获取
2.购物车动态渲染
  1、商品详情页 “加入购物车”  添加新的商品属性  checked = textUnderlinePosition:
  2、页面你onshow 获取本地存储数据 存入到data中 wxml 才有数据渲染
  3、格据data中的cart对象  来计算  全选  | 总价格  |购买数量  setCart（cart）
3.单个商品的切换选中
  1、给商品绑定事件
  2、获取要修改商品的id
  3、获取data中的购物车cart对象
  4、cart[id].checked = !cart[id].checked；
  5.把新的cart  设置在data 中  也要设置在本地存储中
4.全选 复选框
  1、绑定选中事件
  2、获取data中的 isAllChecked 
  3、直接取反 isAllChecked = !isAllChecked
  4 获取data中的购物车对象， 循环对象 来修改每一个商品的选中状态 把值都改为  isAllChecked
  5 把修改后的 cart对象 传入到 this.setCart(cart);
5.给数量按钮添加一个绑定事件
  1、获取商品的ID 是加还是减  用operation区分
  2.获取data中的购物车 cart
  3、判断当前操作是正常操作  还是   删除操作  
    if(当前的数量===1&&点击是“-”){
      删除    要删除得是一个cart对象属性而已  delete  cart【id】
    }
  4、当删除操作 时候需要删除购物车数据
    1、先弹出对话框  用户是否确认删除
  5、是正常操作 cart[id].num+=operation;

 */
import regeneratorRuntime from '../../lib/runtime/runtime';
import { getSetting, openSetting, chooseAddress } from "../../utils/asyncWx";
Page({
  data: {
    address:{},
    cart:{},
    // 全选状态
    isAllChecked: false,
    // 总价格
    totalPrice: 0,
    // 总数量 勾选了的中数量 
    totalNum: 0,
    // 判断购物车内有没有商品
    hasGoods:false,
  },
  // handleChooseAddress(){
  //   wx.getSetting({
  //     success: (result1) => {
  //       //1. 获取  用户对该授权的状态
  //       const scopeAddress = result1.authSetting["scope.addreess"]
  //       // 2.对权限scope 进行判断
  //       if(scopeAddress === true || scopeAddress === undefined){
  //         // 2.1.直接获取用户的收货地址
  //         wx.chooseAddress({
  //           success: (result2) => {
  //             console.log(result2,"、、、、、、、")
  //           }
  //         });
  //       }
  //       else{
  //         // 3 诱导用户打开授权页面'
  //         console.log("111111")
  //         wx.openSetting({
  //           success: (result3) => {
  //             // 3.1、直接获取用户的收货地址
  //             wx.chooseAddress({
  //               success: (result4) => {
  //                 console.log(result4,"\\\\\\")
  //               }
  //             })
  //           },
  //         });
            
  //       }
  //     },
  //   });
  // },

  async handleChooseAddress(){
    const res1 = await getSetting();
    const scopeAddress = res1.authSetting["scope.address"];
    if(scopeAddress===true || scopeAddress===undefined){
      //1、直接获取用户的收货地址 

    }else{
      // 2、先打开授权页面
      await openSetting();
    }
    const res2 = await chooseAddress();
    // 3、存入到本地存储数据中去
    // 自己新增 很详细的信息
    res2.all=res2.provinceName+res2.cityName+res2.countyName+res2.detailInfo;
    wx.setStorageSync("address", res2);
  },
  onShow(){
    const address = wx.getStorageSync("address")||{};
    const cart = wx.getStorageSync("cart")||{};
    this.setData({address,cart})
    this.setCart(cart)
  },
  setCart(cart){
    // 把参数转换为数组
    // 把的对象中的值 提取出来 变成一个数组 
    let cartArr = Object.values(cart);
    // 1.计算全选
    // every 会接受回调函数  数组循环的时候 这个时候的回调函数是true；
    // 那么every 的返回值是true  否则是就是  fontVariantAlternates: 
    let isAllChecked= true;
     // 计算总价格
    let totalPrice=0;
     // 总数量 购买的总数量
    let totalNum= 0;
    cartArr.forEach(v => {
      if(v.checked){
        // 选中
        totalPrice +=v.goods_price * v.num;
        totalNum +=v.num;
      }else{
        isAllChecked = false;
      }
      // 判断购物车中有没有数据
      isAllChecked = cartArr.length===0?false :isAllChecked;
      // 判断购物车内有没有商品
      const hasGoods = cartArr.length ? true:false;
      this.setData({cart,isAllChecked,totalPrice,totalNum,hasGoods})
      wx.setStorageSync("cart",cart);
    });
  },
  // 商品复选框选中事件
  handleCartCheck(e){
    // 1/获取要修改商品的id
    const {index} = e.currentTarget.dataset;
    // console.log(e)
    // 2. 获取data中的购物车对象
    const {cart} = this.data;
    // 3获取状态取反
    cart[index].checked =!cart[index].checked; 
    // 4.把cart重新设置  回data中和缓存中
    // 5.重新计算 全选状态
    this.setData({cart});
  },
  // 全选框   选中事件
  handleCartAllCheck(){
    // 1.获取data中的 isAllChecked ，cart对象
    let {isAllChecked,cart} = this.data;
    // 2.直接取反
    isAllChecked = !isAllChecked;
    // 3.获取data中的购物车对象， 循环对象 来修改每一个商品的选中状态 把值都改为  isAllChecked
    for (const key in cart) {
      if (cart.hasOwnProperty(key)) {
        cart[key].checked = isAllChecked;
      }
      // 4 把修改后的 cart对象 传入到 this.setCart(cart);
      this.setCart(cart);
    }
  },
  //给加减值绑定一个事件
  handleCartNumEit(e){
    //1、获取商品的id 是加还是减 
    const { id,operation} = e.currentTarget.dataset;
    // console.log(id,operation );
    // 2、获取data中的购物车cart
    const {cart} = this.data;
    // 3、判断当前是   删除操作 当前的数量===1&&点击是“-”
    if(cart[id].num===1&&operation===-1){
      delete cart[id];
      this.setCart(cart);
    };
    // 5、是正常操作时
    cart[id].num += operation;
    // 6 把修改后的 cart对象 传入到 this.setCart(cart);
    this.setCart(cart);
  }
}) 