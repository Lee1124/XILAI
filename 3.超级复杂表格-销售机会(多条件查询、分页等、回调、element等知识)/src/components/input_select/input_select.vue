<template>
  <div id="app">
    <div class="bigBox" id="bigBox" @mouseleave="hideBigBox">
      <div class="inputBox"><!--@keyup="searchNews($event)"-->
        <input type="text" id="inputSelect" autocomplete="off" v-model="searchText" @keyup="searchNo($event)" class="inputSelect" @focus="showSelectBox" placeholder="请输入酒店，客户姓名，负责人，添加人...">
        <div class="searchBtn" @click="searchNews"><!--@click="searchNews"-->
          <span></span>
          <img src="../../../static/img/search.png" alt="搜索">
        </div>
        <div class="addInput" v-show="isShowAddInput" @mouseenter="showAddInput">
          <template v-for="(items,index) in selectData">
            <div class="addInput_inner">
              {{items.contentName2}}
              <img src="../../../static/img/close2.png" @click="closeSelect(items)" alt="关闭">
            </div>
          </template>
        </div>
      </div>

      <div id="selectBox" class="selectBox" v-loading="loading" v-show="isShowSelectBox"><!--v-show="isShowSelectBox"--><!--v-loading="loading"-->
        <!--最近搜索-->
        <div class="select_content" style="display: none;">
          <span class="label">最近搜索：</span>
          <ul class="select_content_inner">
            <li><span>某酒店名</span></li><!--class="select_name"-->
            <li><span>某酒店名</span></li><!--class="select_name"-->
            <li><span>某酒店名</span></li><!--class="select_name"-->
          </ul>
        </div>
        <template v-for="(items1,index1) in contentData">
          <div class="select_content">
            <span class="label">{{items1.titleName}}：</span>
            <ul class="select_content_inner">
              <template v-for="(items2,index2) in items1.data">
                <li><span :class="{'select_name':items2.isShowBorder}"
                          @click="selectThis(items1,items2,index1,index2)">{{items2.contentName}}</span>
                </li>
              </template>
            </ul>
            <div class="address" v-if="items1.titleName=='店铺选择'">
              <img src="../../../static/img/address.png" alt="地区">
              <span>四川</span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  //事件
  var myMethods = {
    //关键词查询
    searchNews(){
      this.$emit('searchNews',this.searchText)
    },
    //关键词为空
    searchNo(e){
      if ($(e.target).val()==""){
        this.$emit('searchNo',$(e.target).val())
      }

      if (e.keyCode==13){
        this.$emit('searchNews',this.searchText)
      }
    },

    //选择当前查询项
    selectThis(obj1, obj2, index1, index2) {
      this.$emit('selectThis',{obj1,index2})
    },
    //删除当前查询项
    closeSelect(obj) {
      //去边框
      this.$emit('closeSelect',obj)
    },
    //获取光标显示
    showSelectBox() {
      this.$emit('showSelectBox')
    },
    //移入显示
    showAddInput(){
      $("#selectBox").show();
    },
    //移除隐藏
    hideBigBox() {
      $("#selectBox").hide();
      $("#inputSelect").blur();
    }

  };
  export default {
    name: "input_select",
    props: ['contentData','selectData','isShowAddInput','isShowSelectBox','loading'],
    created(){
    },
    data() {
      return {
        // isShowSelectBox: false,
        // loading: true,
        searchText: '',
      }
    },
    methods: myMethods,
    watch: {
      searchText(val) {
        this.searchText=val
      }
    },
    mounted() {
      window.Vue = this
    }
  }
</script>

