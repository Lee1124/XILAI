// pages/Administrators/scanStatistic/scanStatistic.js
var app = getApp();
const now = new Date();
Page({
  data: {
    adminuser: '',
    active: 'doStatistic',
    current: {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate()
    },
    today: '',
    seven: '',
    thirty: '',
    phoneNumber: '',        // 联系电话
    identity_: '',          // 访客身份
    currentSelect: 'seven',
    currentDay: 'seven',
    startDate: '',          //访问统计开始时间
    endDate: '',            //访问统计结束时间
    doStart: '',            //操作统计开始时间
    doEnd: '',              //操作统计结束时间
    branchArray: [],
    index: 0,
    typeArray: [],
    typeIndex: 0,
    userList: [],
    usertotal: '',
    scanList: [],
    total: '',
    visittotal: '',
    visitList: [],
    query_pageIndex: 1,
    visitquery_pageIndex: 1,
    userquery_pageIndex: 1,
    pageCount: 15
  },
  togglepage(e) {
    this.setData({
      identity_: '',
      phoneNumber: '',
      query_pageIndex: 1,
      visitquery_pageIndex: 1,
      userquery_pageIndex: 1
    })
    let caseName = e.currentTarget.dataset.case;
    if (caseName == 'recentScan') {
      this.setData({
        active: 'recentScan'
      })
      this.recentScan()
    } else if (caseName == 'visitStatistic') {
      this.setData({
        active: 'visitStatistic'
      })
      this.visitList()
    } else {
      this.setData({
        active: 'doStatistic'
      })
      this.queryUserList()
    }
  },
  toggleselect(e) {
    let caseName = e.currentTarget.dataset.case;
    if (caseName == 'seven') {
      this.setData({
        currentSelect: 'seven',
        doStart: this.data.seven,
        doEnd: this.data.today
      })
      this.queryUserList()
    } else {
      this.setData({
        currentSelect: 'thirty',
        doStart: this.data.thirty,
        doEnd: this.data.today
      })
      this.queryUserList()
    }
  },
  toggleselect2(e) {
    let caseName = e.currentTarget.dataset.case;
    if (caseName == 'seven') {
      this.setData({
        currentDay: 'seven',
        startDate: this.data.seven,
        endDate: this.data.today
      })
      this.visitList()
    } else {
      this.setData({
        currentDay: 'thirty',
        startDate: this.data.thirty,
        endDate: this.data.today
      })
      this.visitList()
    }
  },
  // 筛选电话号码
  togglePhoneNumber: function(e){
    var caseName = e.currentTarget.dataset.case;
    this.setData({
      phoneNumber: caseName,
      query_pageIndex: 1,
      visitquery_pageIndex: 1,
      userquery_pageIndex: 1
    })
    console.log("caseName", caseName);
    if (this.data.active == "recentScan") this.recentScan()
    if (this.data.active == "visitStatistic") this.visitList()
  },
  // 筛选身份
  toggleIdentity: function(e) {
    var caseName = e.currentTarget.dataset.case;
    this.setData({
      identity_: caseName,
      query_pageIndex: 1,
      visitquery_pageIndex: 1,
      userquery_pageIndex: 1
    })
    console.log("caseName", caseName);
    if (this.data.active == "recentScan") this.recentScan()
    if (this.data.active == "visitStatistic") this.visitList()
    
  },
  startDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      startDate: e.detail.value,
      currentSelect: ''
    })
    this.visitList()
  },
  endDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      endDate: e.detail.value,
      currentSelect: ''
    })
    this.visitList()
  },
  startChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      doStart: e.detail.value,
      currentSelect: ''
    })
    this.queryUserList()
  },
  endChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      doEnd: e.detail.value,
      currentSelect: ''
    })
    this.queryUserList()
  },
  branchChange: function(e) {
    console.log('picker发送选择改变，携带值为', e)
    this.setData({
      index: e.detail.value
    })
    this.queryUserList()
  },
  typeChange: function(e) {
    console.log('picker发送选择改变，携带值为', e)
    this.setData({
      typeIndex: e.detail.value
    })
    this.queryUserList()
  },
  queryList() {
    var this_1 = this;
    var userid = this.data.adminuser.userdata.userid;
    wx.request({
      url: app.globalData.url + 'xlapi/Mini/Ins/Partners/RiZhiSelectInfo',
      method: "POST",
      data: {
        UserId: userid
      },
      success: function(res) {
        console.log(res)
        this_1.setData({
          branchArray: res.data.branchData,
          typeArray: res.data.typeData
        })
        this_1.queryUserList()
      }
    })
  },
  recentScan() {
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    var this_1 = this;
    wx.request({
      url: app.globalData.url + 'xlapi/Mini/Ins/Partners/GetRecentlyIntoRecord',
      method: "POST",
      data: {
        PageIndex: this_1.data.query_pageIndex,
        PageSize: this_1.data.pageCount,
        FKSF: this_1.data.identity_,
        YWDH: this_1.data.phoneNumber
      },
      success: function(res) {
        console.log(res)
        if (this_1.data.query_pageIndex > 1) {
          this_1.setData({
            scanList: [
              ...this_1.data.scanList,
              ...res.data.data
            ],
            total: res.data.allcount
          });
          
        } else {
          this_1.setData({
            scanList: res.data.data,
            total: res.data.allcount
          });
        }
        wx.hideLoading()
        // wx.showModal({
        //   title: '数据条数-提示',
        //   content: "-"+res.data.data.length+"-",
        //   success(res) {
        //   }
        // })
      }
    })
  },
  visitList() {
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    var this_1 = this;
    wx.request({
      url: app.globalData.url + 'xlapi/Mini/Ins/Partners/AccessStatistical',
      data: {
        PageIndex: this_1.data.visitquery_pageIndex,
        PageSize: this_1.data.pageCount,
        StartDate: this_1.data.startDate,
        EndDate: this_1.data.endDate,
        FKSF: this_1.data.identity_,
        YWDH: this_1.data.phoneNumber
      },
      method: "POST",
      success: function(res) {
        if (this_1.data.visitquery_pageIndex > 1) {
          this_1.setData({
            visitList: [
              ...this_1.data.visitList,
              ...res.data.data
            ],
            visittotal: res.data.allcount
          });
        } else {
          console.log("res.data.data", res.data.data);
          this_1.setData({
            visitList: res.data.data,
            visittotal: res.data.allcount
          });
        }
        wx.hideLoading()
        // wx.showModal({
        //   title: '数据条数-提示',
        //   content: "-" + res.data.data.length + "-",
        //   success(res) {
        //   }
        // })
      }
    })
  },
  queryUserList() {
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    var this_1 = this;
    console.log("this_1.data.branchArray", this_1.data.branchArray, this_1.data.index);
    wx.request({
      url: app.globalData.url + 'xlapi/Mini/Ins/Partners/OperatingStatistics',
      data: {
        PageIndex: this_1.data.userquery_pageIndex,
        PageSize: this_1.data.pageCount,
        StartDate: this_1.data.doStart ? this_1.data.doStart : this_1.data.today,
        EndDate: this_1.data.doEnd ? this_1.data.doEnd : this_1.data.seven,
        ChoosBranchId: this_1.data.branchArray[this_1.data.index].Id,
        ChoosTypeId: this_1.data.typeArray[this_1.data.typeIndex].Id
      },
      method: "POST",
      success: function(res) {
        console.log(res)
        if (this_1.data.userquery_pageIndex > 1) {
          this_1.setData({
            userList: [
              ...this_1.data.userList,
              ...res.data.data
            ],
            usertotal: res.data.allcount
          });
          console.log(this_1.data)
        } else {
          this_1.setData({
            userList: res.data.data,
            usertotal: res.data.allcount
          });
        }
        wx.hideLoading()
        // wx.showModal({
        //   title: '数据条数-提示',
        //   content: "-" + res.data.data.length + "-",
        //   success(res) {
        //   }
        // })
      }
    })
  },
  num(s) {
    return s < 10 ? '0' + s : s;
  },
  // 跳转到人员详情
  go_personInfo(e) {
    var openId_ = e.currentTarget.dataset.openid
    var sf = e.currentTarget.dataset.sf;
    wx.navigateTo({
      url: '/pages/personInfo/personInfo?o_id=' + openId_ + "&sf=" + sf
    })
  },
  onLoad: function(options) {
    this.setData({
      'adminuser': JSON.parse(wx.getStorageSync('adminuser'))
    })
    let today = this.data.current.year + '-' + this.data.current.month + '-' + this.data.current.day;
    console.log(today)
    var date1 = new Date();
    var date2 = new Date(date1);
    date2.setDate(date1.getDate() - 7);
    let seven = date2.getFullYear() + "-" + this.num((date2.getMonth() + 1)) + "-" + this.num(date2.getDate());
    var date3 = new Date(date1);
    date3.setDate(date1.getDate() - 30);
    let thirty = date3.getFullYear() + "-" + this.num((date3.getMonth() + 1)) + "-" + this.num(date3.getDate());
    console.log(seven)
    this.setData({
      today: today,
      seven: seven,
      thirty: thirty,
      startDate: seven, //访问统计开始时间
      endDate: today, //访问统计结束时间
      doStart: seven, //操作统计开始时间
      doEnd: today, //操作统计结束时间
    })
    this.queryList()
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
      'adminuser': JSON.parse(wx.getStorageSync('adminuser'))
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
    var this_1 = this;
    if (this_1.data.active == 'recentScan') {
      if (this_1.data.total > (this_1.data.query_pageIndex * this_1.data.pageCount)) {
        var pageIndex = this_1.data.query_pageIndex + 1;
        this_1.setData({
          query_pageIndex: pageIndex
        })
        this_1.recentScan();
      } else {
        wx.showToast({
          title: '没有更多了',
          icon: 'none',
          duration: 500
        });
      }
    }else if (this_1.data.active == 'visitStatistic') {
      if (this_1.data.visittotal > (this_1.data.visitquery_pageIndex * this_1.data.pageCount)) {
        var pageIndex = this_1.data.visitquery_pageIndex + 1
        this_1.setData({
          visitquery_pageIndex: pageIndex
        })
        this_1.visitList();
      } else {
        wx.showToast({
          title: '没有更多了',
          icon: 'none',
          duration: 500
        });
      }
    } else {
      if (this_1.data.usertotal > (this_1.data.userquery_pageIndex * this_1.data.pageCount)) {
        var pageIndex = this_1.data.userquery_pageIndex + 1
        console.log("pageIndex_", pageIndex);
        this_1.setData({
          userquery_pageIndex: pageIndex
        })
        this_1.userLsit();
      } else {
        wx.showToast({
          title: '没有更多了',
          icon: 'none',
          duration: 500
        });
      }
    }
  }
})