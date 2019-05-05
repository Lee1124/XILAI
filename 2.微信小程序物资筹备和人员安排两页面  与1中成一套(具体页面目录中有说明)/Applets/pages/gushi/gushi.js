// pages/gushi/gushi.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.setData({url: options.url_});
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
    var url = currentPage.route + "&url_=" + currentPage.options.url_; //当前页面url
    return {
      title: '你好哇，爱情',
      // imageUrl: app.globalData.imgUrl + 'share.png',
      path: '/pages/validation/validation?share=true&shareopenid=' + getApp().globalData.openid + '&url=' + url
    }
  }
})