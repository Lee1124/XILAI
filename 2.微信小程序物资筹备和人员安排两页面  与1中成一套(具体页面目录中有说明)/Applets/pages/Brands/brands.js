// pages/Brands/brands.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        nowpages: 1,
        allPage: 0,
        isXinRen: false,//判断是不是新人页面
        nodes: [
            {
                name: "p",
                attrs: { class: "ct_title" },
                children: [{
                    type: 'text',
                    text: '喜来婚礼 ⊙ 源自爱'
                }]
            },
            {
                name: "p",
                attrs: { class: "ct_titles" },
                children: [{
                    type: 'text',
                    text: '婚礼策划 | 始于2004年'
                }]
            },
            {
                name: "p",
                attrs: { class: "ct_titles1" },
                children: [{
                    type: 'text',
                    text: '拥有11家直营店 | 全国首家直营体系婚礼机构'
                }]
            }
        ],
        storyList: []
    },
    callphone: function (e) {
        console.log(e)
        wx.makePhoneCall({
            phoneNumber: '4009951520',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.user) {
            console.log('修改用户标签')
            app.editUserTabBar();
            app.editHeader();
            wx.setNavigationBarColor({
                frontColor: '#ffffff',
                backgroundColor: '#cd1130'
            })
            this.setData({
                isXinRen: true,
            })
        } else if(options.admin){
            console.log('修改合作标题');
            app.editadminTabbar();
        } else if (options.JiHuiOrderUser) {
          app.editJiHuiOrderTabBar();
        }
        else{
            this.setData({
                isXinRen: false
            })
            console.log("第一个修改普通标题");
            app.editTabBar();

        }
        //古诗
        var postdata = { currPage: this.data.nowpages, pageSize: 3, type: 2 }
        var _this = this;
        wx.request({
            url: app.globalData.url + '/xlapi/Mini/Ins/Anli/getAnli',
            method: "POST",
            header: { 'content-type': 'application/json', },
            data: postdata,
            success: function (res) {
                console.log(res.data[0])
                _this.setData({
                    storyList: res.data[0],
                    allPage: res.data[1],
                    nowpages: _this.data.nowpages
                });
            }
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
      wx.stopPullDownRefresh() //停止下拉刷新 
    },

  //保存日志
  SaveLog:function(e)
  {
    
    var gushiid = e.currentTarget.dataset.item;
    console.log(gushiid);
    getApp().SaveLog(gushiid, "6","");
  },


    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

        var _this = this
        if ((this.data.nowpages * 2) < this.data.allPage) {

            //古诗
            var postdata = { currPage: this.data.nowpages + 1, pageSize: 3, type: 2 }
            var _this = this;
            wx.request({
                url: app.globalData.url + '/xlapi/Mini/Ins/Anli/getAnli',
                method: "POST",
                header: { 'content-type': 'application/json', },
                data: postdata,
                success: function (res) {
                    var temp = _this.data.storyList.concat(res.data[0]);
                    _this.setData({
                        storyList: temp,
                        nowpages: _this.data.nowpages + 1
                    });
                }
            })
        } else {
            wx.showToast({ //如果全部加载完成了也弹一个框
                title: '没有更多了',
                icon: 'none',
                duration: 300
            });
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        var pages = getCurrentPages();
        var currentPage = pages[pages.length - 1];
        var url = currentPage.route; //当前页面url
        return {
            title: '你好哇，爱情',
            imageUrl: app.globalData.imgUrl + 'share.png',
            path: "/pages/validation/validation?share=true&url=/" + url
        }
    },
    ToSkip: function (e) {
        if (e.currentTarget.dataset.url == '') {
            wx.showModal({
                title: '提示',
                content: '功能暂未开放，敬请期待！',
                showCancel: false,
                success: function (res) {
                    if (res.confirm) {

                    }
                }
            })
        }

    }
})