// pages/materialManage/materialManage.js
let app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    changeType1: '1',
    changeType2: '0',
    delBtnWidth: 130, //删除按钮的宽度  单位为rpx
    isScroll: false,
    yesEdit: 0,
    isShowTips: 0,
    zt2: 0,
    orderid: '',
    backIndexBtnBottom: 235,
    baseData: [], //基础数据
    editBtnIsShow: true, //是否显示编辑按钮
    startX: 0,
    flag: true,
    titleData: [{
        titleName: '新娘家(酒店)物资准备',
        text1: "收起",
        windowHeight: 'auto',
        data_id: '0',
        startData: []
      },
      {
        titleName: '新郎家(新房)物资准备',
        text1: "展开",
        windowHeight: 0,
        data_id: '1',
        startData: []
      },
      {
        titleName: '宴会物资准备',
        text1: "展开",
        windowHeight: 0,
        data_id: '2',
        startData: []
      },
      {
        titleName: '喜来婚礼提供物资',
        text1: "展开",
        windowHeight: 0,
        data_id: '3',
        startData: []
      },
    ],
  },

  // 切换
  showToggle(e) {
    // console.log("进来了")
    let index_id = e.currentTarget.dataset.id;
    let titleData_height = 'titleData[' + index_id + '].windowHeight'; //打开状态
    let titleData_text1 = 'titleData[' + index_id + '].text1' //展开和收起文字
    if (e.currentTarget.dataset.zt == 0) {
      if (this.data.zt2 == 1) {
        this.setData({
          [titleData_height]: 'auto',
          [titleData_text1]: '收起',
        })
      }
    } else {
      this.setData({
        [titleData_height]: 0,
        [titleData_text1]: '展开',
      })
      // 收起的时候将删除全部重置位置
      for (var index in this.data.titleData[0].startData) {
        var item = this.data.titleData[0].startData[index]
        item.right = 0
      }
      // 将所有right全重置为0
      for (var index in this.data.titleData[1].startData) {
        var item = this.data.titleData[1].startData[index]
        item.right = 0
      }
      // 将所有right全重置为0
      for (var index in this.data.titleData[2].startData) {
        var item = this.data.titleData[2].startData[index]
        item.right = 0
      }
      // 将所有right全重置为0
      for (var index in this.data.titleData[3].startData) {
        var item = this.data.titleData[3].startData[index]
        item.right = 0
      }
      this.setData({
        titleData: this.data.titleData,
      })
    }
  },

  // 切换编辑按钮
  showAdd() {
    let that = this;
    this.setData({
      changeType1: '0',
      changeType2: '1',
      yesEdit: 1, //两个编辑按钮出现时将状态置为1
      isShowTips: 1, //两个编辑按钮出现时将状态置为1
      backIndexBtnBottom: 140
    })

    // 定时5s后关闭删除提示
    setTimeout(function() {
      that.setData({
        isShowTips: 0
      })
    }, 5000)
  },

  // 手动关闭删除提示
  closeTips() {
    this.setData({
      isShowTips: 0,
    })
  },

  // 开始滑动时
  drawStart: function(e) {
    if (this.data.yesEdit == 1) {
      var touch = e.touches[0];
      // 将所有right全重置为0
      for (var index in this.data.titleData[0].startData) {
        var item = this.data.titleData[0].startData[index]
        item.right = 0
      }
      // 将所有right全重置为0
      for (var index in this.data.titleData[1].startData) {
        var item = this.data.titleData[1].startData[index]
        item.right = 0
      }
      // 将所有right全重置为0
      for (var index in this.data.titleData[2].startData) {
        var item = this.data.titleData[2].startData[index]
        item.right = 0
      }
      // 将所有right全重置为0
      for (var index in this.data.titleData[3].startData) {
        var item = this.data.titleData[3].startData[index]
        item.right = 0
      }
      if (e.touches.length == 1) {
        this.setData({
          startX: e.touches[0].pageX
        })
      }
    }
  },

  // 滑动过程中
  drawMove: function(e) {
    console.log(e.touches.length)
    if (this.data.yesEdit == 1) {
      let index0; //定义父级索引
      let index = e.currentTarget.dataset.index; //当前索引
      let thisName = e.currentTarget.dataset.name; //当前区块
      if (thisName == "新娘家（酒店）物资准备") {
        index0 = 0;
      } else if (thisName == "新郎（新房）家物资准备") {
        index0 = 1;
      } else if (thisName == "宴会物资准备") {
        index0 = 2;
      } else if (thisName == "喜来婚礼提供物资") {
        index0 = 3;
      }
      var item = this.data.titleData[index0].startData[index];
      if (e.touches.length == 1) {
        //手指移动时水平方向位置        
        var moveX = e.touches[0].clientX;
        //手指起始点位置与移动期间的差值  
        var disX = this.data.startX - moveX;
        var delBtnWidth = this.data.delBtnWidth;
        if (disX == 0 || disX < 0) { //如果移动距离小于等于0，文本层位置不变  
          item.right = 0 + 'px';
          this.setData({
            titleData: this.data.titleData
          })

        } else if (disX > 0) { //移动距离大于0，文本层left值等于手指移动距离          
          item.right = disX / 2 + 'px';
          this.setData({
            titleData: this.data.titleData
          })
          if (disX >= delBtnWidth) {
            //控制手指移动距离最大值为删除按钮的宽度  
            item.right = delBtnWidth / 2 + 'px';
            this.setData({
              titleData: this.data.titleData
            })
          }
        }
      }
    }
  },
  // 滑动结束
  drawEnd: function(e) {
    if (this.data.yesEdit == 1) {
      let index0; //定义父级索引
      let index = e.currentTarget.dataset.index; //当前索引
      let thisName = e.currentTarget.dataset.name; //当前区块
      if (thisName == "新娘家（酒店）物资准备") {
        index0 = 0;
      } else if (thisName == "新郎（新房）家物资准备") {
        index0 = 1;
      } else if (thisName == "宴会物资准备") {
        index0 = 2;
      } else if (thisName == "喜来婚礼提供物资") {
        index0 = 3;
      }
      var item = this.data.titleData[index0].startData[index];
      if (e.changedTouches.length == 1) {
        //手指移动结束后水平位置  
        var endX = e.changedTouches[0].clientX;
        //触摸开始与结束，手指移动的距离  
        var disX = this.data.startX - endX;
        var delBtnWidth = this.data.delBtnWidth;
        //如果距离小于删除按钮的1/2，不显示删除按钮  
        if (disX > delBtnWidth / 2) {
          item.right = delBtnWidth / 2 + "px"
          this.setData({
            titleData: this.data.titleData
          })
        } else {
          item.right = 0
          this.setData({
            titleData: this.data.titleData
          })
        }
      }
    }
  },

  // 删除某行数据
  delItem(e) {
    let urlapi = app.globalData.url;
    let orderid = this.data.orderid;
    let thisName = e.currentTarget.dataset.name; //所属区块
    let thisId = e.currentTarget.dataset.id; //所属Id
    let thissort = e.currentTarget.dataset.sort; //所属sort

    let index0; //定义父级索引
    let index = e.currentTarget.dataset.index; //当前索引
    if (thisName == "新娘家（酒店）物资准备") {
      index0 = 0;
    } else if (thisName == "新郎（新房）家物资准备") {
      index0 = 1;
    } else if (thisName == "宴会物资准备") {
      index0 = 2;
    } else if (thisName == "喜来婚礼提供物资") {
      index0 = 3;
    }
    var items = this.data.titleData[index0].startData;

    let requestUrl = urlapi + '/xlapi/FlowScheme/Operation/FlowScheme/DeleteRow';
    let data = {
      orderid: orderid,
      Sort: thissort, //当前位置
      type: '2',
      FlowPath: thisName, //所属区块
      Id: thisId, //当前Id
      show: true
    }
    wx.request({
      url: requestUrl,
      method: 'POST',
      data: {
        modelJson: data
      },
      header: {
        Authorization: "url|1|2|xlhl|http://171.211.126.122:8092/||rolestate||0|action" //======================预用=================
      },
      success: res => {
        this.onLoad({
          orderId: this.data.orderid
        })

      }
    })
  },

  // 跳转当前修改内容的页面
  goChangePage(e) {
    if (this.data.yesEdit == 1) {
      let orderid = this.data.orderid;
      let thisId = e.currentTarget.dataset.id; //所属Id
      let thissort = e.currentTarget.dataset.sort; //所属sort
      let thisName = e.currentTarget.dataset.name; //所属区块
      let index0; //定义父级索引
      let index = e.currentTarget.dataset.index; //当前索引
      if (thisName == "新娘家（酒店）物资准备") {
        index0 = 0;
      } else if (thisName == "新郎（新房）家物资准备") {
        index0 = 1;
      } else if (thisName == "宴会物资准备") {
        index0 = 2;
      } else if (thisName == "喜来婚礼提供物资") {
        index0 = 3;
      }
      wx.navigateTo({
        url: '../changeMaterialManage/changeMaterialManage?orderid=' + orderid + '&&thisId=' + thisId + '&&thissort=' + thissort + '&&index0=' + index0
      })
    }
  },

  // 跳转增加页面
  goToAddPage() {
    if (this.data.flag == true) {
      this.setData({
        flag:false
      })
      let orderid = this.data.orderid;
      wx.navigateTo({
        url: '../addMaterialManage/addMaterialManage?orderid=' + orderid
      })
    }
  },

  // 关闭编辑
  yesChangeLast(e) {
    // 将所有right全重置为0
    for (var index in this.data.titleData[0].startData) {
      var item = this.data.titleData[0].startData[index]
      item.right = 0
    }
    // 将所有right全重置为0
    for (var index in this.data.titleData[1].startData) {
      var item = this.data.titleData[1].startData[index]
      item.right = 0
    }
    // 将所有right全重置为0
    for (var index in this.data.titleData[2].startData) {
      var item = this.data.titleData[2].startData[index]
      item.right = 0
    }
    // 将所有right全重置为0
    for (var index in this.data.titleData[3].startData) {
      var item = this.data.titleData[3].startData[index]
      item.right = 0
    }

    this.setData({
      changeType1: '1',
      changeType2: '0',
      yesEdit: 0,
      isShowTips: 0,
      titleData: this.data.titleData,
      backIndexBtnBottom: 235
    })

  },
  // // 点击返回首页
  // backIndexPage(){
  //   wx.redirectTo({
  //     url: '/pages/Cases/Cases'
  //   })
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options.orderId)
    // console.log(options.isShare)
    var that = this;
    let urlapi = app.globalData.url;
    let orderid = options.orderId;
    this.setData({
      orderid: orderid
    })

    // // 初始化数据
    if (options.orderId == undefined || options.orderId == 'undefined') {
      wx.showModal({
        title: '提示',
        content: '参数错误',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            that.backIndex()
          }
        }
      })
      return false
    }


    //判断是不是转发进入
    if (options.isShare == "true") {
      this.setData({
        // isShare: true,
        editBtnIsShow: false
      });
      app.getUserInfo().then(function(res) {
        // 获取当前用户状态
        wx.request({
          url: getApp().globalData.url + '/xlapi/Mini/Ins/Partners/GetUserOrderIdentity',
          method: 'POST',
          data: {
            OpenId: getApp().globalData.openid,
            OrderId: options.orderId
          },
          success: function(res) {
            console.log("当前用户状态,hahahaahaa", res);
            // 返回   0游客  1员工  2客户
            console.log("12121212121212", res.data);
            console.log("身份显示===============", res.data.data);
            if (res.data.data == 0) {
              that.setData({
                editBtnIsShow: false
              });
            }
            if (res.data.data == 1) {
              that.setData({
                editBtnIsShow: true
              });
            }
            if (res.data.data == 2) {
              that.setData({
                editBtnIsShow: true
              });
            }
            console.log("editBtnIsShow状态显示===============", that.data.editBtnIsShow);
          }
        })
        //身份验证
        wx.request({
          url: getApp().globalData.url + '/xlapi/Authentication/AppletUser/Authentication/OpenIdVerify',
          method: 'POST',
          data: {
            openId: getApp().globalData.openid,
            orderId: options.orderId
          },
          success: function(res) {
            console.log("hahahaahaahahahaahaa---");
            console.log(res.data);
            // 处理黑名单用户的跳转
            if (res.data.status == "OK" && res.data.ishmd) {
              wx.redirectTo({
                url: "/pages/Blacklist/Blacklist"
              })
              return false;
            }
            if (res.data.code == "404") {
              // wx.redirectTo({
              //   url: '/pages/Login/Login'
              // })
              that.setData({
                editBtnIsShow: false,
              });
              return false;
            }
            // 是否是-预约成功的游客
            if (res.data.status == "OK" && res.data.yymodel.status) {
              app.globalData.isYuYueOk = true;
              var data_ = res.data.yymodel.branchdata;
              app.globalData.dianpuName = data_.name;
              app.globalData.dianpuPhone = data_.tel;
              app.globalData.youkeName = res.data.yymodel.userda;
              wx.redirectTo({
                url: '/pages/Login/Login'
              })
              return false;
            }
            //验证完成
            that.setData({
              editBtnIsShow: true,
            });
          }
        })
      });
    }
    // 41419de0-30b8-45e1-a32e-72c4dbf9c166

    let requestUrl = urlapi + '/xlapi/FlowScheme/Operation/FlowScheme/GetPreparMaterial';
    wx.request({
      url: requestUrl,
      method: 'POST',
      data: {
        orderid: orderid,
        type: 2
      },
      header: {
        Authorization: "url|1|2|xlhl|http://171.211.126.122:8092/||rolestate||0|action" //======================预用=================
      },
      success: res => {
        // console.log(res.data)
        // console.log(res.data.title)
        // console.log(res.data.title.length)
        var title = '';
        if (res.data.title.length > 5) {
          for (var i = 0; i < 5; i++) {
            title += res.data.title[i]
          }
          title = title + '...' + '物资筹备'
        } else {
          title = res.data.title + '物资筹备'
        }

        wx.setNavigationBarTitle({
          title: title,
        })

        for (var i = 0; i < res.data.data.modelList1.length; i++) {
          res.data.data.modelList1[i].Personnel = res.data.data.modelList1[i].Personnel.replace(/[ ]/g, ""); //上--去除空格
          res.data.data.modelList1[i].Personnel = res.data.data.modelList1[i].Personnel.replace(/[\r\n]/g, ""); //上--去除回车
          res.data.data.modelList1[i].Article = res.data.data.modelList1[i].Article.replace(/[ ]/g, ""); //下--去除空格
          res.data.data.modelList1[i].Article = res.data.data.modelList1[i].Article.replace(/[\r\n]/g, ""); //下--去除回车
        }
        let startData01 = 'titleData[0].startData';
        let startData02 = 'titleData[1].startData';
        let startData03 = 'titleData[2].startData';
        let startData04 = 'titleData[3].startData';
        this.setData({
          [startData01]: res.data.data.modelList1,
          [startData02]: res.data.data.modelList2,
          [startData03]: res.data.data.modelList3,
          [startData04]: res.data.data.modelList4,
          zt2: 1,
          baseData: res.data
        })
      }
    })
  },

  //返回首页
  backIndex(e) {
    wx.redirectTo({
      url: '/pages/validation/validation'
    })
  },

  // 为了内页返回后刷新当前页面
  changeData: function(data) {
    this.onLoad(data);
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
    this.setData({
      flag: true
    })
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
    console.log(url)
    return {
      title: this.data.baseData.title,
      imageUrl: app.globalData.imgUrl + 'share.png',
      path: "/pages/validation/validation?share=true&url=" + url + "&isShare=true&orderId=" + this.data.orderid
    }
  }
})