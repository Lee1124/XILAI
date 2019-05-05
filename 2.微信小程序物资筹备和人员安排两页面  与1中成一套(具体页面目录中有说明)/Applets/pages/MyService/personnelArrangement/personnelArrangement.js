// pages/ personnelArrangement/ personnelArrangement.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    changeType1: '1',
    changeType2: '0',
    scrollViewHeight1: 'auto',
    scrollViewHeight2: 'auto',
    scrollView1Open: false,
    scrollView2Open: false,
    rotateDeg1: 0,
    rotateDeg2: 0,
    paddingBottom: 0,
    showDelTips: 0, //是否显示删除按钮  1显示  0不显示
    dataLength: 0,
    orderId: '',
    baseData: '', //基础数据
    editBtnIsShow: true,
    backIndexBtnBottom: 235,
    flag: true,
    contentData: []
  },

  // 切换1
  showToggle1() {
    if (this.data.scrollView1Open == true) {
      this.setData({
        scrollViewHeight1: 'auto',
        rotateDeg1: 0,
        scrollView1Open: false
      })
    } else {
      this.setData({
        scrollViewHeight1: 0,
        rotateDeg1: 180,
        scrollView1Open: true
      })
    }

  },

  // 切换2
  showToggle2() {
    if (this.data.scrollView2Open == true) {
      this.setData({
        scrollViewHeight2: 'auto',
        rotateDeg2: 0,
        scrollView2Open: false
      })
    } else {
      this.setData({
        scrollViewHeight2: 0,
        rotateDeg2: 180,
        scrollView2Open: true
      })
    }
  },

  // 收起1
  hideContent1() {
    this.setData({
      scrollViewHeight1: 0,
      rotateDeg1: 180,
      scrollView1Open: true
    })
  },

  // 收起2
  hideContent2() {
    this.setData({
      scrollViewHeight2: 0,
      rotateDeg2: 180,
      scrollView2Open: true
    })
  },

  // 切换编辑按钮
  showAdd() {
    this.setData({
      changeType1: '0',
      changeType2: '1',
      showDelTips: 1, //显示删除按钮
      paddingBottom: 10,
      backIndexBtnBottom: 140
    })

  },

  // 非编辑状态
  yesChangeLast() {
    this.setData({
      changeType1: '1',
      changeType2: '0',
      showDelTips: 0,
      backIndexBtnBottom: 235
    })
  },

  // 跳转修改页面
  goChangePage(e) {
    if (this.data.showDelTips == 1) {
      let orderid = this.data.orderid;
      let thisId = e.currentTarget.dataset.id; //所属Id
      let thissort = e.currentTarget.dataset.sort; //所属sort
      wx.navigateTo({
        url: '../changePersonnelArrangement/changePersonnelArrangement?orderid=' + orderid + '&&thisId=' + thisId + '&&thissort=' + thissort
      })
    }
  },

  // 跳转增加页面
  goToAddPage() {
    if (this.data.flag == true) {
      this.setData({
        flag: false
      })
      let orderid = this.data.orderid;
      wx.navigateTo({
        url: '../addPersonnelArrangement/addPersonnelArrangement?orderid=' + orderid
      })
    }
  },




  // 删除当前信息
  delThisNews(e) {
    let that = this;
    let orderid = this.data.orderid;
    let urlapi = app.globalData.url;
    let thisId = e.currentTarget.dataset.id; //所属Id
    let thissort = e.currentTarget.dataset.sort; //所属sort

    let requestUrl = urlapi + '/xlapi/FlowScheme/Operation/FlowScheme/DeleteRow';
    let data = {
      orderid: orderid,
      Sort: thissort, //当前位置
      type: '3',
      Id: thisId, //当前Id
      show: true
    }

    // 删除提示
    wx.showModal({
      title: '提示:',
      content: '确认删除?',
      success(res) {
        if (res.confirm) {
          console.log("确认删除")
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
              if (res.data.status == 'OK') {
                // let items = this.data.contentData.modelList;
                // for (var i = 0; i < items.length; i++) {
                //   if (items[i].Sort == thissort) {
                //     items.splice(i, 1)
                //   }
                // }
                // this.setData({
                //   contentData: this.data.contentData
                // })

                // 刷新数据
                that.onLoad({
                  orderId: that.data.orderid
                });

                if (that.data.contentData.modelList.length == 1) {
                  that.setData({
                    dataLength: 0
                  })
                } else {
                  that.setData({
                    dataLength: 1
                  })
                }
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 为了内页返回后刷新当前页面
  changeData: function(data) {
    this.onLoad(data);
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    // 获取初次数据
    let urlapi = app.globalData.url;
    // let orderid = app.globalData.orderId;
    let orderid = options.orderId;
    this.setData({
      orderid: orderid
    })

    // 初始化数据
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

    let requestUrl = urlapi + '/xlapi/FlowScheme/Operation/FlowScheme/GetFriendsInfamily';
    wx.request({
      url: requestUrl,
      method: 'POST',
      data: {
        orderid: orderid,
        type: 3
      },
      header: {
        Authorization: "url|1|2|xlhl|http://171.211.126.122:8092/||rolestate||0|action" //======================预用=================
      },
      success: res => {
        // console.log(res.data.data.modelList)
        // 设置动态标题
        var title = '';
        if (res.data.title.length > 5) {
          for (var i = 0; i < 5; i++) {
            title += res.data.title[i]
          }
          title = title + '...' + '人员安排'
        } else {
          title = res.data.title + '人员安排'
        }
        wx.setNavigationBarTitle({
          title: title,
        })

        if (res.data.data.modelList.length == 1) {
          this.setData({
            dataLength: 0
          })
        } else {
          this.setData({
            dataLength: 1
          })
        }

        this.setData({
          contentData: res.data.data,
          baseData: res.data,
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
    return {
      title: this.data.baseData.title,
      imageUrl: app.globalData.imgUrl + 'share.png',
      path: "/pages/validation/validation?share=true&url=" + url + "&isShare=true&orderId=" + this.data.orderid
    }
  }
})