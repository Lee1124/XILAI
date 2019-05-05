<template>
  <div id="app">
    <router-view/>
    <div class="header">
      <div class="header_left">
        <div class="drop_down_select">
          <dropDownSelect @getSelectVal="getSelectVal"></dropDownSelect>
        </div>
        <div class="time_select">
          <time_select2 @getStartTime="getStartTime" @getEndTime="getEndTime"></time_select2>
        </div>
        <div class="input_select">
          <inputSelect :contentData="inputSelect" :selectData="selectData" :isShowAddInput="isShowAddInput"
                       :isShowSelectBox='isShowSelectBox'
                       @selectThis="selectThis" @closeSelect="closeSelect"
                       @searchNews="searchNews"
                       @searchNo="searchNo"
                       @showSelectBox="showSelectBox"
          ></inputSelect>
        </div>
      </div>
      <div class="header_right">
        <div class="btn1">
          <btn btnText="批量更改负责人" btnStyle="btn1Style" @btnEvent="allChanceEvent"></btn>
        </div>
        <div class="btn2">
          <btn btnText="新增" btnStyle="btn2Style" @btnEvent="addEvent"></btn>
        </div>
      </div>
    </div>

    <!--表格内容-->
    <div class="content">
      <tableContent :tableData="tableData" :total="total" :allYeMa="allYeMa" :pagesize="pagesize"
                    :tableHeight="tableHeight"
                    :strType="strType" :caoZuoWidth="caoZuoWidth"
                    :loading="loading" @returnBtnEvent="returnEvent"
                    @addSay="addSay"
                    @deleteRow="deleteRow"
                    @getOrder="getOrder" @editRow="editRow"
                    @getWXImgNews="getWXImgNews" @chanceLoss="chanceLoss"
                    @lossManage="lossManage"
                    @chancePerson="chancePerson"
                    @handleSelectionChange="handleSelectionChange"
                    @sortChange="sortChange"
                    @showLiuShiYuanYin="showLiuShiYuanYin"
      ></tableContent>
    </div>

    <!--弹出框-->
    <msgBox :Opacity="Opacity" :list="list" :showBox="showBox" @hideModel="hideModel"
            @yesEvent_add="yesEvent_add"
            @yesEvent_return="yesEvent_return"
            :retName="retName"
            :retCt="retCt"
            :retTime="retTime"
            :model_type="model_type"></msgBox>

    <!--显示框-->
    <diaLog :showDialogBox="showDialogBox"
            :show_chance_dialogBox="show_chance_dialogBox"
            :rowNewsText="rowNewsText"
            :show_lossManage_dialogBox="show_lossManage_dialogBox"
            :show_personChance_dialogBox="show_personChance_dialogBox"
            :show_wx_dialogBox="show_wx_dialogBox"
            :show_addSay_dialogBox="show_addSay_dialogBox"
            :personChanceSrc="personChanceSrc"
            :wxPageSrc="wxPageSrc"
            :addSayPageSrc="addSayPageSrc"
            :getText='getText'
            :lossManageData="lossManageData"
            @confirmEvent="confirmEvent"
            @cancelEvent="cancelEvent"
            @returnLossManage="returnLossManage"
            @closeTip="closeTip"
            :showLiuShiDialogBox="showLiuShiDialogBox"
            :liuShiTextAreaText="liuShiTextAreaText"
    ></diaLog>

  </div>
</template>

