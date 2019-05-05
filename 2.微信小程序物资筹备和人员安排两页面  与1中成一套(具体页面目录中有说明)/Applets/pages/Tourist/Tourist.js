var url = getApp().globalData.url;//服务器ip
var userid = getApp().globalData;//用户id
var app = getApp();
import util from '../../utils/totalUtil'
var common = require('../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userToggle: false,
    userInfo: app.globalData.userInfo,
    uname: '',
    dianpuName: '',
    dianpuPhone: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载...',
      mask: true
    })
    var that = this;
    if (options.uname && options.dianpuName && options.dianpuPhone){
      that.setData({
        uname: options.uname,
        dianpuName: "喜来" + options.dianpuName,
        dianpuPhone: options.dianpuPhone
      })
    }else{
      that.setData({
        uname: app.globalData.youkeName,
        dianpuName: "喜来" + app.globalData.dianpuName,
        dianpuPhone: app.globalData.dianpuPhone,
      })
    }
    
    app.getUserInfo().then(function (res) {
      //未获取权限
      if (res.status == 204) {
        that.setData({
          userToggle: true
        });
      } else {
        console.log(app.globalData.userInfo)
        that.setData({
          userInfo: app.globalData.userInfo
        })
        wx.hideLoading();
      }
    });
    app.editTabBar();
    wx.hideLoading();
  },
  // 打电话
  callPhone: function(e){
    wx.makePhoneCall({
      phoneNumber: this.data.dianpuPhone
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

  }
})