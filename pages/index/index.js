// 引入自己封装的代码
import { request } from '../../request/index.js'
Page({
  data: {
    // 轮播图数组
    swiperList:[],
     // 分类导航
     navCateList: [],
     // 楼层数组
     floorList: []
  },
  //生命周期函数--监听页面加载
  onLoad: function () {
    this.getswiperList();
    this.getNavCateList();
    this.getFloorList()
  },
  //获取轮播图数据
  getswiperList(){
    // wx.request({
    //   url: 'https://api.zbztb.cn/api/public/v1/home/swiperdata',
    //   success: (result) => {
    //     // console.log(result)
    //     this.setData({swiperList:result.data.message})
    //   },
    // });
    request({url:'/home/swiperdata'})
    .then((result)=>{
      this.setData({swiperList:result})
    })
  },
  // 分类导航
  getNavCateList(){
    request({url:'/home/catitems'})
    .then((result)=>{
      this.setData({navCateList:result})
    })
  },
  // 楼层数组
  getFloorList(){
    request({url:'/home/floordata'})
    .then((result)=>{
      this.setData({floorList:result})
    })
  }
})