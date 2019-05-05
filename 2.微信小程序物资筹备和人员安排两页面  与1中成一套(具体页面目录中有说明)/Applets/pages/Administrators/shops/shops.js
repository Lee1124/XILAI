// pages/Administrators/shops/shops.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        adminuser:'',
        shop_list:[],       //店铺列表
    },
    //领导权限 同时获取店铺
    HeadAuth(){
        var this_1=this;
        var userid=this.data.adminuser.userdata.userid;
        wx.request({
            url: app.globalData.url + '/xlapi/Mini/Ins/Partners/HeadAuth',
            data: { UserId:userid},
            method: "POST",
            header: {
                // Authorization: "url|1|2|xlhl|http://171.211.126.122:8092/||rolestate||0|action"
            },
            success: function (res) {
                console.log('领导权限',res)
                this_1.setData({
                    shop_list:res.data.data.nowShopData
                });
                // this_1.setData({
                //     'flow':res.data
                // })
            }
        })
    },
    //点击事件 选择店铺
    Selection_shop(e){
        console.log(e)
        // var obj=e.target.dataset.item;
        // wx.setStorageSync('shop', JSON.stringify(obj)) //保存选择的店铺
        // wx.navigateBack({
        //     delta: 1
        // })
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

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.setData({
            'adminuser':JSON.parse(wx.getStorageSync('adminuser'))
        })
        this.HeadAuth();    //领导权限 同时获取店铺
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