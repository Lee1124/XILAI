// pages/message/message.js
var COS = require('../../lib/cos-wx-sdk-v5')
var config = require('../../lib/config')
const { watch, computed } = require('../../lib/vuefy.js')
var this_1;
let options_ = {}
//版本检测
function compareVersion(v1, v2) {
  v1 = v1.split('.')
  v2 = v2.split('.')
  var len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (var i = 0; i < len; i++) {
    var num1 = parseInt(v1[i])
    var num2 = parseInt(v2[i])

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }

  return 0
}
var formatDateTime = function (date) {
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  var minute = date.getMinutes();
  minute = minute < 10 ? ('0' + minute) : minute;
  var second = date.getSeconds();
  second = second < 10 ? ('0' + second) : second;
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
};  

var cos = new COS({ //实例化cos类 
  getAuthorization: function (params, callback) { //获取签名 必填参数
    var authorization = COS.getAuthorization({
      SecretId: config.SecretId,
      SecretKey: config.SecretKey,
      Method: params.Method,
      Key: params.Key
    });
    callback(authorization);
  }
});
// 设置聊天消息为已读
function Read(_this) {
  var obj = new Object();
  obj.MessageType = 3
  var MessageContent = new Object();
  MessageContent.OrderId = _this.data.orderId;
  MessageContent.SendUser = _this.data.openid;
  MessageContent.ReceiveUser = '';
  MessageContent.ChatType = _this.data.ChatType; //1外部聊 2内部聊天3私聊 指定接收者
  MessageContent.userType = 0;
  obj.MessageContent = JSON.stringify(MessageContent);
  // 把内容发送到socket
  var msg = JSON.stringify(obj);
  // if (!getApp().globalData.isReconnection){
    wx.sendSocketMessage({
      data: msg,
      success: function (res) {
        console.log("已读成功");
      },
      fail: function () {
        getApp().globalData.isError = true
        _this.setData({
          isError: getApp().globalData.isError
        })
      }
    })
  // }else{
  //   wx.showModal({
  //     title: '提示',
  //     content: '您的socket已经断开连接，发送失败_read_message',
  //     showCancel: false
  //   });
  // }
}
function toBottom(this_1, number) {
  // number:-1，表示是第一次访问，其他值均当做下拉处理
  this_1.setData({
    scrollHeight: "83vh"
  })
  if (number == -1) {
    setTimeout(() => {
      wx.createSelectorQuery().select('#j_page').fields({ 
        dataset: true, size: true, scrollOffset: true, properties: ['scrollX', 'scrollY'] 
        }, function (res) {
          console.log(res.height);
          this_1.setData({
            scrollTop: parseFloat(res.height)
          })
          // wx.pageScrollTo({
          //   scrollTop: parseFloat(res.height),
          //   duration: 300
          // })
      }).exec()
    }, 250);
  } else {
    this_1.setData({
      scrollHeight: "83vh",
      scrollTop: 0
    })
  }
}

// 发送图片
function JiaruFile(img, _this) {
  sendAllType(JSON.stringify(img), 3, _this);
}

