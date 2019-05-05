// components/flow-nav.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    two:{
      type:Boolean,
        value:true
    },
      active:{
      type:Number,
          value:2
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
      chooseNav(e){
          console.log(e);
          let id=e.currentTarget.dataset.id;

        if(id==1){
            this.setData({
                active:1
            })
            this.triggerEvent('chooseNav',{pages:1})
        }else if(id==2){
            this.setData({
                active:2
            })
            this.triggerEvent('chooseNav',{pages:2})
        }else{
            this.setData({
                active:3
            })
            this.triggerEvent('chooseNav',{pages:3})
        }
      }
  }
})
