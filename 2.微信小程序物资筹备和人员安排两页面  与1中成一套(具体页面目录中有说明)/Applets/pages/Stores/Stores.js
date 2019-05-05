// pages/Stores/Stores.js
var QQmapwx = require("../../utils/qqmap-wx-jssdk.js");
var qqmapsdk;
var url = getApp().globalData.url;//服务器ip
var app = getApp();
//引入图片预加载组件
const ImgLoader = require('../img-loader/img-loader.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        storeArr: [
            //  { img:"../../images/cd.png",  title:"喜来婚礼-成都店",phone:"18780965687"  },
            //  { img: "../../images/jy.png", title: "喜来婚礼-绵阳店",phone:"12346546" },
            //  { img: "../../images/cd.png", title: "喜来婚礼-成都店" ,phone:"5311133"},
            //  { img: "../../images/cd.png", title: "喜来婚礼-广元店" ,phone:"14641313"},
        ],
        title: "",//位置标题
        address: "",//详细地址
        phonesize: false,//电话遮罩层
        phoneNumber: "",//对应电话数据
        amimationData: {},//动画数据
        loading: true,
        content: false,
        defaultimg: "../../images/loading.png",
        data: false
    },
    map: function (e) {
        console.log(e)
        var that = this;
        var item_= e.currentTarget.dataset.item;
        //位置日志
        getApp().SaveLog("", "5", e.currentTarget.dataset.branchid);

        wx.openLocation({
          latitude: parseFloat(e.currentTarget.dataset.lat),
          longitude: parseFloat(e.currentTarget.dataset.lng),
          name: "喜来婚礼"+item_.name,
          address: item_.address
        });

        // 经纬度获取地图详细地址
        // qqmapsdk.reverseGeocoder({
        //     location: {
        //         latitude: e.currentTarget.dataset.lat,
        //         longitude: e.currentTarget.dataset.lng
        //     },
        //     success: function (res) {
        //       console.log(res.result);
        //         that.setData({
        //             title: res.result.formatted_addresses.recommend,//设置位置标题
        //             address: res.result.address//设置详细地址
        //         });
        //         wx.openLocation({
        //             latitude: parseFloat(e.currentTarget.dataset.lat),
        //             longitude: parseFloat(e.currentTarget.dataset.lng),
        //             name: that.data.title,
        //             address: that.data.address
        //         });
        //     }
        // });

    },
    //控制底部电话显示
    phone: function (e) {
        // var that = this;
        // that.setData({
        //   phoneNumber:e.target.dataset.text//获取点击时的电话号码，赋值给电话区域
        // })
        // // 创建一个动画实例
        // var animation = wx.createAnimation({
        //   // 动画持续时间
        //   duration: 200,
        //   // 定义动画效果，当前是匀速
        //   timingFunction: 'linear'
        // })
        // // 将该变量赋值给当前动画
        // that.animation = animation
        // // 先在y轴偏移，然后用step()完成一个动画
        // animation.translateY(200).step()
        // // 用setData改变当前动画
        // that.setData({
        //   // 通过export()方法导出数据
        //   animationData: animation.export(),
        //   // 改变view里面的Wx：if
        //   phonesize: true
        // })
        // // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
        // setTimeout(function () {
        //   animation.translateY(0).step()
        //   that.setData({
        //     animationData: animation.export()
        //   })
        // }, 200)

      var branchid = e.currentTarget.dataset.phonebranchid;
      wx.makePhoneCall({
        phoneNumber: e.target.dataset.text,
        success: function (e) {
          getApp().SaveLog("", "3", branchid);
          console.log("拨打电话成功");
        },
        fail: function (e) {
          console.log("拨打电话失败");
        },
        complete: function (e) {
          console.log("拨打电话结束");
        }
      })
    },
    //控制电话隐藏
    ph_hideModal: function (e) {
        var that = this;
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: 'linear'
        })
        that.animation = animation
        animation.translateY(200).step()
        that.setData({
            animationData: animation.export()

        })
        setTimeout(function () {
            animation.translateY(0).step()
            that.setData({
                animationData: animation.export(),
                phonesize: false
            })
        }, 200)
    },
    callphone: function (res) {

        wx.makePhoneCall({
            phoneNumber: res.target.dataset.phone//获取点击时的电话号码
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    //加载完成后的回调
    imageOnLoad(err, data) {
        const imgList = this.data.storeArr.map(item => {
            if (item.img == data.src)
                this.setData({
                    loaded: true
                })
            return item
        })
        this.setData({ imgList })
    },
    onLoad: function (options) {
        if (options.user) {
            console.log('修改用户标签')
            app.editUserTabBar();
            app.editHeader();
            wx.setNavigationBarColor({
                frontColor: '#ffffff',
                backgroundColor: '#cd1130'
            })
            this.setData({
                isXinRen: true
            })
        } else if(options.admin){
            console.log('修改合作标题');
            app.editadminTabbar();
        } else {
            this.setData({
                isXinRen: false
            })
            console.log("第五个修改普通标题");
            app.editTabBar();
        }

        var that = this;
        qqmapsdk = new QQmapwx({
            key: "FDMBZ-S36WF-XZTJ5-NN7BN-O257J-NYBSM"
        });
        qqmapsdk.geocoder({
            address: "四川省广元市旺苍县百丈街161号",
            success: function (res) {
                console.log(res)
            }
        })
        // 请求店铺数据
        wx.request({
            url: url + '/xlapi/Mini/Ins/Anli/RetStore',
            method: "GET",
            success: function (res) {
                that.setData({
                    storeArr: res.data,
                    loading: false
                });
                if (that.data.loading == false) {
                    that.setData({
                        content: true
                    })
                }
                //初始化图片预加载组件，并指定统一的加载完成回调
                that.imgLoader = new ImgLoader(that, that.imageOnLoad.bind(that));
                that.data.storeArr.forEach(item => {
                    that.imgLoader.load(item.img)
                });
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
        var _this = this;

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
    // onShareAppMessage: function () {
    //     var pages = getCurrentPages();
    //     var currentPage = pages[pages.length - 1];
    //     var url = currentPage.route; //当前页面url
    //     console.log(url);
    //     return {
    //         imageUrl: app.globalData.imgUrl + 'share.png',
    //         path: "/pages/validation/validation?share=true&url=" + url
    //     }
    // },
    /**
 * 用户点击右上角分享
 */
    onShareAppMessage: function () {
      var pages = getCurrentPages();
      var currentPage = pages[pages.length - 1];
      var url = currentPage.route; //当前页面url
      //path: "/pages/validation/validation?share=true&url=" + url,
      return {
        title: '你好哇，爱情',
        imageUrl: app.globalData.imgUrl + 'share.png',
        path: 'pages/validation/validation?share=true&shareopenid=' + getApp().globalData.openid + '&url=' + url
      }
    },
    ToSkip: function (e) {
        console.log('点击事件', e)
        if (e.currentTarget.dataset.url == '') {
            wx.showModal({
                title: '提示',
                content: '功能暂未开放，敬请期待！',
                showCancel: false,
                success: function (res) {
                    if (res.confirm) {

                    }
                }
            })
        }

    }
})