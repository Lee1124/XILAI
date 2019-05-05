// pages/consociationDetails/consociationDetails.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataInfo:{
      title:"成都富力丽思卡尔顿酒店",
      location:"成都市青羊区顺城大街269号",
      description:"成都富力丽思卡尔顿酒店拥有353间现代舒适的客房，融合重视的古典Yui现代的建立月。酒店提供结合具有成都特色的茶文化和卡的的传奇服务，为你创造独特难忘的回忆"
    }
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