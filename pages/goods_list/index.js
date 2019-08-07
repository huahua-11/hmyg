/* 
1、动态渲染生成图片
2、实现下拉刷新功能
  1、上滑页面，触动滚动条   下拉刷新
  2、页面触动事件  onReachBottom
    1、先判断  有没有下一页数据
      1、当前页面pagenum  和  总页数  比较
      总页数 = Math.ceil(总条数 /  页容量 pagesize)
      
      当前的页码是否  >=  总页数  没有下一页数据  否则就取反
  3. 判断 页面触动事件  onReachBottom  有没有下一页数据
3、启用下拉页面功能
  1. 页面的json文件开启设置 enablePullDownRefresh:true
  2. 页面的js中，绑定事件ngzh onPullDownRefresh
  3、重置
    1、重置页面   pagenum: 1,  不然一直刷新 一直叠加数据
    2、重置商品数组  data中商品数组  进行重置
    3、重新发送请求
    4、数据请求回来1后   手动关闭 页面的下拉刷新效果
4、异步请求   正在等待的效果
  1、正在等待的效果   这段代码怎么写  
  2、这段代码  放哪里好
5 接口的代码 用es 7 async方式
  1 脚手架工具 把js es6 编译成es5 babel来转 
  2 后期 学到小程序的第三方框架
    mpvue 自带脚手架工具 就会帮我编译 es7 -> es5 
  3 原生小程序代码 没有什么工具帮我们直接编译代码 
  4 提供一种方案 可以让在原生小程序中直接使用 es7 async 
    0 兼容性最好的方案 就是不要在原生小程序中 使用 es7的方法。。
    1 会在某些低版本的手机或者微信中 还是会报错
    2 经理 当前的原生代码在我的手机上运行没有问题，就可以直接使用了
 */
import {request} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    //标题
    tabs: [
      { id: 0, title: "综合", isActive: true },
      { id: 1, title: "销量", isActive: false },
      { id: 2, title: "价格", isActive: false }
    ],
    //给我们菜单渲染数组
    goodsList:[] 
  },
  //接口用的参数
  QueryParams:{
    //关键字
    query:'',
    //分类id
    cid:'',
    //当前页码
    pagenum: 1,
    //页容量
    pagesize: 10
  },
  // 总页数
  TotalPages: 1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //赋值
    this.QueryParams.cid = options.cid;
    this.getGoodsList();
    wx.showLoading({
      title: '加载中'
    });
    setTimeout(() => {
      wx.hideLoading()
    }, 3000);
  },
  //获取商品数据列表
  async  getGoodsList(){
    const result = await request({ url: "/goods/search", data:this.QueryParams });
      // console.log(result)
      //计算总页数 = Math.ceil(总条数 /  页容量 pagesize)
      this.TotalPages=Math.ceil(result.total / this.QueryParams.pagesize)
      this.setData({
        //拼接数据，先预览旧的数据 要是没有才看新的
        goodsList:[...this.data.goodsList,...result.goods]
      })
      // 关闭页面的下拉刷新效果
        // 1 有些框架 一些组件没有开启 就关闭可能  会报错
        // 2 有些框架 一些组件没有开启 就关闭可能  不会报错！！
        wx.stopPullDownRefresh();
  },
  //下拉刷新，页面触动事件  onReachBottom
  onReachBottom(){
    // 判断有没有下一条数据
    if(this.QueryParams.pagenum>=this.TotalPages){
      // 没有数据
      // console.log("没有下一条数据")
      wx.showToast({
        title: '没有下一条数据',
        icon: "none"
      })
    }else{
      //有数据
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },
  // 下拉刷新全局页面
  onPullDownRefresh(){
    //重置当前页数
    this.QueryParams.pagenum = 1;
    //重置商品数组
    this.setData({
      goodsList:[]
    })
    // 重新发送请求
    this.getGoodsList();
  },
  //子组件触发事件
  handleItemChange(e){
    //获取传递过来的索引
    const {index} = e.detail;
    //获取tabs数组
    let {tabs} = this.data;
    //循环修改tabs数组
    tabs.forEach((v,i) => {i===index? v.isActive = true:v.isActive = false});
    this.setData({tabs});
  }
})