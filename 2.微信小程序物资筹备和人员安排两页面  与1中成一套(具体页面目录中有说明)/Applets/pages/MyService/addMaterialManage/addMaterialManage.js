// pages/changeMaterialManage/changeMaterialManage.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index0: 0,
    array: ['请选择一个合适的分类', '新娘家（酒店）物资准备', '新郎（新房）家物资准备', '宴会物资准备', '喜来婚礼提供物资'],
    orderid: '',
    thissort: 0,
    index0: 0,
    thisId: 0,
    wupin: '',
    yongtu: '',
    weizhi: 0,
    data1Length: 0, //初始数据的长度
    data2Length: 0, //初始数据的长度
    data3Length: 0, //初始数据的长度
    data4Length: 0, //初始数据的长度
    flag: true
  },

  // 保存修改
  keepChange() {
    if (this.data.flag == true) {
      this.setData({
        flag: false
      })
      var flowPath;
      let urlapi = app.globalData.url;
      let requestUrl = urlapi + '/xlapi/FlowScheme/Operation/FlowScheme/AddRow';
      if (this.data.index0 == '1') {
        flowPath = '新娘家（酒店）物资准备'
      } else if (this.data.index0 == '2') {
        flowPath = '新郎（新房）家物资准备'
      } else if (this.data.index0 == '3') {
        flowPath = '宴会物资准备'
      } else if (this.data.index0 == '4') {
        flowPath = '喜来婚礼提供物资'
      }
      if (this.data.index0 == '0') {
        wx.showToast({
          title: '请选择分类',
          icon: 'none',
          duration: 2000
        })
        return false;
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

      if (this.data.weizhi == '') {
        wx.showToast({
          title: '请输入位置',
          icon: 'none',
          duration: 2000
        })
        return false;
      }

      var weizhi;
      if (this.data.weizhi != '') {
        weizhi = this.data.weizhi - 1;
      }
      // 输入的位置超出最大
      if (flowPath == '新娘家（酒店）物资准备') {
        if (weizhi > this.data.data1Length) {
          weizhi = this.data.data1Length;
        }
      } else if (flowPath == '新郎（新房）家物资准备') {
        if (weizhi > this.data.data2Length) {
          weizhi = this.data.data2Length;
        }
      } else if (flowPath == '宴会物资准备') {
        if (weizhi > this.data.data3Length) {
          weizhi = this.data.data3Length;
        }
      } else if (flowPath == '喜来婚礼提供物资') {
        if (weizhi > this.data.data4Length) {
          weizhi = this.data.data4Length;
        }
      }

      var data = {
        FlowPath: flowPath,
        Personnel: this.data.wupin, //物品
        Article: this.data.yongtu, //用途
        Type: 2,
        Sort: weizhi,
        show: true,
        OrderId: this.data.orderid,
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
          console.log(res)
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
    }

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
  // input2输入时触发事件
  getInput2Content(e) {
    this.setData({
      weizhi: e.detail.value
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
    this.setData({
      orderid: orderid,
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
        // console.log(res.data.data.modelList1.length)
        // console.log(res.data.data.modelList2.length)
        // console.log(res.data.data.modelList3.length)
        // console.log(res.data.data.modelList4.length)
        this.setData({
          data1Length: res.data.data.modelList1.length,
          data2Length: res.data.data.modelList2.length,
          data3Length: res.data.data.modelList3.length,
          data4Length: res.data.data.modelList4.length,
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