// pages/MyService/flow/flow.js
var app = getApp();
var orderId;
import utils from '../../../utils/totalUtil'

const xiaoshi = [];
const xiaoshi_1 = ['--'];
const fenzhong = [];
const fenzhong_1 = ['--'];
for (let i = 0; i <= 23; i++) {
    xiaoshi.push(i<10 ? '0'+i : i)
    xiaoshi_1.push(i<10 ? '0'+i : i)
}
for (let i = 0 ; i <= 59; i++) {
    fenzhong.push(i<10 ? '0'+i : i)
    fenzhong_1.push(i<10 ? '0'+i : i)
}

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isTwo: true,
        isLoad: true,
        Data: {},
        basic: {},//基础数据
        table2Data: [],//流程
        personArray: ["全部人员"],//人员
        disable: true,
        allClose: false,
        date: '2016-09-01',
        pages: 2,
        value: '测试数据',
        isShow: true,//控制卡片内容缩放
        isPopup: false,
        showEdit: true,
        shadwShow: false,
        isBorder: false,
        floorIndex: 1,
        detailIndex: 0,
        isShare: false,
        height: 0,
        newbie: true,
        title: '',
        set: false, //控制是否返回顶部
        // ---------------
        xiaoshi: xiaoshi,
        xiaoshi_1: xiaoshi_1,
        fenzhong: fenzhong,
        fenzhong_1: fenzhong_1,
        value1: [8,0,0,0,0,0,0],
        zhi:['至'],
        dian:[':'],
        pickerview:false,

        index:0,    //输入框返回的index

    },
    open(e){
        if(!this.data.disable){
            var index = e.target.dataset.index;
            this.setData({
                'pickerview':true,
                'index':index
            })
        }
    },
    //取消
    close_1(){
        this.setData({
            'pickerview':false
        })
    },
    //确定
    close_2(){
        var that = this;
        console.log(this.data.value1);
        var val=this.data.value1;
        var time=this.data.xiaoshi[val[0]]+':'+this.data.fenzhong[val[2]];
        if(val[4]!=0 || val[6]!=0){
            var index=val[4]==0 ? 1 : val[4];
            var index_1=val[6]==0 ? 1 :val[6];
            time+='-'+this.data.xiaoshi_1[index]+':'+this.data.fenzhong_1[index_1]
        }
        var model = this.data.table2Data[this.data.index];
            model['Date']=time
            wx.request({
                url: app.globalData.url + '/xlapi/FlowScheme/Operation/FlowScheme/EditRow',
                method: "POST",
                data: { modelJson: model },
                header: {
                    Authorization: "url|1|2|xlhl|http://171.211.126.122:8092/||rolestate||0|action"
                },
                success: function (result) {
                    if (result.data.status == "OK") {

                        var modelList = that.data.table2Data;
                            modelList[that.data.index] = model;
                        that.setData({
                            'table2Data': modelList
                        });
                    }
                }
            });        
        console.log(time)
        this.setData({
            'pickerview':false
        })
    },
    //选择时间
    bindChange: function(e) {
        console.log(e);
        const val = e.detail.value
        this.setData({
            value1:val
        })
    },
    text(e) {
        var t = e.target.dataset.type;
        var index = e.target.dataset.index;
        var value = e.detail.value;
        var model = this.data.table2Data[index]
        if (model[t] == value) {
            return;
        }
        model[t] = value;
        var that = this;
        wx.request({
            url: app.globalData.url + '/xlapi/FlowScheme/Operation/FlowScheme/EditRow',
            method: "POST",
            data: { modelJson: model },
            header: {
                Authorization: "url|1|2|xlhl|http://171.211.126.122:8092/||rolestate||0|action"
            },
            success: function (result) {
                if (result.data.status == "OK") {
                    var modelList = that.data.table2Data;
                    modelList[index] = model;
                    that.setData({
                        table2Data: modelList
                    });
                    if (t == "Personnel") {
                        that.shanxuan(that);
                    }
                }
            }
        });
    },
    basicText(e) {
        var t = e.target.dataset.type;
        var value = e.detail.value
        if (this.data.Data[t] == value) {
            return;
        }
        var temp = this.data.Data;
        temp[t] = value;
        this.setData({
            Data: temp
        })
        wx.request({
            url: app.globalData.url + '/xlapi/FlowScheme/Operation/FlowScheme/EditRow',
            method: "POST",
            data: { modelJson: this.data.Data },
            header: {
                Authorization: "url|1|2|xlhl|http://171.211.126.122:8092/||rolestate||0|action"
            },
            success: function (result) {
                if (result.status == "OK") {

                }
            }
        });
    },
    shanxuan(that) {
        var arr = that.data.table2Data;
        var n = [];
        n.push("全部人员");
        for (var i = 0; i < arr.length; i++) {
            if (n.indexOf(arr[i].Personnel) == -1) {
                if (arr[i].Personnel != '')
                    n.push(arr[i].Personnel);
            }
        }
        n.push("其他");
        that.setData({
            personArray: n
        })
    },
    statusClick: function (e) {
        var arr = this.data.table2Data;
        var orderStatus = this.data.personArray[e.detail.value];
        for (var i = 0; i < arr.length; i++) {
            if (orderStatus == "全部人员") {
                arr[i].show = true;
            } else if (orderStatus == "其他") {
                if (arr[i].Personnel == "") {
                    arr[i].show = true;
                } else {
                    arr[i].show = false;
                }
            } else {
                if (arr[i].Personnel == orderStatus) {
                    arr[i].show = true;
                } else {
                    arr[i].show = false;
                }
            }
        }
        this.setData({
            table2Data: arr,
            title: orderStatus
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        //获取手机高度
        var screenHeight = wx.getSystemInfo({
            success: function (res) {
                screenHeight = res.windowHeight;
                that.setData({
                    height: screenHeight - 127
                });
            }
        })

        // 初始化数据
        if (options.orderId == undefined || options.orderId == 'undefined') {
            wx.showModal({
                title: '提示',
                content: '参数错误',
                showCancel: false,
                success: function (res) {
                    if (res.confirm) {
                        that.backIndex()
                    }
                }
            })
        }
        //是不是转发进入
        if (options.isShare == "true") {
            this.setData({
                isShare: true,
                isLoad: false
            });
            app.getUserInfo().then(function (res) {
                // 获取当前用户状态
                wx.request({
                  url: getApp().globalData.url + '/xlapi/Mini/Ins/Partners/GetUserOrderIdentity',
                  method: 'POST',
                  data: { OpenId: getApp().globalData.openid, OrderId: options.orderId },
                  success: function (res) {
                    console.log("当前用户状态,hahahaahaa", res);
                    // 返回   0游客  1员工  2客户
                    console.log("12121212121212", res.data);
                    if (res.data.data == 0) {
                      that.setData({
                        newbie: false
                      });
                    }
                    if (res.data.data == 1) {
                      that.setData({
                        newbie: true
                      });
                    }
                    if (res.data.data == 2) {
                      that.setData({
                        newbie: true
                      });
                    }
                  }
                })
                //身份验证
                wx.request({
                    url: getApp().globalData.url + '/xlapi/Authentication/AppletUser/Authentication/OpenIdVerify',
                    method: 'POST',
                    data: { openId: getApp().globalData.openid, orderId: options.orderId },
                    success: function (res) {
                      console.log("hahahaahaahahahaahaa---");
                      // 处理黑名单用户的跳转
                      if (res.data.status == "OK" && res.data.ishmd) {
                        wx.redirectTo({
                          url: "/pages/Blacklist/Blacklist"
                        })
                        return false;
                      }
                      if (res.data.code == "404") {
                        // wx.redirectTo({
                        //   url: '/pages/Login/Login'
                        // })
                        that.setData({
                          isLoad: true,
                        });
                        return false;
                      }
                      // 是否是-预约成功的游客
                      if (res.data.status == "OK" && res.data.yymodel.status) {
                        app.globalData.isYuYueOk = true;
                        var data_ = res.data.yymodel.branchdata;
                        app.globalData.dianpuName = data_.name;
                        app.globalData.dianpuPhone = data_.tel;
                        app.globalData.youkeName = res.data.yymodel.userda;
                        wx.redirectTo({
                          url: '/pages/Login/Login'
                        })
                        return false;
                      }
                      //验证完成
                      that.setData({
                          isLoad: true,
                      });
                    }
                })
            });
        }


        orderId = options.orderId;
        //获取订单当天流程
        wx.request({
            url: app.globalData.url + '/xlapi/FlowScheme/Operation/FlowScheme/GetFlowSchemeData',
            data: {
                "orderId": orderId,
                "type": 1
            },
            method: "POST",
            header: {
                Authorization: "url|1|2|xlhl|http://171.211.126.122:8092/||rolestate||0|action"
            },
            success: function (res) {
                if (res.data.status == "OK") {
                    that.setData({
                        Data: res.data.data.modelList[0],
                        basic: res.data.data.dic
                    });
                    console.log(res.data.data.dic);
                    var tempDataList = [];
                    res.data.data.modelList.splice(0, 1);
                    for (var i = 0; i < res.data.data.modelList.length; i++) {
                        res.data.data.modelList[i].show = true;
                        res.data.data.modelList[i].isShow = false;
                    }
                    that.setData({
                        table2Data: res.data.data.modelList,
                    });
                    that.shanxuan(that)
                } else {
                    wx.showModal({
                        title: '提示',
                        content: res.errorMsg,
                        showCancel: false,
                        success: function (res) {
                            if (res.confirm) {
                                wx.navigateBack({});
                            }
                        }
                    })
                }
            }
        })
    },
    closeAll() {
        var modelList = this.data.table2Data;
        for (var i = 0; i < modelList.length; i++) {
            modelList[i].isShow = false;
        }
        this.setData({
            table2Data: modelList,
            allClose: false,
        });
    },
    openAll() {
        var modelList = this.data.table2Data;
        for (var i = 0; i < modelList.length; i++) {
            modelList[i].isShow = true;
        }
        this.setData({
            table2Data: modelList,
            allClose: true,
        });
    },
    chooseNav(e) {
        this.setData({
            pages: e.detail.pages
        })
    },
    // 选择时间
    changeTime(e) {
        this.setData({
            date: e.detail.value
        })
    },
    // 点击编辑
    edit() {
        this.setData({
            disable: false
        })
    },
    showCard(e) {
        var index = e.currentTarget.dataset.index;
        var modelList = this.data.table2Data;
        modelList[index].isShow = !modelList[index].isShow;
        this.setData({
            table2Data: modelList
        })
        setTimeout(() => {
            this.setData({
                isBorder: !this.data.isBorder
            })
        }, 10)
    },

    //控制弹出层的显示隐藏
    showPopup(e) {
        let id = e.currentTarget.dataset.id
        this.setData({
            isPopup: !this.data.isPopup,
            floorIndex: id
        })
    },

    // 控制多行输入框的显示和隐藏
    showArea(e) {
      var type_ = e.currentTarget.dataset.type;
      if (this.data.disable == false) {
        var index = e.target.dataset.index;
        var model = this.data.table2Data[index];
        
        // 内容
        if (type_ == "content") {
          var detail = model["FlowDetail"];
          this.setData({
            shadwShow: !this.data.shadwShow,
            input_content: detail,
            detailIndex: index,
            input_title: '内容'
          })
        }
        // 内容
        if (type_ == "remark") {
          var detail = model["Remarks"];
          this.setData({
            shadwShow: !this.data.shadwShow,
            input_content: detail,
            detailIndex: index,
            input_title: '备注'
          })
        }
        // 人员
        if (type_ == "ry") {
          var detail = model["Personnel"];
          this.setData({
            shadwShow: !this.data.shadwShow,
            input_content: detail,
            detailIndex: index,
            input_title: '人员'
          })
        }
        // 物品
        if (type_ == "wp") {
          var detail = model["Article"];
          this.setData({
            shadwShow: !this.data.shadwShow,
            input_content: detail,
            detailIndex: index,
            input_title: '物品'
          })
        }
        
      }
    },
    inputSure(e) {
        var index = this.data.detailIndex;
        var modelList = this.data.table2Data;
        var model = modelList[index];
      if (this.data.input_title == "内容") {
        model["FlowDetail"] = this.data.input_content;
      }
      if (this.data.input_title == "备注") {
        model["Remarks"] = this.data.input_content;
      }
      if (this.data.input_title == "人员") {
        model["Personnel"] = this.data.input_content;
      }
      if (this.data.input_title == "物品") {
        model["Article"] = this.data.input_content;
      }
        var that = this;
        wx.request({
            url: app.globalData.url + '/xlapi/FlowScheme/Operation/FlowScheme/EditRow',
            method: "POST",
            data: { modelJson: model },
            header: {
                Authorization: "url|1|2|xlhl|http://171.211.126.122:8092/||rolestate||0|action"
            },
            success: function (result) {
                if (result.data.status == "OK") {

                    that.setData({
                        shadwShow: !that.data.shadwShow,
                        table2Data: modelList
                    });
                }
            }
        });
    },
    textareaChange(e) {
        var detail = e.detail.value;
        this.setData({
            input_content: detail,
        });
    },
    hideShadw() {
        this.setData({
            shadwShow: !this.data.shadwShow
        })
    },
    DeleteRow(index) {
        //删除行
        var modelList = this.data.table2Data;
        var model = modelList[index];
        var that = this;
        wx.request({
            url: app.globalData.url + '/xlapi/FlowScheme/Operation/FlowScheme/DeleteRow',
            method: "POST",
            data: { modelJson: model },
            header: {
                Authorization: "url|1|2|xlhl|http://171.211.126.122:8092/||rolestate||0|action"
            },
            success: function (result) {
                if (result.data.status == "OK") {
                    modelList.splice(index, 1);
                    that.setData({
                        isPopup: !that.data.isPopup,
                        table2Data: modelList
                    });
                }
            }
        });
    },
    //第二页显示编辑按钮
    edit2() {
        this.setData({
            showEdit: !this.data.showEdit,
            disable: !this.data.disable
        })
    },
    //返回首页
    backIndex(e) {
        // if (this.data.newbie) {
        //   app.globalData.skip = true;
        // }
        wx.redirectTo({
            url: '/pages/validation/validation'
        })
    },
    // 回到顶部
    goTop() {
        this.setData({
            set: !this.data.set
        })
        setTimeout(() => {
            this.setData({
                set: !this.data.set
            })
        })
    },
    addPrev(e) {
        let type = e.detail.type;

        if (type == 1) {
            let idx = this.data.floorIndex;
            this.AddRow(idx);
        } else if (type == 2) {
            let idx = this.data.floorIndex + 1;
            this.AddRow(idx);
        } else {
            var index = this.data.floorIndex;
            this.DeleteRow(index);
        }
    },
    AddRow(index) {
        //表格添加空数据
        var null_td = new Object();
        null_td.Id = 0;
        null_td.Date = "";
        null_td.FlowPath = "";
        null_td.Personnel = "";
        null_td.Article = "";
        null_td.Remarks = "";
        null_td.show = true;
        null_td.isShow = true;
        null_td.Sort = index + 1;
        null_td.Type = 1;
        null_td.OrderId = orderId;
        var that = this;
        wx.request({
            url: app.globalData.url + '/xlapi/FlowScheme/Operation/FlowScheme/AddRow',
            method: "POST",
            data: { modelJson: null_td },
            header: {
                Authorization: "url|1|2|xlhl|http://171.211.126.122:8092/||rolestate||0|action"
            },
            success: function (res) {
                if (res.data.status == "OK") {
                    let arr = that.data.table2Data;
                    null_td.Id = res.data.data;
                    arr.splice(index, 0, null_td)
                    that.setData({
                        isPopup: !that.data.isPopup,
                        table2Data: arr
                    });
                } else {
                    wx.showModal({
                        title: '错误',
                        content: '添加流程出现异常',
                        showCancel: false,
                        success: function (res) {
                            if (res.confirm) {
                            }
                        }
                    })
                }
            }
        })
    },
    save(e) {

        this.setData({
            disable: true
        });
    },

    // 提交表单
    formSubmit(e) {
        console.log("xasd");
        let value = e.detail.value;
        let obj = {}
        obj.manName = value.manName;
        obj.manAddress = value.manAddress;
        obj.womanName = value.womanName
        obj.womanAddress = value.womanAddress
        obj.marryTime = value.date;
        obj.marryTime = value.marryTime
        obj.people = value.peopleNum
        for (let key in obj) {
            if (!obj[key]) {
                wx.showModal({
                    title: '提示',
                    content: '请完成表单',
                    showCancel: false,
                })
                return
            }
        }

    },
    empty(data) {
        return typeof data === 'undefined' || data === null || data === ''
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
            title: this.data.basic.GROOM_NAME + '&' + this.data.basic.BRIDE_NAME + '婚礼当天流程',
            imageUrl: app.globalData.imgUrl + 'share.png',
            path: "/pages/validation/validation?share=true&url=" + url + "&isShare=true&orderId=" + orderId
        }
        // return {
        //   title: this.data.basic.GROOM_NAME + '&' + this.data.basic.BRIDE_NAME + '婚礼当天流程',
        //   path: '/pages/MyService/flow/flow?orderId=' + orderId + '&isShare=true'
        // }
    }
})