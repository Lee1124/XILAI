// pages/changeMaterialManage/changeMaterialManage.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index0: 0,
    array: ['新娘家（酒店）物资准备', '新郎（新房）家物资准备', '宴会物资准备', '喜来婚礼提供物资'],
    orderid: '',
    thissort: 0,
    index0: 0,
    thisId: 0,
    wupin: '',
    yongtu: '',
    defalutData: []
  },

  // 保存修改
  keepChange() {
    var flowPath;
    var that = this;
    let urlapi = app.globalData.url;
    let requestUrl = urlapi + '/xlapi/FlowScheme/Operation/FlowScheme/EditRow';
    console.log(this.data.index0)
    if (this.data.index0 == '0') {
      flowPath = '新娘家（酒店）物资准备'
    } else if (this.data.index0 == '1') {
      flowPath = '新郎（新房）家物资准备'
    } else if (this.data.index0 == '2') {
      flowPath = '宴会物资准备'
    } else if (this.data.index0 == '3') {
      flowPath = '喜来婚礼提供物资'
    }

    if (this.data.wupin == '') {
      wx.showToast({
        title: '请输入物品',
        icon: 'none',
        duration: 2000
      })
      return false;
    }

    if (this.data.yongtu == '') {
      wx.showToast({
        title: '请输入用途',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    var data = {
      FlowPath: flowPath,
      Personnel: this.data.wupin, //物品  “备注关键词”
      Article: this.data.yongtu, //用途 “备注内容”
      Type: 2,
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
  // picker改变时触发事件
  bindPickerChange(e) {
    this.setData({
      index0: e.detail.value
    })
  },
  // input输入时触发事件
  getInputContent(e) {
    this.setData({
      wupin: e.detail.value
    })
  },
  // textareat输入时触发事件
  getTextareaContent(e) {
    this.setData({
      yongtu: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let orderid = options.orderid;
    let thisId = options.thisId; //当前ID
    let thissort = options.thissort; //当前Sort
    let index0 = options.index0; //当前父级索引

    this.setData({
      orderid: orderid,
      thissort: thissort,
      thisId: thisId,
      index0: index0
    })

    let urlapi = app.globalData.url;
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
        // console.log(res.data.data)
        var thisIndex;
        if (index0 == 0) {
          for (var i = 0; i < res.data.data.modelList1.length; i++) {
            if (res.data.data.modelList1[i].Sort == thissort) {
              thisIndex = i
            }
          }

          this.setData({
            defalutData: res.data.data.modelList1[thisIndex],
            wupin: res.data.data.modelList1[thisIndex].Personnel,
            yongtu: res.data.data.modelList1[thisIndex].Article
          })
        }
        if (index0 == 1) {
          for (var i = 0; i < res.data.data.modelList2.length; i++) {
            if (res.data.data.modelList2[i].Sort == thissort) {
              thisIndex = i
            }
          }
          this.setData({
            defalutData: res.data.data.modelList2[thisIndex],
            wupin: res.data.data.modelList2[thisIndex].Personnel,
            yongtu: res.data.data.modelList2[thisIndex].Article
          })
        }
        if (index0 == 2) {
          console.log('宴会物资准备')
          for (var i = 0; i < res.data.data.modelList3.length; i++) {
            if (res.data.data.modelList3[i].Sort == thissort) {
              thisIndex = i
            }
          }
          this.setData({
            defalutData: res.data.data.modelList3[thisIndex],
            wupin: res.data.data.modelList3[thisIndex].Personnel,
            yongtu: res.data.data.modelList3[thisIndex].Article
          })
        }
        if (index0 == 3) {
          for (var i = 0; i < res.data.data.modelList4.length; i++) {
            if (res.data.data.modelList4[i].Sort == thissort) {
              thisIndex = i
            }
          }
          this.setData({
            defalutData: res.data.data.modelList4[thisIndex],
            wupin: res.data.data.modelList4[thisIndex].Personnel,
            yongtu: res.data.data.modelList4[thisIndex].Article
          })
        }

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