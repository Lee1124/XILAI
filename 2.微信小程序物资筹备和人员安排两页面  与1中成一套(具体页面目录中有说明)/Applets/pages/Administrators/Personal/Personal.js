// pages/Administrators/Personal/Personal.js

var app = getApp();
var url = getApp().globalData.url;//服务器ip

function guid() {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid;
}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        img_url:'',
        userInfo:'',    //微信用户信息
        adminuser:"",        //登陆的信息
        loginUser: {
          name: "",
          imgUrl: ""
        },  // 当前登录的用户
        flow:{          //流量
            AllCount:0,    //我的流量总人数
            YesterdayCount:0,    //昨日更新人数
            AllData:[],     //我的全部流量信息列表
            YesterdayData:[]    //昨日流量信息列表  
        },
        ishead:false,       //是否是领导
        ismanage:false,     //是否是最高权限
        shop_obj:{              //店铺相关信息 主要是分享的流量
            nowShopCount:0,     //当前可查看店铺个数
            nowShopData:[],      //当前可查看店铺列表
            TotalTraffic:0,     //总计流量数
            yesTotalTraffic:0   //昨日新增流量数
        },
        managedata:{            //最高权限看到的数据
            allCount:0,         //总流量
            yesAllCount:0       //昨日流量
        },
        shop:{},    //选的店铺
        open_shop:false,    //是否选择了店铺
        ShopDetails:{},     //所选店铺的详情

    },
    //流量统计
    goflow(){
        //判断是否选择了店铺
        var shoplist=[]
        if(this.data.open_shop){
            shoplist.push(this.data.shop.Branch_Id)
        }else{
            var nowShopData=this.data.shop_obj.nowShopData
            for(var i=0;i<nowShopData.length;i++){
                shoplist.push(nowShopData[i].Branch_Id)
            }
        }
        shoplist=shoplist.join(',')
        wx.setStorageSync('shoplist', shoplist)
        wx.navigateTo({
            url: '../flow/flow?yesterday=false'
        })
    },
    goflow_1(){
        //判断是否选择了店铺
        // var shoplist=[]
        // if(this.data.open_shop){
        //     shoplist.push(this.data.shop.Branch_Id)
        // }else{
        //     var nowShopData=this.data.shop_obj.nowShopData
        //     for(var i=0;i<nowShopData.length;i++){
        //         shoplist.push(nowShopData[i].Branch_Id)
        //     }
        // }
        // shoplist=shoplist.join(',')
        // wx.setStorageSync('shoplist', shoplist)
        wx.navigateTo({
            url: '../MyFlow/MyFlow?type='+(this.data.ismanage ? 5 : 1)
        })
    },
    goshops(){
        wx.navigateTo({
            url: '../shops/shops'
        })
    },
    //获取店的流量统计数据
    GetBranchTrafficById(){
        var this_1=this;
        wx.request({
            url:app.globalData.url+'/xlapi/Mini/Ins/Partners/GetBranchTrafficById',
            data:{BranchId:this.data.shop.Branch_Id},    //多个店用逗号隔开  1,2
            method: "POST",
            header:{},
            success:function(x){
                console.log('获取店的流量统计数据',x);
                this_1.setData({
                    'ShopDetails':x.data.data[0]
                })
            }
        })
    },
    //领导权限
    HeadAuth(){
        var this_1 = this;
        var userid = this.data.adminuser.userdata.userid;
        this.setData({
          loginUser: {
            name: this.data.adminuser.userdata.username,
            imgUrl: app.globalData.url + '/xlapi/Mini/Ins/Partners/GetUserHeadImg?userid=' + userid
          }
        })
        wx.request({
          url: app.globalData.url + '/xlapi/Mini/Ins/Partners/HeadAuth?v=' + guid(),
            data: { UserId:userid},
            method: "POST",
            header: {
                // Authorization: "url|1|2|xlhl|http://171.211.126.122:8092/||rolestate||0|action"
            },
            success: function (res) {
                console.log('领导权限',res)
                var obj=new Object();
                    obj.ishead=res.data.ishead;
                    obj.shop_obj=res.data.data;
                    obj.ismanage=res.data.ismanage;
                    obj.managedata=res.data.managedata;
                    console.log(obj);
                  this_1.setData(obj);
                // this_1.setData({
                //     'flow':res.data
                // })
            }
        })
    },
    //我的流量
    getMyUser(){
        var this_1=this;
        var userid=this.data.adminuser.userdata.userid;
        wx.request({
          url: app.globalData.url + '/xlapi/Mini/Ins/Partners/getMyUser?v=' + guid(),
            data: { userid: userid},
            method: "POST",
            header: {
                // Authorization: "url|1|2|xlhl|http://171.211.126.122:8092/||rolestate||0|action"
            },
            success: function (res) {
                console.log('我的流量',res)
                this_1.setData({
                    'flow':res.data
                })
            }
        })
    },
    //注销
    go_out(e){
        wx.showModal({
            title: '提示',
            content: '确定注销？',
            success: function (res) {
                if (res.confirm) {
                    wx.request({
                        url: app.globalData.url + '/xlapi/Login/Login/Login/UserLogut',
                        data: { openid: app.globalData.openid },
                        method: 'POST',
                        success: function (res) {
                            /*** */
                            if (res.data.status == "OK") {
                                wx.showToast({
                                    title: '注销成功',
                                    icon: 'none',
                                    duration: 2000
                                })
                              getApp().globalData.isAdminUser = false;
                                wx.redirectTo({
                                    url: '/pages/Cases/Cases'
                                });
                            } else {
                                wx.showToast({
                                    title: '注销失败',
                                    icon: 'none',
                                    duration: 2000
                                })
                            }
                        },
                        fail: function (res) { },
                        complete: function (res) { },
                    })
                }
            }
        })
    },
    ToSkip: function (e) {
        console.log('点击事件', e);
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
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //存储页面地址
        var pages = getCurrentPages()    //获取加载的页面
        app.editadminTabbar(); 
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
        this.setData({
            'userInfo': app.globalData.userInfo,
            'adminuser':  JSON.parse(wx.getStorageSync('adminuser'))
        })
      app.globalData.lo
      console.log("app.globalData.userInfo=",app.globalData.userInfo);
        //判断是否有选择店铺
        var shop = wx.getStorageSync('shop');
        if(!shop || shop=='' || shop==null){
            console.log('没有选择店铺')
            this.setData({
                open_shop:false
            });
        }else{
            console.log(shop)
            this.setData({
                shop:JSON.parse(shop),
                open_shop:true
            });
            this.GetBranchTrafficById();    //获取店的流量统计数据
        }
        console.log('微信用户信息',app.globalData.userInfo);
        // console.log('openid',app.globalData.openid);
        var adminuser =JSON.parse(wx.getStorageSync('adminuser'));
        console.log('用户信息',adminuser)

        this.getMyUser();      //获取我的流量信息
        this.HeadAuth();    //领导权限
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

    }

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function () {

    // }
})