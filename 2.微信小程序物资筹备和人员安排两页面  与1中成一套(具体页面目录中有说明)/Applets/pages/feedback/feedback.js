// pages/feedback/feedback.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      x: 0,
      y: 0,
      scale:2,
      active:1,
      images1:[
          {id:1,star:false},
          {id:2,star:false},
          {id:3,star:false},
          {id:4,star:false},
      ],
      images2:[
          {id:1,star:true},
          {id:2,star:false},
          {id:3,star:false},
          {id:4,star:false},
      ],
      images3:[
          {id:1,star:true},
          {id:2,star:false},
          {id:3,star:false},
          {id:4,star:false},
      ],
  },


    scale(e){
      console.log(e.detail);
        this.setData({
            scale:e.detail.scale
        })
    },
    change(e){
      console.log(e.detail)
    },
    choosetext(e){
        let id=e.currentTarget.dataset.id;
                this.setData({
                    active:id
                })
    },
    chooseStar(e){
        console.log(123);
        let id=e.currentTarget.dataset.id-1;
        console.log(id);
        let abc=this.data.images1
        abc.forEach((item,index)=>{
          item.star=false;
          if(index<=id){
              item.star=true
          }
      })
        this.setData({
            images1:abc,
        })
    },
    touchStart(e){
        if(e.target.id=='handle'){
            this.start_x=e.touches[0].clientX;
            this.start_y=e.touches[0].clientY;
        }
        // console.log(this.start_x)
    },
    touchMove(e){
        var current_x=e.touches[0].clientX;
        var current_y=e.touches[0].clientY;
        var moved_x=current_x-this.start_x;
        var moved_y=current_y-this.start_y;

    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      this.start_x=0;
      this.start_y=0;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var pages = getCurrentPages();
    var currentPage = pages[pages.length - 1];
    var url = currentPage.route; //当前页面url
    return {
      imageUrl: app.globalData.imgUrl + 'share.png',
      path: "/pages/validation/validation?share=true&url=" + url
    }
  }
})