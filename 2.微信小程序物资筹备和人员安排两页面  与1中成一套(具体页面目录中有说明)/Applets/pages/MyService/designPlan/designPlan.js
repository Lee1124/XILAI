// pages/MyService/ designPlan/ designPlan.js

var app = getApp();
// var url = getApp().globalData.url;//服务器ip
import { url, promisePost } from '../../../utils/totalUtil'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        slideStatus: false,
        slideType: '',
        list: [2, 3, 4, 5],
        imageList: [1, 3, 2, 3],
        toastText: '您的婚礼设计已出，请确认您的婚礼设计',
        autoplay: false,
        interval: 10000,
        interval2: 6000,
        duration: 500,
        current2: 0,
        current1: 0,
        circular: true,
        showToast: true,//是否显示顶部提示框
        show: 1, //判断是否是转发的
        id:""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let id = options.orderId;
        this.setData({
            'id':id
        })
        app.editSJHeader();
        if (options.isShare == 'true') {
          this.setData({
            show: 2
          })
        }
        promisePost(url.url.planList, { orderId: id }).then(json => {
            console.log(json);
            if (json.status == 'OK') {
                json.data.forEach((item) => {
                    item.arr = item.ImageUrl.split(',')
                })
                this.setData({
                    Data: json.data
                })
                //判断是否确认
                if (json.isDetermine) {
                    this.setData({
                      show: 3,
                      toastText: '您的婚礼设计已确认'
                    })
                }
            }
        })
    },
    // 轮播旋转
    swiper(e) {
        let index = e.detail.current;
        this.setData({
            current1: index
        })
    },
    swiper2(e) {
        let index = e.detail.current;
        this.setData({
            current2: index
        })
    },
    // 预览显示大图
    preview(e) {
        let index = e.currentTarget.dataset.index;
        let idx = e.currentTarget.dataset.idx;
        console.log(index);
        let urls = this.data.Data[idx].arr

        wx.previewImage({
            current: urls[index],
            urls: urls
        })
    },
    start(e) {
        console.log(e);
    },
    closeToast() {
        console.log(123);
        this.setData({
            showToast: !this.data.showToast
        })
    },
    confirmDesign(e) {
        // wx.showToast({
        //     icon:'none',
        //     title:'确认成功'
        // })
        // this.setData({
        //     show:3,
        //     toastText:'您的婚礼设计已确认'
        // })
        promisePost(url.url.DetermineDesign, { orderId: app.globalData.orderId, openid: app.globalData.openid }).then(json => {
            console.log(json);
            if (json.status == 'OK') {
                wx.showToast({
                    icon: 'none',
                    title: '确认成功'
                })
                this.setData({
                    show: 3,
                    toastText: '您的婚礼设计已确认'
                })
            } else {
                wx.showToast({
                    icon: 'none',
                    title: json.errorMsg
                })
            }
        })
    },
    goIndex() {
        wx.navigateTo({
            url: '../../Cases/Cases'
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
        console.log('下拉刷新');
      promisePost(url.url.planList, { orderId: this.data.id }).then(json => {
          console.log(json);
          if (json.status == 'OK') {
              json.data.forEach((item) => {
                  item.arr = item.ImageUrl.split(',')
              })
              this.setData({
                  Data: json.data
              })
              //判断是否确认
              if (json.isDetermine) {
                  this.setData({
                    show: 3,
                    toastText: '您的婚礼设计已确认'
                  })
              }
          }
      })
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
        var pages = getCurrentPages();
        var currentPage = pages[pages.length - 1];
        var url = currentPage.route; //当前页面url
        return {
          title: '婚礼设计',
          imageUrl: app.globalData.imgUrl + 'share.png',
          path: "/pages/validation/validation?share=true&url=/" + url + "&isShare=true&orderId=" + app.globalData.orderId
        }
    },
    //关闭滑出层
    close() {
        this.setData({
            slideStatus: false
        })
    },
    openslide(e) {
        var t = e.currentTarget.id;
        this.setData({
            slideType: t,
            "slideStatus": true
        })
    }
})