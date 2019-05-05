// pages/test/test.js
var app = getApp();
import util from '../../utils/totalUtil'
// var Cases=require('../Cases/Cases.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabbar: app.globalData.tabbar,
        unread: app.globalData.unread,
        url:'../Cases/Cases.wxml'
    },
    ToSkip(e){
        console.log('点击事件',e)
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // app.editUserTabBar();
        // new Cases();
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
      wx.stopPullDownRefresh() //停止下拉刷新 
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