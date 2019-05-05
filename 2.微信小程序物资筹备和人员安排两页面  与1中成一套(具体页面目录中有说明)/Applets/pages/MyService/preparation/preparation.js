// pages/MyService/preparation/preparation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isDay:true,
    dataList:[{
      time:"婚礼前三个月",
      content: "【喜来婚礼】婚礼管家林初安温馨提示:一场完美的，离不开喜来为亲们量现的浪漫现场，同样重要的是当天新人及其父母的着装，婚礼当天新娘可准备两件婚纱(出门，仪式)敬酒服  (礼服、套装、小洋装都可以) ，新郎可以准备一套西服(天气炎热可在抢亲和迎宾穿衬衣，仪式再把外套穿上)新人父亲同样也需要准备一套正式的着装(切忌不要穿着T恤、夹克，羽绒服等休闲服饰) ，新人母亲准备套装、连衣裙等大方得体的着装即可，有任何疑问请致电您的婚礼管家。谢谢!  祝您生活愉快!"
    }, {
      time: "婚礼前三个月",
      content: "【喜来婚礼】婚礼管家林初安温馨提示:一场完美的，离不开喜来为亲们量现的浪漫现场，同样重要的是当天新人及其父母的着装，婚礼当天新娘可准备两件婚纱(出门，仪式)敬酒服  (礼服、套装、小洋装都可以) ，新郎可以准备一套西服(天气炎热可在抢亲和迎宾穿衬衣，仪式再把外套穿上)新人父亲同样也需要准备一套正式的着装(切忌不要穿着T恤、夹克，羽绒服等休闲服饰) ，新人母亲准备套装、连衣裙等大方得体的着装即可，有任何疑问请致电您的婚礼管家。谢谢!  祝您生活愉快!"
    },
    {
      time: "婚礼前三个月",
      content: "【喜来婚礼】婚礼管家林初安温馨提示:一场完美的，离不开喜来为亲们量现的浪漫现场，同样重要的是当天新人及其父母的着装，婚礼当天新娘可准备两件婚纱(出门，仪式)敬酒服  (礼服、套装、小洋装都可以) ，新郎可以准备一套西服(天气炎热可在抢亲和迎宾穿衬衣，仪式再把外套穿上)新人父亲同样也需要准备一套正式的着装(切忌不要穿着T恤、夹克，羽绒服等休闲服饰) ，新人母亲准备套装、连衣裙等大方得体的着装即可，有任何疑问请致电您的婚礼管家。谢谢!  祝您生活愉快!"
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      setInterval(()=>{
          this.setData({
              isDay:!this.data.isDay
          })
      },2500)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh() //停止下拉刷新 
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var pages = getCurrentPages();
    var currentPage = pages[pages.length - 1];
    var url = currentPage.route; //当前页面url
    return {
      title: ' ',
      imageUrl: app.globalData.imgUrl + 'share.png',
      path: "/pages/validation/validation?share=true&url=" + url
    }
  }
})