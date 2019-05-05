
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
        array: [],
        index: 0,
        id: "",//存店铺id
        user_name: "",//姓名
        phone: "",//手机号
        value: "",//清空数据
        color: "",
        imgUrl: '',
        active: 1,
        showCard: 0,
        welcome: '预约',
        skip: false,
        userToggle: false
    },
    // 设置对应店铺
    listenchange: function (e) {
        this.setData({
            index: e.detail.value,
            color: "#000"
        })
        this.setData({
            id: this.data.array[this.data.index].id
        })
    },
    // 验证手机号同时获取手机号
    verification: function (e) {
        var phone = e.detail.value;//预约手机号
        var reg = /^[1][3,4,5,7,8][0-9]{9}$/;//正则判断手机号
        if (!reg.test(phone) && phone != "") {
            //手机号不合法
            wx.showModal({
                title: '警告',
                content: '手机号输入不合法！！！',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    } else {
                        console.log('用户点击取消')
                    }

                }
            })
        } else {
            //手机号合法
            console.log(e)
            this.setData({
                phone: e.detail.value
            })
            return true;
        }
    },
    // 获取姓名
    username: function (e) {
        this.setData({
            user_name: e.detail.value
        })
    },
    // 新人咨询提交数据
    submint1: function (e) {
        if (this.data.id == "") {
            wx.showModal({
                title: '警告',
                content: '请选择喜来店铺',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    } else {
                        console.log('用户点击取消')
                    }
                }
            })
            return false;
        } else if (this.data.phone == "") {
            //手机号不合法
            wx.showModal({
                title: '警告',
                content: '手机号不合法，请重新输入！！！',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    } else {
                        console.log('用户点击取消')
                    }
                }
            })
            return false;
        } else {
            var data = { id: this.data.id, openid: userid.openid, user: this.data.user_name, phone: this.data.phone }
            var that = this;


            wx.request({
                url: url + '/xlapi/Mini/Ins/Anli/UserSub',
                method: "POST",
                data: data,
                success: function (res) {
                    console.log("成功")
                    
                    //预约日志
                  getApp().SaveLog("", "7", that.data.id);

                    wx.showToast({
                        title: '预约成功',
                        icon: 'succes',
                        duration: 1900,
                        mask: true
                    });
                    that.setData({
                        value: "",
                        index: 0,
                        color: "#999999"
                    })
                }
            })
        }
        // if(this.data.phone!=''){
        // console.log("店铺",this.data.id);
        // console.log("openid",userid.openid);
        // console.log("姓名",this.data.user_name);
        // console.log("电话",this.data.phone);

        // }else{
        //   return false;
        // }
    },

    //客户登陆登录
    submint2: function (e) {

        let value = e.detail.value
        let data = {
            name: value.name,
            phone: value.phone
        }
        for (let key in data) {
            if (data[key] == '') {
                wx.showModal({
                    title: '提示',
                    content: '请完成表单填写',
                    showCancel: false,
                    success: res => {
                    }
                })
                return
            }
        }
        var d = {
            "type": 0,
            "openId": app.globalData.openid,
            "openName": app.globalData.userInfo.nickName,
            "phone": value.phone,
            "name": value.name
        }
        util.promisePost(app.globalData.url + '/xlapi/Authentication/AppletUser/Authentication/Identification', d).then(function (res) {
            if (res.code == "1") {

              //取出orderType （orderType为0订单客户  2机会客户）
              getApp().globalData.orderType = res.orderType;
                getApp().globalData.orderId = res.data.orderId;
                getApp().globalData.weddingRole = res.data.userType;
                //app.globalData
                wx.redirectTo({
                  url: '/pages/MyService/MyService?orderId=' + res.data.orderId,
                })
             

            } else {
                //手机号不合法
                wx.showModal({
                    title: '提示',
                    content: '验证失败，请确认信息是否正确或者联系客服',
                    showCancel: false,
                    success: function (res) {
                        if (res.confirm) {

                        }
                    }
                })
            }
        });
    },

    //合作商
    submint3(e) {
        var that = this;
        let value = e.detail.value
        let data = {
            name: value.userName,
            phone: value.password
        }
        for (let key in data) {
            if (data[key] == '') {
                wx.showModal({
                    title: '提示',
                    content: '请完成表单填写',
                    showCancel: false,
                    success: res => {
                    }
                })
                return
            }
        }
        var d = {
            "type": 1,
            "openId": app.globalData.openid,
            "openName": app.globalData.userInfo.nickName,
            "name": value.userName,
            "password": value.password
        }
        util.promisePost(app.globalData.url + '/xlapi/Authentication/AppletUser/Authentication/Identification', d).then(function (res) {
            // app.globalData.orderId = res.data.orderId;
                //app.globalData
            
            if (res.code == 2) {
                // app.globalData.adminuser=res
                wx.setStorageSync('adminuser', JSON.stringify(res)) //保存用户信息
                app.editadminTabbar();
                wx.redirectTo({
                    url: '/pages/Administrators/Personal/Personal',
                })
                // that.skip();
            }else{
                wx.showToast({
                    title: '登陆失败，请确认信息是否正确或者联系客服',
                    icon: 'none',
                    duration: 2000
                })
            }
        });
    },//跳转页面
    skip: function () {
        if (this.data.skip) {
            wx.redirectTo({
                url: "/" + app.globalData.pathUrl
            })
            this.setData({
                skip: false
            })
        }
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        // app.getUserInfo().then(function (res) {
        if (app.globalData.skip) {
            that.setData({
                skip: true,
                showCard: 1,
                active: 2
            })
        }
        app.getUserInfo().then(function (res) {
            //未获取权限
            if (res.status == 204) {
                that.setData({
                    userToggle: true
                });
            }
        });
        //获取店铺
        that.setData({
            imgUrl: getApp().globalData.imgUrl + "yy_bg.png"
        })
        wx.request({
            url: url + '/xlapi/Mini/Ins/Anli/RetStore',
            method: "GET",
            success: function (res) {
                console.log(res.data)
                res.data.splice(0, 0, { name: "选择喜来店铺" })
                that.setData({
                    array: res.data
                })
            }
        });

        //})
        console.log("第四个修改普通标题");
        app.editTabBar();
    },
    /**
     * ys 2018-6-4
     * 添加导航
     */
    chooseType(e) {
        let index = e.currentTarget.dataset.index;
        switch (index) {
            case "1":
                this.setData({
                    active: 1,
                    showCard: 3,
                    welcome: '预约'
                });
                break
            case '2':
                this.setData({
                    active: 2,
                    showCard: 1,
                    welcome: '欢迎您'
                })
                break
            case '3':
                this.setData({
                    active: 3,
                    showCard: 2,
                    welcome: '欢迎您'
                })
                break
        }
    },
    getUserInfo(e) {
        common.getUserInfo(e, this);
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
    // 监听下拉
    onPullDownRefresh: function () {
      wx.stopPullDownRefresh(); // 关闭下拉刷新
    }

})