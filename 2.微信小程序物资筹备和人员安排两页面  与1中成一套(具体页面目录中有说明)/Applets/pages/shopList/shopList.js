var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [],
    phone: '',
    userType: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if(options.phone) {
      that.setData({
        phone: options.phone
      })
    }
    if(options.userType != -1) {
      that.setData({
        userType: options.userType
      })
    }
    //获取店铺
    wx.request({
      url: app.globalData.url + '/xlapi/Mini/Ins/Anli/RetStore',
      method: "GET",
      success: function (res) {
        console.log(res.data)
        // res.data.splice(0, 0, { name: "请选择离您最近的店铺" })
        that.setData({
          array: res.data
        })
        console.log(that.data.array);
      }
    });
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
  checkDian: function(e) {
    var item_ = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/Login/Login?dianId=' + item_.id + "&dianName=" + item_.name + "&phone=" + this.data.phone + 
        "&userType=" + this.data.userType + "&tel=" + item_.tel
    })
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