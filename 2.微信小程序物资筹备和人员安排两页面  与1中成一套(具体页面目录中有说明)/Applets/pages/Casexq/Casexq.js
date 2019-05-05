// pages/Casexq/Casexq.js
var url = getApp().globalData.url;//服务器ip
var userid=getApp().globalData;//用户id
//引入图片预加载组件
const ImgLoader = require('../img-loader/img-loader.js');
var common = require('../../utils/common.js')
//保存日志savelog
var id;//详情id
Page({

  /**
   * 页面的初始数据
   */
  data: {
    casexqArr: [],//详情数据
    style:[],//风格列表
    color:[],//颜色列表
    xq_style:"",//详情风格
    xq_color:[],//详情颜色
    imgArr:[],//图片集合
    array:[],//店铺集合
    username:"",//姓名
    phone:"",//电话
    chooseSize:false,//预约遮罩层
    phonesize:false,//电话遮罩层
    //fxsize:false,//分享遮罩层
    amimationData:{},//动画数据
    index:0,//店铺数据下标
    color:"",
    id:"",//店铺id
    loading: true,
    content: false,
    defaultimg: "../../images/loading.png",
    showbg:false
  },
 
  bindChange: function (e) {
    // 弹出式
    this.setData({
      index: e.detail.value,
      color:"#000"
    })
    this.setData({
      id: this.data.array[this.data.index].id
    })
  },

  // 请求风格
  test1:function(){
    var that=this;
    //获取风格
    wx.request({
      url: url+'/xlapi/Mini/Ins/Anli/retStyleModel',
      method: "POST",
      success: function (res) {
        var xq_style = that.data.casexqArr.styles.split(",");//详情风格id
        var xq_stylecontent=[];
        for (var i = 0; i < res.data.length; i++) {
          for (var j = 0; j < xq_style.length; j++) {
            if (res.data[i].ID == xq_style[j]) {
              xq_stylecontent.push(res.data[i].NAME);
            }
          }
        }
        that.setData({
          xq_style:xq_stylecontent.join("、")
        })
        that.test2();
      }
    });
  },
  //请求颜色
  test2:function(){
    var that=this;
    //获取颜色
    wx.request({
      url: url+'/xlapi/Mini/Ins/Anli/retColorModel',
      method: "POST",
      success: function (res) {
        var xq_color = that.data.casexqArr.colors.split(",");//详情颜色id
        var xq_colorcontent = [];
        console.log(that.data.casexqArr)
        for (var i = 0; i < res.data.length; i++) {
          for (var j = 0; j < xq_color.length; j++) {
            if (res.data[i].ID == xq_color[j]) {
              console.log(res.data[i].ImageUrl)
              xq_colorcontent.push("#"+res.data[i].ImageUrl);
            }
          }
        }
        that.setData({
          xq_color: xq_colorcontent
        });
        that.test3();
      }
    })
  },
  //请求图片
  test3:function(){
    var that=this;
    //获取图片集合
    wx.request({
      url: url + '/xlapi/Mini/Ins/Anli/getImg?id=' + id,
      method: "GET",
      success: function (res) {
        console.log("2", res.data)
        that.setData({
          imgArr: res.data
        })
        //初始化图片预加载组件，并指定统一的加载完成回调
        that.imgLoader = new ImgLoader(that, that.imageOnLoad.bind(that));
        that.data.imgArr.forEach(item => {
          that.imgLoader.load(item.img1)
        });
      }
    })
  },
  // 预约获取姓名
  // username:function(e){
  //   console.log(e.detail.value)
  // },
  // phone:function(e){
  //   console.log(e.detail.value)
  // },
  formSubmit:function(e){
    console.log(e)
    var data=e.detail.value;
    data.id=this.data.id;//店铺id
    console.log(data.id)
    data.openid=userid.openid;//用户id
    var that=this;
    //判断电话是否合法
    var reg = /^[1][3,4,5,7,8][0-9]{9}$/;//正则判断手机号
    if (data.id==""||data.id==undefined) {
      wx.showModal({
        title: '提示',
        content: '请选择喜来店铺',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else {
            console.log('用户点击取消')
          }
          that.setData({
            color: "#808080"
          })
        }
      })
      return false; 
    }else if(!reg.test(data.phone)){
      //手机号不合法
      wx.showModal({
        title: '提示',
        content: '手机号输入不合法！！！',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else {
            console.log('用户点击取消')
          }
        }
      })
      return false;
    }else{
      wx.request({
        url: url + '/xlapi/Mini/Ins/Anli/UserSub',
        method: "POST",
        data: data,
        success: function (res) {
          console.log("成功")
          wx.showToast({
            title: '预约成功',
            icon: 'succes',
            duration: 1900,
            mask: true
          });
          that.setData({
            index:0,
            color:"#d9d9d9",
            value:""
          });
          //隐藏预约
          that.hideModal();
        }
      })
    }
  },
  //加载完成后的回调
  imageOnLoad(err, data) {
    const imgList = this.data.imgArr.map(item => {
      if (item.img == data.img1)
      this.setData({
        loaded: true
      })
      return item
    })
    this.setData({ imgList })
  },
    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.share_query=="true")
    {
      this.setData({
        showbg:true
      })
      //var that = this;
      // setTimeout(function () {
      //   that.setData({
      //     showbg: false
      //   })
      //   console.log(that.data.showbg);
      //   console.log("xasdasdas")
      // }, 2000) 
    }
    id=options.id;
    var that=this;
    //获取详情数据
    wx.request({
      url: url+'/xlapi/Mini/Ins/Anli/getModel?id=' + id,
      method: "POST",
      success: function (res) {
        that.setData({
          casexqArr: res.data,//详情
          loading:false
        })
        // 设置标题
        wx.setNavigationBarTitle({
          title: that.data.casexqArr.Cname,
        })
        if (that.data.loading == false) {
          that.setData({
            content: true
          })
        }
        that.test1();
      }
    });
    //浏览记录
    this.AddVisit(getApp().globalData.openid,id);
    //获取店铺
    wx.request({
      url: url + '/xlapi/Mini/Ins/Anli/RetStore',
      method: "GET",
      success: function (res) {
        res.data.splice(0, 0, { name: "选择喜来店铺" })
        that.setData({
          array: res.data
        })
      }
    });
  },
  //浏览记录123
  AddVisit: function (userId, AppId){

    // wx.request({
    //   url: url + '/xlapi/Mini/Ins/Anli/AddVisit',
    //   data:{
    //     "userId": userId, "AppId": AppId
    //   },
    //   method:"POST",
    //   success:function(){}
    // })
    getApp().SaveLog(AppId, "2","");

  },
  //关闭背景
  stopbgShow: function () {
    this.setData({
      showbg: false
    })
  },
  //底部弹框动画
  yuyue:function(e){
    var that=this;
    // 创建一个动画实例
    var animation = wx.createAnimation({
      // 动画持续时间
      duration: 500,
      // 定义动画效果，当前是匀速
      timingFunction: 'linear'
    })
    // 将该变量赋值给当前动画
    that.animation = animation
    // 先在y轴偏移，然后用step()完成一个动画
    animation.translateY(0).step()
    // 用setData改变当前动画
    that.setData({
      // 通过export()方法导出数据
      animationData: animation.export(),
      // 改变view里面的Wx：if
      chooseSize: true
    })
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 0)
  },
  //电话沟通效果
  phone: function (e) {
    // var that = this;
    // // 创建一个动画实例
    // var animation = wx.createAnimation({
    //   // 动画持续时间
    //   duration: 500,
    //   // 定义动画效果，当前是匀速
    //   timingFunction: 'linear'
    // })
    // // 将该变量赋值给当前动画
    // that.animation = animation
    // // 先在y轴偏移，然后用step()完成一个动画
    // animation.translateY(200).step()
    // // 用setData改变当前动画
    // that.setData({
    //   // 通过export()方法导出数据
    //   animationData: animation.export(),
    //   // 改变view里面的Wx：if
    //   phonesize: true
    // })
    // // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    // setTimeout(function () {
    //   animation.translateY(0).step()
    //   that.setData({
    //     animationData: animation.export()
    //   })
    // }, 200)

    wx.makePhoneCall({
      phoneNumber: '4009951520',
      success: function (e) {
        //保存日志
        getApp().SaveLog("400", "3", "");
        console.log("拨打电话成功");
      },
      fail: function (e) {
        console.log("拨打电话失败");
      },
      complete: function (e) {
        console.log("拨打电话结束");
      }
    })
  },
  // fenx: function (e) {
  //   var that = this;
  //   // 创建一个动画实例
  //   var animation = wx.createAnimation({
  //     // 动画持续时间
  //     duration: 500,
  //     // 定义动画效果，当前是匀速
  //     timingFunction: 'linear'
  //   })
  //   // 将该变量赋值给当前动画
  //   that.animation = animation
  //   // 先在y轴偏移，然后用step()完成一个动画
  //   animation.translateY(200).step()
  //   // 用setData改变当前动画
  //   that.setData({
  //     // 通过export()方法导出数据
  //     animationData: animation.export(),
  //     // 改变view里面的Wx：if
  //     fxsize: true
  //   })
  //   // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
  //   setTimeout(function () {
  //     animation.translateY(0).step()
  //     that.setData({
  //       animationData: animation.export()
  //     })
  //   }, 200)
  // },
  // 点击遮罩层隐藏
  hideModal: function (e) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(200).step()
    that.setData({
      animationData: animation.export()

    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        chooseSize: false
      })
    }, 200)
    that.setData({
      index: 0,
      color: "#222222",
      value: ""
    });
  },
  ph_hideModal: function (e) {
    var that = this;
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'linear'
    })
    that.animation = animation
    animation.translateY(200).step()
    that.setData({
      animationData: animation.export()

    })
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export(),
        phonesize: false
      })
    }, 200)
  },
  // fx_hideModal:function(e) {
  //   var that = this;
  //   var animation = wx.createAnimation({
  //     duration: 1000,
  //     timingFunction: 'linear'
  //   })
  //   that.animation = animation
  //   animation.translateY(200).step()
  //   that.setData({
  //     animationData: animation.export()

  //   })
  //   setTimeout(function () {
  //     animation.translateY(0).step()
  //     that.setData({
  //       animationData: animation.export(),
  //       fxsize: false
  //     })
  //   }, 200)
  // },
  // 拨打电话
  callphone:function(e){
    wx.makePhoneCall({
      phoneNumber:e.currentTarget.dataset.phone,
    });
    this.ph_hideModal();
  },
  // 分享微信好友
  onShareAppMessage: function (res) {
    var desc = this.data.casexqArr.describe.substring(15, 0);
    
   return {
     title: ' ',//this.data.casexqArr.Cname,
     desc: desc,
     //imageUrl: this.data.casexqArr.Cimg
     path: "/pages/validation/validation?share=true&url=/pages/Casexq/Casexq&share_query=true&id=" + this.data.casexqArr.id
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
  zixun(){
    wx.navigateTo({    
      url: '/pages/message/message?id='+id,
    }) 
  },
  BackSY:function(r){
    console.log(this.data.showbg);
    if(this.data.showbg)
    {
      wx.redirectTo({
        url: '/pages/Cases/Cases'
      })
    }
    else{
      wx.navigateBack({
        delta: 1
      })
    }
  }
})