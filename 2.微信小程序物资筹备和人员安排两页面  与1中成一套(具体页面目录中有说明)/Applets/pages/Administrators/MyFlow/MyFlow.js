var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        adminuser:'',       //用户登录的信息
        yesterday:false,    //是否是昨日
        AllCount:0,         //我的流量总人数
        YesterdayCount:0,   //昨日更新人数
        AllData:[],         //我的全部流量信息列表
        YesterdayData:[],    //昨日流量信息列表  
        url:'',             //上一页地址
        Branch_Id:'',       //接收到的店铺Id
        BranchName:'',      //接收到的店铺名
        userid:'',          //接收到的用户Id
        UserName:'',        //接收到的用户名
        header_right:'',
        header_left:'',
        loading:true,      //是否正在加载
        pageIndex:1,
        pageSize:15,
        isdata:true,        //是否没有数据了
        ishead:false,       //是否是领导

        branchidOruserid:'',
        type:'',
    },
    open_1(e){
        console.log(e);
        var index=e.target.dataset.index;
        var AllData=this.data.AllData;
            if(!AllData[index].height || AllData[index].height==0){
                AllData[index].height=90* AllData[index].UserLists.length;
            }else{
                AllData[index].height=0
            }
            console.log(AllData[index].height)
            this.setData({
                AllData
            })
    },
    open_2(e){
        console.log(e);
        var index=e.target.dataset.index;
        var YesterdayData=this.data.AllData;
            if(!YesterdayData[index].height || YesterdayData[index].height==0){
                YesterdayData[index].height=90* YesterdayData[index].UserLists.length;
            }else{
                YesterdayData[index].height=0
            }
            console.log(YesterdayData[index].height)
            this.setData({
                YesterdayData
            })
    },
    //领导权限
    HeadAuth(){
        var this_1=this;
        var userid=this.data.adminuser.userdata.userid;
        wx.request({
            url: app.globalData.url + '/xlapi/Mini/Ins/Partners/HeadAuth',
            data: { UserId:userid},
            method: "POST",
            header: {
                // Authorization: "url|1|2|xlhl|http://171.211.126.122:8092/||rolestate||0|action"
            },
            success: function (res) {
                console.log('领导权限',res)
                var obj=new Object();
                    obj.ishead=res.data.ishead;
                    // obj.shop_obj=res.data.data;
                this_1.setData(obj);
                this_1.GetBranchTraffic();    //获取数据
            }
        })
    },
    // 跳转到人员详情
    go_personInfo(e) {
      var openId_ = e.currentTarget.dataset.openid
      var sf = e.currentTarget.dataset.sf;
      wx.navigateTo({
        url: '/pages/personInfo/personInfo?o_id=' + openId_ + "&sf=" + sf
      })
    },
    //我的流量
    getMyUser(){
        var this_1=this;
        var userid=this.data.adminuser.userdata.userid;
        wx.request({
            url: app.globalData.url + '/xlapi/Mini/Ins/Partners/getMyUser',
            data: { userid: userid},
            method: "POST",
            header: {
                // Authorization: "url|1|2|xlhl|http://171.211.126.122:8092/||rolestate||0|action"
            },
            success: function (res) {
                console.log('我的流量',res)
                var AllData=res.data.AllData;   //全部
                var YesterdayData=res.data.YesterdayData;    //昨日
                //计算高度
                for(var i=0;i<AllData.length;i++){
                    AllData[i].height=90* AllData[i].UserLists.length;
                }
                for(var i=0;i<YesterdayData.length;i++){
                    YesterdayData[i].height=90*YesterdayData[i].UserLists.length;
                }
                this_1.setData({
                    'AllData':AllData,
                    'YesterdayData':YesterdayData
                })
            }
        })
    },
    GetBranchTraffic(){
        var this_1=this;
            this.setData({
                loading:true
            })
            wx.hideLoading()
            wx.showLoading({
                title:'正在加载',
                mask:true
            })
       
        var obj=new Object;
            obj.userid=this.data.adminuser.userdata.userid ;
            obj.type=this.data.ishead ? this.data.type : 2 ;    //1表示店铺 2表示人员 4表示最高管理的所有
            
            // obj.branchidOruserid=this.data.ishead ? (this.data.branchidOruserid ?  this.data.branchidOruserid :this.data.adminuser.userdata.userid ) : this.data.adminuser.userdata.userid;  //空查询所有
            
            obj.branchidOruserid=(this.data.type==1 || this.data.type==5) ? this.data.branchidOruserid : (this.data.branchidOruserid ? this.data.branchidOruserid : this.data.adminuser.userdata.userid);  //空查询所有
            obj.page=this.data.pageIndex;
            obj.pagesize=this.data.pageSize;
        wx.request({
            url: app.globalData.url + '/xlapi/Mini/Ins/Partners/GetBranchTrafficByBranchIdOrUserId',
            data: obj,
            method: "POST",
            header: {
                // Authorization: "url|1|2|xlhl|http://171.211.126.122:8092/||rolestate||0|action"
            },
            success: function (res) {
                console.log('查询流量',res)
                var list=res.data.data;
                 wx.hideLoading()
                if(list.length==0){
                    this_1.setData({
                        'isdata':false,
                        'loading':false
                    })
                }else{
                    for(var i=0;i<list.length;i++){
                        list[i].height=90* list[i].UserLists.length;
                    }
                    var AllData=this_1.data.AllData.concat(list);
                    this_1.setData({
                        'AllData':AllData,
                        'loading':false,
                        'AllCount':res.data.count
                    })
                  wx.hideLoading();
                }
            }
        })
    },
    //选择人员或店铺
    Choice(){
        if(this.data.url && this.data.url!=''){
            wx.navigateBack({   //如果从 flow 页面跳转的就返回
                delta:1
            })
        }else{
            console.log('11231')
            wx.navigateTo({
                url: '../flow/flow?url=MyFlow'
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({
          title: '正在加载',
          mask: true
        })
        // url=flow 跳转的上一页表示 flow(总计流量跳转过来的) 
        console.log(options);
        var url=options.url ? options.url : '';
        var branchidOruserid=options.branchidOruserid ? options.branchidOruserid : '';
        var type=options.type ? options.type : 1; //1表示店铺 2表示人员 4表示最高管理员
        var title=options.title ? options.title : '';

        var titlename='我的流量';
        var header_right="我的流量"
        var header_left="切换店铺/人员";
        if(title && title!=''){
            titlename=title;
            header_right=title+'的流量'
        }
        this.setData({
            'url':url,
            'header_right':header_right,
            'header_left':header_left,
            'branchidOruserid':branchidOruserid,     //传递过来的参数
            'type':type,        //查询类型
        })
        
        wx.setNavigationBarTitle({
            title: titlename   //动态设置
        })




        var flowjson = wx.getStorageSync('flowjson');
        console.log(flowjson)
        if (flowjson && flowjson != '') {
          wx.removeStorageSync('flowjson');
          var url = flowjson.url ? flowjson.url : '';
          var branchidOruserid = flowjson.branchidOruserid ? flowjson.branchidOruserid : '';
          var type = flowjson.type ? flowjson.type : 1; //1表示店铺 2表示人员 4表示最高管理员
          var title = flowjson.title ? flowjson.title : '';

          var titlename = '我的流量';
          var header_right = "我的流量"
          var header_left = "切换店铺/人员";
          if (title && title != '') {
            titlename = title;
            header_right = title + '的流量'
          }
          this.setData({
            'url': url,
            'header_right': header_right,
            'header_left': header_left,
            'branchidOruserid': branchidOruserid,     //传递过来的参数
            'type': type,        //查询类型
          })
          wx.setNavigationBarTitle({
            title: titlename   //动态设置
          })
        }


        this.setData({
          'adminuser': JSON.parse(wx.getStorageSync('adminuser')),
          'pageIndex': 1,
          'isdata': true,
          'AllData': []
        })
        this.HeadAuth();
       
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

        // wx.showToast({
        //     title:'提示',
        //     icon:'loading',
        //     mask:true,
        //     duration:1500
        // })
        // wx.hideLoading()
        // wx.showLoading({
        //     title:'正在加载',
        //     mask:false
        // })
        // wx.hideLoading()
        
        // var flowjson= wx.getStorageSync('flowjson');
        // console.log(flowjson)
        // if(flowjson && flowjson!=''){
        //     wx.removeStorageSync('flowjson');
        //     var url=flowjson.url ? flowjson.url : '';
        //     var branchidOruserid=flowjson.branchidOruserid ? flowjson.branchidOruserid : '';
        //     var type=flowjson.type ? flowjson.type : 1; //1表示店铺 2表示人员 4表示最高管理员
        //     var title=flowjson.title ? flowjson.title : '';

        //     var titlename='我的流量';
        //     var header_right="我的流量"
        //     var header_left="切换店铺/人员";
        //     if(title && title!=''){
        //         titlename=title;
        //         header_right=title+'的流量'
        //     }
        //     this.setData({
        //         'url':url,
        //         'header_right':header_right,
        //         'header_left':header_left,
        //         'branchidOruserid':branchidOruserid,     //传递过来的参数
        //         'type':type,        //查询类型
        //     })
        //     wx.setNavigationBarTitle({
        //         title: titlename   //动态设置
        //     })
        // }
       

        // this.setData({
        //     'adminuser':JSON.parse(wx.getStorageSync('adminuser')),
        //     'pageIndex':1,
        //     'isdata':true,
        //     'AllData':[]
        // })
        // this.getMyUser();
       
        // this.HeadAuth();    //判断领导权限
       
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
        console.log('到底了')
        if(this.data.isdata && !this.data.loading){
            var pageindex=this.data.pageIndex+1
            this.setData({
                'pageIndex':pageindex
            });
            this.GetBranchTraffic();
        }
    }

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function () {

    // }
})