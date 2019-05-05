<template>
  <div id="app">
    <router-view/>
    <el-table
      ref="multipleTable"
      :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      tooltip-effect="dark"
      :header-cell-style="{textAlign:'center',backgroundColor:'#E6E6E6',color:'#808080',fontSize:'14px',padding:'8px 0'}"
      :cell-style="cellStyle"
      row-key="id"
      :expand-row-keys="entexpands"
      @row-click="rowExpand"
      @cell-click="cellExpand"
      :row-class-name="table1RowClassName"
      :style="{'width': '100%','border-radius': '5px'}"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
      @cell-mouse-enter="tdHover"
      @cell-mouse-leave="tdHoverNo"
      :height="tableHeight"
      v-loading="loading"
      show-overflow-tooltip
    >
      <!--子表格内容-->
      <el-table-column type="expand" prop="msglis" width="10">
        <template slot-scope="scope">
          <el-table
            :row-class-name="table2RowClassName"
            :header-cell-style="{textAlign:'center',backgroundColor:'#ECECEC'}"
            :data="scope.row.msglis"
          >
            <el-table-column
              prop="time"
              label="时间"
              width="200"
              show-overflow-tooltip
              align="center">
            </el-table-column>

            <el-table-column
              prop="Title"
              label="标题"
              width="150"
              show-overflow-tooltip
              align="center">
            </el-table-column>

            <el-table-column
              prop="Contents"
              label="内容"
              show-overflow-tooltip
              align="center">
            </el-table-column>

            <el-table-column
              prop="item"
              label="添加人"
              width="450"
              align="center">
            </el-table-column>
            <el-table-column
              label="操作"
              width="80"
              align="center">
              <template slot-scope="scope">
                <span @click="returnBtnEvent(scope.row)"
                      style="color: #3B3D98;text-decoration: underline;font-size: 14px;cursor: pointer;">回复</span>
                <span class="tianChong2"></span>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>

      <!--主表格内容-->
      <el-table-column
        type="selection"
        align="center"
        width="55">
      </el-table-column>
      <el-table-column
        type="index"
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        label="服务日期"
        align="center"
        width="100"
        sortable
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{ scope.row.OrderDate }}</template>
      </el-table-column>
      <el-table-column
        prop="msglis.length"
        label="信息条数"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="Hotel"
        label="酒店"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="cusname"
        label="客户姓名"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="adduser"
        label="添加人"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="负责人"
        align="center"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span @click.stop="chancePerson(scope.row)" class="fzr"
                v-if="scope.row.Recuser!=''">{{ scope.row.Recuser }}</span>
          <span @click.stop="chancePerson(scope.row)" class="fzr" v-if="scope.row.Recuser==''"
                style="width: 100%;height: 20px;display: block;">{{ scope.row.Recuser }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="Bname"
        label="店铺"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="状态"
        align="center"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span style="color: #F3484C;" v-if="scope.row.status=='申请流失中'" @click.stop="showLiuShiYuanYin(scope.row)" class="redLiuShi">{{scope.row.status}}</span>
          <span style="color: #BB9860;" v-if="scope.row.status!='申请流失中'">{{scope.row.status}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="Other"
        label="热度"
        align="center"
        width="50"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="money"
        label="预算"
        align="center"
        width="80"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="新娘微信绑定"
        width="110"
        align="center">
        <template slot-scope="scope">
          <img v-if="scope.row.xnimg!=''" key-name="新娘" :src="scope.row.xnimg" class="imgStyle imgStyleWH imgStyBig"
               @click.stop="getWXImgNews($event,scope)">
          <img v-if="scope.row.xnimg==''" key-name="新娘" src="../../../static/img/wx_no.png"
               class="imgStyle imgStyleWH wx_no"
               @click.stop="getWXImgNews($event,scope)">
          <img v-if="scope.row.xnimg==''" key-name="新娘" src="../../../static/img/wx_hover.png" style="display: none;"
               class="imgStyle imgStyleWH wx_hover"
               @click.stop="getWXImgNews($event,scope)">
        </template>
      </el-table-column>
      <el-table-column
        label="新郞微信绑定"
        width="110"
        align="center">
        <template slot-scope="scope">
          <img v-if="scope.row.xlimg!=''" key-name="新郞" :src="scope.row.xlimg" class="imgStyle imgStyleWH imgStyBig"
               @click.stop="getWXImgNews($event,scope)">
          <img v-if="scope.row.xlimg==''" key-name="新郞" src="../../../static/img/wx_no.png"
               class="imgStyle imgStyleWH wx_no"
               @click.stop="getWXImgNews($event,scope)">
          <img v-if="scope.row.xlimg==''" key-name="新郞" src="../../../static/img/wx_hover.png" style="display: none;"
               class="imgStyle imgStyleWH wx_hover"
               @click.stop="getWXImgNews($event,scope)">
        </template>
      </el-table-column>
      <el-table-column
        prop="Source"
        label="业务来源"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="addtime"
        label="登记时间"
        align="center"
        sortable
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" :width="caoZuoWidth">
        <template slot-scope="scope">
          <span class="edit" @click.stop="editRow(scope.row)" v-if="strType=='my'">编辑</span>
          <span class="edit" @click.stop="editRow(scope.row)" v-if="strType=='all'">编辑</span>
          <span class="edit" @click.stop="editRow(scope.row)" v-if="strType=='editbranch'">编辑</span>
          <span class="getOrder" @click.stop="getOrder(scope.row)">生成订单</span>
          <div class="moreBox" @mouseenter="showMore(scope.row)" @mouseleave="showMoreNo(scope.row)">
            <span class="moreIcon">
            <img src="../../../static/img/more1.png" v-show="scope.row.isShowMore">
            <img src="../../../static/img/more2.png" v-show="!scope.row.isShowMore">
          </span>
          </div>
          <div class="moreShow" v-show="scope.row.isMoreShow" @mouseenter="showMore(scope.row)"
               @mouseleave="showMoreNo(scope.row)"><!--v-show="scope.row.isMoreShow"-->
            <i></i>
            <span class="addSay" @click.stop="addSay(scope.row)" v-if="strType=='my'">添加沟通记录</span>
            <span class="del" @click.stop="deleteRow(scope.row)" v-if="strType=='editbranch'">删除</span>
            <span class="del" @click.stop="deleteRow(scope.row)" v-if="strType=='all'">删除</span>
            <span class="chanceLoss" @click.stop="chanceLoss(scope.row)"
                  v-if="strType=='my'&&scope.row.status!='申请流失中'">机会流失</span>
            <span class="lossManage" @click.stop="lossManage(scope.row)"
                  v-if="strType=='editbranch'&&scope.row.status=='申请流失中'">处理申请流失</span>
          </div>


        </template>
      </el-table-column>
      <el-table-column
        label="关注" align="center"
        width="48"
      >
        <template slot-scope="scope">
          <img src="../../../static/img/xin0.png" class="imgStyle">
          <!--<img src="../../../static/img/xin1.png" class="imgStyle">-->
        </template>
      </el-table-column>
      <el-table-column
        label="" align="center" width="60">
        <template slot-scope="scope">
          <div :class="{'lastTd':scope.row.lastTdColorZt}">
            <img src="../../../static/img/s.png" v-if="scope.row.showJt" class="imgStyle">
            <img src="../../../static/img/x.png" v-if="!scope.row.showJt" class="imgStyle">
          </div>
          <span class="tianChong"></span>
        </template>
      </el-table-column>
    </el-table>

    <div class="ym">
      <div class="allYeShu">共{{total}}条</div>
      <el-pagination
        background
        layout="total, prev, pager, next"
        @current-change="current_change"
        :pager-count="5"
        :page-count="allYeMa"
      >
      </el-pagination>
    </div>

  </div>
</template>

<script>


  var myMethods = {
    //显示流失原因
    showLiuShiYuanYin(obj){
      this.$emit('showLiuShiYuanYin',obj)
    },

    //鼠标移入显示更多操作
    showMore(obj) {
      obj.isMoreShow = true;
      obj.isShowMore = false;
    },
    //鼠标移出隐藏更多操作
    showMoreNo(obj) {
      obj.isMoreShow = false;
      obj.isShowMore = true;
    },

    //排序
    sortChange(column, prop, order) {
      var sOrJObj = {};
      if (column.column != null) {
        sOrJObj = {
          name: column.column.label,
          zt: column.order
        };
      } else {
        sOrJObj = {
          name: null,
          zt: null
        };
      }
      this.$emit('sortChange', sOrJObj)
    },
    //获取微信头像
    getWXImgNews(e, obj) {
      let obj1 = $(e.target).attr('key-name');
      let obj2 = obj.row.OrderDate + obj.row.Hotel;
      let obj3 = obj.row.ORDER_ID;
      this.$emit('getWXImgNews', {obj1, obj2, obj3})
    },

    //回复按钮
    returnBtnEvent(row) {
      this.$emit('returnBtnEvent', row)
    },

    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.$emit('handleSelectionChange', val)
    },
    //单元格样式
    cellStyle({row, column, rowIndex, columnIndex}) {
      if (columnIndex == 3 || columnIndex == 5 || columnIndex == 7 || columnIndex == 9 || columnIndex == 12 || columnIndex == 15) {
        return 'color:#BB9860;fontSize:14px;cursor:pointer'
      } else {
        return 'padding:21px 0;fontSize:14px;color:#4C4C4C;height:70px;cursor:pointer';
      }


    },

    //点击某行展开
    rowExpand(row, event, column) {
      $(event.target).parent().parent().addClass('.table_td_color2')

      window.Vue.tableData.forEach((item, index) => {
        item.showJt = true;
        item.lastTdColorZt = false;
      });
      Array.prototype.remove = function (val) {
        let index = this.indexOf(val);
        if (index > -1) {
          this.splice(index, 1);
        }
      };
      if (this.entexpands.indexOf(row.id) < 0) {
        this.entexpands = [];
        row.id = this.generateUUID();
        this.entexpands.push(row.id);
        row.showJt = false;
        row.lastTdColorZt = true;

      } else {
        this.entexpands.remove(row.id);
        row.showJt = true;
        row.lastTdColorZt = false;
      }
    },
    cellExpand(row, event, column) {
    },
    generateUUID() {
      var d = new Date().getTime();
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
      return uuid;
    },
    //分页
    current_change(currentPage) {
      this.currentPage = currentPage;
    },

    //为外面的表格添加class类名
    table1RowClassName({row, rowIndex}) {
      if (rowIndex % 2 != 0) {
        return 'table1 table0 table_td_color'
        /*table_td_color2*/
      } else {
        return 'table1 table0 table_td_noColor'
      }
    },
    //鼠标移入微信时候
    tdHover(row, column, cell, event) {
      if (column.label == '新娘微信绑定') {
        $(event.target).children().find('.wx_no').css({
          display: 'none',
        });
        $(event.target).children().find('.wx_hover').css({
          display: 'block',
          margin: '0 auto'
        })
      } else if (column.label == '新郞微信绑定') {
        $(event.target).children().find('.wx_no').css({
          display: 'none'
        });
        $(event.target).children().find('.wx_hover').css({
          display: 'block',
          margin: '0 auto'
        })
      }
    },
    //鼠标移出微信时候
    tdHoverNo(row, column, cell, event) {
      if (column.label == '新娘微信绑定') {
        $(event.target).children().find('.wx_no').css({
          display: 'block',
          margin: '0 auto'
        });
        $(event.target).children().find('.wx_hover').css({
          display: 'none',
        })
      } else if (column.label == '新郞微信绑定') {
        $(event.target).children().find('.wx_no').css({
          display: 'block',
          margin: '0 auto'
        });
        $(event.target).children().find('.wx_hover').css({
          display: 'none',
        })
      }
    },
    //为里面的表格添加class类名
    table2RowClassName() {
      return 'table2'
    },
    //修改负责人
    chancePerson(obj) {
      this.$emit('chancePerson', obj)
    },
    //添加沟通记录
    addSay(obj) {
      this.$emit('addSay', obj)
    },
    //删除
    deleteRow(obj) {
      this.$emit('deleteRow', obj)
    },
    //查看
    lookRow(obj) {
      this.$emit('lookRow', obj)
    },
    //编辑
    editRow(obj) {
      this.$emit('editRow', obj)
    },
    //生成订单
    getOrder(obj) {
      this.$emit('getOrder', obj)
    },
    //机会流失
    chanceLoss(obj) {
      this.$emit('chanceLoss', obj)
    },
    //申请流失处理
    lossManage(obj) {
      this.$emit('lossManage', obj)
    },
  };
  export default {
    name: 'App',
    methods: myMethods,
    props: ['tableData', 'total', 'allYeMa', 'tableHeight', 'pagesize', 'loading', 'strType', 'caoZuoWidth'],
    mounted() {
      window.Vue = this;

      // console.log(this.$refs.multipleTable)
    },
    updated() {

    },
    created() {
    },
    data() {
      return {
        entdatas: [],
        entexpands: [],
        currentPage: 1,
        showJt: true,
      }
    },
    watch: {
      tableData: function (newVal, oldVal) {

      }
    },
  }
</script>

<style scoped>
  /*修改加载图标*/
  /deep/ .el-loading-spinner .path {
    display: none;
  }

  /deep/ .el-table th.gutter {
    display: table-cell !important;
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

  #app {
    padding: 0;
  }

  .imgStyle {
    vertical-align: middle;
  }

  .imgStyleWH {
    width: 28px;
    height: 26px;
  }

  .imgStyBig {
    width: 40px;
    height: 40px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  /deep/ .el-table__body-wrapper {
    /*overflow-y: scroll;*/
  }

  /deep/ .el-table__body-wrapper::-webkit-scrollbar {
    width: 3px;
    height: 4px;
    background: #E6E6E6;
    -webkit-border-radius: 1px;
    -moz-border-radius: 1px;
    border-radius: 1px;
  }

  /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
    background-color: #BB9860;
    height: 3px;
    width: 3px;
    -webkit-border-radius: 1px;
    -moz-border-radius: 1px;
    border-radius: 1px;
  }

  /deep/ .el-checkbox__inner {
    border: 1px solid #808080;
  }

  /deep/ .el-checkbox__inner::after {
    border-color: #BB9860;
  }

  /deep/ .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner,
  /deep/ .el-checkbox__inner {
    background-color: #fff !important;
    border-color: #BB9860 !important;
  }

  /deep/ .el-checkbox__input.is-focus .el-checkbox__inner {
    border-color: #BB9860;
  }

  /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner::before {
    background-color: #BB9860;
  }

  /deep/ .el-table .descending .sort-caret.descending {
    border-top-color: #BB9860;
  }

  /deep/ .el-table .ascending .sort-caret.ascending {
    border-bottom-color: #BB9860;
  }

  .del, .look, .getOrder, .addSay, .edit, .chanceLoss, .lossManage {
    cursor: pointer;
  }

  .del {
    color: #EF2727;
    margin: 0 2px;
  }

  .del:hover {
    color: #db2727;
  }

  .addSay {
    color: #299ED0;
    margin: 0 2px;
  }

  .addSay:hover {
    color: #297ead;
  }

  .look {
    color: #8FAFDF;
    margin: 0 2px;
  }

  .edit {
    color: #3b3d98;
    margin: 0 2px;
  }

  .edit:hover {
    color: #21234c;
  }

  .getOrder {
    color: #299ED0;
    margin: 0 2px;
  }

  .getOrder:hover {
    color: #297ead;
  }

  .chanceLoss {
    color: #3b3d98;
    margin: 0 2px;
  }

  .chanceLoss:hover {
    color: #21234c;
  }

  .lossManage {
    color: #299ed0;
    margin: 0 2px;
  }

  .lossManage:hover {
    color: #297ead;
  }

  .addRow td table {
    width: 100%;
  }

  /deep/ .el-table__expanded-cell[class*=cell] {
    padding: 0;
  }

  /deep/ [data-v-7ba5bd90] .el-table th, .el-table tr th[data-v-7ba5bd90] {
    background: #ECECEC;
    font-size: 13px;
    color: #4C4C4C;
    height: 44px;
    padding: 10px 0;
    border: 1px solid #E6E6E6;
  }

  /deep/ .table1 .el-icon-arrow-right:before {
    content: '';
  }

  /deep/ .el-table {
    border-collapse: collapse;
    border: 1px solid #E6E6E6;
    border-bottom: 0;
  }

  /deep/ .el-table td, .el-table th.is-leaf {
    border: 0;
  }

  /deep/ [data-v-7ba5bd90] .el-table {
    border: 0;
  }

  /deep/ [data-v-7ba5bd90] .el-table td {
    border: 1px solid #E6E6E6;
    border-top: 0;
    border-right: 0;
    height: 50px;
  }

  /deep/ [data-v-7ba5bd90] .el-table td:first-of-type {
    border-left: 0;
  }

  /deep/ .el-table .table2:nth-of-type(2n) {
    background-color: #F2F2F2;
  }

  /deep/ .el-table__row:nth-of-type(2n):hover > td {
    background-color: #F7F7F7;
  }

  /deep/ .el-table__row:nth-of-type(2n-1):hover > td {
    background-color: #ffffff;
  }

  /deep/ .el-table .table2:nth-of-type(2n-1) {
    background-color: #F7F7F7;
  }

  /deep/ .table1 > td:nth-of-type(18) > .cell {
    padding-right: 50px;
    box-sizing: border-box;
  }

  /deep/ .el-table .table2:nth-of-type(2n):hover td {
    background-color: #F2F2F2;
  }

  /deep/ .el-table .table2:nth-of-type(2n-1):hover td {
    background-color: #F7F7F7;
  }

  >>> .table_td_color > td {
    background: #F7F7F7;
    transition: all .5s;
  }

  >>> .table_td_noColor > td {
    background: #fff;
    transition: all .5s;
  }


  .table_td_color>td:last-of-type .tianChong {
    background: #F7F7F7;
  }
  .table_td_noColor>td:last-of-type .tianChong {
    background: #fff;
  }

  .tianChong {
    width: 12px;
    height: 70px;
    display: block;
    position: absolute;
    right: -12px;
    top: -1px;
  }

  /deep/ .el-table .table2 td:first-of-type, /deep/ .el-table .table2 td:nth-of-type(3) {
    color: #BB9860;
  }

  /deep/ .el-pagination.is-background .el-pager li:not(.disabled).active {
    background: #BB9860;
  }

  /deep/ .el-pagination.is-background .el-pager li {
    color: #999;
  }

  /deep/ .el-pagination.is-background .el-pager li:hover {
    color: #BB9860;
  }

  /deep/ .el-pagination.is-background .btn-next:hover {
    color: #BB9860;
  }

  /deep/ .el-pagination.is-background .btn-prev:hover {
    color: #BB9860;
  }

  /deep/ .el-table th.gutter {
    background-color: rgb(230, 230, 230);
  }

  /deep/ .el-table .cell {
    text-align: center;
  }

  #app {
    position: relative;
  }

  .ym {
    position: absolute;
    bottom: -65px;
    left: 160px;
  }

  .allYeShu {
    color: #606266;
    font-size: 13px;
    position: absolute;
    top: 50%;
    left: -50px;
    transform: translateY(-50%);
  }

  .lastTd {
    background: rgb(236, 236, 236);
    position: absolute;
    top: 0;
    height: 100%;
    width: 83%;
    line-height: 70px;
  }

  .fzr:hover {
    color: #95774b;
  }

  .moreIcon {
    position: relative;
  }

  .moreIcon img {
    vertical-align: middle;
    margin-top: -3px;
  }

  .moreShow {
    position: absolute;
    z-index: 9999;
    background: #fff;
    width: 140px;
    border: 1px solid rgba(228, 231, 237, 1);
    border-radius: 5px;
    padding: 10px 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    left: 105px;
    top: 50px;
  }

  .moreShow span {
    display: inline-block;
    width: 125px;
    height: 35px;
    line-height: 35px;
    border-radius: 5px;
    color: #4C4C4C;
    text-align: left;
    padding-left: 8px;
    padding-right: 8px;
    box-sizing: border-box;
  }

  .moreShow span:hover {
    background: #F5F7FA;
    color: #BB9860;
  }

  .moreShow i {
    display: inline-block;
    font-style: normal;
    width: 5px;
    height: 5px;
    background: #fff;
    border-left: 1px solid rgba(228, 231, 237, 1);
    border-top: 1px solid rgba(228, 231, 237, 1);
    position: absolute;
    top: -4px;
    left: 20px;
    transform: rotate(45deg);
    z-index: 9;
  }

  .moreBox {
    display: inline-block;
    position: absolute;
    height: 40px;
    top: 50%;
    transform: translateY(-30%);
    right: 8px;
  }

  /deep/ .el-table__expanded-cell[class*=cell] {
    border-bottom: 1px solid #BB9860 !important;
    border-left: 1px solid #BB9860 !important;
  }

  /deep/ .table1> td {
    transition: all .5s;
  }
  /deep/ .table1:hover > td {
    border-top: 1px solid #BB9860;
    border-bottom: 1px solid #BB9860;
    padding: 17px 0 !important;
    height: 70px !important;
  }

  /deep/ .table1:hover > td:nth-of-type(1) {
    border-left: 1px solid #BB9860;
  }

  >>> .expanded > td {
    border-top: 1px solid #BB9860;
  }

  >>> .expanded > td:first-of-type {
    border-left: 1px solid #BB9860;
  }

  >>> .expanded > td .tianChong {
    height: 118px;
    border-top: 1px solid #BB9860;
    border-right: 1px solid #BB9860;
    background: rgb(236, 236, 236)!important;
  }

  /deep/ .expanded:hover > td {
    border-bottom: 0 solid #fff;
    height: 70px !important;
    padding: 17px 0 !important;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  >>> .el-table_1_column_1 {
    position: absolute;
    height: 51px;
    left: 0;
  }

  .redLiuShi:hover {
    color: #d74145 !important;
  }

  >>> .table_td_color td .tianChong, >>> .table_td_noColor td .tianChong{
    transition: all .5s;
    /*border-top: 1px solid #BB9860;*/
    /*border-bottom: 1px solid #BB9860!important;*/
    /*border-right: 1px solid #BB9860;*/
  }

  >>> .table_td_color:hover > td .tianChong, >>> .table_td_noColor:hover > td .tianChong{
    border-top: 1px solid #BB9860;
    /*border-bottom: 1px solid #BB9860!important;*/
    border-right: 1px solid #BB9860;
  }
  >>> .table2 td {
    position: relative;
    overflow: visible;
  }

  >>> .table2 td .tianChong2 {
    width: 12px;
    height: 20px;
    display: block;
    position: absolute;
    right: -12px;
    top: -1px;
    background: red!important;
  }


</style>
