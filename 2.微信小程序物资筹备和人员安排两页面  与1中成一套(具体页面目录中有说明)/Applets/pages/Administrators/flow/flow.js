// pages/Administrators/flow/flow.js

var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        adminuser:'',   //登陆人信息
        list:[],        //查询结果
        yesterday:false,        //是否昨日
        shoplist:'',    //待查询的店铺id 都好隔开
        url:'',          //上一页地址主要用于 MyFlow 跳转过来
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
                    obj.shop_obj=res.data.data;
                    obj.ismanage=res.data.ismanage;
                    obj.managedata=res.data.managedata;
                this_1.setData(obj);
                // this_1.setData({
                //     'flow':res.data
                // })
            }
        })
    },
    //跳转至 goMyFlow
    goMyFlow(e){
        console.log(e);

        if(this.data.url=='MyFlow'){
            var obj=new Object();
                obj.branchidOruserid='';
                obj.type=e.target.dataset.type;
                obj.title=e.target.dataset.title;
                wx.setStorageSync('flowjson', obj)  //保存所选的店铺或者人员
            wx.navigateBack({
                delta: 1
            });
        }else{
            wx.navigateTo({
              url: '/pages/Administrators/MyFlow/MyFlow?url=flow&type='+e.target.dataset.type+'&title='+e.target.dataset.title //type 1表示店铺 2表示人员 4表示最高管理员的那个
            })
        }
    },
    gogoMyFlow_1(e){
        console.log(e)
        var Branch_Id=e.target.dataset.item.BranchId;  //点击的店铺Id
        var BranchName=e.target.dataset.item.BranchName;
        if(this.data.url=='MyFlow'){
            var obj=new Object();
                obj.branchidOruserid=Branch_Id;
                obj.title=BranchName;
                obj.type=1
                wx.setStorageSync('flowjson', obj)  //保存所选的店铺或者人员
            wx.navigateBack({
                delta: 1
            });

        }else{
            wx.navigateTo({
              url: '/pages/Administrators/MyFlow/MyFlow?url=flow&type=1&branchidOruserid='+Branch_Id+'&title='+BranchName
            })
        }
    },
    gogoMyFlow_2(e){
        console.log(e)
        var userid=e.target.dataset.item.UserId;  //点击的用户Id
        var UserName=e.target.dataset.item.UserName
        if(this.data.url=='MyFlow'){
            var obj=new Object();
                obj.branchidOruserid=userid;
                obj.title=UserName;
                obj.type=2
            wx.setStorageSync('flowjson', obj)  //保存所选的店铺或者人员
            wx.navigateBack({
                delta: 1
            })
        }else{
            wx.navigateTo({
              url: '/pages/Administrators/MyFlow/MyFlow?url=flow&type=2&branchidOruserid='+userid+'&title='+UserName
            })
        }
    },
    //展开收起
    open(e){
        console.log(e);
        // var obj=e.target.dataset.obj
        //     obj.open=!obj.open;
        //     console.log(obj)
        var index=e.target.dataset.index;
        var list=this.data.list;
            if(list[index].open){
                list[index].height=90*list[index].userList.length+90;
            }else{
                list[index].height=0;
            }
            list[index].open=!list[index].open  //默认的未false
            this.setData({
                list
            })
           
    },
    //获取店的流量统计数据
    GetBranchTrafficById(){
       
            wx.showLoading({
                title:'正在加载',
                mask:true
            })
        var this_1=this;
        wx.request({
            url:app.globalData.url+'/xlapi/Mini/Ins/Partners/GetBranchTrafficById',
            data:{BranchId:this.data.shoplist},    //多个店用逗号隔开  1,2
            method: "POST",
            header:{},
            success:function(x){
                console.log('获取店的流量统计数据',x);
                var list=x.data.data;
                // var TotalTraffic=0
                for(var i=0;i<list.length;i++){
                    list[i].height=list[i].userList.length==0 ? 0 : 90*list[i].userList.length+90;
                }
                this_1.setData({
                    'list':list
                });
                wx.hideLoading()
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options);
        var url=options.url ? options.url : '';
        this.setData({
            'url':url
        })
        if(options.yesterday=='true'){
            this.setData({
                'yesterday':true
            })
        }else{
            this.setData({
                'yesterday':false
            })
        }
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
        wx.removeStorageSync('flowjson');   //删除所选择的店铺或者人员信息
        var shoplist = wx.getStorageSync('shoplist')
        console.log(shoplist)
        this.setData({
            'shoplist':shoplist,
            'adminuser':JSON.parse(wx.getStorageSync('adminuser'))
        });
        this.HeadAuth();        //获取领导权限
        this.GetBranchTrafficById();


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