// 发送所有类型的消息
function sendAllType(content, MessageContentType, _this) {
  // 把数据发送到socket后端存储，并把当前发送的这条数据放到chatList中去
  var obj = new Object();
  // MessageType：消息类型: 1订单聊天消息 2微信聊天消息 3状态修改消息 4.获取聊天记录
  obj.MessageType = 2;
  // 发送的内容message
  var Message = new Object();
  Message = content;
  // Message = encodeURI(content); // 编码
  
  var MessageContent = new Object();
  MessageContent.OrderId = _this.data.orderId;
  MessageContent.SendUser = _this.data.openid;
  MessageContent.AddTimeStr = formatDateTime(new Date());
  MessageContent.ReceiveUser = '';
  MessageContent.MessageContentType = MessageContentType;
  //ChatType：1外部聊天(订单相关人员和客户) 2内部聊天(订单相关人员) 3私聊(指定接受者)
  MessageContent.ChatType = MessageContent.Type = _this.data.ChatType;
  MessageContent.Message = Message;
  obj.MessageContent = JSON.stringify(MessageContent);
  
  // 把内容发送到socket
  var msg = JSON.stringify(obj);
  console.log(msg);
  // if (!getApp().globalData.isReconnection) {
    wx.sendSocketMessage({
      data: msg,
      success: function (res) {
        // // 把新的消息添加到charList中
        var newMsg = MessageContent;
        if (newMsg.MessageContentType != 1) {
          newMsg.Message = JSON.parse(newMsg.Message);
        }
        console.log(newMsg);
        // newMsg.isShowTime = this_1.showTime(_this.data.chatList.length, newMsg);
        getApp().globalData.chatMsg = getApp().globalData.chatMsg.concat(newMsg);

        _this.setData({
          chatList: getApp().globalData.chatMsg,
          content: '',
          toggle: true
        })
        toBottom(_this, -1)
      },
      fail: function () {
        getApp().globalData.isError = true
        _this.setData({
          isError: getApp().globalData.isError
        })
      }
    })
  // }else{
  //   wx.showModal({
  //     title: '提示',
  //     content: '您的socket已经断开连接，发送失败_send',
  //     showCancel: false
  //   });
  // }
}

// 是否是第一次咨询,如果是第一次，则需要发送一条默认消息
function isFirstZiXun(_this) {
  var msg = new Object();
  msg.OrderId = _this.data.orderId;
  msg.SendUser = "";
  msg.ReceiveUser = '';
  msg.SendUserName = '喜来婚礼';
  msg.MessageContentType = 0;
  msg.ChatType = msg.Type = _this.data.ChatType;
  msg.AddTimeStr = '';
  var conent = {
    "title": "喜来婚礼欢迎您！",
    "message": "拥有11家直营店的喜来起始于2004年，是一家专注于婚礼策划一对一顾问式服务的品牌公司，感谢您的关注~\n" +
      "您的消息，我们将及时回复!\n" +
      "您也可以通过以下方式了解和关注喜来婚礼。\n"
  }
  msg.Message = conent;

  if (_this.data.isFisrtVisit) {
    getApp().globalData.chatMsg.unshift(msg);
    _this.setData({
      isFisrtVisit: false
    })
  }
  _this.setData({
    chatList: getApp().globalData.chatMsg,
    isNumberOne: false
  })
}


var requestCallback = function (err, data) { //请求结果
  var FilePath = this.FilePath;
  var imageurl = this.Key;
  wx.getImageInfo({ //获取这个图片 图片压缩
    src: FilePath,
    success: function (res) {
      var ctx = wx.createCanvasContext('photo_canvas'); //使用一个canvas
      var canvasWidth = res.width //原图宽度    
      var canvasHeight = res.height; //原图高度 
      var tWidth = 640; //设置缩略图初始宽度    
      var tHeight = 360; //设置缩略图初始高度    
      if (canvasWidth > tWidth || canvasHeight > tHeight) {
        //按比例计算出缩略图的宽度和高度    
        if (canvasWidth > canvasHeight * 1.8) {
          tHeight = Math.floor(parseFloat(canvasHeight) * (parseFloat(tWidth) / parseFloat(canvasWidth)));
        } else {
          tWidth = Math.floor(parseFloat(canvasWidth) * (parseFloat(tHeight) / parseFloat(canvasHeight)));
        }
      } else {
        tWidth = canvasWidth;
        tHeight = canvasHeight;
      }
      ctx.drawImage(FilePath, 0, 0, tWidth, tHeight)
      ctx.draw(false, function () {
        //下载canvas图片
        wx.canvasToTempFilePath({
          canvasId: 'photo_canvas',
          width: tWidth,
          height: tHeight,
          destWidth: tWidth,
          destHeight: tHeight,
          success: function (res) {
            var filePath = res.tempFilePath
            var lastindex = imageurl.lastIndexOf('.')
            var yskey = imageurl.substr(0, lastindex) + '-ys' + imageurl.substr(lastindex, lastindex);
            var imgUrl = {
              "key": imageurl,
              "yskey": yskey
            }
            cos.postObject({
              Bucket: config.Bucket,
              Region: config.Region,
              // Key: 'dir/demo/' + yskey,
              Key: yskey,
              FilePath: filePath
            }, function () {
              console.log("yskey=" + yskey);
              JiaruFile(imgUrl, this_1) //加入数据库
              // filescount = filescount + 1
              // zhixing()
            });
          },
          fail: function (error) {
            console.log(error)
          }
        })
      })
    }
  })
}

