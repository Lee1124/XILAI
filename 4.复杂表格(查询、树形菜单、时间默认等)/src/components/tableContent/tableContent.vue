<template>
  <div id="app">
    <el-table
      ref="multipleTable"
      :data="tableData"
      :header-cell-style="{textAlign:'center',backgroundColor:'#E5E5E5',color:'#3C3C3C',fontSize:'14px',padding:'4px 0'}"
      :header-row-class-name="headerRowClassName"
      :row-class-name="table1RowClassName"
      :cell-class-name="tableCellClassName"
      :height="tableHeight"
      v-loadmore='loadMore'
      v-loading="showLoading"
    >
      <!--表格内容-->
      <el-table-column
        label="物品"
        align="center"
        show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.MATERIAL_NAME }}</template>
      </el-table-column>
      <el-table-column
        prop="NUMBER"
        label="库存"
        align="center"
        sortable
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="报损量"
        align="center"
        sortable
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span @click="toBaoSunDiaLog(scope.row,'bsl')">{{scope.row.Dropnumber}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="Purnumber"
        label="采购量"
        align="center"
        sortable
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="Purnumber"
        label="采购单价"
        align="center"
        sortable
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="采购金额"
        align="center"
        sortable
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span @click="caiGouDiaLog(scope.row,'cgje')">{{scope.row.Purmoney}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="Busenumber"
        label="使用数量"
        align="center"
        sortable
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="PURCHASE_PRICE"
        label="使用单价"
        align="center"
        sortable
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="Usevalue"
        label="使用价值"
        align="center"
        sortable
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span @click="shiYongJiaZhiDiaLog(scope.row,'syjz')">{{scope.row.Usevalue}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="外借金额"
        align="center"
        sortable
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span @click="waiJieJinEDiaLog(scope.row,'wjje')">{{scope.row.Borrowmoney}}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="yk"
        label="盈亏"
        align="center"
        sortable
        show-overflow-tooltip>
        <span class="tianChong"></span>
      </el-table-column>

    </el-table>

    <el-table
      ref="multipleTable"
      :data="tableData2"
      :show-header="false"
      :row-class-name="table2RowClassName"
      style="border: 0;"
    >

      <!--表格内容-->
      <el-table-column
        align="left"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>合计：</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="number"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="dropnumber"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="purnumber"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="purmoney"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="usenumber"
        align="center"
        show-overflow-tooltip>
      </el-table-column>

      <el-table-column
        prop="borrowmoney"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="price"
        align="center"
        show-overflow-tooltip>
      </el-table-column>

      <el-table-column
        prop="usemoney"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        align="center"
        show-overflow-tooltip>
      </el-table-column>
    </el-table>

    <!--弹框-->
    <dialogBox ref="diaLogChild" :show_dialogBox="show_dialogBox" @closeTip="closeTip" :toDiaLogData="toDiaLogData"
               :toDiaLogHeJiData="toDiaLogHeJiData" :diaLogName="diaLogName" :diaLogTitle="diaLogTitle"
               @diaLogGetStartTime="diaLogGetStartTime" @diaLogGetEndTime="diaLogGetEndTime"
               :getSTime="stime2" :getETime="etime2"
               @diaLogBtnEvent="diaLogBtnEvent"
    ></dialogBox>
  </div>
</template>
<script>
  import dialogBox from '../diaLog/diaLog'

  var myMethods = {
    hideLoading() {
      window.parent.document.getElementsByClassName("load_img_show")[0].style.display = "none";//onload_img
    },
    //弹框中按钮查询事件
    diaLogBtnEvent() {
      this.toDiaLog();
    },
    //开始时间
    diaLogGetStartTime(val) {
      this.stime2 = val;
      if (val == '') {
        this.toDiaLog();
      }
    },
    //结束时间
    diaLogGetEndTime(val) {
      this.etime2 = val;
      if (val == '') {
        this.toDiaLog();
      }
    },

    //打开外借金额弹框
    waiJieJinEDiaLog(obj, name) {
      this.toDiaLog(obj, name);
    },
    //打开使用价值弹框
    shiYongJiaZhiDiaLog(obj, name) {
      this.toDiaLog(obj, name);
    },
    //打开采购金额弹框
    caiGouDiaLog(obj, name) {
      this.toDiaLog(obj, name);
    },
    //打开报损量弹框
    toBaoSunDiaLog(obj, name) {
      this.toDiaLog(obj, name);
    },

    toDiaLog(obj, name) {
      if (obj != undefined && name != undefined) {
        if (name == 'bsl') {
          this.diaLogTitle = '[ ' + obj.MATERIAL_NAME + ' ] 报损量明细';
        } else if (name == 'cgje') {
          this.diaLogTitle = '[ ' + obj.MATERIAL_NAME + ' ] 采购金额明细';
        } else if (name == 'syjz') {
          this.diaLogTitle = '[ ' + obj.MATERIAL_NAME + ' ] 使用价值明细';
        } else if (name == 'wjje') {
          this.diaLogTitle = '[ ' + obj.MATERIAL_NAME + ' ] 外借金额明细';
        }
        this.diaLogName = name;
        this.show_dialogBox = true;
        this.matid2 = obj.MATERIAL_ID;
      }
      var url = '';
      if (this.diaLogName == 'bsl') {
        url = this.api + '/xlapi/SysManage/Materil/MaterilSave/RetMatDrop'
      } else if (this.diaLogName == 'cgje') {
        url = this.api + '/xlapi/SysManage/Materil/MaterilSave/RetPurs'
      } else if (this.diaLogName == 'syjz') {
        url = this.api + '/xlapi/SysManage/Materil/MaterilSave/RetUsevalue'
      } else if (this.diaLogName == 'wjje') {
        url = this.api + '/xlapi/SysManage/Materil/MaterilSave/RetBorrow'
      }

      /*stime	是	string	开始时间
          etime	是	string	结束时间
          branid 是	int	店
          matid   物品*/

      this.branid2 = this.branid;

      let data = {
        stime: this.stime2,
        etime: this.etime2,
        branid: this.branid2,
        matid: this.matid2,
      };
      this.$axios({
        method: 'post',
        url: url,
        data: data,
        headers: {
          // Authorization: 'http://localhost:5080/|1|2|xlhl|http://localhost:5819/|http://171.211.126.122:8092/|3,1|3,1|https://xilai99.com'
          Authorization: localStorage.userinfo
        }
      }).then(res => {
        if (res.status == 200) {
          if (this.diaLogName == 'bsl') {
            this.toDiaLogData = res.data;
            let heJi = 0;
            this.toDiaLogData.forEach((item) => {
              heJi += item.Number
            });
            this.toDiaLogHeJiData = [{heJi: heJi}];
          } else if (this.diaLogName == 'cgje') {
            this.toDiaLogData = res.data;
            let heJi1 = 0;
            let heJi2 = 0;
            let heJi3 = 0;
            this.toDiaLogData.forEach((item) => {
              heJi1 += item.PurchaseSum;
              heJi2 += item.PurchaseMoney;
              heJi3 += item.PurchaseTotal;
            });
            this.toDiaLogHeJiData = [{heJi1: heJi1, heJi2: heJi2, heJi3: heJi3}];
          } else if (this.diaLogName == 'syjz') {
            this.toDiaLogData = res.data;
            let heJi1 = 0;
            let heJi2 = 0;
            this.toDiaLogData.forEach((item) => {
              heJi1 += item.number;
              heJi2 += item.Cost;
            });
            this.toDiaLogHeJiData = [{heJi1: heJi1, heJi2: heJi2}];
          } else if (this.diaLogName == 'wjje') {
            this.toDiaLogData = res.data;
            let heJi1 = 0;
            let heJi2 = 0;
            this.toDiaLogData.forEach((item) => {
              heJi1 += item.number;
              heJi2 += item.Cost;
            });
            this.toDiaLogHeJiData = [{heJi1: heJi1, heJi2: heJi2}];
          }
        }
      }, err => {
        console.log(err)
      })

    },

    //关闭弹框
    closeTip() {
      this.show_dialogBox = false;
      this.stime2 = this.stime;
      this.etime2 = this.etime;
    },

    //表格的滚动事件
    loadMore(scrollHeightVal) {
      if (scrollHeightVal == 0) {
        this.flag = true;
        this.flag2 = true;
        if (this.flag) {
          this.page++;
          if (this.page > Math.ceil(this.count / this.size)) {
            this.$message({
              type: 'warning',
              message: '已经加载到最后一页啦!'
            });
          } else {
            this.loadTableData();
          }
        }

      }
    },

    //加载表格数据
    loadTableData() {
      /*stime	是	string	起始时间
etime	是	string	结束时间
type	是	string	属性 消耗品 租赁品等
search	是	string	查询物品名称
branid	是	int	店
mattype	是	int	查询类型 花艺 回收物品，，
page	是	int	当前页
size	是	int	每页多少条*/
      if (this.flag2) {
        let data = {
          stime: this.stime,
          etime: this.etime,
          type: this.type,
          search: this.search,
          branid: this.branid,
          mattype: this.mattype,
          page: this.page,
          size: this.size,
        };
        this.stime2 = this.stime;
        this.etime2 = this.etime;
        this.showLoading = true;
        this.$axios({
          method: 'post',
          url: this.api + '/xlapi/SysManage/Materil/MaterilSave/RetMatTongji',
          data: data,
          headers: {
            // Authorization: 'http://localhost:5080/|1|2|xlhl|http://localhost:5819/|http://171.211.126.122:8092/|3,1|3,1|https://xilai99.com'
            Authorization: localStorage.userinfo
          }
        }).then(res => {
          if (res.status == 200) {
            if (this.page == 1) {
              this.count = res.data.count;
            }
            if (this.flag) {
              this.tableData_yuCun.splice(0, this.tableData_yuCun.length);
              res.data.data.forEach((item) => {
                this.tableData_yuCun.push(item);
              });
              this.tableData = this.tableData.concat(this.tableData_yuCun);
              this.flag = false;
            } else {
              this.tableData = res.data.data;
            }
            this.loadTable2Data();
          }
        }, err => {
          console.log(err)
        })
      }
    },

    //加载表格2合计数据
    loadTable2Data() {
      /*stime	是	string	起始时间
etime	是	string	结束时间
type	是	string	属性 消耗品 租赁品等
search	是	string	查询物品名称
branid	是	int	店
mattype	是	int	查询类型 花艺 回收物品*/
      let data = {
        stime: this.stime,
        etime: this.etime,
        type: this.type,
        search: this.search,
        branid: this.branid,
        mattype: this.mattype
      };
      this.$axios({
        method: 'post',
        url: this.api + '/xlapi/SysManage/Materil/MaterilSave/GetHeji',
        data: data,
        headers: {
          // Authorization: 'http://localhost:5080/|1|2|xlhl|http://localhost:5819/|http://171.211.126.122:8092/|3,1|3,1|https://xilai99.com'
          Authorization: localStorage.userinfo
        }
      }).then(res => {
        if (res.status == 200) {
          this.showLoading = false;
          this.tableData2.splice(0, this.tableData2.length);
          this.tableData2.push(res.data);
        }
      }, err => {
        console.log(err)
      })
    },

    //分页
    current_change(currentPage) {
      this.currentPage = currentPage;
    },

    //为表头添加class类名
    headerRowClassName({row, rowIndex}) {
      return 'tableHeaderStyle'
    },
    //为表格1行添加类名
    table1RowClassName({row, rowIndex}) {
      if (rowIndex % 2 != 0) {
        return 'tableStyle table_td_color'
      } else {
        return 'tableStyle table_td_noColor'
      }
    },
    //为表格1td添加类名
    tableCellClassName({row, column, rowIndex, columnIndex}) {
      if (columnIndex == 0 || columnIndex == 2 || columnIndex == 5 || columnIndex == 8 || columnIndex == 9) {
        return 'moreCellStyle'
      }
    },
    //为表格2行添加类名
    table2RowClassName({row, rowIndex}) {
      return 'table2RowStyle'
    },

    StartTime(val) {
      // this.page = 1;
      // this.flag = false;
      this.stime = val;
      this.loadTableData();
    },
    EndTime(val) {
      // this.page = 1;
      // this.flag = false;
      this.etime = val;
      this.loadTableData();
    },
  };
  export default {
    name: 'tableContent',
    methods: myMethods,
    props: ['SelectVal1', 'SelectVal2', 'inputVal', 'toInputVal', 'handleNodeClickData'],
    mounted() {

    },
    updated() {
    },
    components: {
      dialogBox: dialogBox
    },
    watch: {
      SelectVal1: function (newVal, old) {
        this.page = 1;
        this.flag = false;
        this.type = newVal;
        this.loadTableData();
      },
      SelectVal2: function (newVal, old) {
        this.page = 1;
        this.flag = false;
        this.branid = newVal;
        this.loadTableData();
      },
      inputVal: function (newVal, old) {
        this.page = 1;
        this.flag = false;
        this.search = newVal;
        this.loadTableData();

      },
      toInputVal: function (newVal, old) {
        if (newVal.keyCode == 13) {
          this.page = 1;
          this.flag = false;
          this.search = newVal.val;
          this.loadTableData();

        }
        if (newVal.val == '') {
          this.page = 1;
          this.flag = false;
          this.search = '';
          this.loadTableData();

        }
      },

      handleNodeClickData: function (newVal, old) {
        this.page = 1;
        this.flag = false;
        this.mattype = newVal.id;
        this.loadTableData();
      },
    },

    created() {
      window.Vue = this;
      this.stime = this.getTime().startDate;//获取开始时间
      this.etime = this.getTime().endDate;//获取结束时间
      this.stime2 = this.stime;
      this.etime2 = this.etime;
      this.hideLoading();
      this.loadTableData();
      let tableHeight = $(document).height() - 290;
      this.tableHeight = tableHeight;
    },
    data() {
      return {
        api: getkevalue().apiurl,//获取通用api
        // api: 'http://192.168.1.253:8092',//获取通用api

        flag: false,
        flag2: true,

        currentPage: 1,
        tableData_yuCun: [],
        tableData: [],
        tableData2: [],
        tableHeight: '',
        stime: '',
        etime: '',
        type: '',
        search: '',
        branid: '2',
        mattype: '0',
        page: 1,
        size: 20,
        count: 0,

        stime2: '',
        etime2: '',
        branid2: '2',//=============与上同步
        matid2: 0,

        show_dialogBox: false,
        toDiaLogData: [],
        toDiaLogHeJiData: [],
        diaLogName: '',
        diaLogTitle: '',

        showLoading: false,


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

  /*#app {*/
  /*padding: 0;*/
  /*}*/
  /deep/ .el-table {
    border-collapse: collapse;
    border: 1px solid #DDDDDD;
  }

  >>> .tableHeaderStyle > th {
    border-left: 1px solid #DDDDDD;
  }

  >>> .tableHeaderStyle > th:first-of-type {
    border-left: 0;
  }

  >>> .tableHeaderStyle > th:last-of-type {
    background: rgb(229, 229, 229);
    border-left: 0;
  }

  /deep/ .el-table .descending .sort-caret.descending {
    border-top-color: #BB9860;
  }

  /deep/ .el-table .ascending .sort-caret.ascending {
    border-bottom-color: #BB9860;
  }

  >>> .table_td_color {
    background: #F7F7F7;
  }

  >>> .table_td_color, >>> .table_td_noColor {
    height: 52px;
    font-size: 14px;
    color: #3C3C3C;
  }

  >>> .tableStyle td:nth-of-type(1) {
    border-left: 0;
  }

  >>> .table_td_color > td, >>> .table_td_noColor > td {
    border-left: 1px solid #DDDDDD;
    transition: all .5s;
  }

  >>> .table_td_color td .tianChong, >>> .table_td_noColor td .tianChong {
    transition: all .5s;
  }

  >>> .table_td_color:hover > td .tianChong, >>> .table_td_noColor:hover > td .tianChong {
    background: #DEDEDE !important;
  }

  >>> .table_td_color:hover > td, >>> .table_td_noColor:hover > td {
    background: #DEDEDE !important;
  }

  >>> .moreCellStyle {
    color: #377799;
  }

  >>> .moreCellStyle > .cell.el-tooltip {
    text-decoration: underline;
    cursor: pointer;
  }

  /deep/ .table2RowStyle {
    border: 0 !important;
  }

  /deep/ .table2RowStyle > td {
    color: red !important;
    height: 52px;
    border: 0 !important;
  }

  /deep/ .table2RowStyle:hover > td {
    background: transparent !important;
  }

  /deep/ .el-table::before {
    width: 0;
    height: 0;
  }

  /deep/ .el-table__body-wrapper::-webkit-scrollbar {
    width: 4px;
    height: 4px;
    background: #E6E6E6;
    -webkit-border-radius: 1px;
    -moz-border-radius: 1px;
    border-radius: 1px;
  }

  /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
    background-color: #BB9860;
    height: 4px;
    width: 4px;
    -webkit-border-radius: 1px;
    -moz-border-radius: 1px;
    border-radius: 1px;
  }

  .table_td_color > td:last-of-type .tianChong {
    background: #F7F7F7;
  }

  .table_td_noColor > td:last-of-type .tianChong {
    background: #fff;
  }

  .tianChong {
    width: 17px;
    height: 51px;
    display: block;
    position: absolute;
    right: -17px;
    top: 0px;
    border-bottom: 1px solid #ebeef5;
  }

</style>
