// pages/MyService/MyService.js
var app = getApp();
var url = getApp().globalData.url;//服务器ip
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: false,
    txImage: "",
    userName: "",
    orderId: "",
    date: "", day: "", hotel: "",
    weddingRole: -1,
    serviceList: [
      {
        tubiao: "../../images/icon/team.png",
        name: "婚礼团队",
        url: '/pages/MyService/weddingTeam/weddingTeam',
        event: "hint"
      },
      {
        tubiao: "../../images/icon/questionList.png",
        name: "婚礼问卷表",
        url: '/pages/question/question',
        event: ""
      }, {
        tubiao: "../../images/icon/design.png",
        name: "婚礼设计",
        url: '/pages/MyService/designPlan/designPlan',
        event: ""
      }, {
        tubiao: "../../images/icon/plan.png",
        name: "婚礼方案",
        url: '',
        event: "hint"
      }, {
        tubiao: "../../images/icon/preparation.png",
        name: "婚前筹备",
        url: "/pages/MyService/preparation/preparation",
        event: "hint"
      }, {
        tubiao: "../../images/icon/flow.png",
        name: "婚礼当天流程",
        url: '/pages/MyService/flow/flow',
        event: ""
      }, {
        tubiao: "../../images/icon/rite.png",
        name: "婚礼仪式流程",
        url: '/pages/MyService/rite/rite',
        event: ""
      }, {
        tubiao: "../../images/icon/questionnaire.png",
        name: "婚礼反馈",
        url: '/pages/feedback/feedback',
        event: "hint"
      }
    ]
  },
  UserLogut: function (e) {
    wx.showModal({
      title: '提示',
      content: '是否确定注销',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url + '/xlapi/Login/Login/Login/UserLogut',
            data: { openid: app.globalData.openid },
            method: 'POST',
            success: function (res) {
              /*** */
              if (res.data.status == "OK") {
                wx.showToast({
                  title: '注销成功',
                  icon: 'none',
                  duration: 2000
                })
                wx.redirectTo({
                  url: '/pages/Cases/Cases'
                });
              } else {
                wx.showToast({
                  title: '注销失败',
                  icon: 'none',
                  duration: 2000
                })
              }
            },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  hint() {
    wx.showModal({
      title: '提示',
      content: '功能暂未开放，敬请期待！',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {

        }
      }
    })
  },
  ToSkip: function (e) {
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

  },
  onLoad: function (options) {
    console.log("我的界面开始");
    //存储页面地址
    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length - 1]    //获取当前页面的对象
    app.globalData.pathUrl = currentPage.route    //当前页面url
    var i = 0;
    for (var item in currentPage.options) {
      if (i == 0) {
        app.globalData.pathUrl += "?" + item + "=" + currentPage.options[item];
      } else {
        app.globalData.pathUrl += "&" + item + "=" + currentPage.options[item];
      }
      i++;
    }
    app.editUserTabBar();
    var that = this;
    this.setData({ orderId: app.globalData.orderId });
    // 初始化数据
    if (this.data.orderId == undefined || this.data.orderId == 'undefined') {
      wx.showModal({
        title: '提示',
        content: '参数错误',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '/pages/Cases/Cases'
            });
          }
        }
      });
    }
    // if (options.weddingRole == '0') {
    //   that.setData({
    //     weddingRole: "新娘"
    //   });
    // }
    // else if (options.weddingRole == '1') {
    //   that.setData({
    //     weddingRole: "新郎"
    //   });

    // }

    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (!res.authSetting['scope.userInfo']) {
          that.setData({
            canIUse: true
          });
        } else {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              app.globalData.userInfo = res.userInfo;
              console.log("授权信息" + res.userInfo);
              that.setData({
                userName: res.userInfo.nickName,
                txImage: res.userInfo.avatarUrl
              });
            }
          })
        }
      }
    })

    //请求获取用户信息
    wx.request({
      url: app.globalData.url + '/xlapi/Login/Login/User/GetNewbieInfo',
      data: { orderId: app.globalData.orderId },
      method: "POST",
      header: {
        Authorization: "url|1|2|xlhl|http://171.211.126.122:8092/||rolestate||0|action"
      },
      success: function (res) {
        if (res.data.status == "OK") {
          that.setData({
            date: res.data.date,
            day: res.data.day,
            hotel: res.data.hotel
          });
        }
      }
    })
    console.log("我的界面结束");

  },
  getUserInfo: function (e) {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (!res.authSetting['scope.userInfo']) {
          that.setData({
            canIUse: true
          });
        } else {
          that.setData({
            canIUse: false
          });
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              app.globalData.userInfo = e.detail.userInfo;
              that.setData({
                userName: e.detail.userInfo.nickName,
                txImage: e.detail.userInfo.avatarUrl
              });
            }
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("我的界面渲染完成");
    app.editUserTabBar();
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

  
})