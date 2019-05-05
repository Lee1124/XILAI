// pages/question/question.js
//文件上传
var COS = require('../../lib/cos-wx-sdk-v5')
var config = require('../../lib/config')
var common = require('../../utils/common.js')
var files = []
var tempThis;
var filescount = 0
var weddingRole_type = -1;
var cos = new COS({ //实例化cos类 
  getAuthorization: function(params, callback) { //获取签名 必填参数
    var authorization = COS.getAuthorization({
      SecretId: config.SecretId,
      SecretKey: config.SecretKey,
      Method: params.Method,
      Key: params.Key
    });
    callback(authorization);
  }
});


function JiaruFile(orderId, type, inspect, value) {
  console.log("files:" + value);
  wx.request({
    url: url + '/xlapi/FlowScheme/Operation/IntentionList/RedactInfo',
    method: "POST",
    data: {
      orderId: orderId,
      type: type,
      inspect: inspect,
      value: value
    },
    header: {
      Authorization: "url|1|2|xlhl|http://171.211.126.122:8092/||rolestate||0|action"
    }
  })
}

function ArrayInclude(array, value) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] == value) {
      return true;
    }
  }
  return false;
}

function delimg(path) {
  path = path.replace("https://xlfile-1256392453.cos.ap-chengdu.myqcloud.com/", "");
  var array = path.split('.');
  var yspath = array[0] + '-ys.' + array[1];
  cosdelImg(yspath);
  cosdelImg(path);
  wx.showToast({
    title: '删除成功',
    icon: 'success',
    duration: 2000
  })
  wx.hideLoading();
}

function cosdelImg(path) {
  cos.deleteObject({
    Bucket: config.Bucket,
    /* 必须 */
    Region: config.Region,
    /* 必须 */
    Key: path /* 必须 */
  }, function(err, data) {
    console.log(err || data);
  });
}

var requestCallback = function(err, data) { //请求结果
  var orderId = tempThis.data.orderId;
  var weddingRole = tempThis.data.weddingRole;
  var url = "https://xlfile-1256392453.cos.ap-chengdu.myqcloud.com/";
  wx.getImageInfo({ //获取这个图片 图片压缩
    src: files[filescount],
    success: function(res) {
      var ctx = wx.createCanvasContext('photo_canvas'); //使用一个canvas
      var canvasWidth = res.width //原图宽度    
      var canvasHeight = res.height; //原图高度
      var tWidth = 800; //设置缩略图初始宽度    
      var tHeight = 640; //设置缩略图初始高度    
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
      ctx.drawImage(files[filescount], 0, 0, tWidth, tHeight)
      ctx.draw()
      //下载canvas图片
      setTimeout(function() {
        wx.canvasToTempFilePath({
          canvasId: 'photo_canvas',
          success: function(res) {
            var filePath = res.tempFilePath
            var oldfilePath = files[filescount]
            var Key = oldfilePath.substr(oldfilePath.lastIndexOf('/') + 1);
            var yskeyCl = Key.split('.')
            var length = yskeyCl.length;
            var yskey = yskeyCl[length - 2] + '-ys.' + yskeyCl[length - 1]
            cos.postObject({
              Bucket: config.Bucket,
              Region: config.Region,
              Key: 'dir/biao/' + orderId + "/" + weddingRole + "/" + yskey,
              FilePath: filePath
            }, function(err, data) {
              console.log('返回参数', data);
              console.log('orderId为', orderId);
              var tempListInspect = tempThis.data.imgListInspect;
              var tempList = tempThis.data.imgList;
              var img_orderid_list = tempThis.data.img_orderid_list;
              var inspect = "fl_m1";
              for (var i = 1; i <= 3; i++) {
                if (!ArrayInclude(tempListInspect, "fl_m" + i)) {
                  inspect = "fl_m" + i;
                  break;
                }
              }
              var valueimg = url + 'dir/biao/' + orderId + "/" + weddingRole + "/" + yskeyCl[length - 2] + '.' + yskeyCl[length - 1];
              tempListInspect.push(inspect);
              tempList.push(valueimg);
              img_orderid_list.push(orderId)
              tempThis.setData({
                imgList: tempList,
                imgListInspect: tempListInspect,
                img_orderid_list: img_orderid_list
              })
              JiaruFile(orderId, weddingRole, inspect, valueimg) //加入数据库
              filescount = filescount + 1
              zhixing()
            });
          },
          fail: function(error) {
            console.log(error)
          }
        })
      }, 100)
    }
  })
}

