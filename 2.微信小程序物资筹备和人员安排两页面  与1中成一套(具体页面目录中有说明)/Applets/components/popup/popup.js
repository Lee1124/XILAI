// components/popup/popup.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      show:{
        type:Boolean,
          value:false
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
      showPopup(){
        console.log(123);
        // this.setData({
        //     isShow:!this.data.isShow
        // })

          this.triggerEvent('showPopup')
    },
      addPrev(){
        // let obj=1
          this.triggerEvent('addPrev',{type:1})
      },
      addNext(){
        // let obj=1
          this.triggerEvent('addPrev',{type:2})
      },
      delThis(){
        // let obj=1
          this.triggerEvent('addPrev',{type:3})
      }
      
  }
})
