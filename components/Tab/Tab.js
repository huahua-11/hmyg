// components/Tab/Tab.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 接受父组件传递过来的的信息
    tabs:{
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleItemChange(e){
      // console.log(e)
      const {index} = e.currentTarget.dataset;
      //触发父组件对的自定义事件
      this.triggerEvent("itemChange",{index});
    }
  }
})