<style scoped>
  /*修改加载图标*/
  /deep/ .el-loading-spinner .path {
    display: none;
  }

  /deep/ .el-loading-spinner {
    background: url("../../../static/img/loading.gif") no-repeat;
    background-size: 30px 30px;
    position: absolute;
    width: 30px;
    height: 30px;
    left: 50%;
    -webkit-transform: translateX(-50%);
    -moz-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    -o-transform: translateX(-50%);
    transform: translateX(-50%);
  }

  * {
    margin: 0;
    padding: 0;
  }

  #app {
    padding: 0;
  }

  li {
    list-style: none;
  }

  .bigBox {
    width: 420px;
    position: absolute;
    height: 400px;
  }

  /*搜索框*/
  .inputBox {
    position: relative;
    width: 420px;
  }

  .inputSelect {
    width: 420px;
    height: 32px;
    border: 1px solid #DDD;
    border-radius: 4px;
    padding-left: 10px;
    box-sizing: border-box;
    outline: none;
  }

  ::-webkit-input-placeholder {
    color: #B2B2B2;
  }

  .searchBtn {
    width: 40px;
    height: 32px;
    text-align: center;
    line-height: 32px;
    position: absolute;
    right: 0;
    top: 0;
    cursor: pointer;
  }

  .searchBtn span {
    display: inline-block;
    height: 24px;
    width: 1px;
    background: #DDD;
    position: absolute;
    top: 50%;
    margin-top: -12px;
    left: 0;
  }

  .searchBtn img {
    margin-top: 8px;
  }

  /*高级搜索框*/
  .selectBox {
    width: 420px;
    height: 360px;
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(0, 0, 0, .3);
    margin-top: 5px;
    overflow: auto;
    padding: 0 12px 30px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    position: absolute;
    z-index: 9999;
    background: #fff;
  }

  /*滚动条的滑槽的样式*/
  .selectBox::-webkit-scrollbar {
    width: 3px;
    height: 100%;
    background: #E6E6E6;
    -webkit-border-radius: 1px;
    -moz-border-radius: 1px;
    border-radius: 1px;
  }

  /*滚动条的滑块的样式*/
  .selectBox::-webkit-scrollbar-thumb {
    background-color: #BB9860;
    width: 3px;
    height: 55px;
    -webkit-border-radius: 1px;
    -moz-border-radius: 1px;
    border-radius: 1px;
  }

  .select_content {
    padding: 18px 0;
    position: relative;
  }

  .select_content:first-child {
    border-bottom: 1px solid #DDDDDD;
  }

  .select_content .label {
    color: #808080;
    font-size: 14px;
  }

  .select_content_inner {
    padding: 18px 0 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .select_content_inner li {
    height: 19px;
    color: #4C4C4C;
    font-size: 14px;
    cursor: pointer;
    margin-top: 20px;
    transition: all .2s;
    text-align: center;
  }

  .select_content_inner li:hover {
    color: #BB9860;
  }

  .select_content_inner li:nth-of-type(1),
  .select_content_inner li:nth-of-type(2),
  .select_content_inner li:nth-of-type(3) {
    margin-top: 0;
  }

  .select_content_inner li:nth-of-type(3n-2) {
    flex-basis: 30%;
  }

  .select_content_inner li:nth-of-type(3n-1) {
    flex-basis: 40%;
  }

  .select_content_inner li:nth-of-type(3n) {
    flex-basis: 30%;
  }

  .select_name {
    border: 1px solid #BB9860;
    padding: 0 16px;
    border-radius: 3px;
    max-width: 105px;
    height: 30px;
    line-height: 30px;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    margin-top: -6px;
  }

  .addInput {
    width: 368px;
    height: 28px;
    position: absolute;
    top: 2px;
    left: 5px;
    background: #fff;
    padding: 2px 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
  }

  /*滚动条的滑槽的样式*/
  .addInput::-webkit-scrollbar {
    width: 100%;
    height: 3px;
    background: #E6E6E6;
    -webkit-border-radius: 1px;
    -moz-border-radius: 1px;
    border-radius: 1px;
  }

  /*滚动条的滑块的样式*/
  .addInput::-webkit-scrollbar-thumb {
    background-color: #BB9860;
    height: 3px;
    width: 5px;
    -webkit-border-radius: 1px;
    -moz-border-radius: 1px;
    border-radius: 1px;
  }

  .addInput_inner {
    background: #D2D2D2;
    display: inline-block;
    height: 24px;
    line-height: 20px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 2px 5px;
    color: #fff;
    margin-right: 6px;
    font-size: 14px;
  }

  .addInput_inner img {
    cursor: pointer;
  }

  .address {
    font-size: 14px;
    color: #BB9860;
    display: flex;
    align-items: center;
    position: absolute;
    right: 5px;
    bottom: -10px;
  }

  .address img {
    margin-right: 6px;
  }

  .hideSelectBox {
    display: none;
  }

</style>
