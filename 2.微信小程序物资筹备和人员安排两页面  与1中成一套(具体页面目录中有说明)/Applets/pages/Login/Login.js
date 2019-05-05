// pages/Reserve/Reserve.js
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
    isGetPhone: false,
    array: [],
    index: 0,
    userSex: 1,               // 用户的性别 1女士，2：男士
    dianId: "",               // 存店铺id
    dianName: "",
    dianPhone: "",
    userName_yk: '',          // 游客身份：用户姓
    userType: -1,             // 用户类型：0员工  1客户  2游客 -1默认
    userInfo: {},             // 用户信息
    phone: "",                // 手机号
    isShowTips: false,        // 是否显示错误提示/消息提示
    isGetYZMOkTips: '  ',     // 手机号是否是合法的
    isGetYZM: false,          // 是否点击了获取的了验证码
    isGetYZMOK: false,        // 验证码是否获取成功
    getYZMTips: '获取验证码',  // 获取验证码提示，默认
    yzmNumber: '',            // 当前输入的验证码
    showTips: '    ',
    activeIndex: -1,          // 
    skip: false,
    userToggle: false,
    nextBtnWords: '下一步'
  },
  // 游客-姓
  getUserName_: function(e) {
    this.setData({
      userName_yk: e.detail.value
    })
    if(this.data.dianId && this.data.userName_yk){
      this.setData({
        showTips: ''
      })
    }
  },
  // 获取当前输入的验证码
  getinputYZM: function(e) {
    this.setData({
      yzmNumber: e.detail.value
    })
    if (this.data.yzmNumber != '' && this.data.yzmNumber){
      this.setData({
        phoneIsOk: true
      })
    }
  },
  // 获取验证码
  getYZMClick: function(e) {
    var that = this;
    if (that.data.isGetYZM) return; // 已经点击了获取验证码后，禁止再次点击
    // 验证码倒计时
    var number = 60;
    that.setData({
      getYZMTips: number+"秒后重发"
    })
    var timer = setInterval(function (){
      number--;
      if(number > 0){
        that.setData({
          getYZMTips: number + "秒后重发",
          isGetYZM: true
        })
      }else{
        that.setData({
          getYZMTips: "重新获取",
          isGetYZM: false
        })
        clearInterval(timer);
      }
    }, 1000);
    wx.request({
      method: 'post',
      url: app.globalData.url + 'xlapi/Mini/Ins/Partners/GetVerificationCode',
      data: { 'Phone': that.data.phone },
      success: function (x) {
        if(x.data.status){
          // clearInterval(timer);
          var phone_ = that.data.phone;
          var reg = /^(\d{3})\d{4}(\d{4})$/;
          phone_ = phone_.replace(reg, "$1****$2");
          that.setData({
            // getYZMTips: '重新获取',
            // isGetYZM: false,
            isGetYZMOkTips: '验证码已发送至手机' + phone_ 
          })
        }
      }
    })
  },
  // 选择性别
  changeSex: function(e) {
    var type_ = e.currentTarget.dataset.type;
    this.setData({
      userSex: type_
    })
    
  },
  // 设置对应店铺
  listenchange: function (e) {
    // this.setData({
    //   index: e.detail.value,
    //   color: "#000"
    // })
    // this.setData({
    //   dianId: this.data.array[this.data.index].id
    // })
    // 跳转
    wx.navigateTo({
      url: '/pages/shopList/shopList?phone='+this.data.phone+"&userType="+this.data.userType
    })
  },
  // 下一步
  nextStep: function(e) {
    var that = this;
    /* 第一次进入页面时输入手机号码后 */
    if (that.data.userType == -1) {
      if (that.data.phone) {
        wx.request({
          method: 'post',
          url: app.globalData.url + 'xlapi/Mini/Ins/Partners/GetUserIdentityByPhone',
          data: { 'Phone': that.data.phone },
          success: function (x) {
            if (x.data.status) {
              var str = '';
              if (x.data.data == 2) str = '立即预约'
              if (x.data.data == 1) str = '立即登录'
              if (x.data.data == 0) str = '立即登录'
              that.setData({
                userType: x.data.data,
                nextBtnWords: str
              })
            }
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '请先输入手机号码！',
        })
      }
    }
    
    // 游客
    if (that.data.userType == 2){
      if (that.data.dianId!="" && that.data.userName_yk!="" && that.data.phone!="") {
        that.setData({
          showTips: ''
        })
        app.globalData.youkeName = that.data.userName_yk + (that.data.userSex == 1 ? "女士" : "先生");
        var data = { id: that.data.dianId, openid: app.globalData.openid, user: app.globalData.youkeName, phone: that.data.phone }
        wx.request({
          url: app.globalData.url + '/xlapi/Mini/Ins/Anli/UserSub',
          method: "POST",
          data: data,
          success: function (res) {
            //预约日志
            app.SaveLog("", "7", that.data.dianId);
            app.globalData.isYuYueOk = true;
            wx.navigateTo({
              url: '/pages/Tourist/Tourist?uname=' + app.globalData.youkeName + "&dianpuName=" + that.data.dianName + "&dianpuPhone=" + that.data.dianPhone
            })
          }
        })
      }else{
        that.setData({
          showTips: '*手机号、店铺或姓不能为空！'
        })
      }
    }

    // 0员工  1客户 
    if (that.data.userType == 0 || that.data.userType == 1){
      if (!that.data.yzmNumber){
        wx.showModal({
          title: '提示',
          content: '验证码不能为空',
        })
        return false;
      }
      var data_ = {
        'Phone': that.data.phone,
        'YZM': that.data.yzmNumber,
        'Identity': that.data.userType,
        'OpenId': app.globalData.openid,
        'NickName': that.data.userInfo.NickName
      }
      wx.request({
        url: app.globalData.url + '/xlapi/Mini/Ins/Partners/UserLoginByFirst',
        method: "POST",
        data: data_,
        success: function (res) {
          if(res.data.status) {
            
            // 客户跳转
            if (that.data.userType == 1){
              getApp().globalData.orderType = res.data.orderType;
              getApp().globalData.orderId = res.data.data.orderId;
              getApp().globalData.weddingRole = res.data.data.userType;
              wx.redirectTo({
                url: '/pages/MyService/MyService?orderId=' + res.data.orderId,
              })
            }
            // 员工跳转
            if (that.data.userType == 0) {
              // res.data.userdata.userid = 204;
              wx.setStorageSync('adminuser', JSON.stringify(res.data)) //保存用户信息
              app.editadminTabbar();
              wx.redirectTo({
                url: '/pages/Administrators/Personal/Personal',
              })
            }
            
          }else{
            wx.showModal({
              title: '提示',
              content: res.data.msg
            });
          }
        }
      })
    }
  },
  // 手机号码
  getPhoneVal: function(e) {
    var phone_ = e.detail.value;
    var reg = /^[1][3,4,5,7,8][0-9]{9}$/;//正则判断手机号
    if (!reg.test(phone_) && phone_ != "") {
      //手机号不合法
      this.setData({
        phone: phone_,
        // isShowTips: true,
        showTips: '*输入的手机号不合法，请确定',
        phoneIsOk: false
      })
    } else {
      //手机号合法
      this.setData({
        phone: phone_,
        // isShowTips: false,
        showTips: '',
        phoneIsOk: true
      })
    }
  },
  // 验证手机号同时获取手机号
  verification: function (phone) {
    
  },
  onShow: function(){
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取手机号
    wx.request({
      url: app.globalData.url + '/xlapi/Mini/Ins/Anli/IsGetPhone',
      data: {
        openId: app.globalData.openid
      },
      method: "POST",
      success: function (res) {
        if (res.data.status == "OK") {
          that.setData({
            isGetPhone: res.data.msg
          });
        }else{
          // 显示手机号码授权弹框
          that.setData({
            isGetPhone: true
          });
        }
      }
    })
    // 以前预约过，直接跳转到预约成功后的页面
    if (app.globalData.isYuYueOk) {
      var uname = app.globalData.youkeName,
        dname = app.globalData.dianpuName,
        tel_ = app.globalData.dianpuPhone;
      wx.redirectTo({
        url: '/pages/Tourist/Tourist?uname=' + uname + "&dianpuName=" + dname + "&dianpuPhone=" + tel_
      })
      return false;
    }
    // 从店铺列表页面跳转过来的情况
    if (options.dianId && options.dianName && options.phone){
      that.setData({
        phone: options.phone,
        dianId: options.dianId,
        phoneIsOk: true,
        userType: options.userType,
        dianName: options.dianName,
        dianPhone: options.tel
      })
      app.globalData.dianpuName = options.dianpuName;
      app.globalData.dianpuPhone = options.tel;

    }

    app.getUserInfo().then(function (res) {
      //未获取权限
      if (res.status == 204) {
        that.setData({
          userToggle: true
        });
      }else{
        that.setData({
          userInfo: app.globalData.userInfo
        })
      }
    });
    app.editTabBar();

    //获取店铺
    wx.request({
      url: app.globalData.url + '/xlapi/Mini/Ins/Anli/RetStore',
      method: "GET",
      success: function (res) {
        res.data.splice(0, 0, { name: "请选择离您最近的店铺" })
        that.setData({
          array: res.data
        })
      }
    });
  },
  getPhoneNumber: function (e) {
    console.log("e=", e);
    //没有授权
    if (e.detail.errMsg != "getPhoneNumber:ok") {
      return;
    }
    
    var that = this;
    wx.login({
      success: function (res) {
        console.log("手机号码授权成功！", res);
        that.setData({
          isGetPhone: false,
          phoneIsOk: true
        });
        if (res.code) {
          wx.request({
            url: app.globalData.url + '/xlapi/Mini/Ins/Anli/GetOpenID?loginCode=' + res.code,
            method: "GET",
            success: function (res) {
              var session_key = JSON.parse(res.data).session_key;
              wx.request({
                url: app.globalData.url + '/xlapi/Mini/Ins/Anli/GetPhoneNumber',
                data: {
                  session_key: session_key,
                  iv: e.detail.iv,
                  openid: JSON.parse(res.data).openid,
                  encryptedData: e.detail.encryptedData
                },
                method: 'POST',
                success: function (res) {
                  if (res.data.status == "OK") {
                    that.setData({
                      isGetPhone: false,
                      phone: res.data.Phone,
                      phoneIsOk: true
                    });
                  }
                },
                complete: function (res) { },
              })
            }
          });
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
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