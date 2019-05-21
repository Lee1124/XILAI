<template>
  <div id="store-classify-page">
    <ul>
      <template v-for="(item,index) in list">
        <li>
          <div class="list-top">
            <div class="list-top-01">
              <span class="title" v-text="item.DictionaryGroupName"></span>
              <span class="addBtn" @click="addShop(item)"><i></i>添加</span>
            </div>
            <div class="list-top-02">
              <dropDownSelect @getSelectZT="getSelectZT" :data="item"></dropDownSelect>
            </div>
          </div>
          <div class="list-bottom">
            <dl>
              <template v-for="item2 in item.BranchList">
                <dd v-cloak v-show="item2.isShow" :id="item2.City">{{item2.BranchName}}
                  <span class="del"><img src="../../../static/img/close.png" alt="删除"
                                         @click="removeThisClass(item2)"></span>
                </dd>
              </template>
            </dl>
          </div>
        </li>
      </template>
    </ul>

    <el-dialog
      title=""
      :visible.sync="showDialogViewBox"
      :show-close=false
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="dialogViewBox"
      center>
      <i class="closeIcon" @click="closeTip">
        <img src="../../../static/img/close4.png" alt="关闭">
      </i>
      <div class="content">
        <iframe :src="shopChoiceUrl" frameborder="0"></iframe>
      </div>
      <span slot="footer" class="dialog-footer">
        </span>
    </el-dialog>
  </div>
</template>

<script>
  import dropDownSelect from '../drop-down-select/drop-down-select'
  import index from "../../router";

  let myData = {
    api: getkevalue().apiurl,
    // Authorization: 'http://211.149.163.185:8090/|1|22|xlhl|http://171.211.126.122:8091/|http://171.211.126.122:8092/|1,1|http://192.168.1.253:8095|https://xilai99.com',
    Authorization: localStorage.userinfo,

    showDialogViewBox: false,
    shopChoiceUrl: '',
    url2:'http://211.149.163.185:8090/commonPages/shopChoicePage/shop-choice.html?type=getShopId',//211用
    // url2:'http://192.168.1.253:9527/commonPages/shopChoicePage/shop-choice.html?type=getShopId',//253用
    list: [],
    shopArr: [],

    DictionaryId: '',//当前分组id
    no:Math.random(),
  };
  let myMethods = {
    //获取初始列表
    getList() {
      let url = this.api + '/xlapi/SysManage/BranchManage/BranchGroups/GetSearchGroupList?no='+this.no;
      this.$axios({
        method: 'POST',
        url: url,
      }).then(res => {
        res.data.data.forEach((item, index, arr) => {
          arr[index].BranchList.forEach((item2, index2, arr2) => {
            arr2[index2].isShow = true;
          });
        });
        this.list = res.data.data;
        this.hideLoading();
      })
    },
    addShop(itemObj) {
      this.showDialogViewBox = true;
      this.shopChoiceUrl = this.url2;
      this.DictionaryId = itemObj.DictionaryId;
    },
    //关闭弹框
    closeTip() {
      this.showDialogViewBox = false;
      this.shopChoiceUrl = '';
    },
    getShopId(arrObj) {
      if (arrObj.length > 1) {
        this.$message.error('只能选择一个店铺！');
        return false;
      } else {
        this.addThisTypeClassShop(arrObj[0].id);
      }
    },
    // 添加到当前分组
    addThisTypeClassShop(shopIdObj) {
      let url = this.api + '/xlapi/SysManage/BranchManage/BranchGroups/AddBranchGroupItem?no='+this.no;
      let data = {
        DictionaryId: this.DictionaryId,	//是	int	分组id
        AddBranchId: shopIdObj,	//是	int	店id
      };
      this.$axios({
        method: 'POST',
        url: url,
        data: data,
      }).then(res => {
        if (res.status == 200) {
          if (res.data.msg == '新增成功') {
            this.$message({
              message: '添加成功!',
              type: 'success'
            });
            this.getList();
            this.closeTip();
          } else {
            this.$message.error(res.data.msg);
          }
        }
      })
    },
    // 移除分组
    removeThisClass(itemObj) {
      let url = this.api + '/xlapi/SysManage/BranchManage/BranchGroups/DeleteBranchGroupItem?no='+this.no;
      let data = {
        DeleteItemId: itemObj.ItemId,	//id
      };
      this.$axios({
        method: 'POST',
        url: url,
        data: data,
      }).then(res => {
        if (res.status == 200) {
          this.$message({
            message: '移除成功!',
            type: 'success'
          });
          this.getList();
        }
      })
    },
    //选择地区触发
    getSelectZT(obj) {
      if (obj.val == -1) {
        this.list.forEach((item, index, arr) => {
          if (arr[index].DictionaryId == obj.itemObj.DictionaryId) {
            arr[index].BranchList.forEach((item2, index2, arr2) => {
              arr2[index2].isShow = true;
            })
          }
        });
      } else {
        this.list.forEach((item, index, arr) => {
          if (arr[index].DictionaryId == obj.itemObj.DictionaryId) {
            arr[index].BranchList.forEach((item2, index2, arr2) => {
              arr2[index2].isShow = false;
            })
          }
        });
        this.list.forEach((item, index, arr) => {
          if (arr[index].DictionaryId == obj.itemObj.DictionaryId) {
            arr[index].BranchList.forEach((item2, index2, arr2) => {
              if (arr2[index2].City == obj.val) {
                arr2[index2].isShow = true;
              }
            })
          }
        });
      }
    },
    //隐藏加载图标
    hideLoading() {
      window.parent.document.getElementsByClassName("load_img_show")[0].style.display = "none";//onload_img
    },
  };
  export default {
    name: "store-classify-page",
    data() {
      return myData;
    },
    methods: myMethods,
    created() {
      this.$nextTick(() => {
        this.getList();
      });
      window.closeTip = this.closeTip;
      window.getShopId = this.getShopId;
    },
    components: {
      dropDownSelect: dropDownSelect
    }
  }
