// pages/personInfo/personInfo.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasscroll: true,
    isNoContent: false,   // 没有内容
    isBlackUser: false,   // 是否拉入黑名单
    openid: 'ooUwn4wuMFbQpx3sBatpV1mf33xE',           // 当前user 的 openid
    curr_id: '',          // 当前被点击的视频
    videoContext: null,   // 视频
    userInfo_: null,      // 用户信息
    userLookDetail: []    // 浏览足迹
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    var this_ = this;
    var oid = options.o_id;
    this.setData({
      openid: options.o_id,
      isBlackUser: options.sf == 4 ? true :false // sf=4 黑名单
    })
    console.log('options,', options);
    wx.request({
      url: app.globalData.url + '/xlapi/Mini/Ins/Partners/GetShareUserDetail',
      data: { OpenId: this_.data.openid },
      method: "POST",
      header: {
        // Authorization: "url|1|2|xlhl|http://171.211.126.122:8092/||rolestate||0|action"
      },
      success: function (res) {
        var result = res.data;
        if (result.status){
          console.log(res)
          this_.setData({
            userInfo_: result.data.userModel,
            userLookDetail: result.data.userLookDetail
          })

          if (!result.data.userLookDetail || result.data.userLookDetail.length == 0){
            this_.setData({
              isNoContent: true
            })
          }
        }
        console.log("userInfo_", this_.data.userInfo_);
        console.log("userLookDetail", this_.data.userLookDetail);
        wx.hideLoading();
      }
    })
    
  },
  videoEnd(e) {
    this.setData({
      curr_id: '',
      hasscroll: true
    })
  },
  // 最新案例查看
  showCase(e){
    var item = e.currentTarget.dataset.item;
    if (item.IsVideo){
      this.setData({
        curr_id: item.NewGuid,
        hasscroll: false
      })
      
      // this.videoContext.requestFullScreen()
      this.videoContext.play()


    }else{
       // 当前显示的图片
      var currentImg = item.ImgUrl[0].ImgUrl;
      // 预览的图片集合
      var imgList = [];
      for (var i = 0; i < item.ImgUrl.length; i++){
        var it_ = item.ImgUrl[i];
        imgList.push(it_.ImgUrl.replace('-ys',''));
      }
      wx.previewImage({
        current: currentImg,    // 当前显示图片的http链接
        urls: imgList           // 需要预览的图片http链接列表
      })
    }
  },
  // 经典案例
  go_classicCase(e) {
    var id_ = e.currentTarget.dataset.appid;
    wx.navigateTo({
      url: '/pages/Casexq/Casexq?id=' + id_
    })
  },
  // 故事
  go_store(e) {
    var url_ = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: '/pages/gushi/gushi?url_=' + url_
    })
  },
  // 加入黑名单
  addBlackList(e){
    var that = this;
    if(that.data.isBlackUser){
      wx.showModal({
        title: '提示',
        content: '确定将该用户从黑名单移除吗？',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: app.globalData.url + '/xlapi/Mini/Ins/Partners/RestoreHeiMingDan',
              data: { OpenId: that.data.openid },
              method: "POST",
              header: {
                // Authorization: "url|1|2|xlhl|http://171.211.126.122:8092/||rolestate||0|action"
              },
              success: function (res) {
                var result = res.data;
                if (result.status) {
                  wx.showModal({
                    title: '提示',
                    content: '该用户已从黑名单中移除!'
                  })
                  that.setData({
                    isBlackUser: false
                  })
                }
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '确定将该用户加入黑名单吗？',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: app.globalData.url + '/xlapi/Mini/Ins/Partners/JoinHeiMingDan',
              data: { OpenId: that.data.openid },
              method: "POST",
              header: {
                // Authorization: "url|1|2|xlhl|http://171.211.126.122:8092/||rolestate||0|action"
              },
              success: function (res) {
                var result = res.data;
                if (result.status) {
                  wx.showModal({
                    title: '提示',
                    content: '该用户已被加入了黑名单!'
                  })
                  that.setData({
                    isBlackUser: true
                  })
                }
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //创建视频上下文对象
    this.videoContext = wx.createVideoContext('myVideo', this);
    this.videoContext.requestFullScreen();//执行全屏方法，没有效果
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
  
  }
})