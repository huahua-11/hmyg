/* 
1.给左侧菜单绑定点击事件 点击
    1.左侧菜单切选中
      1.获取到被点击的索引
      2.或取源数组 循环修改
    2.同时右侧要显示的内容跟随变化
      1.获取之前定义 好的全局接口返回值
      2.动态的传递被点击的索引即可
2、给分类页面添加一个缓存的效果
  1、h5中的  本地存储技术  localStorage
      localStorage.setItem  存入不同类型的数据
      1。。。普通的数据  数字 字符串  bool
      2。。。对象格式   先转成json字符串在存进去
  2、微信小程序中 本地存储技术
      1。。。不管什么类型的数据  直接存  可以直接获取  比以前的h5的本地存储更简单
  3、在分析缓存的逻辑 
    1.发送请求之前  先判断一下有没有缓存的数据
    2.假如没有  （a.直接发送请求  获取数据  （b.把新输入的存到缓存中
    要存入的数据格式 key =" cates":，{time：存入的时间,data:接口的返回值  }））
    3.有缓存数据  
         判断是否过期
         1、数据已过期    重新发送请求
         2、数据没有过期   继续使用
 */
import {request} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
import {getStorageCate ,setStorageCate } from "../../utils/storage.js";

Page({
  data: {
    // 左侧的菜单栏
    LeftCateList:[],
    // 右侧的菜单栏
    RightCateList:[],
    // 选中的菜单的索引
    currentIndex: 0,
    //右侧滚动条距离  颈部的位置
    scrollTop: 0
  },
  //接口的返回值  数组格式
  //小程序中不建议把没有必要的的数据定义在data中，因为内部会把data中的所有的数据都会传递到
  // 视图层 wxml ，这样容易页面加载会特别容易卡
  Cates:[],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // 存    获取
    // wx.setStorageSync('qaz', {name:"大师兄"});
    // let qaz = wx.getStorageSync('qaz');
    //获取缓存数据  判断是否有缓存数据
    // const cates = wx.getStorageSync("cates");
    const cates = getStorageCate();
      //判断是否有数据
      if(!cates){
        // 没有数据    1、发送请求 2.缓存数据
        this.getCateGoryList()
      }else{
        //有数据
        // 判断是否过期 (当前时间 - 缓存时间)>10秒
        if(Date.now()-cates.time>1000*10){
          //重新发送请求
          this.getCateGoryList()
        }else{
          //获取缓存中的数据
          const cateData = cates.data;
          //给全局变量进行复制
          this.Cates = cateData;
          //左侧菜单数据
          const LeftCateList = this.Cates.map(v=>({cat_id:v.cat_id,cat_name:v.cat_name}))
          //右侧菜单数据
          const RightCateList = this.Cates[0].children
          this.setData({
            LeftCateList,
            RightCateList
          })
        }
      }
  },
  //获取所有分类数据
  async getCateGoryList(){
    const result = await request({url:'/categories'})  
      //把接口的数据赋值   给我们的全局变量
      this.Cates = result;
      // 把我们的数据缓存到本地存储中去
      // wx.setStorageSync("cates",{time:Date.now(),data:this.Cates} );
      setStorageCate({time:Date.now(),data:this.Cates})
      //左侧菜单数据
      const LeftCateList = this.Cates.map(v=>({cat_id:v.cat_id,cat_name:v.cat_name}))
      //右侧菜单数据
      const RightCateList = this.Cates[0].children
      this.setData({
        LeftCateList,
        RightCateList
      })
  },
  //左菜单被点击事件
  handleMenuChang(e){
    // console.log(e)
    //1 获取索引
    const {index} = e.currentTarget.dataset;
    // 2 根据索引获取右侧的内容    要渲染数据
    const RightCateList = this.Cates[index].children;
    //3.控制右侧滚动条的的 滚动距离
    //4 选中的菜单的索引 = 点击的索引 就会随他改变而改变
    this.setData({
      currentIndex : index,
      RightCateList,
      scrollTop: 0
    })
  }
})