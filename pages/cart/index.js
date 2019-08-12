/* 
1 给 收货地址按钮 添加点击事件 
  1 调用微信小程序自带 获取收货地址的api   wx.chooseAddress
  2 正常流程
    1 先调用 获取( wx.getSetting) 用户对小程序的授权的 接口 有返回值 scope  存放 用户对该应用的权限信息
    2 对权限scope 进行判断
      1 scope 可能是 undefined ： 用户从来没有点击过 收货地址按钮 
        1 直接获取用户的收货地址 
      2 scope 可能是 true ： 用户曾经给过应用 权限 
        1 直接获取用户的收货地址
      3 scope 可能是 false : 用户曾经点击 取消 授权
        1 先打开用户 授权页面(openSetting) 让用户自己 重新授权
        2 再去获取收货地址信息！！！
  3 把收货的地址信息 存入到本地存储中 方便获取 
2 购物车数据动态渲染
  1 商品的详情页面 ‘加入购物车 ’ 添加新商品的时候顺便添加了新属性 checked=true
  2 页面 onShow 获取本地存储的数据 存入到 data中 wxml 才有数据渲染 
  3 根据data中的cart对象 来计算 全选| 总价格| 总购买数量 setCart(cart)
3 单个商品的切换选中
  1 给 商品绑定change事件
  2 获取 要修改的商品的id
  3 获取data中的购物车cart 对象 
  4 cart[id].checked=!cart[id].checked;
  5 把新的cart 设置会 data中  也要设置会本地存储中 
4 全选 复选框 
  1 绑定选中事件
  2 获取data中的  isAllChecked
  3 直接 取反 isAllChecked=!isAllChecked;
  4 获取data中的购物车对象， 循环对象 来修改每一个商品的选中状态 把值都改为  isAllChecked
  5 把修改后的 cart对象 传入到 this.setCart(cart);
5 给数量按钮 绑定事件
  1 获取到要操作的商品的id 和  加 还是 减  opeation
  2 获取data中的购物车 cart
  3 判断当前的操作是正常的操作 还是删除操作
    if(当前的数量===1&&点击的是 "-"){
      删除。 要删除的是一个cart对象的属性而已 delete cart[id]
    }
  4 当删除操作 时候 要删除购物车数据
    1 先弹出对话框 用户是否确认删除
  5 是正常操作的时候 cart[id].num+= opeation;
6 点击 结算
  1 先判断有么有收货地址
  2 判断有没有选中了的要购买的商品 checked=true 
  3 都满足了 才跳转到 支付页面！！
 */
