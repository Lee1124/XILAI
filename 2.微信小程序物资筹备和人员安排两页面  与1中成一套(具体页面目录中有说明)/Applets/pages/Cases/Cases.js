// pages/Cases/Cases.js
//
var app = getApp();
var url = getApp().globalData.url; //服务器ip
var apiurl = getApp().globalData.url; //服务器ip
var common = require('../../utils/common.js')
var COS = require('../../lib/cos-wx-sdk-v5');
var config = require('../../lib/config');
import util from '../../utils/totalUtil'
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
// //引入图片预加载组件
// const ImgLoader = require('../img-loader/img-loader.js');
Page({
  /**      
   * 页面的初始数据
   */
  data: {
    searchKey: '', // 根据searchKey搜索
    curr_id: '',   // 当前被点击的视频
    ceshi: false,
    height: '',
    caseArr: [], //经典案例列表
    isFirstVideo: true, // 是否是第一个视频
    allPage: 0, //经典案例总条数
    nowpage: 1, //经典案例当前页面
    loading: false,
    caseList: [], //最新案例
    allpages: 0, //最新案例总条数
    nowpages: 1, //最新案例当前条数
    content: false,
    defaultimg: "../../images/loading.png",
    userToggle: false,
    active: 'new',
    isPermission: false, //是否有权限
    show: false,
    addPopup: false,
    width: 0,
    height: 0,
    isXinRen: false, //判断是不是新人页面
    // canIUse: wx.canIUse('cover-view')
  },
  // 回到顶部
  goToHeader(){
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    }
  },
  go_search(e){
    var searchKey = e.currentTarget.dataset.searchKey;
    var searchKey = this.data.searchKey;
    wx.redirectTo({
      url: '/pages/caseSearch/search?searchKey=' + searchKey
    })
  },
  // 视频播放
  videoPlay(e) {
    getApp().SaveLog(e.currentTarget.dataset.id, "1", "");
    this.setData({
      curr_id: e.currentTarget.dataset.id,
    })

    this.videoContext.play()
  },
  // 切换经典与最新案例
  togglepage(e) {
    var _this = this;
    let caseName = e.currentTarget.dataset.case;
    if (caseName == 'old') {
      this.setData({
        active: 'old'
      })
      if (this.data.allPage == 0) { 
        this.getlistdata();
      }
    } else {
      this.setData({
        active: 'new'
      })

      // if (this.data.allpages == 0) { //切换最新案例判断是否存在数据
      //   _this.IsPermission(_this);
      //   this.setData({
      //     searchKey: "",
      //     nowpage: 1,
      //     pageSize: 
      //   })
      //   this.getlistdata();
      // }
    }
  },
  addCase() {
    wx.showActionSheet({
      itemList: ['添加图片案例', '添加视频案例'],
      success: function(res) {
        console.log(res.tapIndex)
        wx.navigateTo({
          url: '../issue/issue?tag=' + res.tapIndex
        })
      },
      fail: function(res) {
        console.log(res.errMsg)
      }
    })
  },
  IsPermission(_this) {
    //验证是否有权限添加新案列
    wx.request({
      url: url + '/xlapi/Mini/Ins/Anli/IsPermission',
      method: "POST",
      data: {
        openId: app.globalData.openid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        _this.setData({
          isPermission: res.data.isPermission
        })
      }
    })
  },
  operation(e) {
    var index = e.currentTarget.dataset.index;
    var _this = this;
    wx.showActionSheet({
      itemList: ['编辑案列', '删除案列'],
      success: function(res) {
        if (res.tapIndex == 1) {
          wx.showModal({
            title: '提示',
            content: '是否确认删除',
            success: function(res) {
              if (res.confirm) {
                //删除案列
                _this.delMiniApp(index);
              }
            }
          })

        } else {
          wx.showModal({
            title: '提示',
            content: '功能建设中..',
            showCancel: false
          })
        }
      },
      fail: function(res) {
        console.log(res.errMsg)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      searchKey: options.key_ ? options.key_ : ''
    })

    console.log('Cases页面显示了')
    var that = this
    //赋值宽高
    // this.setData({
    //   // loading: true,
    //   width: app.globalData.phoneSize.width,
    //   height: app.globalData.phoneSize.height
    // })

    // app.getUserInfo().then(function(res){
    //判断是不是新人页面的案列
    console.log("开始执行案列界面的onload");
    if (options.user) {
      console.log('修改用户标题')
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
        isXinRen: true
      });
    } else if (options.admin) {
      console.log('修改合作标题');
      app.editadminTabbar();
    } 
    else if (options.JiHuiOrderUser)
    {
      app.editJiHuiOrderTabBar();
    }
    else {
      this.setData({
        isXinRen: false
      });
      console.log("第二个修改普通标题");
      if (!getApp().globalData.isAdminUser)
      {
        app.editTabBar();
      }
      else
      {
        app.editadminTabbar();
      }
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
          that.IsGetIcon(app.globalData.openid);
        }
      }
    })
    //获取案例
    that.getlistdata();
    that.IsPermission(that)
  },
  getlistdata: function(datatype) {
    var _this = this
    var postdata;
    if (_this.data.active == 'old') { //经典案例
      postdata = {
        currPage: _this.data.nowpage,
        pageSize: 18,
        type: 0
      }
      this.setData({
        // loading: true,
        nowpage: _this.data.nowpage + 1
      })
    } else {
      //最新案例
      postdata = {
        currPage: _this.data.nowpages,
        pageSize: 3,
        type: 1,
        key: _this.data.searchKey ? _this.data.searchKey.replace(' ', ',') : ''
      }
      this.setData({
        // loading: true,
        nowpages: _this.data.nowpages + 1
      })
      // if (this.data.allpages == 0) { //切换最新案例判断是否存在数据
        // _this.IsPermission(_this)
        // this.getlistdata();
      // }
    }
    wx.request({
      url: url + '/xlapi/Mini/Ins/Anli/getAnli',
      method: "POST",
      header: {
        'content-type': 'application/json',
        type: datatype
      },
      data: postdata,
      success: function(res) {
        if (_this.data.active == 'old') {
          for (var i = 0; i < res.data[0].length; i++) {
            var str = res.data[0][i].keys.replace(/\|/g, "  |  ")
            res.data[0][i].str = str
            res.data[0][i].loaded = false
          }
          _this.setData({
            caseArr: _this.data.caseArr.concat(res.data[0]),
            allPage: res.data[1] / 3,
            // loading: false 
          });
        } else {
          var newList = res.data[0];
          for (var i = 0; i < newList.length; i++) {
            newList[i].index = i;
            newList[i].userToggle = _this.data.userToggle
            if (!newList[i].isvideo) {
              //图片需要分割数组
              var str = newList[i].img.split("|");
              newList[i].imglist = str
            }else{
              if(_this.data.isFirstVideo){
                newList[i].isFirstVideo = true
                console.log(newList[i]);
                _this.setData({
                  isFirstVideo: false 
                })
              }else{
                newList[i].isFirstVideo = false
              }
            }
          }
          
          _this.setData({
            caseList: _this.data.caseList.concat(newList),
            allpages: res.data[1] / 3,
            // loading: false
          });

          console.log(newList, _this.data.caseList.length);
        }
      }
    })


  },
  IsGetIcon: function(openId) {
    var that = this;
    wx.request({
      url: app.globalData.url + '/xlapi/Mini/Ins/Anli/IsGet?openid=' + openId,
      method: "GET",
      success: function(res) {
        if (!res.data) {
          that.setData({
            userToggle: true
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    //创建视频上下文对象
    this.videoContext = wx.createVideoContext('myVideo')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log('Cases页面显示了')
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

    var _this = this
    if (_this.data.active == "old") {
      if ((this.data.nowpage - 1) < this.data.allPage) {

        _this.getlistdata();
      } else {
        wx.showToast({ //如果全部加载完成了也弹一个框
          title: '没有更多了',
          icon: 'none',
          duration: 300
        });
      }
    } else {
      if ((this.data.nowpages - 1) < this.data.allpages) {

        _this.getlistdata();
      } else {
        wx.showToast({ //如果全部加载完成了也弹一个框
          title: '没有更多了',
          icon: 'none',
          duration: 300
        });
      }

    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var pages = getCurrentPages();
    var currentPage = pages[pages.length - 1];
    var url = currentPage.route; //当前页面url
    //path: "/pages/validation/validation?share=true&url=" + url,
    console.log("app.globalData", app.globalData);
    return {
      title: app.globalData.userInfo.nickName + '带你见证最美的爱情',
      imageUrl: app.globalData.imgUrl + 'share.png',
      path: 'pages/validation/validation?share=true&shareopenid=' + getApp().globalData.openid + '&url=' + url
    }
  },
  myCatchTouch() {
    return;
  },
  loadimg(e) {
    var url = e.currentTarget.dataset.url.replace("-ys.", ".");
    var urls = e.currentTarget.dataset.urls;
    var newUrls = []; // 新的urls
    for (var i = 0; i < urls.length; i++) {
      var item = urls[i].replace("-ys.", ".");
      newUrls.push(item);
    }
    if (urls != undefined) {
       //保存图片
      var anliid = e.currentTarget.dataset.anliid;
      console.log("打开案例id:"+anliid);
      getApp().SaveLog(anliid, "1", "");
      wx.previewImage({
        current: url, // 当前显示图片的http链接
        urls: newUrls // 需要预览的图片http链接列表
      })
    }
  },
  zixun(e) {
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index;
    var isvideo = this.data.caseList[index].isvideo;
    // var img = this.data.caseList[index].imglist[0];
    
    // var parameter;
    // if (img!="")
    // {
    //   var temp = img.split('?')[1].replace('&', ',');
    //   for(var i=0;i<6;i++)
    //   {
    //     temp = temp.replace('&', ',');
    //   }
    //   parameter = temp;
    //   img = img.split('?')[0];
    // }
    wx.navigateTo({
      url: '/pages/message/message?ids=' + id + '&isvideo=' + isvideo,
    })
  },
  getUserInfo(e) {
    console.log("开始导入数据");
    common.getUserInfo(e, this);
  },
  //删除案列
  delMiniApp(index) {
    var miniApp = this.data.caseList[index];
    var _this = this;
    //先删除案列
    wx.request({
      url: url + '/xlapi/Mini/Ins/Anli/delAnli',
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        'id': miniApp.id
      },
      success: function(res) {
        console.log(res.data);
        if (!res.data) {
          wx.showModal({
            title: '提示',
            content: '删除失败',
            showCancel: false
          })
          return;
        }
        for (var i = 0; i < miniApp.imglist.length; i++) {
          var url = miniApp.imglist[i].split("?")[0];
          var img = miniApp.imglist[i].split("?")[0].split('com')[1].substring(1);
          cos.deleteObject({
            Bucket: config.Bucket,
            Region: config.Region,
            // Key: 'chatImage/' + getApp().globalData.openid||123+ '/' + Key,
            Key: img,
            FilePath: url,
          }, function(err, data) {})
        }
        var temp = _this.data.caseList;
        temp.splice(index, 1);
        _this.setData({
          caseList: temp
        });
        _this.getlistdata();
      }
    })



  },
  ToSkip: function(e) {
    console.log('点击事件', e);
    if (e.currentTarget.dataset.url == '') {
      wx.showModal({
        title: '提示',
        content: '功能暂未开放，敬请期待！',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {

          }
        }
      })
    }

  }
})