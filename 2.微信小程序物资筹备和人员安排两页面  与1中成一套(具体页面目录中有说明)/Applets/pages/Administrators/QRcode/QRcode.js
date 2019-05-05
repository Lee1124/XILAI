// pages/Administrators/QRcode/QRcode.js
var app=getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        adminuser:'',     //登陆的用户信息
        img_url:'',
        writePhotosAlbum:true,      //是否授权保存
        erweima_url:'',     //保存二维码  getImageInfo 中path 的返回值
    },

    //获取画布图片
    getcanvas(){
        var that = this;
        wx.canvasToTempFilePath({
            fileType:'png', 
            canvasId: 'canvas1',
            success: function (res) {
                var tempFilePath = res.tempFilePath;
                console.log(tempFilePath);
                that.setData({
                    img_url: tempFilePath,
                    // canvasHidden:true
                });
                wx.hideLoading()
            },
            fail: function (res) {
                console.log(res);
            }
        });
    },
    handler(e){
        
        if (e.detail.authSetting["scope.writePhotosAlbum"]){    //如果打开保存图片，就会为true
            console.log('未打开')
        }else{
            console.log('打开')
        }
    },

    writePhotosAlbum_1(e){
        console.log(e)
    },
    //用户基本信息
    getuserinfo_1(e){
        console.log(e);
    },
    //点击下载图片
    downloadFile_1(){
        var this_1=this;
        //判断是有保存本地的权限
        wx.getSetting({
            success(res) {
                if (!res.authSetting['scope.writePhotosAlbum']) {
                    wx.authorize({
                        scope: 'scope.writePhotosAlbum',
                        success(e){
                            console.log('成功的回调',e)
                            // wx.getUserInfo()
                            this_1.downloadFile_img();
                        },
                        fail(e){
                            console.log('失败的回调函数',e);
                            // {errMsg:"authorize:fail auth deny"}
                            wx.showModal({
                                title: '提示',
                                content: '您未同意使用图片保存到系统相册功能，无法下载！',
                                success: function(res) {
                                    if (res.confirm) {
                                        console.log('用户点击确定')
                                    } else if (res.cancel) {
                                        console.log('用户点击取消')
                                    }
                                }
                            })
                        },
                        complete(e){
                            // console.log('成功失败都有的',e)
                        }
                    })
                    // that.setData({
                    //     userToggle: true
                    // })
                } else {
                    //如果有获取权限判断是否获取了头像（后面可以删除）
                    // that.IsGetIcon(app.globalData.openid);
                    console.log('已授权保存本地图片')
                    this_1.downloadFile_img();
                }
            }
        })
    },
    downloadFile_img(){
        var this_1=this;
        console.log(this_1.data.img_url)
        wx.saveImageToPhotosAlbum({
            filePath:this_1.data.img_url,
            success(res) {
                console.log(res);
                wx.showToast({
                    title: '下载成功，以保存至手机相册',
                    icon: 'none',
                    duration: 2000
                })
            },
            fail(err){
                console.log(err)
                wx.showToast({
                    title: '下载失败，请稍后再试！',
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    },
    //获取微信二维码
    GetQrCode(){
        //xlapi/Mini/Ins/Partners/GetQrCode
        var userid=this.data.adminuser.userdata.userid;

        // return
        // wx.request({
        //     url:  app.globalData.url + '/xlapi/Mini/Ins/Partners/GetQrCode',
        //     method: "get",
        //     data: {'shareuserid':userid},
        //     header: {
        //         // Authorization: "url|1|2|xlhl|http://171.211.126.122:8092/||rolestate||0|action"
        //     },
        //     success: function (x) {
        //         console.log('获取微信二维码',x)
        //         this_1.setData({
        //             'img_url':x.data
        //         })
        //     }
        // })
        
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(wx.getSystemInfo())
        console.log(wx.getSystemInfoSync())
        //微信相关信息；
        console.log(app.globalData.userInfo)
        var adminuser =JSON.parse(wx.getStorageSync('adminuser'))
        console.log(adminuser)
        this.setData({
            'adminuser':adminuser
        });

        wx.showLoading({
            title: '加载中',
        })
        var ths_1=this;
        // var img_url='https://images2017.cnblogs.com/blog/79124/201801/79124-20180105165758096-1954973341.png'
        var img_url=app.globalData.url + '/xlapi/Mini/Ins/Partners/GetQrCode?shareuserid='+this.data.adminuser.userdata.userid;
        var user_url= app.globalData.url + '/xlapi/Mini/Ins/Partners/GetUserHeadImg?userid='+this.data.adminuser.userdata.userid;
        wx.getImageInfo({
            src:img_url,
            success: function (res) {
                console.log(res)
                var path=res.path;

                wx.getImageInfo({
                    src:user_url,
                    success:function(x){
                        var path_1=x.path;

                         // 190 240 宽高
                        var width=190;
                        var height=240
                        const ctx = wx.createCanvasContext('canvas1')

                    
                        ctx.save()
                        ctx.beginPath()
                        // ctx.setFillStyle('#ffffff');
                        // ctx.fillRect(0, 0,190,240); 

                        ctx.drawImage('../../../images/bg_ffffff.png', 0, 0, 190, 240);
                        
                        ctx.drawImage(path, (width-215/2)/2, 44/2, 215/2, 215/2);
                        // ctx.restore()
                        // ctx.draw()

                        // ctx.save()
                        // ctx.beginPath()
                        ctx.arc(width/2, 75, 20, 0, 2*Math.PI)
                        ctx.clip()
                        ctx.drawImage(path_1, width/2-20, 75-20,50,50);
                        ctx.restore()
                        // ctx.draw()

                        ctx.setFontSize(15)
                        ctx.setFillStyle('#222222');
                        ctx.setTextAlign('center')  //居中
                        ctx.setTextBaseline('top')  //水平对齐
                        ctx.fillText(ths_1.data.adminuser.userdata.username , width/2 , 306/2 )    //左右对齐方式  后面两个是中心

                        // ctx.setFillStyle('#666666');
                        // ctx.setFontSize(12);
                        // ctx.fillText('销售',width/2, 357/2);

                        ctx.setFillStyle('#666666');
                        ctx.setFontSize(12);
                        ctx.fillText(ths_1.data.adminuser.userdata.userphone,width/2,378/2);

                        ctx.setFillStyle('#666666');
                        ctx.setFontSize(12);
                        // ctx.fillText(ths_1.data.adminuser.userdata.branchname, width / 2, 424 / 2)
                        ctx.fillText("喜来婚礼 ⊙ 源自爱", width / 2, 424 / 2)
                        ctx.draw(true,function(){
                            console.log('绘制完成')
                            ths_1.getcanvas();
                        })
                            // ————————————————————

                    }
                })
                // --------
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