//app.js
const regeneratorRuntime = require('utils/runtime.js');
var appid = 'wxb1c40518af450477'; //用户appid
var secret = '59c2b6c40edd14381cfd34edba1f66db';
var openid;
//  var WXBizDataCrypt = require('/utils/cryptojs-master/RdWXBizDataCrypt.js');
// 心跳链接
let heartCheck = {
  timeout: 30000,
  timeoutObj: null,
  serverTimeoutObj: null,
  reset: function () {
    clearTimeout(this.timeoutObj);
    clearTimeout(this.serverTimeoutObj);
    return this;
  },
  start: function () {
    var that = this;
    this.timeoutObj = setTimeout(() => {
      console.log("发送ping");
      var obj = new Object();
      obj.MessageType = 9;
      var MessageContent = new Object();
      MessageContent.orderId = getApp().globalData.orderId;
      MessageContent.SendUser = getApp().globalData.openid;
      MessageContent.userType = 0;
      MessageContent.Message = "ping";
      obj.MessageContent = JSON.stringify(MessageContent);
      // 把内容发送到socket
      var msg = JSON.stringify(obj);
      wx.sendSocketMessage({
        data: msg,
        success: function (res) {
          console.log("ping发送成功");
        },
        fail: function () {
          // that.setData({
          //   isError: getApp().globalData.isError
          // })
        }
      })
      this.serverTimeoutObj = setTimeout(() => {
        wx.closeSocket();
      }, this.timeout);
    }, this.timeout);
  }
};
const httpPost = (url, data = {}, header = {}) => {
  return new Promise(resolve => {
    wx.request({
      method: "POST",
      header,
      url: url.startsWith('http') ? url : (getApp().globalData.url + url),
      data,
      success(res) {
        resolve(res.data)
      }
    })
  })
}
const httpGet = (url, header = {}) => {
  return new Promise(resolve => {
    wx.request({
      method: "GET",
      header,
      url: url.startsWith('http') ? url : (getApp().globalData.url + url),
      success(res) {
        resolve(res.data)
      }
    })
  })
}



// 设置聊天消息为已读
function Read() {
  var obj = new Object();
  obj.MessageType = 3
  var MessageContent = new Object();
  MessageContent.orderId = getApp().globalData.orderId;
  MessageContent.SendUser = getApp().globalData.openid;
  MessageContent.ReceiveUser = '';
  MessageContent.ChatType = 3; //1外部聊 2内部聊天3私聊 指定接收者
  MessageContent.userType = 0;
  obj.MessageContent = JSON.stringify(MessageContent);
  // 把内容发送到socket
  var msg = JSON.stringify(obj);
  wx.sendSocketMessage({
    data: msg,
    success: function (res) {
      console.log("聊天已被读成功");
    },
    fail: function () {
      // this.setData({
      //   isError: getApp().globalData.isError
      // })
    }
  })
}

function sendSocketMessage(msg) {
  if (socketOpen) {
    wx.sendSocketMessage({
      data: msg
    })
  } else {
    socketMsgQueue.push(msg)
  }
}

