// pages/Administrators/withdrawDt/withdrawDt.js
var app = getApp();
Page({
  data: {
    hidden: false,
    adminuser: '',
    from: '',
    id: '',
    branid: '',
    showComfirm: false,
    code: '',
    money: '',
    time: '获取验证码',
    currentTime: 120,
    disabled: false,
    detail: '',
    status: '',
    phoneNum: '',
    amount: '',
  },
  saveAmount(e) {
    this.setData({
      amount: e.detail.value
    })
  },
  getCode() {
    if (this.data.disabled) {
      return;
    }
    var that = this;
    var currentTime = that.data.currentTime;
    that.setData({
      time: currentTime + '秒',
      disabled: true
    })
    wx.request({
      url: app.globalData.url + 'xlapi/SysManage/Hotel/Hotel/Send?id=' + that.data.adminuser.userdata.userid + '&PHONE=' + that.data.adminuser.userdata.userphone,
      method: "GET",
      success: (res) => {
        if (res.data.status) {
          wx.showToast({
            title: '验证码发放成功！请及时输入!',
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '验证码获取失败!',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
    let interval = setInterval(function() {
      that.setData({
        time: (currentTime - 1) + '秒'
      })
      currentTime--;
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新获取',
          currentTime: 120,
          disabled: false
        })
      }
    }, 1000)
  },
  saveMoney(e) {
    this.setData({
      money: e.detail.value
    })
  },
  saveCode(e) {
    this.setData({
      code: e.detail.value
    })
  },
  agree() {
    this.setData({
      showComfirm: true
    })
  },
  cancel() {
    this.setData({
      showComfirm: false,
      time: '获取验证码'
    })
  },
  disagree() {
    wx.request({
      url: app.globalData.url + 'xlapi/SysManage/Hotel/Hotel/SetCashModel',
      method: "POST",
      data: {
        userid: that.data.adminuser.userdata.userid,
        status: 2, //1通过 2驳回
        id: that.data.id,
        branid: that.data.branid,
        yzm: that.data.code,
        phone: that.data.adminuser.userdata.userphone
      },
      success: (res) => {
        if (res.data.status) {
          wx.showToast({
            title: '验证码发放成功！请及时输入!',
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '验证码获取失败!',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  makesure() {
    var that = this;
    if (that.data.amount > that.data.detail.Integral) {
      wx.showToast({
        title: '修改金额必须小于等于申请金额',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    wx.request({
      url: app.globalData.url + 'xlapi/SysManage/Hotel/Hotel/yamYz?id=' + that.data.adminuser.userdata.userid + '&yzm=' + that.data.code + '&phone=' + that.data.adminuser.userdata.userphone,
      method: "GET",
      success: (res) => {
        console.log(res)
        if (res.data.status) {
          wx.request({
            url: app.globalData.url + 'xlapi/SysManage/Hotel/Hotel/SetCashModel',
            method: "POST",
            data: {
              userid: that.data.adminuser.userdata.userid,
              status: 1, //1通过 2驳回
              id: that.data.id,
              branid: that.data.branid,
              yzm: that.data.code,
              phone: that.data.adminuser.userdata.userphone,
              NewIntegral: that.data.amount
            },
            success: (res) => {
              if (res.data.status) {
                wx.showToast({
                  title: '审核成功!',
                  icon: 'none',
                  duration: 2000
                })
                that.setData({
                  showComfirm: false,
                  time: '获取验证码',
                  code: ''
                })
                setTimeout(() => {
                  wx.navigateBack({
                    url: '../pointList/pointList',
                  })
                }, 2000)
              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: '验证码有误!',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  getDetail() {
    var this_1 = this;
    wx.request({
      url: app.globalData.url + 'xlapi/SysManage/Hotel/Hotel/retCashModel?id=' + this_1.data.id,
      method: "GET",
      success: function(res) {
        this_1.setData({
          detail: res.data,
          status: res.data.status == 0 ? '等待审核' : '已提现',
          amount: res.data.Integral,
          hidden: true
        })
      }
    })
  },
  getRecordDetail() {
    var this_1 = this;
    wx.request({
      url: app.globalData.url + 'xlapi/SysManage/Hotel/Hotel/RetConModel?id=' + this_1.data.id,
      method: "GET",
      success: function(res) {
        this_1.setData({
          detail: res.data,
          status: '已提现',
          hidden: true
        })
      }
    })
  },
  onLoad: function(options) {
    this.setData({
      'adminuser': JSON.parse(wx.getStorageSync('adminuser'))
    })
    var phone = this.data.adminuser.userdata.userphone.substr(0, 3) + "****" + this.data.adminuser.userdata.userphone.substr(7);
    this.setData({
      phoneNum: phone
    })
    if (options.from) {
      this.setData({
        from: options.from,
        id: options.id,
      })
      // this.getRecordDetail()
    } else {
      this.setData({
        id: options.id,
        branid: options.branid
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (this.data.from) {
      this.getRecordDetail()
    } else {
      this.getDetail()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  }
})