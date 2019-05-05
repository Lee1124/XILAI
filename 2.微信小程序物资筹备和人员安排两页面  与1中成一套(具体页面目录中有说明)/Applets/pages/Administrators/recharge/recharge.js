// pages/Administrators/recharge/recharge.js
var app = getApp();
Page({
  data: {
    number: 1000,
    branid: ''
  },
  getNumber(e) {
    this.setData({
      number: e.detail.value
    })
  },
  guid() {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  chongzhi() {
    var _this = this
    let guid = _this.guid()
    var userid = _this.data.adminuser.userdata.userid;
    wx.showLoading({
      title: '',
      mask: true,
      success() {
        wx.request({
          url: app.globalData.url + 'xlapi/prop/Ins/WxHotelPay/ItPay',
          method: "POST",
          data: {
            openid: app.globalData.openid,
            id: guid,
            totalfee: _this.data.number * 100
          },
          // header: {
          //   'content-type': 'application/x-www-form-urlencoded',
          //   'Authorization': app.globalData.loackinfo
          // },
          success: function(res) {
            wx.hideLoading()
            var params = JSON.parse(res.data)
            wx.requestPayment({
              'timeStamp': params.timeStamp,
              'nonceStr': params.nonceStr,
              'package': params.package,
              'signType': 'MD5',
              'paySign': params.paySign,
              'success': function(res) {
                console.log(res)
                if (res.errMsg == 'requestPayment:ok') {
                  wx.request({
                    url: app.globalData.url + 'xlapi/SysManage/Hotel/Hotel/IsGathering',
                    method: "POST",
                    data: {
                      total_fee: _this.data.number * 100,
                      out_trade_no: guid,
                      branid: _this.data.branid,
                      userid: userid
                    },
                    // header: {
                    //   'content-type': 'application/x-www-form-urlencoded',
                    //   'Authorization': app.globalData.loackinfo
                    // },
                    success: function(res) {
                      if (res.data == true) {
                        wx.showToast({
                          title: '充值成功',
                        })
                        setTimeout(()=>{
                          wx.navigateBack({
                            url: '../pointList/pointList',
                          })
                        }, 2000)
                      }
                    }
                  })
                }
              },
              'fail': function(res) {
                wx.showToast({
                  title: '支付失败',
                  icon: 'none',
                  mask: true,
                })
              }
            })
          }
        })
      }
    })
  },
  onLoad: function(options) {
    this.setData({
      'adminuser': JSON.parse(wx.getStorageSync('adminuser'))
    })
    this.setData({
      branid: options.branid
    })
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