</script>

<style scoped>
  [v-cloak] {
    display: none;
  }

  #store-classify-page {
    height: 100%;
    padding: 40px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  #store-classify-page > ul {
    height: 100%;
    margin: 0;
  }

  #store-classify-page > ul > li {
    width: 250px;
    height: 100%;
    box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    float: left;
    margin-right: 50px;
    padding: 20px 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    position: relative;
  }

  .list-top {
    padding: 0 15px;
  }

  .title {
    color: #BB9860;
    font-size: 16px;
  }

  .title::before {
    content: '';
    display: inline-block;
    height: 16px;
    width: 4px;
    background: #BB9860;
    vertical-align: -2px;
    margin-right: 10px;
  }

  .addBtn {
    float: right;
    color: #B2B2B2;
    font-size: 14px;
    cursor: pointer;
    margin-top: 1px;
  }

  .addBtn i {
    width: 15px;
    height: 15px;
    display: inline-block;
    background: url("../../../static/img/add0.png") no-repeat center center;
    vertical-align: -3px;
    margin-right: 6px;
  }

  .addBtn:hover {
    color: #BB9860;
  }

  .addBtn:hover i {
    background: url("../../../static/img/add1.png") no-repeat center center;
  }

  .list-top-02 {
    margin: 25px 0;
  }

  .list-bottom {
    /*padding: 0 10px 0 0;*/
    width: 240px;
    position: absolute;
    top: 120px;
    bottom: 20px;
    /*width: 100%;*/
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    overflow: auto;
  }

  dl, dd {
    margin: 0;
    color: #4C4C4C;
  }

  dl {
    padding: 0 3px;
  }

  dl > dd {
    height: 46px;
    line-height: 46px;
    padding: 0 13px 0 33px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    position: relative;
  }

  dl > dd {
    /*transition: all .3s;*/
  }

  dl > dd:hover {
    background: #F2EEE8;
  }

  .del {
    visibility: hidden;
    /*transition: all .3s;*/
  }

  dl > dd:hover .del {
    visibility: visible;
  }

  .del img {
    cursor: pointer;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 13px;
  }

  .list-bottom::-webkit-scrollbar {
    width: 3px;
    height: 4px;
    background: #EBEBEB;
    -webkit-border-radius: 1px;
    -moz-border-radius: 1px;
    border-radius: 1px;
  }

  .list-bottom::-webkit-scrollbar-thumb {
    background-color: #DFDFDF;
    height: 3px;
    width: 3px;
    -webkit-border-radius: 1px;
    -moz-border-radius: 1px;
    border-radius: 1px;
  }

  /*弹框样式*/
  .closeIcon {
    width: 20px;
    height: 20px;
    text-align: center;
    display: block;
    font-style: normal;
    position: absolute;
    right: 18px;
    top: 18px;
    cursor: pointer;
    z-index: 99988;
    box-sizing: border-box;
    transition: all .2s;
  }

  >>> .dialogViewBox {
    width: 800px;
    height: 540px;
    border-radius: 0;
    /*padding: 35px;*/
  }

  >>> .dialogViewBox .el-dialog__title {
    font-size: 17px;
    color: #4c4c4c;
  }

  >>> .dialogViewBox .el-dialog__header,
  >>> .dialogViewBox .el-dialog__body,
  >>> .dialogViewBox .el-dialog__footer {
    padding: 0;
    margin: 0;
  }

  >>> .dialogViewBox .el-dialog__body {
    height: 100%;
  }

  >>> .dialogViewBox .el-dialog__body .content {
    height: 100%;
  }

  >>> .dialogViewBox .el-dialog__body iframe {
    width: 100%;
    height: 100%;
  }
</style>