<script>
  import dropDownSelect from './components/drop_down_select/drop_down_select'
  import inputSelect from './components/input_select/input_select'
  import time_select2 from './components/time_select2/time_select2'
  import btn from './components/button/btn'
  import tableContent from './components/table/table_content'
  import msgBox from './components/msgBox/msgBox'
  import diaLog from './components/diaLog/diaLog'


  var myMethods = {

    //显示流失原因
    showLiuShiYuanYin(val) {
      this.show_lossManage_dialogBox = true;
      // 获取流失信息
      this.row_orderid = val.ORDER_ID;
      this.rowNewsText = val.OrderDate + val.Hotel;
      let data = {
        id: this.row_orderid
      };
      this.$axios.get(this.api + '/xlapi/SysManage/Hotel/Hotel/Getliushi', {params: data})
        .then(res => {
          if (res.status == 200) {
            this.lossManageData = res.data;
          }
        }, err => {
          console.log(err)
        })
    },

    hideLoading() {
      window.parent.document.getElementsByClassName("load_img_show")[0].style.display = "none";//onload_img
    },

    //表格选择当前行
    handleSelectionChange(obj) {
      this.handleSelectionChangeData = obj;
    },

    //排序
    sortChange(obj) {
      if (this.flag) {
        if (obj.name == '服务日期' && obj.zt == 'ascending') {
          this.orderby = 'OrderDate';
          this.asc = '';
          this.loadStartData();
        } else if (obj.name == '服务日期' && obj.zt == 'descending') {
          this.orderby = 'OrderDate';
          this.asc = 'descending';
          this.loadStartData();
        } else if (obj.name == null && obj.zt == null) {
          this.orderby = 'OrderDate';
          this.asc = '';
          this.loadStartData();
        }

        if (obj.name == '登记时间' && obj.zt == 'ascending') {
          this.orderby = '';
          this.asc = '';
          // this.timetype='adddate';
          this.loadStartData();
        } else if (obj.name == '登记时间' && obj.zt == 'descending') {
          this.orderby = 'adddate';
          this.asc = 'descending';
          // this.timetype='adddate';
          this.loadStartData();
        } else if (obj.name == null && obj.zt == null) {
          this.orderby = '';
          this.asc = '';
          // this.timetype='adddate';
          this.loadStartData();
        }
      }
    },

    //获取微信绑定等信息
    getWXImgNews(val) {
      this.row_orderid = val.obj3;
      this.getText = '';//清空
      this.show_wx_dialogBox = true;
      if (val.obj1 == '新娘') {
        this.WeddingRole = 1;
      } else if (val.obj1 == '新郞') {
        this.WeddingRole = 0;
      }
      this.getText = val.obj2;
      let OrderId = this.row_orderid;
      let openid = '';
      // this.wxPageSrc = 'http://192.168.1.253:9527/publicView/salesVolume.html?WeddingRole=' + this.WeddingRole + '&OrderId=' + OrderId + '&openid=' + openid;
      this.wxPageSrc = 'http://211.149.163.185:8090/publicView/salesVolume.html?WeddingRole=' + this.WeddingRole + '&OrderId=' + OrderId + '&openid=' + openid;
    },

    //获取微信绑定等信息回调函数
    selectusercallback(WeChatIcon, openid) {
      let data = {
        OpenId: openid,
        WeddingRole: this.WeddingRole,//负责人id
        OrderId: this.row_orderid
      };

      this.$axios.post(this.api + '/xlapi/Mini/Ins/Partners/BandDingOrderMiniUser', data)
        .then(res => {
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
            this.show_wx_dialogBox = false;
            this.loadStartData();
          }
        }, err => {
          console.log(err)
        })
    },

    //批量更改的负责人
    allChanceEvent() {
      this.row_orderidList.splice(0, this.row_orderidList.length);
      this.handleSelectionChangeData.forEach((item, index) => {
        this.row_orderidList.push(this.handleSelectionChangeData[index].ORDER_ID + ',' + this.handleSelectionChangeData[index].Recuserid)
      });
      if (this.handleSelectionChangeData == 0) {
        this.$message({
          type: 'error',
          message: '请勾选待更改的负责人!'
        });
        return false;
      } else {
        this.show_personChance_dialogBox = true;
        let author = 2;
        let openType = 'moreChange';
        // this.personChanceSrc = 'http://192.168.1.253:9527/Login/saixuan_tongyong.html?author=' + author + '&openType=' + openType;
        this.personChanceSrc = 'http://211.149.163.185:8090/Login/saixuan_tongyong.html?author=' + author + '&openType=' + openType;
      }
    },

    //批量更改负责人的回调函数
    getpassdata2(branchid, userid, name, checkType) {
      if (userid.indexOf(',') != -1) {
        this.$message({
          type: 'warning',
          message: '不能选择多人!'
        });
      } else {
        let data = {
          /*id	是	string	新负责人id
  username	是	string	负责人名称
  idlist	是	array	订单id集合
  userid	是	int	操作人*/
          id: userid,//新人id
          idlist: this.row_orderidList,//订单id集合
          username: name,//新人的名字
          userid: this.userid
        };

        this.$axios.post(this.api + '/xlapi/SysManage/Order/Orderlist/Changeaddlist', data)
          .then(res => {
            console.log(res);
            if (res.status == 200) {
              this.$message({
                type: 'success',
                message: '修改成功!'
              });
              this.show_personChance_dialogBox = false;
              this.loadStartData();
            }
          }, err => {
            console.log(err)
          })
      }
    },

    //更改负责人
    chancePerson(obj) {
      this.row_orderid = obj.ORDER_ID;
      this.row_userid = obj.Recuserid;
      let author = 2;
      let openType = 'salesPage';
      // this.personChanceSrc = 'http://192.168.1.253:9527/Login/saixuan_tongyong.html?author=' + author + '&openType=' + openType;
      this.personChanceSrc = 'http://211.149.163.185:8090/Login/saixuan_tongyong.html?author=' + author + '&openType=' + openType;
      this.show_personChance_dialogBox = true;
    },

    //筛选负责人的回调函数
    getpassdata(branchid, userid, name, checkType) {
      let data = {
        oldid: this.row_userid,//旧人id
        id: userid,//负责人id
        orderid: this.row_orderid,//订单id
        username: name,//修改人的名字
        userid: this.userid
      };

      this.$axios.post(this.api + '/xlapi/SysManage/Order/Orderlist/Changeadd', data)
        .then(res => {
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
            this.show_personChance_dialogBox = false;
            this.loadStartData();
          }
        }, err => {
          console.log(err)
        })
    },

    //增加
    addEvent() {
      this.model_type = 'add';
      this.Opacity = true;
      this.showBox = false;
    },
    //回复
    returnEvent(obj) {
      console.log(obj)
      this.model_type = 'return';
      this.Opacity = true;
      this.showBox = false;
      this.returnId = obj.id;
      this.returnTitle = obj.Title;
      $("#return_textArea").val('');
      this.retName = obj.item;
      this.retCt = obj.Contents;
      this.retTime = obj.time
    },
    //回复确认
    yesEvent_return(val) {
      if (val == '') {
        alert("回复内容不能为空");
        return false;
      }
      let data = {
        content: val,
        id: this.returnId,
        title: this.returnTitle,
        userid: this.userid,
        username: '',
      };
      this.$axios.post(this.api + '/xlapi/SysManage/Order/Orderlist/setMsg', data)
        .then(res => {
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '回复成功!'
            });
            this.loadStartData();
            this.Opacity = false;
          }
        }, err => {
          console.log(err)
        })
    },
    //取消
    hideModel() {
      this.Opacity = false;
      this.showBox = false;
      this.list.forEach((item, index, arr) => {
        item.isChoise = false;
        arr[0].isChoise = true;
      })
    },
    //新增销售机会确认事件
    yesEvent_add(val) {
      if (val == 0) {
        return false;
      }
      let type = this.strType;//权限
      var isorder = "";
      if (type == "my") {
        isorder = "2";
      } else {
        isorder = '3';
      }
      // window.location.href = "http://192.168.1.253:9527/View/Order_N/Index_New.aspx?power=edit&type=add&coustomertype=" + val + "&isorder=" + isorder
      window.location.href = "http://211.149.163.185:8090/View/Order_N/Index_New.aspx?power=edit&type=add&coustomertype=" + val + "&isorder=" + isorder
    },

    //编辑
    editRow(obj) {
      this.row_orderid = obj.ORDER_ID;
      this.row_CUSTOMER_ID = obj.coustomid;
      this.row_coustomertype = obj.coustomtype;
      /* row_coustomertype(coustomertype): '',//表当前行的客户类型
        row_CUSTOMER_ID（ CUSTOMER_ID）: '',//表当前行的客户id
        row_orderid（orderID）: '',//表当前行的订单id*/
      // window.location.href = "http://192.168.1.253:9527/View/Order_N/Index_New.aspx?coustomertype=" + this.row_coustomertype + "&orderID=" + this.row_orderid + "&CUSTOMER_ID=" + this.row_CUSTOMER_ID + "&type=branch&power=edit&isorder=2&modifiedheat=true";
      window.location.href = "http://211.149.163.185:8090/View/Order_N/Index_New.aspx?coustomertype=" + this.row_coustomertype + "&orderID=" + this.row_orderid + "&CUSTOMER_ID=" + this.row_CUSTOMER_ID + "&type=branch&power=edit&isorder=2&modifiedheat=true";
    },

    //添加沟通记录
    addSay(obj) {
      this.show_addSay_dialogBox = true;
      // this.addSayPageSrc = 'http://192.168.1.253:9527/View/CustomerManage/OrderContanct.aspx?type=pastadd' + '&id=' + obj.ORDER_ID;
      this.addSayPageSrc = 'http://211.149.163.185:8090/View/CustomerManage/OrderContanct.aspx?type=pastadd' + '&id=' + obj.ORDER_ID;
    }, //添加沟通记录
    getpassdata3(obj) {
      if (obj == '保存成功') {
        this.$message({
          type: 'success',
          message: '添加成功!'
        });
        this.show_addSay_dialogBox = false;
        this.loadStartData();
      }
    },

    //生成订单
    getOrder(val) {
      let orderid = val.ORDER_ID;
      this.$confirm('确定将此机会生成订单！', '', {
        confirmButtonText: '生成',
        cancelButtonText: '取消',
        type: '',
        customClass: 'confirmBox'
      }).then(() => {
        let data = {
          orderid: orderid,
          userid: getkevalue().userid
        };
        this.$axios.post(this.api + '/xlapi/SysManage/Order/Orderlist/shengchengOrder', data)
          .then(res => {
            if (res.status == 200) {
              this.loadStartData();
              this.$message({
                type: 'success',
                message: '生成成功!'
              });
            }
          }, err => {
            console.log(err)
          })
      }).catch(() => {

      });
    },
    //机会流失
    chanceLoss(val) {
      $("#chance_textArea").val('');
      this.show_chance_dialogBox = true;
      this.row_orderid = val.ORDER_ID;
      this.rowNewsText = val.OrderDate + val.Hotel;
    },
    //申请流失处理
    lossManage(val) {
      this.show_lossManage_dialogBox = true;
      // 获取流失信息
      this.row_orderid = val.ORDER_ID;
      this.rowNewsText = val.OrderDate + val.Hotel;
      let data = {
        id: this.row_orderid
      };
      this.$axios.get(this.api + '/xlapi/SysManage/Hotel/Hotel/Getliushi', {params: data})
        .then(res => {
          if (res.status == 200) {
            this.lossManageData = res.data;
          }
        }, err => {
          console.log(err)
        })
    },


    //删除
    deleteRow(val) {
      $("#textArea").val('');
      this.showDialogBox = true;
      this.row_orderid = val.ORDER_ID;
      this.rowNewsText = val.OrderDate + val.Hotel;
    },
    //提示框确认（包括：删除确认、流失确认、流失处理确认）
    confirmEvent(obj) {
      if (obj == 'del') {
        let content = $("#textArea").val();
        if (content == "") {
          alert("请输入删除理由");
          return false;
        }

        let data = {
          orderid: this.row_orderid,
          content: content,
          userid: getkevalue().userid,
          isdelete: '0',
        };

        this.$axios.post(this.api + '/xlapi/SysManage/Order/Orderlist/Delorder', data)
          .then(res => {
            if (res.data.msg == '删除成功!') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.showDialogBox = false;
              this.loadStartData();
            } else if (res.data.msg == '存在交款记录，是否确认删除！') {
              alert(res.data.msg);
              let data = {
                orderid: this.del_orderid,
                content: content,
                userid: getkevalue().userid,
                isdelete: '1',
              };
              this.$axios.post(this.api + '/xlapi/SysManage/Order/Orderlist/Delorder', data)
                .then(res => {
                  if (res.data.msg == '删除成功!') {
                    this.$message({
                      type: 'success',
                      message: '删除成功!'
                    });
                    this.showDialogBox = false;
                    this.loadStartData();
                  }
                })
            }
          }, err => {
            console.log(err)
          })
      } else if (obj == 'chance') {
        let content = $("#chance_textArea").val();
        let data = {
          id: this.row_orderid,
          remark: content,
          userid: getkevalue().userid,
        };
        if (content == "") {
          this.$message({
            type: 'success',
            message: '请输入流失备注!'
          });
          return false;
        }

        this.$axios.get(this.api + '/xlapi/SysManage/Hotel/Hotel/Setliushi', {params: data})
          .then(res => {
            if (res) {
              this.show_chance_dialogBox = false;
              this.loadStartData();
            }
          }, err => {
            console.log(err)
          })
      } else if (obj == 'lossManage') {
        let data = {
          id: this.row_orderid,
          state: '0',
        };
        this.$axios.get(this.api + '/xlapi/SysManage/Hotel/Hotel/Chuliliushi', {params: data})
          .then(res => {
            if (res.status == 200) {
              this.$message({
                type: 'success',
                message: '审核通过!'
              });
              this.show_lossManage_dialogBox = false;
              this.loadStartData();
            }
          }, err => {
            console.log(err)
          })
      }
    },
    //流失处理驳回
    returnLossManage() {
      let data = {
        id: this.row_orderid,
        state: '1',
      };
      this.$axios.get(this.api + '/xlapi/SysManage/Hotel/Hotel/Chuliliushi', {params: data})
        .then(res => {
          if (res.status == 200) {
            this.$message({
              type: 'success',
              message: '退回成功!'
            });
            this.show_lossManage_dialogBox = false;
            this.loadStartData();
          }
        }, err => {
          console.log(err)
        })
    },

    //删除取消
    cancelEvent() {
      this.showDialogBox = false;
      this.show_chance_dialogBox = false;
      this.show_lossManage_dialogBox = false;
    },
    //删除取消关闭
    closeTip() {
      this.showDialogBox = false;
      this.show_lossManage_dialogBox = false;
      this.show_personChance_dialogBox = false;
      this.show_wx_dialogBox = false;
      this.show_addSay_dialogBox = false;
      this.showLiuShiDialogBox = false;
    },

    //高级搜索选择
    selectThis(val) {
      if (this.flag == true) {
        let obj1 = val.obj1;
        let index2 = val.index2;
        let titleName = val.obj1.titleName;
        this.isShowAddInput = true;
        this.selectData.splice(0, this.selectData.length);//清空数组
        if (titleName == '店铺选择') {
          obj1.data[index2].isShowBorder = true;
          this.dianIDArr.splice(0, this.dianIDArr.length);//清空数组
          for (let i = 0; i < this.inputSelect.length; i++) {
            for (let j = 0; j < this.inputSelect[i].data.length; j++) {
              if (this.inputSelect[i].data[j].isShowBorder) {
                if (this.selectData.indexOf(this.inputSelect[i].data[j]) == -1) {
                  this.selectData.push(this.inputSelect[i].data[j]);
                  if (this.inputSelect[i].data[j].BRANCH_ID != undefined) {
                    this.dianIDArr.push(this.inputSelect[i].data[j].BRANCH_ID);
                  }
                }
              }
            }
          }

          this.strbranch = this.dianIDArr.join(',');
          this.loadStartData();

        } else if (titleName == '人员统计') {
          for (let i = obj1.data.length - 1; i >= 0; i--) {
            if (obj1.data[i].isShowBorder == true) {
              obj1.data[i].isShowBorder = false;
            }
          }
          obj1.data[index2].isShowBorder = true;
          for (let i = 0; i < this.inputSelect.length; i++) {
            for (let j = 0; j < this.inputSelect[i].data.length; j++) {
              if (this.inputSelect[i].data[j].isShowBorder) {
                if (this.selectData.indexOf(this.inputSelect[i].data[j]) == -1) {
                  this.selectData.push(this.inputSelect[i].data[j]);
                  if (this.inputSelect[i].data[j].USER_ID != undefined) {
                    this.rytjIDArr = this.inputSelect[i].data[j].USER_ID;
                  }
                }
              }
            }
          }
          this.selectuerid = this.rytjIDArr;
          this.loadStartData();

        } else {
          for (let i = obj1.data.length - 1; i >= 0; i--) {
            if (obj1.data[i].isShowBorder == true) {
              obj1.data[i].isShowBorder = false;
            }
          }
          obj1.data[index2].isShowBorder = true;
          for (let i = 0; i < this.inputSelect.length; i++) {
            for (let j = 0; j < this.inputSelect[i].data.length; j++) {
              if (this.inputSelect[i].data[j].isShowBorder) {
                if (this.selectData.indexOf(this.inputSelect[i].data[j]) == -1) {
                  this.selectData.push(this.inputSelect[i].data[j]);
                  if (this.inputSelect[i].data[j].PARENT_ID == 19) {
                    this.ywIDArr = this.inputSelect[i].data[j];
                  }
                  if (this.inputSelect[i].data[j].PARENT_ID == 2) {
                    this.ztIDArr = this.inputSelect[i].data[j];
                  }
                }
              }
            }
          }

          this.strfrom = this.ywIDArr.ID;
          this.strtype = this.ztIDArr.ID;
          if (this.strbranch == undefined) {
            this.strbranch = '';
          }
          if (this.strfrom == undefined) {
            this.strfrom = '';
          }
          if (this.strtype == undefined) {
            this.strtype = '';
          }
          this.loadStartData();
        }
      }
    },
    closeSelect(obj) {
      if (this.flag == true) {
        //去边框
        for (let i = 0; i < this.inputSelect.length; i++) {
          for (let j = 0; j < this.inputSelect[i].data.length; j++) {
            if (this.inputSelect[i].data[j].contentName == obj.contentName) {
              this.inputSelect[i].data[j].isShowBorder = false
            }
          }
        }

        //删除选项
        this.selectData.forEach(function (currentValue, index, arr) {
          if (currentValue.contentName == obj.contentName) {
            arr.splice(index, 1);
          }
        });


        this.dianIDArr2.splice(0, this.dianIDArr.length);//清空数组
        for (let i = 0; i < this.selectData.length; i++) {
          for (let j = 0; j < this.dianIDArr.length; j++) {
            if (this.selectData[i].BRANCH_ID == this.dianIDArr[j]) {
              if (this.dianIDArr2.indexOf(this.dianIDArr[j]) == -1) {
                this.dianIDArr2.push(this.dianIDArr[j]);
              }
            }
          }
        }

        if (this.dianIDArr2 != 0) {
          this.strbranch = this.dianIDArr2.join(',');
        } else {
          this.strbranch = ''
        }


        this.ywIDArr = '';
        this.ztIDArr = '';
        this.rytjIDArr = '';
        for (let i = 0; i < this.selectData.length; i++) {
          if (this.selectData[i].PARENT_ID == 19) {
            this.ywIDArr = this.selectData[i]
          } else {
            this.ywIDArr = ''
          }
          if (this.selectData[i].PARENT_ID == 2) {
            this.ztIDArr = this.selectData[i]
          } else {
            this.ztIDArr = ''
          }
          if (this.selectData[i].USER_ID != undefined) {
            this.rytjIDArr = this.selectData[i].USER_ID
          } else {
            console.log("进2")
            this.rytjIDArr = ''
          }
        }

        this.strfrom = this.ywIDArr.ID;
        this.strtype = this.ztIDArr.ID;
        this.selectuerid = this.rytjIDArr;
        if (this.strbranch == undefined) {
          this.strbranch = ''
        }
        if (this.strfrom == undefined) {
          this.strfrom = ''
        }
        if (this.strtype == undefined) {
          this.strtype = ''
        }
        if (this.selectuerid == undefined) {
          this.selectuerid = ''
        }
        this.loadStartData();

        if (this.selectData.length == 0) {
          this.isShowAddInput = false;
          $("#inputSelect").focus();
        }
      }
    },

    //关键词搜索
    searchNews(val) {
      if (this.flag) {
        this.username = val;
        this.loadStartData();
      }
    },
    //关键词为空搜索
    searchNo(val) {
      if (this.flag) {
        this.username = val;
        this.loadStartData();
      }
    },
    //获取光标事件
    showSelectBox() {
      $("#selectBox").show();
      this.isShowSelectBox = true;
      this.getMoreNews();
    },

    //获取店铺等信息
    getMoreNews() {
      let that = this;
      let strType = this.strType; //all or my
      let strbranch = this.strbranch; //查询店 多个店用逗号隔开
      let api = this.api;
      this.inputSelect.splice(0, this.inputSelect.length);//清空数组
      this.$axios.get(api + '/xlapi/SysManage/Order/Orderlist/RetBranlis', {
        params: {
          strType: strType,
          branid: strbranch,
          userid: this.userid
        }
      })
        .then(res => {
          if (res.data.length == 0) {
            // console.log(res.data)
            getRY(that);
          } else {
            res.data.forEach((item, index) => {//添加状态
              item.isShowBorder = false;
              if (item.selected == true) {
                item.isShowBorder = true;
              }
              item.contentName = item.BRANCH_NAME
            });
            let dPObj = {
              titleName: '店铺选择',
              data: res.data
            };

            this.inputSelect.push(dPObj);
            getRY(that);
          }
        }, err => {
          console.log(err)
        });


      //获取统计人员
      function getRY(thisObj) {
        thisObj.$axios.get(api + '/xlapi/SysManage/Order/Orderlist/RetTongjiUser', {
          params: {
            strType: strType,
            strbranch: strbranch
          }
        })
          .then(res => {
            if (res.data.length == 0) {
              getYWLY(that);
            } else {
              res.data.forEach((item, index) => {//添加状态
                item.isShowBorder = false;
                item.contentName = item.NAME
              });
              let rYObj = {
                titleName: '人员统计',
                data: res.data
              };
              thisObj.inputSelect.push(rYObj);
              getYWLY(that);
            }
          }, err => {
            console.log(err)
          })
      }

      //获取业务来源和宴会类型
      function getYWLY(thisObj) {
        thisObj.$axios.get(api + '/xlapi/SysManage/Order/Orderlist/RetYewuAndType')
          .then(res => {
            let yWLYArr = [];
            let yHTypeArr = [];
            if (res.data.length == 0) {
              console.log(res.data)
            } else {
              res.data.forEach((item, index) => {//添加状态
                item.isShowBorder = false;
                item.contentName = item.NAME;
                if (item.PARENT_ID == 19) {
                  yWLYArr.push(item)
                }
                if (item.PARENT_ID == 2) {
                  yHTypeArr.push(item)
                }

              });
              let yWObj = {
                titleName: '业务来源',
                data: yWLYArr
              };
              let yHTypeObj = {
                titleName: '宴会类型',
                data: yHTypeArr
              };
              thisObj.inputSelect.push(yWObj);
              thisObj.inputSelect.push(yHTypeObj);
              // console.log(thisObj.inputSelect)
            }
          }, err => {
            console.log(err)
          })
      }
    },

    //获取下拉选择类型
    getSelectVal(val) {
      if (this.flag) {
        if (val == 'orderdate') {
          this.timetype = val;
          this.orderby = 'OrderDate';
          this.loadStartData();
        } else {
          this.timetype = val;
          this.orderby = '';
          this.loadStartData();
        }
        // console.log(val)
        // this.timetype = val;
        // this.loadStartData();
      }
    },
    //获取开始时间
    getStartTime(val) {
      if (this.flag) {
        this.btime = val;
        this.loadStartData();
      }
    },
    //获取结束时间
    getEndTime(val) {
      if (this.flag) {
        this.etime = val;
        this.loadStartData();
      }
    },
    //加载初始数据
    loadStartData() {
      if (this.flag = true) {
        this.flag = false;
        this.loading = true;
        //=============定义全局变量=============
        let that = this;
        let strType = this.strType; //all or my
        let strbranch = this.strbranch; //查询店 多个店用逗号隔开
        let api = this.api;
        //获取表格数据
        let startParams = {
          timetype: that.timetype,
          btime: that.btime,
          etime: that.etime,
          username: that.username,
          selectuerid: that.selectuerid,
          orderby: that.orderby,
          asc: that.asc,
          strtype: that.strtype,
          strbranch: that.strbranch,
          strfrom: that.strfrom,
          strType: that.strType,
          userid: that.userid,
        };
        this.$axios.post(api + '/xlapi/SysManage/Order/Orderlist/GetDataList', startParams)
          .then(res => {
            // console.log(res.data)
            res.data.forEach((item, index) => {//添加操作图标
              item.lastTdColorZt = false;
              item.showJt = true;
              item.isMoreShow = false;
              item.isShowMore = true;
            });

            //页码、表格高度、每页显示页数
            that.tableData = res.data;
            that.total = that.tableData.length;
            let tableHeight = $(document).height() - 190;
            that.tableHeight = tableHeight;
            // let pageSize = Math.floor(tableHeight / 70);
            that.allYeMa = Math.ceil(parseInt(this.tableData.length) / 50);
            that.pagesize = 50;
            this.loading = false;
            this.flag = true;
            this.hideLoading();
          }, err => {
            console.log(err)
          });
      }
    },
  };

  export default {
    name: 'App',
    data() {
      return {
        flag: true,

        rowNewsText: '',

        retName: '',
        retCt: '',
        retTime: '',

        timetype: 'orderdate',//服务时间 orderdate 添加时间 adddate
        btime: '',//开始时间
        etime: '',//结束时间
        username: '',//关键词
        selectuerid: '',//人员统计 多个用户用,隔开
        orderby: 'OrderDate',//排序字段
        asc: '',//排序方式
        strtype: '',//庆典类型
        strbranch: '',//店查询/*2喜来成都店*/
        strfrom: '',//按照业务来源
        strType: 'all',//查看类型 个人和全部 my all
        userid: '',//当前登录人

        inputSelect: [],//高级搜索初始加载数据
        selectData: [],//高级搜索选择数据
        dianIDArr: [],//高级搜索搜索店
        dianIDArr2: [],//高级搜索搜索店
        ywIDArr: '',//高级搜索搜索来源
        ztIDArr: '',//高级搜索搜索状态
        rytjIDArr: '',//高级搜索搜索状态
        searchIdArr: [],//高级搜索选择类型ID
        isShowAddInput: false,//高级搜索框显示
        isShowSelectBox: false,//高级搜索内容框显示
        tableData: [],//表格数据

        total: 0,
        allYeMa: 0,
        pagesize: 0,
        tableHeight: 0,

        caoZuoWidth: 200,

        loading: false,
        Opacity: false,
        showBox: false,
        list: [
          {addName: '添加婚礼销售机会', isChoise: true},
          {addName: '添加宝宝宴销售机会', isChoise: false},
          {addName: '添加生日宴销售机会', isChoise: false},
          {addName: '添加添加商业庆典销售机会', isChoise: false},
          {addName: '添加网络销售机会', isChoise: false},
          {addName: '添加其他庆典销售机会', isChoise: false},
        ],
        model_type: '',


        api: '',
        returnId: '',
        returnTitle: '',

        showDialogBox: false,//删除小对话框
        show_chance_dialogBox: false,//机会流失小对话框
        show_lossManage_dialogBox: false,//申请流失处理小对话框
        show_personChance_dialogBox: false,//筛选负责人弹框
        show_wx_dialogBox: false,//微信绑定弹框状态
        show_addSay_dialogBox: false,//添加沟通记录弹框状态
        showLiuShiDialogBox: false,//查看流失原因状态
        liuShiTextAreaText: '',//查看流失原因状态
        personChanceSrc: '',//筛选负责人弹框
        wxPageSrc: '',//微信绑定弹框
        WeddingRole: 0,//微信绑定弹框
        addSayPageSrc: '',//添加沟通记录弹框
        getText: '',
        lossManageData: [],//申请流失处理获取数据

        row_orderid: '',//表当前行的orderid
        row_orderidList: [],//表多行的orderid集合
        row_userid: '',//表当前行的userid
        row_coustomertype: '',//表当前行的客户类型
        row_CUSTOMER_ID: '',//表当前行的客户id

        handleSelectionChangeData: [],//选择表当前行的数据

      }
    },
    methods: myMethods,
    components: {
      dropDownSelect: dropDownSelect,
      inputSelect: inputSelect,
      time_select2: time_select2,
      btn: btn,
      tableContent: tableContent,
      msgBox: msgBox,
      diaLog: diaLog,
    },
    mounted() {
      window.getpassdata = this.getpassdata;
      window.selectusercallback = this.selectusercallback;
      window.getpassdata2 = this.getpassdata2;
      window.getpassdata3 = this.getpassdata3;
    },
    created() {
      this.api = getkevalue().apiurl;
      this.userid = getkevalue().userid;
      this.strType = GetQueryString('type');
      if (this.strType == 'my') {
        this.caoZuoWidth = 160;
        window.document.title = "我的销售机会";
      } else if (this.strType == 'all') {
        this.caoZuoWidth = 160;
        window.document.title = "所有店销售机会";
      } else if (this.strType == 'editbranch') {
        window.document.title = "本店销售机会";
        this.strbranch = getkevalue().branchid;
        this.dianIDArr.push(parseInt(this.strbranch));
        this.caoZuoWidth = 160;
      }
      this.loadStartData();//加载初始数据
    },
  }