function zhixing() { //执行上传图片的方法 
  var orderId = tempThis.data.orderId;
  var weddingRole = tempThis.data.weddingRole;
  if (filescount < files.length) { //判断图片是否上传完毕
    var filePath = files[filescount];
    var Key = filePath.substr(filePath.lastIndexOf('/') + 1);
    var yskeyCl = Key.split('.');
    var length = yskeyCl.length;
    var yskey = yskeyCl[length - 2] + '.' + yskeyCl[length - 1]
    cos.postObject({
      Bucket: config.Bucket,
      Region: config.Region,
      Key: 'dir/biao/' + orderId + "/" + weddingRole + "/" + yskey,
      FilePath: filePath
    }, requestCallback);

  } else {
    wx.hideLoading();
    wx.showToast({
      title: '添加成功',
      icon: 'success',
      duration: 2000
    })
    wx.hideLoading();
  }
}

var price;
var time = 0;
var touchDot = 0; //触摸时的原点
var interval = "";
var flag_hd = true;
var titleName; //弹出修改窗标题
var url = getApp().globalData.url; //服务器ip
var openId = getApp().globalData.openid;
var tempId;
var app = getApp();
var common = require('../../utils/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    textFocus: true,
    yusuanIsShow: false, // 是否显示预算
    isFirst: true, // 是否是第一次进入
    questionShow: false,
    shareTitle: "婚礼意向表",
    IsEmployees: false, // 是否是员工
    hiddenmodalput: true, // 可以通过hidden是否掩藏弹出框的属性，来指定那个弹出框
    phone_number: "", // 弹框输入的手机号码
    showPage: 1, //控制显示页面
    showCenterPage: 1, //控制显示中间部分数据
    second_title: "我的基本信息", //表单信息标题
    shadwShow: false, //遮罩层显示
    shadwType: 1, //弹窗显示控制
    _num: "1", //分页显示页数
    title: "意向表",
    orderId: "",
    weddingRole: -1,
    isShare: false,
    qusData: {},
    userToggle: false,
    focus: true,
    items: [
      {
        name: '2万以下',
        value: '2万以下'
      },
      {
        name: '2万 - 4万',
        value: '2万 - 4万'
      },
      {
        name: '4万 - 6万',
        value: '4万 - 6万'
      },
      {
        name: '6万 - 8万',
        value: '6万 - 8万'
      },
      {
        name: '10万以上',
        value: '10万以上'
      }
    ],
    items1: [{
      name: '室内',
      value: '室内'
    }, {
      name: '户外',
      value: '户外'
    }, {
      name: '其他',
      value: '其他'
    }],
    imgList: [], //: [//图片地址
    //   "../../images/bg.png", "../../images/bg.png"
    // ],imgList
    imgListInspect: [],
    img_orderid_list: [], //保存图片orderid
    input_title: "asd", //弹窗修改标题
    input_content: "", //弹窗输入内容
    date: '', //生日
    array: ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'],
    xingzuo: ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座']
  },
  bindFocus: function(){
    this.setData({
      textFocus: true
    })
  },
  //点击按钮痰喘指定的hiddenmodalput弹出框  
  modalinput: function() {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },
  // 获取输入的手机号码
  getPhoneNumber: function(e) {
    this.setData({
      phone_number: e.detail.value
    })
  },
  // 验证当前用户
  formSubmit: function(e) {
    var that = this;
    var phone_number = that.data.phone_number;
    var openid = that.data.openid; //用户id
    //判断电话是否合法
    var reg = /^[1][3,4,5,7,8][0-9]{9}$/; //正则判断手机号
    if (phone_number == "") {
      wx.showModal({
        title: '提示',
        content: '请输入手机号码！'
      })
      return false;
    } else if (!reg.test(phone_number)) {
      //手机号不合法
      wx.showModal({
        title: '提示',
        content: '手机号输入不合法！'
      })
      return false;
    } else {
      wx.request({
        url: app.globalData.url + 'xlapi/FlowScheme/Operation/FlowScheme/checkorderphone',
        data: {
          orderid: getApp().globalData.orderId,
          phone: phone_number
        },
        method: 'POST',
        header: {
          Authorization: "url|1|2|xlhl|http://171.211.126.122:8092/||rolestate||0|action"
        },
        success: function(res) {
          //后台检测电话号码
          console.log(res.data);
          if (!res) {
            wx.showModal({
              title: '提示',
              content: '请输入正确的手机号码'
            })
            return false;
          } else {
            if (res.data == "") {
              wx.showModal({
                title: '提示',
                content: '电话号码验证错误'
              })
              return false;
            } else if (res.data != weddingRole_type && res.data != "") {
              var type_ = (weddingRole_type == 1) ? "新娘" : "新郎";
              var type_1 = !(weddingRole_type == 1) ? "新娘" : "新郎";
              wx.showModal({
                title: '提示',
                content: '该意见表是' + type_ + "意向表，是否要切换到" + type_1 + "意向表",
                success: function(result) {
                  if (result.confirm) {
                    wx.redirectTo({
                      url: '/pages/question/question?orderId=' + getApp().globalData.orderId + "&weddingRole=" + res.data + "&isShare=true"
                    })
                  }else{
                    
                  }
                }

              })
            } else {
              that.setData({
                questionShow: true,
                isFirst: false,
                hiddenmodalput: true
              })
              that.getWeddingRoleName(that, getApp().globalData.orderId, getApp().globalData.weddingRole);
              that.getInfo(that);
              // openId: openid, orderid: 订单id, WeddingRole: 新人类型，openName：用户的微信名称
              //判断是否获取了权限
              wx.getSetting({
                success(res) {
                  if (!res.authSetting['scope.userInfo']) {
                    // wx.authorize({
                    //   scope: 'scope.userInfo',
                    //   success() {
                    //     wx.getUserInfo()
                    //   }
                    // })
                    that.setData({
                      userToggle: true
                    })
                  } else {
                    that.adduserinf();
                  }
                }
              })


            }
          }
        }
      })
    }
  },
  getUserInfo(e) {
    console.log("开始导入数据");
    common.getUserInfo(e, this);
    this.adduserinf();
  },
  adduserinf: function() {
    wx.request({
      url: app.globalData.url + 'xlapi/Authentication/AppletUser/Authentication/addorderuserinfo',
      data: {
        openId: getApp().globalData.openid,
        orderid: getApp().globalData.orderId,
        WeddingRole: getApp().globalData.weddingRole,
        openName: getApp().globalData.userInfo.nickName
      },
      method: 'POST',
      header: {
        Authorization: "url|1|2|xlhl|http://171.211.126.122:8092/||rolestate||0|action"
      },
      success: function(data) {
        console.log(data);
        if (data.data == "ok") {


          // that.setData({
          //   questionShow: true,
          //   isFirst: false,
          //   hiddenmodalput: true
          // })
        }
      }
    })
  },
  //选择星座
  bindPickerChangexingzuo(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    var index = e.detail.value
    this.setData({
      ['qusData.constellatory']: this.data.xingzuo[index]
    });
    this.RedactInfo('constellatory', this.data.xingzuo[index]);
  },
  //生肖选择器
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    var index = e.detail.value
    this.setData({
      ['qusData.horoscope']: this.data.array[index]
    });
    this.RedactInfo('horoscope', this.data.array[index]);
  },
  getshengxiao: function(yyyy) {
    //by Go_Rush(阿舜) from http://ashun.cnblogs.com/

    var arr = ['猴', '鸡', '狗', '猪', '鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊'];
    return /^\d{4}$/.test(yyyy) ? arr[yyyy % 12] : '未找到'
  },
  //时间选择器
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var nian = e.detail.value.substring(0, 4);
    var horoscope = this.getshengxiao(nian); //生肖
    var index_arr = 0;
    var arr = this.data.array;
    for (var i = 0; i < arr.length; i++){
      if (horoscope == arr[i]){
        index_arr = i;
        break;
      }
    }

    this.setData({
      // 'qusData.birthday': e.detail.value,
      ['qusData.birthday']: e.detail.value,
      ['qusData.horoscope']: horoscope,
      ['qusData.arr_index']: index_arr,
    })
    console.log('qusData.arr_index', horoscope)
    this.RedactInfo('birthday', e.detail.value);
    this.RedactInfo('horoscope', horoscope);
  },
  //删除图片
  DeleteInspect(orderId, type, e) {
    // console.log(this.data.imgListInspect);
    // console.log(e);
    // return;
    var inspect = e.currentTarget.id;
    var value = e.currentTarget.dataset.img;
    var index = e.currentTarget.dataset.index;
    var tempListInspect = tempThis.data.imgListInspect;
    var img_orderid_list = tempThis.data.img_orderid_list
    var tempList = tempThis.data.imgList;
    var order_1 = img_orderid_list[index];
    wx.request({
      url: url + '/xlapi/FlowScheme/Operation/IntentionList/DeleteInspect',
      method: "POST",
      data: {
        orderId: order_1,
        type: type,
        inspect: inspect
      },
      header: {
        Authorization: "url|1|2|xlhl|http://171.211.126.122:8092/||rolestate||0|action"
      },
      success: function(result) {
        if (result.data.status == "OK") {
          wx.showLoading({
            title: '删除中...',
          })
          delimg(value);
          tempListInspect.splice(index, 1);
          tempList.splice(index, 1);
          img_orderid_list.splice(index, 1);
          tempThis.setData({
            imgListInspect: tempListInspect,
            imgList: tempList,
            img_orderid_list: img_orderid_list
          })
        }
      }

    })
  },
  sstest: function(e) {
    tempThis = this;
    wx.showModal({
      title: '提示',
      content: '是否确定删除这张图片',
      success: function(res) {
        if (res.confirm) {
          tempThis.DeleteInspect(tempThis.data.orderId, tempThis.data.weddingRole, e);
        }
      }
    })

  },

  testa: function(e) {},
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    price = e.detail.value
  },
  savePrice: function(e) {
    this.RedactInfo("Budget_for_the_venue", price)
    this.setData({
      ['qusData.Budget_for_the_venue']: price,
      shadwShow: false,
    });

  },
  savePrice1: function(e) {
    this.RedactInfo("otherfour", price)
    this.setData({
      ['qusData.otherfour']: price,
      shadwShow: false,
    });

  },

  openQuestion: function(e) { // 进入问卷表
    this.setData({
      showPage: 2
    })
  },

  changeVal: function(e) { //表单信息储存
    var valType;
    var tempId = e.currentTarget.id;
    this.setData({
      ['qusData.' + tempId]: e.detail.value
    })
    this.RedactInfo(tempId, e.detail.value);

  },


  //js
  change_click: function(e) {
    var typeFlag
    if (typeof e == "number") {
      typeFlag = e.toString();
    } else {
      typeFlag = e.target.dataset.num;
    }
    // console.log(typeFlag)
    switch (typeFlag) {
      case "1":
        this.setData({
          second_title: "我的基本信息"
        })
        break;
      case "2":
        this.setData({
          second_title: "我的喜好信息"
        })
        break;
      case "3":
        this.setData({
          second_title: "我的宾客信息"
        })
        break;
      case "4":
        this.setData({
          second_title: "我的爱情故事"
        })
        break;
      case "5":
        this.setData({
          second_title: "我的家庭生活"
        })
        break;
      case "6":
        this.setData({
          second_title: "我的婚礼设计"
        })
        break;
    }

    this.setData({
      _num: typeFlag, //点击显示样式
      showCenterPage: typeFlag, //分页显示页数
      shadwShow: false,
    })

  },
  showShadw_1: function() {
    wx.redirectTo({
      url: '../MyService/MyService'
    })
  },
  showShadw: function(e) { //点击目录显示遮罩层
    this.setData({
      shadwShow: true,
      shadwType: 1,
    })
  },
  showShadw1: function(e) { //点击目录显示遮罩层
    this.setData({
      shadwShow: true,
      shadwType: 2,
    })
  },
  showShadw2: function(e) { //点击目录显示遮罩层
    this.setData({
      shadwShow: true,
      shadwType: 4,
    })
  },
  hideShadw: function(e) { //隐藏遮罩层
    console.log("hideShadw");
    this.setData({
      shadwShow: false,
      // focus: false
    })
  },

  uploadImgs: function(e) { //上传照片
    var that = this;
    wx.chooseImage({
      // count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        //图片总数不能超过3张
        var num = that.data.imgList.length;
        if (num + res.tempFilePaths.length > 3) {
          wx.showToast({
            title: '总数不能超过3张',
            icon: 'none',
            duration: 2000
          })
          return;
        }
        filescount = 0
        files = [];
        files = res.tempFilePaths;
        tempThis = that;
        wx.showLoading({
          title: '正在上传...',
        });
        zhixing();
      }
    })
  },
  listenerButtonPreviewImage: function(e) {
    let index = e.target.dataset.index; //预览图片的编号
    let that = this;
    wx.previewImage({
      current: that.data.imgList[index],
      urls: that.data.imgList, //图片预览list列表
      success: function(res) {
        //console.log(res);
      },
      fail: function() {
        //console.log('fail')
      }
    })
  },
  nextPage: function(e) { //下一页
    var nowPage = parseInt(this.data.showCenterPage); //当前页码
    if (nowPage == 6) {
      wx.showToast({
        title: '已到最后一页',
        icon: 'loading',
        duration: 1000,
        mask: true
      })
    } else {
      this.change_click(nowPage + 1); //分页显示页数
    }
  },

  lastPage: function(e) { //上一页

    var nowPage = parseInt(this.data.showCenterPage); //当前页码
    if (nowPage == 1) {
      wx.showToast({
        title: '已到第一页',
        icon: 'loading',
        duration: 1000,
        mask: true
      })
    } else {
      this.change_click(nowPage - 1); //分页显示页数
    }
  },

  saveQuestion: function(e) { //保存
    wx.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 3000
    })
    wx.hideLoading();
  },

  onShow: function() {
    flag_hd = true; //重新进入页面之后，可以再次执行滑动切换页面代码
    clearInterval(interval); // 清除setInterval
    time = 0;
  },
  // 触摸开始事件
  touchStart: function(e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点
    // 使用js计时器记录时间    
    interval = setInterval(function() {
      time++;
    }, 100);
  },
  // 触摸结束事件
  touchEnd: function(e) {
    var touchMove = e.changedTouches[0].pageX;
    // 向左滑动   
    if (touchMove - touchDot <= -100 && time < 10 && flag_hd == true) {
      // flag_hd = false;
      //执行切换页面的方法
      var nowPage = parseInt(this.data.showCenterPage); //当前页码
      if (nowPage == 6) {
        wx.showToast({
          title: '已到最后一页',
          icon: 'loading',
          duration: 1000,
          mask: true
        })
      } else {
        this.change_click(nowPage + 1); //分页显示页数
      }
    }
    // 向右滑动   
    if (touchMove - touchDot >= 100 && time < 10 && flag_hd == true) {
      // flag_hd = false;
      //执行切换页面的方法
      var nowPage = parseInt(this.data.showCenterPage); //当前页码
      if (nowPage == 1) {
        wx.showToast({
          title: '已到第一页',
          icon: 'loading',
          duration: 1000,
          mask: true
        })
      } else {
        this.change_click(nowPage - 1); //分页显示页数
      }
    }
    clearInterval(interval); // 清除setInterval
    time = 0;
  },

  changeText: function(e) { //弹窗修改内容
    titleName = e.currentTarget.dataset.title;
    var inspect = e.currentTarget.id;
    var input = this.data.qusData[inspect];
    if (input == undefined) {
      input = '';
    }
    console.log(input);
    tempId = inspect;
    this.setData({
      shadwShow: false,
      input_content: input,
    })
    this.setData({
      shadwShow: true,
      shadwType: 3,
      focus: true,
      input_title: titleName,
    })
  },
  inputSure: function(e) { //弹窗确定按钮
    console.log("focus：false");
    var contionVal;
    var valType;
    this.setData({
      ['qusData.' + tempId]: this.data.input_content
    })
    this.RedactInfo(tempId, this.data.input_content);

    this.setData({
      shadwShow: false
      // focus: false,
    })

  },
  textareaChange: function(e) { //多行输入框输入时触发
    this.setData({
      input_content: e.detail.value
    })
  },
  RedactInfo: function(inspect, value) {
    //判断是否有修改
    if (this.data.qusData[inspect] == undefined) {
      return;
    }
    wx.request({
      url: url + '/xlapi/FlowScheme/Operation/IntentionList/RedactInfo',
      method: 'POST',
      header: {
        Authorization: "url|1|2|xlhl|http://171.211.126.122:8092/||rolestate||0|action"
      },
      data: {
        orderId: getApp().globalData.orderId,
        type: getApp().globalData.weddingRole,
        inspect: inspect,
        value: value,
      },
      success: function(result) {
        if (result.data.status != "OK" || result.data.status == "error"){
          wx.showToast({
            title: result.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function() {

        wx.showToast({
          title: '保存失败',
          icon: 'none',
          duration: 2000
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    console.log('页面数量', getCurrentPages().length)
    var CurrentPages = getCurrentPages().length; //获取上一页的数量
    if (CurrentPages == 1) {
      this.setData({
        isShare: true
      });
    }

    var msgtitle = "意向表";
    var roleStr = "";
    if (options.weddingRole){
      if (options.weddingRole == "0") {
        msgtitle = "新郎意向表";
        roleStr = "新郎";
      } else if (options.weddingRole == "1") {
        msgtitle = "新娘意向表";
        roleStr = "新娘";
      }
      wx.setNavigationBarTitle({
        title: '欢迎您 , ' + roleStr
      })
      that.setData({
        title: msgtitle
      })
    }

    //判断是否获取了权限
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          // wx.authorize({
          //   scope: 'scope.userInfo',
          //   success() {
          //     wx.getUserInfo()
          //   }
          // })
          that.setData({
            userToggle: true
          })
        } else {
          //如果有获取权限判断是否获取了头像（后面可以删除）
          // that.IsGetIcon(app.globalData.openid);
        }
      }
    })
    app.getUserInfo().then(function(res) {
      console.log(options);
      if (options.isShare == "true") {
        that.setData({
          isShare: true
        });
      } else {
        common.authentication();
      }
      if (!(options.orderId && options.weddingRole && options.isShare)) {
        that.setData({
          isFirst: false
        });
      } else {
        that.setData({
          isFirst: true,
          questionShow: false
        });

        getApp().globalData.weddingRole = options.weddingRole;
        getApp().globalData.orderId = options.orderId;
      }
      //通过openid获取订单信息获取身份
      wx.request({
        url: getApp().globalData.url + '/xlapi/FlowScheme/Operation/IntentionList/GetOrderId',
        method: "POST",
        data: {
          openId: app.globalData.openid
        },
        header: {
          Authorization: "url|1|2|xlhl|http://171.211.126.122:8092/||rolestate||0|action"
        },
        success: function(res) {
          var item_ = res.data;
          //获取到订单信息 读取数据
          var voderid = "";
          var vrole = "";
          //   weddingRole_type = vrole;
          if (options.isShare) {
            weddingRole_type = options.weddingRole;
          }
          if (item_.status == "OK") {
            console.log(item_.data.weddingRole + "---");
            var msgtitle = "意向表";
            var roleStr = "";
            if (item_.data.weddingRole == "0") {
              msgtitle = "新郎意向表";
              roleStr = "新郎";
            } else if (item_.data.weddingRole == "1") {
              msgtitle = "新娘意向表";
              roleStr = "新娘";
            }
            wx.setNavigationBarTitle({
              title: '欢迎您 , ' + roleStr
            })
            that.setData({
              IsEmployees: item_.data.IsEmployees,
              title: msgtitle
            })
            var roleStr = "0,1,"
            var hasRole = roleStr.indexOf(item_.data.weddingRole);
            // 新人
            if (hasRole >= 0 && item_.data.orderId != "") {
              if (item_.data.weddingRole == options.weddingRole) {
                voderid = item_.data.orderId;
                vrole = item_.data.weddingRole;
              } else {
                //验证订单正确新人角色不对
                if (options.isShare) {
                  //扫描或者分享进入执行跳转
                  wx.redirectTo({
                    url: '/pages/question/question?orderId=' + item_.data.orderId + "&weddingRole=" + item_.data.weddingRole + "&isShare=true"
                  })
                } else {
                  //菜单链接进入
                  voderid = item_.data.orderId;
                  vrole = item_.data.weddingRole;
                }
              }
              // 员工
            } else if (item_.data.IsEmployees) {

              voderid = options.orderId;
              vrole = options.weddingRole;
              // 异常
            } else {
              that.modalinput();
            }
            if (voderid != "") {
              //存在订单id和角色获取数据
              that.setData({
                orderId: voderid,
                weddingRole: vrole,
                questionShow: true
              })
              getApp().globalData.weddingRole = vrole;
              getApp().globalData.orderId = voderid;
              that.getWeddingRoleName(that, voderid, vrole);
              that.getInfo(that);
            }
          } else {
            that.modalinput();
          }
        }
      })
    });
    //获取openId
    //加载的时候获取数据
  },
  getWeddingRoleName(that, orderId, weddingRole) {
    var title = "婚礼意向表";
    wx.request({
      url: getApp().globalData.url + '/xlapi/Authentication/AppletUser/Authentication/GetCustomerInfo',
      method: "POST",
      data: {
        OrderId: orderId,
        WeddingRole: weddingRole
      },
      header: {
        Authorization: "url|1|2|xlhl|http://171.211.126.122:8092/||rolestate||0|action"
      },
      success: function(res) {
        console.log(res);
        if (res.data.status) {
          if (weddingRole == 1) {
            title = "新娘" + res.data.msg + "意向表";
          } else {
            title = "新郎" + res.data.msg + "意向表";
          }
        }
        that.setData({
          shareTitle: title
        })
      }
    })
  },

  getInfo: function(that) {
    console.log(getApp().globalData.orderId + "--、" + getApp().globalData.weddingRole);
    wx.request({
      url: url + '/xlapi/FlowScheme/Operation/IntentionList/GetIntentionList',
      method: "POST",
      data: {
        orderId: getApp().globalData.orderId,
        weddingRole: getApp().globalData.weddingRole
      },
      header: {
        Authorization: "url|1|2|xlhl|http://171.211.126.122:8092/||rolestate||0|action"
      },
      success: function(res) {
        if (res.data.status == "OK") {
          var d = res.data.data.qulist;

          var temp = {};
          var tempList = [];
          var tempListInspect = [];
          var img_orderid_list = [];
          for (var i = 0; i < d.length; i++) {
            //imgList
            temp[d[i].Inspect] = d[i].Value;
            if (d[i].Inspect.indexOf('fl_m') > -1) {
              tempList.push(d[i].Value);
              tempListInspect.push(d[i].Inspect);
              img_orderid_list.push(d[i].Orderid);
            }
          }
          wx.setNavigationBarTitle({
            title: '欢迎您 , ' + res.data.data.title.substring(2, 0)
          })
          console.log("--------------",res.data.data);
          that.setData({
            qusData: temp,
            imgList: tempList,
            title: res.data.data.title,
            imgListInspect: tempListInspect,
            img_orderid_list: img_orderid_list,
            yusuanIsShow: res.data.data.isshow,
            questionShow: true
          })
          console.log(that.data.yusuanIsShow);
        } else {
          that.setData({
            questionShow: false
          })
          var content = "orderId = " + getApp().globalData.orderId + " ,weddingRole=" + getApp().globalData.weddingRole;
          wx.showModal({
            title: '信息验证失败',
            content: '验证失败，请联系客服,' + content,
            showCancel: false,
            success: function(res) {
              app.globalData.skip = true;
              if (res.confirm) {
                wx.switchTab({
                  url: '/pages/Login/Login'
                })
              }
            }
          })
        }
      }
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    console.log("监听页面初次渲染完成")
  },
  onLaunch: function(options) {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(options) {
    console.log("监听页面显示+openid:" + app.globalData.openid)
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
    wx.stopPullDownRefresh() //停止下拉刷新 
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(option) {
    var that = this;
    return {
      title: that.data.shareTitle,
      imageUrl: app.globalData.imgUrl + 'share.png',
      path: "/pages/question/question?orderId=" + getApp().globalData.orderId + '&weddingRole=' + getApp().globalData.weddingRole + "&isShare=true"
      // path: 'pages/validation/validation?share=true&shareopenid=' + getApp().globalData.openid + '&url=' + url + '?isShare=true&orderId=' + this.data.orderId + '&weddingRole=' + this.data.weddingRole
    }
  },
})