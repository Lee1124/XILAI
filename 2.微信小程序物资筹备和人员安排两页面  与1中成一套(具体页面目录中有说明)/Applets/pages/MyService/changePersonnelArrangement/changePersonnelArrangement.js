// pages/changeMaterialManage/changeMaterialManage.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderid: '',
    thissort: 0,
    thisId: 0,
    zhiwu: '',
    lianxiren: '',
    renwu: '',
    defalutData: []
  },

  // 保存修改
  keepChange() {
    if (this.data.zhiwu == '') {
      wx.showToast({
        title: '请输入职务',
        icon: 'none',
        duration: 2000
      })
      return false;
    }

    // if (this.data.lianxiren == '') {
    //   wx.showToast({
    //     title: '请输入联系人',
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return false;
    // }
    if (this.data.renwu == '') {
      wx.showToast({
        title: '请输入任务',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    let urlapi = app.globalData.url;
    let requestUrl = urlapi + '/xlapi/FlowScheme/Operation/FlowScheme/EditRow';
    var data = {
      FlowPath: this.data.lianxiren, //联系人
      Personnel: this.data.zhiwu, //职务
      Article: this.data.renwu, //任务
      Type: 3,
      Sort: this.data.thissort,
      show: true,
      OrderId: this.data.orderid,
      Id: this.data.thisId,
    };
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
        // console.log(res.data.status)
        if (res.data.status == 'OK') {
          var pages = getCurrentPages(); //获取页面栈
          if (pages.length > 1) {
            //上一个页面实例对象
            var prePage = pages[pages.length - 2];
            //调用上一个页面的onShow方法
            prePage.changeData({
              orderId: this.data.orderid
            });
            // 返回上一页
            wx.navigateBack({
              delta: 1
            })
          }
        }
      }
    })
  },

  // input输入时触发事件
  getInputContent1(e) {
    this.setData({
      zhiwu: e.detail.value
    })
  },
  getInputContent2(e) {
    this.setData({
      lianxiren: e.detail.value
    })
  },
  // textareat输入时触发事件
  getTextareaContent(e) {
    this.setData({
      renwu: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let orderid = options.orderid;
    let thisId = options.thisId; //当前ID
    let thissort = options.thissort; //当前Sort
    console.log(orderid)
    console.log(thisId)
    console.log(thissort)
    this.setData({
      orderid: orderid,
      thissort: thissort,
      thisId: thisId
    })


    let urlapi = app.globalData.url;
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
        var thisIndex;
        for (var i = 0; i < res.data.data.modelList.length; i++) {
          if (res.data.data.modelList[i].Sort == thissort) {
            thisIndex = i
          }
        }
        this.setData({
          defalutData: res.data.data.modelList[thisIndex],
          zhiwu: res.data.data.modelList[thisIndex].Personnel,
          lianxiren: res.data.data.modelList[thisIndex].FlowPath,
          renwu: res.data.data.modelList[thisIndex].Article,
        })
      }
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

  }
})