function zhixing(file, _this) { //执行上传图片的方法
  var Key = file.substr(file.lastIndexOf('/') + 1);
  var yskeyCl = Key.split('.');
  var yskey;
  if (file[0] == "h") {
    yskey = yskeyCl[2] + '.' + yskeyCl[3]
  } else {
    yskey = yskeyCl[0] + '.' + yskeyCl[1]
  }
  console.log(getApp().globalData.openid);
  console.log(yskey);
  cos.postObject({
    Bucket: config.Bucket,
    Region: config.Region,
    Key: '/chatImage/' + getApp().globalData.openid + '/' + yskey,
    FilePath: file
  }
    , requestCallback
    // function() {
    //   JiaruFile('chatImage/' + getApp().globalData.openid + '/' + yskey, _this) //加入数据库
    // }
  );
}
// 获取聊天信息
function GetUserChatRecord(params) {
  var this_1 = params.$this;
  var opts = new Object();
  opts.SendUser = this_1.data.openid;
  opts.ChatType = this_1.data.ChatType;
  opts.OrderId = this_1.data.orderId;
  opts.ReceiveUser = '';
  
  opts.Page = this_1.data.pageIndex;
  opts.PageSize = this_1.data.pageSize;

  wx.request({
    method: 'post',
    url: app.globalData.url + 'xlapi/Chat/UserList/UserList/GetUserChatRecord',
    data: opts,
    success: function (x) {
      this_1.setData({
        next_chatList: x.data.NextData,  // 下一页的数据
        isFirstInitChat: false
      })
      var newList = x.data.Data;
      var chatList = this_1.data.chatList;
      if (newList.length != 0) {
        for (var i = 0; i < newList.length; i++) {
          var item = newList[i];
          if (item.MessageContentType != 1) {
            item.Message = JSON.parse(item.Message);
          }
          // item.AddTimeStr = this_1.AddTime_filter(item.AddTimeStr);
          // item.isShowTime = this_1.showTime(i+1);
          newList[i] = item;
          if (chatList.length >= this_1.data.pageSize) {
            chatList.unshift(newList[newList.length - 1 - i]);
          } else {
            chatList.push(newList[i])
          }
        }
        getApp().globalData.chatMsg = chatList;
        console.log('获取聊天记录', getApp().globalData.chatMsg)
        this_1.setData({
          chatList: getApp().globalData.chatMsg,
          hideHeader: false
        })

        if (x.data.IsLast) {
          isFirstZiXun(this_1);
        }

        var id = params.options.id
        if (id) {
          this_1.setData({
            tabToggle: true
          })
          this_1.getDetails(id)
        }

        var ids = params.options.ids
        if (ids) {
          this_1.setData({
            tabToggle: true
          })
          this_1.getDetailss(ids, params.options.isvideo)
        }
      }else{
        isFirstZiXun(this_1);
        if (this_1.data.chatList.length >= this_1.data.pageSize+1){
          this_1.setData({
            isLast: true,
            hideHeader: true,
            loadText: '没有更多了...'
          })
        }else{
          this_1.setData({
            isLast: true,
            hideHeader: false,
            loadText: '加载中...'
          })
        }
      }
      // 显示时间，设置当前显示的时间
      // for (var i = 0; i < this_1.data.chatList.length; i++) {
      //   var item = this_1.data.chatList[i];
      //   this_1.data.chatList[i].isShowTime = this_1.showTime(i);
      //   this_1.data.chatList[i].AddTimeStr = this_1.AddTime_filter(item.AddTimeStr);
      // }
      // 定位当前显示的位置
      toBottom(this_1, params.number)
      // 停止下拉加载和关闭loading
      // wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }
  });
}
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSendFormId: false, // 是否发送了模板
    isLoginUser: false, // 当前登录的用户，来判断是否显示什么颜色
    isFirstInitChat: true,
    loadText: '加载中...',
    isLast: false,
    isOnshow: true,    // 是否执行onshow
    next_chatList: [],  // 下一页的数据
    getNextPage: false, // 获取下一页数据
    isFisrtVisit: true,
    toView: "viewItem_1",
    scrollHeight: "83vh",
    scrollTop: 0,
    scrollEnd: false,
    jiao: false,
    focus: false,
    toggle: true,
    content: '',
    chatList: [],
    openid: "",
    orderId: "",
    ddUser: false,
    isGetPhone: false,
    hiddenPhoneModal: true,
    hideHeader: false,
    detail: {},
    isShua: true,
    userList: [],
    isScroll: true,
    tabToggle: false,
    isConnect: false,
    isConSuccess: true,
    isError: false,
    details: {},
    isTop: false,
    pageIndex: 1,   // 当前页码
    pageSize: 10,  // 一页显示多少条数据
    isVersion: -1,  // 当前版本是否支持
    userInfo: {},   // 用户信息
    hiddenmodalput: false,  // 是否显示关注的微信公众号的二维码
    isNumberOne: true      // 是否是第一次加第一条引导信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 切换标题
    if (options.user) {
      this.setData({
        isLoginUser: true
      })
      app.editUserTabBar();
      app.editHeader();
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#cd1130'
      })
      var pages = getCurrentPages() //获取加载的页面
      var currentPage = pages[pages.length - 1] //获取当前页面的对象
      app.globalData.pathUrl = currentPage.route //当前页面url
      var i = 0;
      for (var item in currentPage.options) {
        if (i == 0) {
          app.globalData.pathUrl += "?" + item + "=" + currentPage.options[item];
        } else {
          app.globalData.pathUrl += "&" + item + "=" + currentPage.options[item];
        }
        i++;
      }
      this.setData({
        isXinRen: false,
        tabToggle: true
      });
    } else if (options.admin) {
      console.log('修改合作标题');
      this.setData({
        tabToggle: true
      });
      app.editadminTabbar();
      
    } else if (options.JiHuiOrderUser) {
      this.setData({
        tabToggle: true
      });
      app.editJiHuiOrderTabBar();

    } 
    else {
      app.editTabBar();
      this.setData({
        isXinRen: false,
        tabToggle: true
      })
    }
    if (getApp().globalData.orderId!="") {
      this.setData({
        orderId: getApp().globalData.orderId,
        openid: getApp().globalData.openid,
        ChatType: 1,
        ddUser: true
      })
    }else{
      this.setData({
        orderId: getApp().globalData.openid,
        openid: getApp().globalData.openid,
        ChatType: 3,
        ddUser: false
      })
    }
    console.log("this.data.ChatType=",this.data.ChatType);
    options_ = options;
    app.globalData.messageCount = 0; // 把消息条数置为0条
    this_1 = this;

    var getSystemInfoSync_1 = wx.getSystemInfoSync();
    if (getSystemInfoSync_1) {
      var Version = getSystemInfoSync_1.SDKVersion;
      var isVersion = compareVersion(Version, "1.9.90");
      this.setData({
        'isVersion': isVersion
      })
    }
    this.setData({
      'userInfo': app.globalData.userInfo
    })
    console.log(app.globalData.userInfo)
    // console.log('版本检测', compareVersion("1.9.9", "1.9.90"))

    // 向socket发送一个消息标识已读
    Read(this_1);
    // 获取聊天信息
    getApp().globalData.chatMsg = [];
    GetUserChatRecord({
      "$this": this,
      "options": options,
      "number": -1
    });

    this.setData({
      openid: app.globalData.openid
    });
    var that = this;
    //获取手机号
    wx.request({
      url: app.globalData.url + '/xlapi/Mini/Ins/Anli/IsGetPhone',
      data: {
        openId: this.data.openid
      },
      method: "POST",
      success: function (res) {
        if (res.data.status == "OK") {
          that.setData({
            isGetPhone: res.data.msg
          });
        }
      }
    })

    //判断是否连接成功
    
    
    this.setData({
      isConnect: getApp().globalData.isReconnection,
      isError: getApp().globalData.isError,
      isConSuccess: getApp().globalData.connectSuccess
    });
    if (this.data.isConnect) {
      app.reconnect();
    } else {
      //接收socket消息
      getApp().onWebscoket(this, true);
      //清空未读消息数量  
      getApp().globalData.unread = 0;

    }
    this.setData({
      isConnect: getApp().globalData.isReconnection,
      isError: getApp().globalData.isError,
      isConSuccess: getApp().globalData.connectSuccess,
      isOnshow: false
    })
    console.log("isConnect=", this.data.isConnect);
    console.log("isError=", this.data.isError);
    console.log("isConSuccess=", this.data.isConSuccess);

    computed(this, {
      showTime2(x) {
        var type = true
        if (this.data.chatList[x - 1]) {
          type = false
          var previous_AddTime = this.data.chatList[x - 1].AddTimeStr
          var this_AddTime = this.data.chatList[x].AddTimeStr
          var days =
            new Date(this_AddTime).getTime() -
            new Date(previous_AddTime).getTime() //毫秒
          var Minute = days / 1000 / 60 //分钟
          type = Minute > 5
        } else {
          type = true
        }
        return type
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
    if (this.data.isOnshow){
      // 获取聊天信息
      getApp().globalData.chatMsg = [];
      this.setData({
        chatList: getApp().globalData.chatMsg,
        hideHeader: true
      });
      GetUserChatRecord({
        "$this": this,
        "options": options_,
        "number": -1
      });
    }
  },
  //时间
  AddTime_filter(x) {
    var time = x;
    if (x) {
      if (new Date().toDateString() == new Date(x).toDateString()) {
        // return dateFtt(x, 'hh:mm')
        time = x.split(' ')[1]
      } else {
        // return dateFtt(x, 'yyyy-MM-dd')
        time = x.split(' ')[1]
      }
    }
    return time;
  },
  //时间是否显示
  showTime(x, newMsg) {
    var type = true
    if (this.data.chatList[x-1]) {
      type = false
      var previous_AddTime = this.data.chatList[x-1].AddTimeStr
      var this_AddTime;
      if(newMsg){
        this_AddTime = newMsg.AddTimeStr
      }else{
        this_AddTime = this.data.chatList[x].AddTimeStr
      }
      var days =
        new Date(this_AddTime).getTime() -
        new Date(previous_AddTime).getTime() //毫秒
      var Minute = days / 1000 / 60 //分钟
      type = Minute > 5
    } else {
      type = true
    }
    return type
  },
  // 发送FormId和发送信息
  getFormIdOrSend (e) {
    var this_= this;
    // 发送消息
    sendAllType(this.data.content, 1, this);
    // 发送formId
    var formid = e.detail.formId;
    // wx.showModal({
    //   title: '',
    //   content: formid + "," + this.data.isSendFormId,
    // })
    if (!this.data.isSendFormId){
      wx.request({
        url: app.globalData.url + '/xlapi/SendMessage/SendMessage/SendMessage/SaveUserFromId',
        method: 'POST',
        data: { FromId: formid, OpenId: this.data.openid},
        success: function (res) {
          console.log("fromId", res);
          this_.setData({
            isSendFormId: true
          })
        }
      })
    }
  },

  // fasongmoban: function (e) {
  //   var formid = e.detail.formId;
  //   var data = {
  //     "touser": "ooUwn4915tjWi4A7UHNReAzpqkfY",
  //     "template_id": "tKjJrgWw1RVl5ur8TowFsRtVrY8gmnj-SWlmQ1ABOFs",
  //     "page": "/pages/message/message",
  //     "form_id": formid,
  //     "data": {
  //       "keyword1": {
  //         "value": "339208499"
  //       },
  //       "keyword2": {
  //         "value": "2015年01月05日 12:30"
  //       },
  //       "keyword3": {
  //         "value": "粤海喜来登酒店"
  //       },
  //       "keyword4": {
  //         "value": "广州市天河区天河路208号"
  //       }
  //     },
  //     // "emphasis_keyword": "keyword1.DATA"
  //   }
  //
  //   wx.request({
  //     url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxb1c40518af450477&secret=85e4cc6c20b9808a82d37c6e081bb43c',
  //     success: function (res) {
  //       wx.request({
  //         url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + res.data.access_token,
  //         method: 'POST',
  //         data: data,
  //         success: function (res) {
  //           console.log("我是推送:"+res);
  //         }
  //       })
  //     }
  //   })
  // },

  test: function (e) {
   console.log("123");
  },
  bindButtonTap: function () {
    this.setData({
      jiao: true
    })
  },
  textFocus: function () {
    // toBottom(this, -1)
    // setTimeout(function(){
    //   this.setData({
    //     toggle: false
    //   })
    // },200)
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
    // var that = this;
    // wx.startPullDownRefresh({
    // success: function(){
    // that.setData({
    //   pageIndex: that.data.pageIndex + 1,
    //   hideHeader: true,
    //   getNextPage: true // 显示上一页数据
    // });
    // GetUserChatRecord({
    //   "$this": that,
    //   "options": "options",
    //   "number": 1
    // });
    // console.log("开始下拉");
    // wx.stopPullDownRefresh()
    // }
    // }); 
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("上拉触底");
  },
  // 下拉触顶
  changeHeight: function (e) {
    console.log("111111", e);
    this.setData({
      // scrollHeight: ""
    })
  },
  // 下拉刷新
  refresh: function (e) {
    console.log('下拉刷新');
    if (this.data.isLast) return;
    var that = this;
    that.setData({
      pageIndex: that.data.pageIndex + 1,
      hideHeader: true,
      getNextPage: true // 显示上一页数据
    });
    GetUserChatRecord({
      "$this": that,
      "options": "options",
      "number": 1
    });
    console.log("开始下拉");
    wx.stopPullDownRefresh()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    // var pages = getCurrentPages();
    // var currentPage = pages[pages.length - 1];
    // var url = currentPage.route; //当前页面url
    // return {
    //     title: ' ',
    //     imageUrl: app.globalData.imgUrl + 'share.png',
    //     path: "/pages/validation/validation?share=true&url=" + url
    // }
  },
  closeModal(){
    this.setData({
      toggle: true
    })
  },
  getDetails(id) {
    var that = this
    wx.request({
      url: getApp().globalData.url + '/xlapi/Mini/Ins/Anli/getModel?id=' + id,
      method: "POST",
      success: function (res) {
        that.setData({
          detail: res.data
        })
        that.sendanli()
      }
    });
  },
  getDetailss(id, isvideo) {
    var that = this
    wx.request({
      url: getApp().globalData.url + '/xlapi/Mini/Ins/Anli/getModel?id=' + id,
      method: "POST",
      success: function (res) {

        //res.data.Yimg=res.data.Cimg.split(';')[0]
        console.log(res.data)
        if (isvideo == 'true') {
          res.data.Yimg = getApp().globalData.imgUrl + 'isvideo.jpg';
        }
        that.setData({
          details: res.data
        })
        that.sendanlis()
      }
    });
  },
  getPhoneNumber: function (e) {
    //没有授权
    if (e.detail.errMsg != "getPhoneNumber:ok") {
      return;
    }
    var that = this;
    wx.login({
      success: function (res) {
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
                      isGetPhone: false
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
  //发送消息(纯文本)
  send(e) {
    sendAllType(this.data.content, 1, this);
  },
  sendaddress(address) {
    var temp = {};
    temp.Type = "address";
    temp.Message = address
    temp.IsRead = false;
    temp.IsRevocation = false;
    temp.SendUser = this.data.openid;
    temp.OrderId = this.data.orderId;
    temp.ReceiveUser = "";

    getApp().globalData.chatMsg = getApp().globalData.chatMsg.concat(temp);
    this.setData({
      chatList: getApp().globalData.chatMsg,
      content: ''
    })
    this.setData({
      top: 999999
    })
    temp.Message = JSON.stringify(address);
    temp.equipment = app.globalData.equipment;
    temp.isError = true;
    wx.sendSocketMessage({
      data: JSON.stringify(temp),
      fail: function () {
        // this.setData({
        //   isError: getApp().globalData.isError
        // })
        temp.isError = true;
      }
    })
    temp.Message = address;
  },
  sendanlis() {
    var detail = {}
    detail.id = this.data.details.id
    detail.Cname = this.data.details.Cname
    detail.describe = this.data.details.describe
    detail.Cimg = this.data.details.Yimg
    sendAllType(JSON.stringify(detail), 5, this);
  },
  chatContent(e) {
    this.setData({
      content: e.detail.value
    })
  },
  sendanli() {
    var detail = {}
    detail.id = this.data.detail.id
    detail.Cname = this.data.detail.Cname
    detail.describe = this.data.detail.describe
    detail.Cimg = this.data.detail.Cimg
    sendAllType(JSON.stringify(detail), 4, this);
  },
  // chatContent(e) {
  //     this.setData({
  //         content: e.detail.value
  //     })
  // },
  open() {
    if (this.data.toggle) {
      this.setData({
        toggle: false
      })
      toBottom(this, -1)
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
  map(e) {
    console.log(e)
    var lat = e.currentTarget.dataset.params.latitude
    var lng = e.currentTarget.dataset.params.longitude
    var name = e.currentTarget.dataset.params.name
    var address = e.currentTarget.dataset.params.address

    wx.openLocation({
      latitude: Number(lat),
      longitude: Number(lng),
      name: name,
      address: address,
      scale: 18
    })
  },
  chooseLocation() {
    var _this = this
    wx.chooseLocation({
      success: function (res) {
        _this.sendaddress(res)
        _this.setData({
          toggle: true
        })
      },
    })
  },
  chooseImage() {
    var _this = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: function (res) {
        var file = res.tempFilePaths[0]
        zhixing(file, _this)
      }
    })
  },
  camera() {
    var _this = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'],
      sourceType: ['camera'],
      success: function (res) {
        var file = res.tempFilePaths[0]
        zhixing(file, _this)
      }
    })
  },
  listenerButtonPreviewImage: function (e) {
    console.log(e.currentTarget);
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: [e.currentTarget.dataset.src] // 需要预览的图片http链接列表
    })
  },
  toDetail(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../Casexq/Casexq?id=' + id,
    })
  },
  //返回上一页
  back: function (e) {
    this.setData({
      hiddenPhoneModal: false
    })
  },
  showQCode: function () {
    this.setData({
      hiddenmodalput: true
    })
  },
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: [current]
    })
  },
  phonecallevent: function () {
    wx.makePhoneCall({
      phoneNumber: "4009951520"
    })
  }
})