// pages/Administrators/pointList/pointList.js
var app = getApp();
const now = new Date();
Page({
  data: {
    hidden: false,
    adminuser: '',
    active: 'audit',
    branchArray: [],
    index: 0,
    balance: 0,
    startDate: '',
    endDate: '',
    current: {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate()
    },
    today: '',
    auditList: [],
    auditPage: 1,
    auditTotal: '',
    pageCount: 15,
    recordList: [],
    recordTotal: '',
    noWithdrawList:[],
    listTotal:''
  },
  startDateChange: function(e) {
    this.setData({
      startDate: e.detail.value,
    })
    this.queryRecordList()
  },
  endDateChange: function(e) {
    this.setData({
      endDate: e.detail.value,
    })
    this.queryRecordList()
  },
  togglepage(e) {
    let caseName = e.currentTarget.dataset.case;
    if (caseName == 'audit') {
      this.setData({
        active: 'audit'
      })
      this.queryAduitList()
    } else if (caseName == 'record') {
      this.setData({
        active: 'record'
      })
      this.queryRecordList()
    } else {
      this.setData({
        active: 'nowithdraw'
      })
      this.noWithdrawList()
    }
  },
  goRecharge() {
    wx.navigateTo({
      url: '../recharge/recharge?branid=' + this.data.branchArray[this.data.index].Id,
    })
  },
  goWithDt(e) {
    console.log(e)
    let from = e.currentTarget.dataset.from
    let id = e.currentTarget.dataset.id
    let money = e.currentTarget.dataset.money
    if (from == "record") {
      wx.navigateTo({
        url: '../withdrawDt/withdrawDt?id=' + id + '&from=record',
      })
    } else {
      if (money > this.data.balance) {
        wx.showToast({
          title: '该店余额不足,请先充值再审核!',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      wx.navigateTo({
        url: '../withdrawDt/withdrawDt?id=' + id + '&branid=' + this.data.branchArray[this.data.index].Id,
      })
    }
  },
  num(s) {
    return s < 10 ? '0' + s : s;
  },
  typeChange: function(e) {
    this.setData({
      index: e.detail.value
    })
    this.getBalance()
    if (this.data.active == "audit") {
      this.queryAduitList()
    } else if (this.data.active == "record") {
      this.queryRecordList()
    } else{
      this.noWithdrawList()
    }
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
        this_1.setData({
          branchArray: res.data.branchData,
        })
        this_1.getBalance()
        this_1.queryAduitList()
      }
    })
  },
  getBalance() {
    var this_1 = this;
    wx.request({
      url: app.globalData.url + 'xlapi/SysManage/Hotel/Hotel/retInteAccount?branid=' + this.data.branchArray[this.data.index].Id,
      method: "GET",
      success: function(res) {
        this_1.setData({
          balance: res.data.integral,
        })
      }
    })
  },
  queryAduitList() {
    var this_1 = this;
    wx.request({
      url: app.globalData.url + 'xlapi/SysManage/Hotel/Hotel/retCashList',
      method: "POST",
      data: {
        branid: this.data.branchArray[this.data.index].Id,
        page: this.data.auditPage,
        size: 10
      },
      success: function(res) {
        this_1.setData({
          hidden: true,
          auditList: res.data.data,
          auditTotal: res.data.count
        })
      }
    })
  },
  queryRecordList() {
    var this_1 = this;
    wx.request({
      url: app.globalData.url + 'xlapi/SysManage/Hotel/Hotel/RetConFlows',
      method: "POST",
      data: {
        branid: this_1.data.branchArray[this_1.data.index].Id,
        stime: this_1.data.startDate,
        etime: this_1.data.endDate
      },
      success: function(res) {
        this_1.setData({
          recordList: res.data,
        })
      }
    })
  },
  noWithdrawList(){
    var this_1 = this;
    wx.request({
      url: app.globalData.url + 'xlapi/SysManage/Hotel/Hotel/RetUserInte?branid=' + this_1.data.branchArray[this_1.data.index].Id,
      method: "GET",
      success: function (res) {
        this_1.setData({
          noWithdrawList: res.data.data,
          listTotal: res.data.all
        })
      }
    })
  },
  onLoad: function(options) {
    this.setData({
      'adminuser': JSON.parse(wx.getStorageSync('adminuser'))
    })
    let today = this.data.current.year + '-' + this.num(this.data.current.month) + '-' + this.num(this.data.current.day);
    var date1 = new Date();
    var date2 = new Date(date1);
    date2.setDate(date1.getDate() - 30);
    let thirty = date2.getFullYear() + "-" + this.num((date2.getMonth() + 1)) + "-" + this.num(date2.getDate());
    this.setData({
      today: today,
      thirty: thirty,
      startDate: thirty, //访问统计开始时间
      endDate: today, //访问统计结束时间
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
    this.queryList()
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
    if (this_1.data.active == 'audit') {
      if (this_1.data.auditTotal > (this_1.data.auditPage * this_1.data.pageCount)) {
        var pageIndex = this_1.data.auditPage + 1;
        this_1.setData({
          auditPage: pageIndex
        })
        this_1.queryAduitList();
      } else {
        wx.showToast({
          title: '没有更多了',
          icon: 'none',
          duration: 500
        });
      }
    }
    // } else if (this_1.data.active == 'visitStatistic') {
    //   if (this_1.data.visittotal > (this_1.data.visitquery_pageIndex * this_1.data.pageCount)) {
    //     var pageIndex = this_1.data.visitquery_pageIndex + 1
    //     this_1.setData({
    //       visitquery_pageIndex: pageIndex
    //     })
    //     this_1.visitList();
    //   } else {
    //     wx.showToast({
    //       title: '没有更多了',
    //       icon: 'none',
    //       duration: 500
    //     });
    //   }
    // } else {
    //   if (this_1.data.usertotal > (this_1.data.userquery_pageIndex * this_1.data.pageCount)) {
    //     var pageIndex = this_1.data.userquery_pageIndex + 1
    //     console.log("pageIndex_", pageIndex);
    //     this_1.setData({
    //       userquery_pageIndex: pageIndex
    //     })
    //     this_1.userLsit();
    //   } else {
    //     wx.showToast({
    //       title: '没有更多了',
    //       icon: 'none',
    //       duration: 500
    //     });
    //   }
    // }
  }
})