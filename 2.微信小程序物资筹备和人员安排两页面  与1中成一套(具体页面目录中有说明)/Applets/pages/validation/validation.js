//toAttribute// pages/validation/validation.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    
    console.log("进入页面时的传递的参数",options);
    var that = this;
    console.log("初始化界面");

    var scene = decodeURIComponent(options.scene);
    if (scene != undefined && scene != 'undefined') {
      //保存到全局
      getApp().globalData.shareuserid = scene;
      console.log("这是通过二维码进入的,用户id:" + scene);
      getApp().globalData.isEwm = true;
    }

    getApp().getUserInfo().then(function (res) {
      //打开websocket连接
      var n = 0;
      getApp().reconnect();
      wx.onSocketOpen(function (res) {
        console.log('WebSocket连接已打开！')
        getApp().globalData.connectSuccess = true;
        getApp().globalData.isReconnection = false;
        getApp().globalData.isError = false;
        n = 0;
      })
      wx.onSocketError(function (res) {
        getApp().globalData.connectSuccess = false;
        getApp().globalData.isReconnection = true;
        console.log('WebSocket连接打开失败，请检查！')
        if (n <= 3) {
          getApp().reconnect();

        } else {
          getApp().globalData.isError = true;
        }
      })

      wx.onSocketClose(function (res) {
        n++;
        console.log('WebSocket 已关闭！');
        getApp().globalData.isReconnection = true;
        getApp().globalData.connectSuccess = false;
        //3次连接失败则异常
        if (n <= 3) {
          getApp().reconnect();

        } else {
          getApp().globalData.isError = true;
        }

      })
      getApp().onWebscoket(this, false);

      //验证身份
      wx.request({
        url: getApp().globalData.url + '/xlapi/Authentication/AppletUser/Authentication/OpenIdVerify',
        method: 'POST',
        data: { openId: getApp().globalData.openid},
        success: function (res) {
          var code = res.data.code;
          // 处理黑名单用户的跳转
          if (res.data.status == "OK" && res.data.ishmd) {
            wx.redirectTo({
              url: "/pages/Blacklist/Blacklist"
            })
            return false;
          }
          //如果是分享的则跳转分享页面
          if (options.share == 'true') {
            var path = '';
            if (options.url != undefined) {
              path = options.url
            }
            if (options.shareopenid != undefined && options.shareopenid != 'undefined') {
              //保存到全局
              getApp().globalData.shareopenid = options.shareopenid;
            }
            //获取参数
            for (var i in options) {
              if (i != 'share') {
                if (i != 'shareopenid') {
                  if (i != 'url') {
                    path += "&" + i + "=" + options[i];
                  }
                }
              }
            }
            var url = "";
            if (path.indexOf('&') > -1) {
              url += path.substring(0, path.indexOf('&')) + "?";
              url += path.substring(path.indexOf('&') + 1, path.length);
            } else {
              url = path
            }
            if (url[0] != '/') {
              url = '/' + url;
            }
            console.log("分享跳转的url：" + url);
            wx.redirectTo({
              url: url
            });
            return;
          }
          // 判断当前用户展示的第一个页面
          if (code == '3') {  //客户
            that.GetOrderId();
          } else if (code == '5') { //合作商
            // wx.redirectTo({
            //   url: '/pages/Administrators/Personal/Personal'
            // });
            // wx.setStorageSync('adminuser', JSON.stringify(res)) //保存用户信息
            // app.editadminTabbar();
            getApp().globalData.isAdminUser = true;
            wx.redirectTo({
              url: '/pages/Cases/Cases'
            });
          } else if (code == '0'){
            // 是否是-预约成功的游客
            if (res.data.status == "OK" && res.data.yymodel.status) {
              app.globalData.isYuYueOk = true;
              var data_ = res.data.yymodel.branchdata;
              app.globalData.dianpuName = data_.name;
              app.globalData.dianpuPhone = data_.tel;
              app.globalData.youkeName = res.data.yymodel.userda;
              // 以前预约过，直接跳转到预约成功后的页面
              if (app.globalData.isYuYueOk) {
                var uname = app.globalData.youkeName,
                  dname = app.globalData.dianpuName,
                  tel_ = app.globalData.dianpuPhone;
                app.globalData.tabbar.list[app.globalData.tabbar.list.length - 1].pagePath = '/pages/Tourist/Tourist';
                wx.redirectTo({
                  url: '/pages/Tourist/Tourist?uname=' + uname + "&dianpuName=" + dname + "&dianpuPhone=" + tel_
                })
                return false;
              }
            }else{
              wx.redirectTo({
                url: '/pages/Cases/Cases'
              });
            }
          }else{
            getApp().globalData.skip = true;
            wx.redirectTo({
              url: '/pages/Cases/Cases'
            });
            return false;
          }
        }
      })
    });

  },
  GetOrderId: function () {
    //获取orderId
    wx.request({
      url: getApp().globalData.url + '/xlapi/FlowScheme/Operation/IntentionList/GetOrderId',
      method: "POST",
      data: {
        openId: getApp().globalData.openid
      },
      header: {
        Authorization: "url|1|2|xlhl|http://171.211.126.122:8092/||rolestate||0|action"
      },
      success: function (res) {
        //获取到订单信息 读取数据
        if (res.data.status == "OK") {
          //取出orderType （orderType为0订单客户  2机会客户）
          getApp().globalData.orderType = res.data.data.orderType;
          getApp().globalData.orderId = res.data.data.orderId
          getApp().globalData.weddingRole = res.data.data.weddingRole;
        } else {
          getApp().globalData.orderId = "CustomerServices";
        }
        //getApp().editUserTabBar();
        //获取订单状态
        console.log("修改标题，执行跳转", getApp().globalData.orderId);
        wx.redirectTo({
          url: '/pages/MyService/MyService?orderId=' + getApp().globalData.orderId + '&weddingRole=' + getApp().globalData.weddingRole
        });
      }
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