function GetQueryString(url, name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = url.match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}
App({
  onLaunch: async function (option) {
    console.log("开始执行小程序app.js/onLaunch");
    // 如果小程序更新的版本，提示用户重新更新加载
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log("版本更新",res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否马上重启小程序？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      wx.showModal({
        content: '下载失败,请先删除此小程序强制清除缓存!',
      })
    })
    //进入小程序时获取手机的宽高
    var size = wx.getSystemInfoSync();
    this.globalData.phoneSize = {
      height: size.screenHeight,
      width: size.windowWidth
    };
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
    console.log("执行小程序app.js/onLaunch 结束");
    console.log(this.globalData.userInfo);
  },  
  //保存日志 1234
  SaveLog:function(appId,appType,branchId){
    wx.request({
      url: getApp().globalData.url + '/xlapi/Mini/Ins/Anli/AddVisit',
      data: {
        "userId": getApp().globalData.openid, "AppId": appId, "Type": appType, "BranchId": branchId, "UnionId": ""
      },
      method: "POST",
      success: function () { }
    })
  },
  connectWebsocket: function () {
    console.log("开始执行小程序app.js/connectWebsocket ");
    var openid = this.globalData.openid;
    wx.connectSocket({
      url: getApp().globalData.wsOpen_url+'/xlapi/ChatNew/ChatNew/Connect?user=' + openid + '&encrypt=WeChat',
      success() {
        // 心跳链接
        heartCheck.reset().start();
      }
    });
    wx.onSocketError(function (res) {
      console.log('WebSocket连接打开失败，请检查！', res);
    });
  },
  // 重连
  reconnect() {
    var this_1 = this;
    wx.request({
      url: this_1.globalData.url + '/xlapi/ChatNew/ChatNew/RemoveUserSocket',
      method: "POST",
      data: { "UserId": this.globalData.openid },
      success: function (res) {
        if (res.data.status) {
          if (this_1.globalData.lockReconnect) return;
          this_1.globalData.lockReconnect = true;
          // 没连接上会一直重连，设置延迟避免请求过多
          setTimeout(function () {
            this_1.connectWebsocket();
            this_1.globalData.lockReconnect = false;
          }, 2000);
        }
      }
    });
  },
  onWebscoket: function (that, isT) {
    var json = "";
    wx.onSocketMessage(function (res) {
      var pages = getCurrentPages() //获取加载的页面
      var currentPage = pages[pages.length - 1] //获取当前页面的对象
      var url = currentPage.route //当前页面url

      var data;
      try {
        json += res.data;
        data = JSON.parse(json);
        json = "";
      } catch (ex) {
        json = res.data;
        return;
      }
      console.log(res);
      // 挤下线
      if (data.status && data.messagestatus == 6) {
        wx.closeSocket();
        var newMsg = data.msg;
        // wx.showModal({
        //   title: '提示',
        //   content: newMsg.Message,
        //   showCancel: false
        // })
      }
      if (data.status && data.messagestatus == 9) {
        // 接收心跳链接返回值
        heartCheck.reset().start();
      }
      if (data.status && data.messagestatus == 8) {
        // 处理从socket处接收到的消息
        // var newMsg = data.msg;
        // if (newMsg.MessageContentType != 1) {
        //   newMsg.Message = JSON.parse(newMsg.Message);
        // }
        // getApp().globalData.chatMsg = getApp().globalData.chatMsg.concat(newMsg);
        // getApp().globalData.chatList = getApp().globalData.chatMsg;
        // console.log("哈哈1", getApp().globalData.chatList);
        // that.setData({
        //   chatList: getApp().globalData.chatList
        // });
      }
      if (data.status && data.messagestatus == 2) {
        //处理聊天消息
        if (data.msg.Type == "link" || data.msg.Type == 'address') {
          data.msg.Message = JSON.parse(data.msg.Message);
          if (data.msg.Type == 'address') {
            data.msg.Message.img = "https://temp-1256392453.cos.ap-chengdu.myqcloud.com/branchAddress/address/" + GetQueryString(data.msg.Message.img, "name");
          }
        }
        var newMsg = data.msg;
        if (newMsg.MessageContentType != 1) {
          newMsg.Message = JSON.parse(newMsg.Message);
        }
        getApp().globalData.chatMsg = getApp().globalData.chatMsg.concat(newMsg);
        getApp().globalData.chatList = getApp().globalData.chatMsg;
        console.log(getApp().globalData.chatList, "哈哈-2");

        //如果是链接消息 需要处理
        //如果当前页面时聊天页面返回信息状态
        if (url == "pages/message/message") {
          // 把该条信息标识为已读
          Read();
          isT = true;
          if (data.status && (data.messagestatus == 8 || data.messagestatus == 2)) {
            getApp().toBottom(that)
          }
        } else {
          getApp().globalData.unread++;
          getApp().editTabBar();
        }
        //消息页面
        if (isT) {
          that.setData({
            chatList: getApp().globalData.chatMsg
          });
        } else {
          //多少未读消息
          getApp().globalData.unread = 0;
          for (var i = 0; i < getApp().globalData.chatMsg.length; i++) {
            if (!getApp().globalData.chatMsg[i].IsRead && getApp().globalData.chatMsg[i].SendUser != getApp().globalData.openid) {
              getApp().globalData.unread++;
            }
          }

        }
        //接收消息状态处理
      } else if (data.status == "msgAdd") {
        if (data.msg.length <= 0) {
          that.setData({
            isShua: false
          })
        }
        getApp().globalData.chatMsg = data.msg.concat(getApp().globalData.chatMsg);
        that.setData({
          chatList: getApp().globalData.chatMsg,
          hideHeader: false
        });
      } else if (data.status == "msgStatus") {
        for (var i = 0; i < getApp().globalData.chatMsg.length; i++) {
          getApp().globalData.chatMsg[i].IsRead = true;
        }
        if (isT) {
          that.setData({
            chatList: getApp().globalData.chatMsg
          });
        }
      }
    })
  },
  onShow: function (option) {
    console.log("show");
    var path = option.path;
    var d = 0;
    for (var i in option.query) {
      if (d == 0) {
        path += "?";
      } else {
        path += "&";
      }
      d++;
      path += i + "=" + option.query[i]
    }
    console.log("分享的链接=", path);
    this.globalData.pathUrl = path;
    console.log("执行小程序app.js/onShow 结束");
    // this.reconnect();
  },
  onHide: function (option) {
    console.log("onHide");

  },
  getUserInfo: function () {
    var that = this;
    return new Promise(function (resolve, reject) {
      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wx.request({
            url: that.globalData.url + '/xlapi/Mini/Ins/Anli/GetOpenID?loginCode=' + res.code,
            method: "GET",
            success: function (res) {
              openid = JSON.parse(res.data).openid;
              getApp().globalData.openid = openid //用户openid
              console.log("当前用户，", getApp().globalData.openid);
              //session_key
              var sessionkey = JSON.parse(res.data).session_key;
              //拿到session_key实例化WXBizDataCrypt（）这个函数在下面解密用
              // var pc = new WXBizDataCrypt(appid, sessionkey)

              // 判断是不是通过二维码过来的,记录流量
              if (getApp().globalData.shareuserid && getApp().globalData.isEwm){
                getApp().userIsGet(getApp().globalData.openid);
              }

              //获取用户基本信息
              wx.getSetting({
                success: res => {
                  if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                      success: res => {
                        // 可以将 res 发送给后台解码出 unionId
                        getApp().globalData.userInfo = res.userInfo;
                        var uniondata = {
                          UserInfo: res.encryptedData,
                          Sessionkey: sessionkey,
                          Iv: res.iv,
                        }
                        wx.request({
                          url: that.globalData.url + '/xlapi/Mini/Ins/Anli/GetMiniAppUserUnionID',
                          method: "POST",
                          data: uniondata,
                          success: function (unionres) {
                            if (unionres.data.status==true)
                            {
                              console.log("这是unionid：" + unionres.data.unionId);
                              getApp().globalData.unionId = unionres.data.unionId;
                            }
                          }
                        })

                        console.log("当前用户，", res);
                        var res = {
                          status: 200,
                        }
                        resolve(res);

                      }
                    })
                  } else {
                    var res = {
                      status: 204,
                    }
                    resolve(res);
                  }
                }
              });

            }
          })
        }
      })
    });
  },
  userIsGet: async function (openId) {
    console.log("执行app.js/userIsGet");
    //判断哦用户是否存在
    let res = await httpGet('/xlapi/Mini/Ins/Anli/IsGet?openid=' + openid)
    if(!res)
    {
      var data = {
        "openid": openid,
        unionid: getApp().globalData.unionId,
        nickname: getApp().globalData.userInfo.nickName,
        gender: getApp().globalData.userInfo.gender,
        location: getApp().globalData.userInfo.province + "-" + getApp().globalData.userInfo.city,
        avatarUrl: getApp().globalData.userInfo.avatarUrl,
        shareopenid: getApp().globalData.shareopenid,
        shareuserid: getApp().globalData.shareuserid,
      }
      let newres = await httpPost('/xlapi/Mini/Ins/Anli/UserIns',data)
      if (newres) {
        console.log(res);
        //打开websocket连接
        console.log("---------111");
        getApp().reconnect();
      }
    }
    else
    {
      //打开websocket连接
      console.log("---------222");
      getApp().reconnect();
    }
  },
  userIsExist: function (openId) {
    console.log("执行app.js/userIsExist");
    //判断哦用户是否存在
    wx.request({
      url: this.globalData.url + '/xlapi/Mini/Ins/Anli/Exitis?openid=' + openid,
      method: "GET",
      success: function (res) {
        //用户不存在
        if (res.data == false) {
          var data = {
            "openid": openid,
            unionid: "",
            nickname: getApp().globalData.userInfo.nickName,
            gender: getApp().globalData.userInfo.gender,
            location: getApp().globalData.userInfo.province + "-" + getApp().globalData.userInfo.city,
            avatarUrl: getApp().globalData.userInfo.avatarUrl,
          }
          wx.request({
            url: getApp().globalData.url + '/xlapi/Mini/Ins/Anli/UserIns',
            method: "POST",
            data: data,
            success: function (res) {
              console.log(res);
              //打开websocket连接
              getApp().reconnect();
            }
          })
        } else {
          //打开websocket连接
          getApp().reconnect();
        }
      }
    })
  },
  globalData: {
    isEwm: false,          // 是否是二维码
    isYuYueOk: false,      // 是否预约
    dianpuName: '',        // 游客选择的店铺
    dianpuPhone: '',       // 游客选择的店铺号码
    youkeName: '',         // 游客的真实姓名
    lockReconnect: false,  //避免ws重复连接
    adminuser: '',         //登陆接口返回的相关用户数据 合作商
    isReconnection: false, //是否掉线
    isError: false,        //是否异常
    scrollTop: 0,
    scrollHeight: '83vh',
    userInfo: null,
    sence: '', // 进入小程序的场景值，比如：转发、二维码、小程序内部链接
    imgUrl: 'https://xilai99.com/image/img/',
    // url:"http://192.168.1.98:8088/",
    // wsOpen_url: 'ws://192.168.1.98:8088',
    url: 'https://xilai99.com/',
    wsOpen_url: 'wss://xilai99.com',
    openid: "", //用户id
    unionId:"", //unionid唯一id
    chatMsg: [], //聊天信息
    userList: [],  
    isConnect:false,//是否连接成功 
    orderId: "",
    count: 1, //页数
    unread: -1, //未读
    equipment: "miApps", //设备
    temp: "123",
    weddingRole: -1, //
    skip: false,
    pathUrl: "", //存取用户上页地址
    phoneSize: {}, //存储手机尺寸,
    shareopenid: "", //如果是分享进入的，则保存分享人的openid
    shareuserid: "", //如果是二维码进入的，保存分享人的用户id 因为二维码太长了，保存用户id
    isAdminUser:false,//进入小程序的时候赋值，如果是员工进来为true
    orderType:"", //用户登入会保存， 0订单客户  1机会客户
    tabbar: {
      color: "#bbb",
      selectedColor: "#eb8778",
      backgroundColor: "#ffffff",
      borderStyle: "#ddd",
      list: [{
        pagePath: "/pages/Cases/Cases",
        text: "案列",
        iconPath: "/images/icon/al1.png",
        selectedIconPath: "/images/icon/al2.png",
        selected: true
      },
      {
        pagePath: "/pages/Brands/brands",
        text: "故事",
        iconPath: "/images/icon/pp1.png",
        selectedIconPath: "/images/icon/pp2.png",
        selected: false,
      },
      {
        pagePath: "/pages/message/message",
        text: "消息",
        iconPath: "/images/icon/gt4.png",
        selectedIconPath: "/images/icon/gt3.png",
        selected: false,
        unread: 1
      },
      {
        pagePath: "/pages/Stores/Stores",
        text: "店铺",
        iconPath: "/images/icon/dp1.png",
        selectedIconPath: "/images/icon/dp2.png",
        selected: false
      },
      {
        pagePath: "/pages/Login/Login",
        text: "预约",
        iconPath: "/images/icon/yy1.png",
        selectedIconPath: "/images/icon/yy2.png",
        selected: false
      }
      ],
      position: "bottom"
    },
    UserTabbar: {
      color: "#888",
      selectedColor: "#cd1130",
      backgroundColor: "#ffffff",
      borderStyle: "#ddd",
      list: [{
        pagePath: "/pages/message/message?user=true", 
        text: "沟通",
        iconPath: "/images/icon/gt1.png",
        selectedIconPath: "/images/icon/gt2.png",
        selected: false
        // selected: true
      },
      {
        pagePath: "/pages/Cases/Cases?user=true",
        text: "喜来服务",
        iconPath: "/images/icon/fw1.png",
        selectedIconPath: "/images/icon/fw2.png",
        selected: false,

      },
      {
        pagePath: "", ///pages/consociation/consociation
        text: "喜来合作",
        iconPath: "/images/icon/hz1.png",
        selectedIconPath: "/images/icon/hz2.png",
        selected: false
      },
      {
        pagePath: "/pages/MyService/MyService",
        text: "我的",
        iconPath: "/images/icon/wd1.png",
        selectedIconPath: "/images/icon/wd2.png",
        selected: false
      }
      ],
      position: "bottom"
    },
    JiHuiOrderTabbar: {
      color: "#888",
      selectedColor: "#cd1130",
      backgroundColor: "#ffffff",
      borderStyle: "#ddd",
      list: [
        {
          pagePath: "/pages/Cases/Cases?JiHuiOrderUser=true",
          text: "案列",
          iconPath: "/images/icon/al1.png",
          selectedIconPath: "/images/icon/al2.png",
          selected: true
        },
        {
          pagePath: "/pages/Brands/brands?JiHuiOrderUser=true",
          text: "故事",
          iconPath: "/images/icon/pp1.png",
          selectedIconPath: "/images/icon/pp2.png",
          selected: false,
        },
        {
          pagePath: "/pages/message/message?JiHuiOrderUser=true",
          text: "消息",
          iconPath: "/images/icon/gt4.png",
          selectedIconPath: "/images/icon/gt3.png",
          selected: false,
          unread: 1
        },
      {
        pagePath: "/pages/MyService/MyService?JiHuiOrderUser=true",
        text: "我的",
        iconPath: "/images/icon/wd1.png",
        selectedIconPath: "/images/icon/wd2.png",
        selected: false
      }
      ],
      position: "bottom"
    },
    adminTabbar: {
      color: "#888",
      selectedColor: "#eb8778",
      backgroundColor: "#ffffff",
      borderStyle: "#ddd",
      list: [
        // {
        //     pagePath: "",///pages/community/community
        //     text: "沟通",
        //     iconPath: "/images/icon/gt1.png",
        //     selectedIconPath: "/images/icon/gt2.png",
        //     selected: true
        // },
        // {
        //     pagePath: "/pages/Cases/Cases?admin=true",
        //     text: "喜来服务",
        //     iconPath: "/images/icon/fw1.png",
        //     selectedIconPath: "/images/icon/fw2.png",
        //     selected: false,

        // },
        // {
        //     pagePath: "",///pages/consociation/consociation
        //     text: "喜来合作",
        //     iconPath: "/images/icon/hz1.png",
        //     selectedIconPath: "/images/icon/hz2.png",
        //     selected: false
        // },
        {
          pagePath: "/pages/Cases/Cases?admin=true",
          text: "案列",
          iconPath: "/images/icon/al1.png",
          selectedIconPath: "/images/icon/al2.png",
          selected: true
        },
        {
          pagePath: "/pages/Brands/brands?admin=true",
          text: "故事",
          iconPath: "/images/icon/pp1.png",
          selectedIconPath: "/images/icon/pp2.png",
          selected: false,
        },
        {
          pagePath: "/pages/message/message?admin=true",
          text: "消息",
          iconPath: "/images/icon/gt4.png",
          selectedIconPath: "/images/icon/gt3.png",
          selected: false,
          unread: 1
        },
        {
          pagePath: "/pages/Stores/Stores?admin=true",
          text: "店铺",
          iconPath: "/images/icon/dp1.png",
          selectedIconPath: "/images/icon/dp2.png",
          selected: false
        },
        {
          pagePath: "/pages/Administrators/Personal/Personal",
          text: "我的",
          iconPath: "/images/icon/wd1.png",
          selectedIconPath: "/images/icon/wd3.png",
          selected: false
        }
      ],
      position: "bottom"
    },
    header: {
      list: [{
        text: "品牌故事",
        pagePath: "/pages/Brands/brands",
        selected: true
      },
      {
        text: "案列展示",
        pagePath: "/pages/Cases/Cases",
        selected: false
      },
      {
        text: "喜来店铺",
        pagePath: "/pages/Stores/Stores",
        selected: false
      }
      ]
    },
    sjheader: {
      list: [{
        text: "婚礼设计",
        pagePath: "/pages/MyService/designPlan/designPlan",
        selected: true
      },
      {
        text: "婚礼方案",
        pagePath: "/pages/MyService/designPlan/designPla1n",
        selected: false
      }
      ]
    }

  },
  toBottom(that) {
    setTimeout(() => {
      wx.createSelectorQuery().selectAll('.chatListItem').boundingClientRect(function (rects) {
        console.log("rects,", rects);
        var sTop = parseFloat(that.data.scrollTop) + parseFloat(rects[rects.length - 1].height)
        that.setData({
          scrollTop: sTop
        })
        console.log(sTop);
      }).exec()
    }, 100);

  },
  editTabBar: function () {
    console.log("修改普通标题");
    var tabbar = this.globalData.tabbar,
      currentPages = getCurrentPages(),
      _this = currentPages[currentPages.length - 1],
      pagePath = _this.__route__;
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for (var i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    _this.setData({
      tabbar: tabbar,
      unread: this.globalData.unread
    });

  },
  //修改机会订单客户的标题
  editJiHuiOrderTabBar: function () {
    var tabbar = this.globalData.JiHuiOrderTabbar,
      currentPages = getCurrentPages(),
      _this = currentPages[currentPages.length - 1],
      pagePath = _this.__route__;
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for (var i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    _this.setData({
      tabbar: tabbar,
      unread: this.globalData.unread
    });
  },
  editUserTabBar: function () {
    console.log("修改用户标题");
    var tabbar = this.globalData.UserTabbar,
      currentPages = getCurrentPages(),
      _this = currentPages[currentPages.length - 1],
      pagePath = _this.__route__;
    pagePath = pagePath.substring(0, pagePath.lastIndexOf('/'));
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    var arr = ["/pages/Cases", "/pages/Brands", "/pages/Stores"];
    for (var i in tabbar.list) {
      tabbar.list[i].selected = false;
      var tempPath = tabbar.list[i].pagePath.substring(0, tabbar.list[i].pagePath.lastIndexOf('/'));
      (tempPath == pagePath) && (tabbar.list[i].selected = true);

    }
    for (var a in arr) {
      (arr[a] == pagePath) && (tabbar.list[1].selected = true);
    }
    _this.setData({
      tabbar: tabbar
    });
  },
  editadminTabbar() {
    console.log("修改合作标题");
    var tabbar = this.globalData.adminTabbar,
      currentPages = getCurrentPages(),
      _this = currentPages[currentPages.length - 1],
      pagePath = _this.__route__;
    console.log('________________', currentPages)
    pagePath = pagePath.substring(0, pagePath.lastIndexOf('/'));
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    var arr = ["/pages/Cases", "/pages/Brands", "/pages/Stores"];
    for (var i in tabbar.list) {
      tabbar.list[i].selected = false;
      var tempPath = tabbar.list[i].pagePath.substring(0, tabbar.list[i].pagePath.lastIndexOf('/'));
      (tempPath == pagePath) && (tabbar.list[i].selected = true);

    }
    // for (var a in arr) {
    // (arr[a] == pagePath) && (tabbar.list[1].selected = true);
    // }
    _this.setData({
      tabbar: tabbar
    });
  },
  editHeader: function () {
    var header = this.globalData.header,
      currentPages = getCurrentPages(),
      _this = currentPages[currentPages.length - 1],
      pagePath = _this.__route__;
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for (var i in header.list) {
      header.list[i].selected = false;
      var tempPath = header.list[i].pagePath;
      (header.list[i].pagePath == pagePath) && (header.list[i].selected = true);
    }
    _this.setData({
      header: header
    });
  },
  editSJHeader: function () {
    var header = this.globalData.sjheader,

      currentPages = getCurrentPages(),
      _this = currentPages[currentPages.length - 1],
      pagePath = _this.__route__;
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for (var i in header.list) {
      header.list[i].selected = false;
      console.log(header.list[i].selected);
      var tempPath = header.list[i].pagePath;

      (header.list[i].pagePath == pagePath) && (header.list[i].selected = true);
    }
    // console.log(_this)
    _this.setData({
      header: header
    });
  },
})