var app = getApp()
var orderId;

// pages/MyService/rite/rite.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isTwo: false,
        pages: 2,
        disable: true,
        value: 123,
        date: '2016-09-01',
        height: 40,
        isShow: true,
        allClose: false,
        newbie: true,
        isBorder: true,
        isLoad: true,
        title: '',
        Data: {
            "Id": 507,
            "OrderId": "a23cb597-5f7b-413e-91b2-bbcc90805e52",
            "Date": "123",
            "FlowPath": "123",
            "FlowDetail": "123",
            "Personnel": "123",
            "Article": "",
            "Remarks": "",
            "Sort": 0,
            "Type": 0
        },
        isPopup: false,//控制弹出层显示隐藏
        showEdit: true,
        shadwShow: false,
        height: 0,
        basic: {},
        basicDataS: {},//基础上部分
        basicDataX: {},//基础下部分
        planData: {},//仪式完成后
        table2Data: [],
        floorIndex: 1,
        zhuanboObj: ['否', '是'],
        zhuanbo: '',
        isShare: false
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
        // options.orderId="6682"
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
                      // 处理黑名单用户的跳转
                      if (res.data.status == "OK" && res.data.ishmd) {
                        wx.redirectTo({
                          url: "/pages/Blacklist/Blacklist"
                        })
                        return false;
                      }
                      // 游客
                      if(res.data.code == '404'){
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
                      if (res.data.code != '3') {
                          that.setData({
                              newbie: false
                          });
                      }
                      //验证完成
                      that.setData({
                          isLoad: true,
                      });
                    }
                })
            });
        }

        //初始化数据
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
        orderId = options.orderId;
        console.log("orderid1=" + orderId);
        //获取订单当天流程
        wx.request({
            url: app.globalData.url + '/xlapi/FlowScheme/Operation/FlowScheme/GetFlowSchemeData',
            data: {
                "orderId": orderId,
                "type": 0
            },
            method: "POST",
            header: {
                Authorization: "url|1|2|xlhl|http://171.211.126.122:8092/||rolestate||0|action"
            },
            success: function (res) {
                if (res.data.status == "OK") {
                    var zhuanbo = res.data.data.modelList[1].Article == "1" ? '是' : '否';
                    that.setData({
                        zhuanbo: zhuanbo,
                        basicDataS: res.data.data.modelList[0],
                        basicDataX: res.data.data.modelList[1],
                        planData: res.data.data.modelList[res.data.data.modelList.length - 1],
                        basic: res.data.data.dic
                    });
                    var tempDataList = [];
                    res.data.data.modelList.splice(0, 2);
                    res.data.data.modelList.splice(res.data.data.modelList.length - 1, 1);
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
                        content: "出现异常",
                        showCancel: false,
                        success: function (res) {
                            if (res.confirm) {
                                that.backIndex()
                            }
                        }
                    })
                }
            }
        })
    },
    //返回首页
    backIndex(e) {
        // if (this.data.newbie)
        // {
        //   app.globalData.skip = true;
        // }
        wx.redirectTo({
            url: '/pages/validation/validation'
        })
    },
    basicText(e) {
        var t = e.target.dataset.type;
        var data = e.target.dataset.index;
        var value = e.detail.value
        if (this.data[data][t] == value) {
            return;
        }
        if (data == "basicDataX" && t == "Article") {
            this.setData({
                zhuanbo: value == "0" ? '否' : '是'
            });
        }
        var temp = this.data[data];
        temp[t] = value;
        var that = this;
        wx.request({
            url: app.globalData.url + '/xlapi/FlowScheme/Operation/FlowScheme/EditRow',
            method: "POST",
            data: { modelJson: temp },
            header: {
                Authorization: "url|1|2|xlhl|http://171.211.126.122:8092/||rolestate||0|action"
            },
            success: function (result) {
                if (result.data.status == "OK") {
                    if (data == "basicDataS") {
                        that.setData({
                            basicDataS: temp
                        });
                    } else if (data == "basicDataX") {
                        that.setData({
                            basicDataX: temp
                        });
                    }
                }
            }
        });
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
    text(e) {
        var t = e.target.dataset.type;
        var index = e.target.dataset.index;
        var value = e.detail.value;
        var model = this.data.table2Data[index]
        if (model[t] == value) {
            return;
        }
        // if (t == "Date" || t =="FlowPath")
        // {
        //   model[t]=value
        // }

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
            }
            else if (orderStatus == "其他") {
                if (arr[i].Personnel == "") {
                    arr[i].show = true;
                } else {
                    arr[i].show = false;
                }
            }
            else {
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
    chooseNav(e) {
        console.log(e);
        this.setData({
            pages: e.detail.pages
        })
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
        null_td.Sort = index + 2;
        null_td.Type = 0;
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
    }, DeleteRow(index) {
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
    // 第二页的编辑
    edit2() {
        this.setData({
            showEdit: !this.data.showEdit,
            disable: !this.data.disable
        })
    },
    // 输入字符并控制高度
    inputConetent(e) {
        let value = e.detail.value;
        console.log(value.length)
        if (value.length > 22) {
            this.setData({
                height: 80
            })
        } else {
            this.setData({
                height: 40
            })
        }
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
        }, 400)
    },
    // 控制弹出层的显示隐藏
    showPopup(e) {
        let id = e.currentTarget.dataset.id
        this.setData({
            isPopup: !this.data.isPopup,
            floorIndex: id
        })
    },
    // showArea(e) {
    //     if (this.data.disable == false) {
    //         var index = e.target.dataset.index;
    //         var model = this.data.table2Data[index];
    //         var detail = model["FlowDetail"];
    //         this.setData({
    //             shadwShow: !this.data.shadwShow,
    //             input_content: detail,
    //             detailIndex: index
    //         })
    //     }
    // },
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
    textareaChange(e) {
        var detail = e.detail.value;
        this.setData({
            input_content: detail,
        });
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
    hideShadw() {
        this.setData({
            shadwShow: !this.data.shadwShow
        })
    },
    //回到顶部
    goTop() {
        console.log('回到顶部')
        this.setData({
            set: !this.data.set
        })
        setTimeout(() => {
            this.setData({
                set: !this.data.set
            })
        })
    },
    /**
     *
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
            title: this.data.basic.GROOM_NAME + '&' + this.data.basic.BRIDE_NAME + '婚礼仪式流程',
            imageUrl: app.globalData.imgUrl + 'share.png',
            path: "/pages/validation/validation?share=true&url=" + url + "&isShare=true&orderId=" + orderId
        }
        // return {
        //   title: this.data.basic.GROOM_NAME + '&' + this.data.basic.BRIDE_NAME +'婚礼仪式流程',
        //   path: '/pages/MyService/rite/rite?orderId=' + orderId + '&isShare=true'
        // }
    }
})