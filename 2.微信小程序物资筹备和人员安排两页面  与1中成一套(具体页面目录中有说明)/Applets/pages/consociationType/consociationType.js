// pages/consociation/consociation.js
var app = getApp();
var url = getApp().globalData.url;//服务器ip

Page({

  /**
   * 页面的初始数据
   */
  data: {
      "list": [{
        "imgUrl": "https://xilai99.com/image/96/fa78d902-94a8-48d9-9994-8fa82203b8ef.jpg",
        "title": "成都富力丽思卡尔顿酒店"
      },
        {
          "imgUrl": "https://xilai99.com/image/96/fa78d902-94a8-48d9-9994-8fa82203b8ef.jpg",
          "title": "成都富力丽思卡尔顿酒店"
        }, {
          "imgUrl": "https://xilai99.com/image/96/fa78d902-94a8-48d9-9994-8fa82203b8ef.jpg",
          "title": "成都富力丽思卡尔顿酒店"
        }, {
          "imgUrl": "https://xilai99.com/image/96/fa78d902-94a8-48d9-9994-8fa82203b8ef.jpg",
          "title": "成都富力丽思卡尔顿酒店"
        }, {
          "imgUrl": "https://xilai99.com/image/96/fa78d902-94a8-48d9-9994-8fa82203b8ef.jpg",
          "title": "成都富力丽思卡尔顿酒店"
        }, {
          "imgUrl": "https://xilai99.com/image/96/fa78d902-94a8-48d9-9994-8fa82203b8ef.jpg",
          "title": "成都富力丽思卡尔顿酒店"
        },
        {
          "imgUrl": "https://xilai99.com/image/96/fa78d902-94a8-48d9-9994-8fa82203b8ef.jpg",
          "title": "成都富力丽思卡尔顿酒店"
        }, {
          "imgUrl": "https://xilai99.com/image/96/fa78d902-94a8-48d9-9994-8fa82203b8ef.jpg",
          "title": "成都富力丽思卡尔顿酒店"
        }, {
          "imgUrl": "https://xilai99.com/image/96/fa78d902-94a8-48d9-9994-8fa82203b8ef.jpg",
          "title": "成都富力丽思卡尔顿酒店"
        }, {
          "imgUrl": "https://xilai99.com/image/96/fa78d902-94a8-48d9-9994-8fa82203b8ef.jpg",
          "title": "成都富力丽思卡尔顿酒店"
        }, {
          "imgUrl": "https://xilai99.com/image/96/fa78d902-94a8-48d9-9994-8fa82203b8ef.jpg",
          "title": "成都富力丽思卡尔顿酒店"
        }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    wx.setNavigationBarTitle({
      title: '酒店'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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