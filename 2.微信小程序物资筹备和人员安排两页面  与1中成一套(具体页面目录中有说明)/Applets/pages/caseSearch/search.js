// pages/caseSearch/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isfocus: false,
    input_focus: true,
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
    searchKey_: [],
    showKeyInput: ''
  },
  // 限制标签数量，最多为3个标签
  limitNumb(){
    var keys = this.data.showKeyInput.split(" ");
    if (keys.length >= 3) {
      wx.showModal({
        title: '提示',
        content: '最多只能输入或选择三个关键词！',
      })
      this.setData({
        isfocus: false
      })
      return false;
    }
  },
  // 选择标签
  choieLabel(e){
    var label_ = e.currentTarget.dataset.item;
    var list = this.data.labelList;
    var keys = this.data.showKeyInput.split(" ");
    if (keys.length >= 4 && label_.ischoie == false) {
      wx.showModal({
        title: '提示',
        content: '最多只能输入四个标签！',
      })
      return false;
    }

    var keyVals = '';
    var hasKey = false; // 是否已经选择了该标签
    
    // 改变样式
    for (var i = 0; i < list.length; i++) {
      var item = list[i];
      if (item.id == label_.id) {
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
    if (!hasKey) {
      keys.push(label_.name);
      keyVals = this.data.showKeyInput
      if (keyVals!=''){
        keyVals += ' ';
      }
      keyVals += label_.name;
    }else{
      keyVals = keys.join(" ");
    }

    this.setData({
      labelList: list,
      searchKey_: keys,
      showKeyInput: keyVals
    })
  },
  // 搜索案例
  getSearch(e){
    console.log(this.data.showKeyInput);
    wx.redirectTo({
      url: '/pages/Cases/Cases?key_=' + this.data.showKeyInput
    })
  },
  changeInputText(e){
    this.setData({
      showKeyInput: e.detail.value
    })
  },
  // 取消搜索
  cancelSearch(e){
    this.setData({
      showKeyInput: "",
      searchKey_: [],
      input_focus: true
    })
    this.getSearch();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options=",options);
    var keys = options.searchKey.split(" ");
    var list = this.data.labelList;
    for(var i = 0; i < list.length; i++){
      for(var j = 0; j < keys.length; j++){
        if (list[i].name == keys[j]) {
          list[i].ischoie = true;
        }
      }
    }
    console.log(list);
    this.setData({
      labelList: list,
      showKeyInput: options.searchKey
    })
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
  
  }
})