// pages/community/community.js
var app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        jiao: false,
        toggle: true,
        content: '',
        chatList: [],
        top: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showModal({
            title: '提示',
            content: '功能暂未开放，敬请期待！',
            showCancel: false,
            success: function (res) {
                if (res.confirm) {
                    wx.redirectTo({
                        url: '/' + app.globalData.pathUrl,
                    })
                }
            }
        })
        console.log('修改用户标签')
        app.editUserTabBar();
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
        var pages = getCurrentPages();
        var currentPage = pages[pages.length - 1];
        var url = currentPage.route; //当前页面url
        return {
            title: ' ',
            imageUrl: app.globalData.imgUrl + 'share.png',
            path: "/pages/validation/validation?share=true&url=" + url
        }
    },
    send() {
        var temp = {}
        temp.text = this.data.content
        this.setData({
            chatList: this.data.chatList.concat(temp),
            content: ''
        })
        this.setData({
            top: 99999
        })
    },
    chatContent(e) {
        this.setData({
            content: e.detail.value
        })
    },
    open() {
        if (this.data.toggle) {
            this.setData({
                toggle: false
            })
            this.setData({
                top: 99999
            })
        } else {
            this.setData({
                jiao: !this.data.jiao,
                top: 99999
            })
        }
    },
    close() {
        if (!this.data.toggle) {
            this.setData({
                toggle: true
            })
        } else {
            return
        }
    },
    chooseLocation() {
        var _this = this
        wx.chooseLocation({
            success: function (res) {
                console.log(res)
                _this.setData({
                    toggle: true
                })
            },
        })
    },
    chooseImage() {
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'],
            sourceType: ['album'],
            success: function (res) {
                var tempFilePaths = res.tempFilePaths
            }
        })
    },
    camera() {
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'],
            sourceType: ['camera'],
            success: function (res) {
                var tempFilePaths = res.tempFilePaths
            }
        })
    }
})