</script>
<style scoped>
  #app {
    padding: 10px;
  }

  .header {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: flex-start;
    padding: 5px 0 40px;
  }

  .header_left {
    display: flex;
    align-items: flex-start;
  }

  .header_right {
    display: flex;
    align-items: center;
  }

  .time_select {
    margin: 0 15px 0;
  }

  .btn1 {
    margin-right: 25px;
  }

  /*提示框样式*/
  .el-message-box__content {
    text-align: center;
  }
</style>

<style>
  .confirmBox {
    width: 250px !important;
  }

  .confirmBox .el-message-box__headerbtn {
    margin-top: -5px;
    transform: scale(1.5);
  }

  .confirmBox .el-message-box__headerbtn:hover .el-icon-close:before {
    color: #67696f !important;
  }

  .confirmBox .el-message-box__content {
    text-align: center;
  }

  .confirmBox .el-message-box__btns {
    text-align: center;
  }

  .confirmBox .el-message-box__btns button {
    height: 28px;
    padding: 0px 15px;
  }

  .confirmBox .el-message-box__btns button:nth-of-type(1) {
    border: 0;
    color: #808080;
  }

  .confirmBox .el-message-box__btns button:nth-of-type(2) {
    background: #BB9860;
    color: #fff;
    border: 0;
  }

  .confirmBox2 {
    width: 300px;
    height: 230px;
  }

  .confirmBox2 .el-message-box__btns {
    /*margin-top: 25px;*/
  }

  .confirmBox2 textarea {
    width: 100%;
  }

  .confirmBox2 .el-input__inner {
    height: 115px;
    border: 1px solid #999;
  }

  .confirmBox2 .el-input__inner:focus {
    border-color: #999
  }

  body .el-table th.gutter {
    display: table-cell !important;
  }
</style>