import regeneratorRuntime from '../../lib/runtime/runtime';
import { getSetting, openSetting, chooseAddress, showModal, showToast } from "../../utils/asyncWx";
import { setStorageCart, getStorageCart, getStorageAddress, setStorageAddress } from "../../utils/storage.js";
Page({
  data: {
    address: {},
    cart: {},
    // 全选状态
    isAllChecked: false,
    // 总价格
    totalPrice: 0,
    // 总数量 勾选了的中数量 
    totalNum: 0,
    // 购物车有没有商品
    hasGoods: false
  },
  async handleChooseAddress() {
    // console.log("小龙女：我也想过过过儿过过的生活");
    // 1 获取用户的授权信息
    const res1 = await getSetting();
    const scopeAddress = res1.authSetting["scope.address"];
    if (scopeAddress === true || scopeAddress === undefined) {
      // 1.1 直接调用获取用户的收货地址
    } else {
      // 2.1 先打开授权页面
      await openSetting();

    }
    const res2 = await chooseAddress();

    // 1.3 存入到本地存储中
    // 自己新增 很详细的地址信息
    res2.all = res2.provinceName + res2.cityName + res2.countyName + res2.detailInfo;
    setStorageAddress(res2);

  },

  onShow() {
    const address = getStorageAddress();
    const cart = getStorageCart() || {};

    this.setData({ address, cart });

    this.setCart(cart);

  },
  // 根据cart对象来计算总价格。。
  // 还需要把总价格设置到data中
  setCart(cart) {
    // 0 把对象转成数组 [].filter [].forEach ...
    // 把的对象中的值 提取出来 变成一个数组 
    let cartArr = Object.values(cart);
    // 1 计算 全选 
    // every 会接收回调函数 数组循环的时候  这个回调函数都返回 true 
    // 那么 every 的返回值才是true 否则就是false 
    // let isAllChecked=cartArr.every(v=>v.checked);
    let isAllChecked = true;

    // 2 计算总的价格 
    let totalPrice = 0;
    // 3 计算 要购买的总数量
    let totalNum = 0;
    cartArr.forEach(v => {
      if (v.checked) {
        // 选中了
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        isAllChecked = false;
      }
    })

    // 判断购物车中有没有数据
    isAllChecked = cartArr.length === 0 ? false : isAllChecked;
    // 判断购物车内有没有商品
    const hasGoods = cartArr.length ? true : false;
    this.setData({ cart, isAllChecked, totalPrice, totalNum, hasGoods })
    setStorageCart(cart)
  },
  // 商品的复选框选中事件
  handleCartCheck(e) {
    // 1 获取要修改的商品的id
    const { id } = e.currentTarget.dataset;
    // 2 获取data中的购物车对象
    let { cart } = this.data;
    // 3 选中状态的取反
    cart[id].checked = !cart[id].checked;
    // 4 把cart重新设置回 data中和 缓存中

    // 5 重新计算 全选状态。。
    this.setCart(cart);
  },
  // 商品的全选功能
  handleCartAllCheck() {
    // 1 获取data中的数据
    let { isAllChecked, cart } = this.data;
    // 2 给全选按钮进行 取反
    isAllChecked = !isAllChecked;
    // 3 拿购物车对象进行循环 ，修改每一个购物车商品对象，把选中状态都改为 isAllChecked
    for (const key in cart) {
      // 判断该属性是不是对象自己 
      if (cart.hasOwnProperty(key)) {
        cart[key].checked = isAllChecked;
      }
    }
    // 4 把cart传入到setCart函数即可
    this.setCart(cart);
  },
  // 数量的改变
  async  handleCartNumEdit(e) {


    // console.log("人要行 干一行 行一行 一行行行行行");
    // 1 获取传递的参数
    const { id, operation } = e.currentTarget.dataset;
    // 2 获取data中的购物车对象cart
    let { cart } = this.data;

    // 3 判断当前的操作是否是删除操作
    if (cart[id].num === 1 && operation === -1) {
      // 执行删除
      const res = await showModal({ content: "您确定删除吗？" });
      // 确定删除
      if (res.confirm) {
        delete cart[id];
        this.setCart(cart);
      } else {
        console.log('用户点击取消')
      }
    } else {
      // 正常改变数量

      // 3 直接修改购物车的数量
      cart[id].num += operation;
      // 4 把cart重新赋值到data和缓存中 同时 也需要让底部的工具栏重新计算  this.setCart()
      this.setCart(cart);
    }

  },
  // 结算按钮的点击
  async handlePay() {
    //  1 获取data的中的地址
    const { address, totalNum } = this.data;
    // let cartArr = Object.values(cart);
    // 2 选中了的要购买的商品的长度
    // some 只要 有一个为true 那么整个some 就为true 
    // let hasChecked = cartArr.some(v => v.checked);
    if (!address.all) {
      // 没有收货地址
      await showToast({ title: "您没有选择收货地址" });
    } else if (totalNum <= 0) {
      // 不满足！！ 
      await showToast({ title: "您没有要结算的商品" });
    } else {
      // 满足要求 可以进行跳转页面！！！ 
      // console.log("可以进行跳转页面！！！");
      wx.navigateTo({
        url: '/pages/pay/index'
      });

    }
  }
})