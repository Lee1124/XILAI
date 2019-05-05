import util from '../../utils/totalUtil'
var COS = require('../../lib/cos-wx-sdk-v5');
var config = require('../../lib/config');
var common = require('../../utils/common.js')
var app = getApp();
var _this;
var statciid = 0;
var allcout = 0;
var uploadcount = 0;
var prevFile = 'https://temp-1256392453.cos.ap-chengdu.myqcloud.com/';
var src = ''
var upfile;
var cos = new COS({
  getAuthorization: function(params, callback) { //获取签名 必填参数
    var authorization = COS.getAuthorization({
      SecretId: config.SecretId,
      SecretKey: config.SecretKey,
      Method: params.Method,
      Key: params.Key
    });
    callback(authorization);
  }
})

function guid() {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid;
}
// 图片等比例缩放
function AutoResizeImage(maxWidth, maxHeight, w, h) {
  var hRatio;
  var wRatio;
  var Ratio = 1;
  wRatio = maxWidth / w;
  hRatio = maxHeight / h;
  if (maxWidth == 0 && maxHeight == 0) {
    Ratio = 1;
  } else if (maxWidth == 0) { //
    if (hRatio < 1) Ratio = hRatio;
  } else if (maxHeight == 0) {
    if (wRatio < 1) Ratio = wRatio;
  } else if (wRatio < 1 || hRatio < 1) {
    Ratio = (wRatio <= hRatio ? wRatio : hRatio);
  }
  if (Ratio < 1) {
    w = w * Ratio;
    h = h * Ratio;
  }
  var imgObj = {
    width: w,
    height: h
  }
  return imgObj;
}
var requestCallback = function(err, data) {
  
  var imageurl = this.Key;
  var FilePath = this.FilePath;
  // 最终保存图片和视屏的接口地址
  var saveUrl; 
  if (_this.data.fileType == 1){
    saveUrl = util.url.url.saveimagewiththum;
  }else{
    saveUrl = util.url.url.addCaseImg;
  }
  util.promisePost(saveUrl, {
    imgs: imageurl,
    id: statciid
  }).then(json2 => {
    console.log("上传成功",json2);

    // wx.navigateTo({
    //   url: '/pages/Cases/Cases?key_=""'
    // })

    uploadcount = uploadcount + 1;
    if (uploadcount == allcout) {
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; //上一个页面
      //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
      prevPage.setData({
        nowpages: 1,
        caseList: []
      });
      prevPage.getlistdata();
      wx.navigateBack({
        delta: 2
      });
    }
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: false,
    searchKey_: [],
    isChoie: false,   // 是否选择当前标签
    labelList: [      // 标签选择
      { id: '001', name: '室内', ischoie: false },
      { id: '002', name: '户外', ischoie: false },
      { id: '003', name: '宝宝宴', ischoie: false },
      { id: '004', name: '商业庆典', ischoie: false },
      { id: '005', name: '红色', ischoie: false },
      { id: '006', name: '白色', ischoie: false },
      { id: '007', name: '蓝色', ischoie: false },
      { id: '008', name: '金色', ischoie: false },
      { id: '009', name: '绿色', ischoie: false },
      { id: '010', name: '视频', ischoie: false }
    ],
    phoneImgList: [],
    imgLists: [],
    imgList: [],
    videoSrc: '',
    fileType: -1, // -1：没有、1：图片、2：视频
    prevFile: 'https://temp-1256392453.cos.ap-chengdu.myqcloud.com/',
    videoContext: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // let type=options.type;
    // this.setData({
    //     type:type
    // })
    _this = this;
    var tag = options.tag
    console.log(tag)
    if (tag == 1) {
      this.setData({
        type: false
      })
    } else {
      this.setData({
        type: true
      })
    }
  },
  // 选择当前标签
  choieLabel(e){
    var label_ = e.currentTarget.dataset.item;
    var list = this.data.labelList;
    var keys = this.data.searchKey_;
    var hasKey = false; // 是否已经选择了该标签

    if (keys.length >= 5 && label_.ischoie == false) {
      wx.showModal({
        title: '提示',
        content: '最多只能选择五个标签！',
      })
      return false;
    }

    // 改变样式
    for (var i = 0; i < list.length; i++){
      var item = list[i];
      if (item.id == label_.id){
        item.ischoie = !label_.ischoie;
        break;
      }
    }
    // 添加或删除
    for (var i = 0; i < keys.length; i++) {
      if (keys[i] == label_.name) {
        keys.splice(i, 1);
        hasKey = true;
        break;
      }
    }
    if (!hasKey){
      keys.push(label_.name);
    }
    this.setData({
      labelList: list,
      searchKey_: keys
    })
    console.log(keys);
  },
  // 获取标题内容
  getTitle(e) {
    let title = e.detail.value;
    this.setData({
      title
    })
  },
  // 获取内容
  getContent(e) {
    let content = e.detail.value;
    this.setData({
      content
    })
  },
  // 选择图片
  chooseImage() {
    var _this = this;
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      success: res => {
        var i = 0;
        if (_this.data.imgLists + res.tempFilePaths.length > 9) {
          wx.showModal({
            title: '提示',
            content: '不得超过9张',
            showCancel: false
          })
          return;
        }
        for (var i = 0; i < res.tempFilePaths.length; i++) {
          let file = res.tempFilePaths[i];
          let arr = this.data.imgList
          arr.push({
            img: file
          })
          var tempList = this.data.imgLists;
          tempList.push(file.tempFilePaths);

          this.setData({
            imgLists: tempList,
            imgList: arr,
            fileType: 1
          });
        }
      }
    });
  },
  //选择当前删除图片
  delImage(e) {
    let index = e.currentTarget.dataset.index;
    let arr = this.data.imgList
    let arrT = this.data.imgLists;
    arr.splice(index, 1)
    arrT.splice(index, 1);
    this.setData({
      imgList: arr,
      imgLists: arrT
    })

  },
  delVideo() {
    this.setData({
      videoSrc: ''
    })
  },
  //选择视频上传
  chooseVideo() {
    let that = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        console.log("视频开始上传了-", res);
        that.setData({
          videoSrc: res.tempFilePath,
          fileType: 2
        })
        that.videoContext = wx.createVideoContext('myvideo');
      }
    })
  },
  fullscreen() {
    console.log(this.videoContext)
    this.videoContext.requestFullScreen
  },
  save() {
    var fileType = this.data.fileType; // 1：图片、2、视频
    let title = this.data.title;
    let content = this.data.content;

    var fo = {
      name: this.data.title,
      gj: this.data.searchKey_.join(","),
      style: '',
      color: '',
      changdi: '',
      hunqi: '',
      miaoshu: this.data.content,
      userid: 0,
      img: "",
      type: 1
    };
    if (title == '' || title == undefined || content == '' || content == undefined) {
      wx.showModal({
        title: '提示',
        content: '请填写完数据再保存',
        showCancel: false
      })
      return;
    }
    // return;
    var that = this;
    wx.showLoading({
      title: '正在保存',
      success() {
        util.promisePost(util.url.url.addNewCase, fo).then(json => {
          console.log(json);
          statciid = json;
          uploadcount = 0;
          if (json.Message != "出现错误。") {
            if (fileType == 1){ // 图片
              allcout = that.data.imgList.length;
              var images = "";
              for (var i = 0; i < that.data.imgList.length; i++) {
                var file = that.data.imgList[i].img;
                upfile = file;
                var Key = guid() + file.substring(file.lastIndexOf('.'))
                src = 'chatImage/newCase/' + json + '/' + Key
                cos.postObject({
                  Bucket: config.Bucket,
                  Region: config.Region,
                  Key: src,
                  FilePath: file
                }, requestCallback)
              }
            }else{ // 视频
              var file = that.data.videoSrc;
              allcout = 1;
              var Key = guid() + file.substring(file.lastIndexOf('.'))
              src = 'chatImage/newCase/' + json + '/' + Key
              cos.postObject({
                Bucket: config.Bucket,
                Region: config.Region,
                Key: src,
                FilePath: file
              }, requestCallback)
            }
          }
        })
      }
    })

  },
  skip() {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    console.log(prevPage);
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      nowpages: 1,
      caseList: []
    });
    prevPage.getlistdata();
    wx.navigateBack({
      delta: 2
    });
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var pages = getCurrentPages();
    var currentPage = pages[pages.length - 1];
    var url = currentPage.route; //当前页面url
    return {
      imageUrl: app.globalData.imgUrl + 'share.png',
      path: "/pages/validation/validation?share=true&url=" + url
    }
  },
  scan(e) {
    var url = e.currentTarget.dataset.src
    var urls = []
    this.data.imgList.forEach(function(value) {
      urls.push(value.img)
    })
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  }
})