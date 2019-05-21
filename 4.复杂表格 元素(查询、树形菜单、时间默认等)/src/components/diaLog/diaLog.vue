<template>
  <div id="app">

    <!--报损量-->
    <el-dialog
      :title="diaLogTitle"
      :visible.sync="show_dialogBox"
      :show-close=false
      custom-class="dialogBox bsl_dialogBox"
      width="850px"
      :close-on-click-modal="false"
      top="45px"
      center>
      <i class="closeIcon" @click="closeTip"></i>
      <div class="dialog_content">
        <div class="dialog_content_top">
          <div class="dialog_timeSelect">
            <timeSelect ref="timeChild" @getStartTime2="getStartTime2" @getEndTime2="getEndTime2"
                        :getSTime="getSTime" :getETime="getETime"
                        :diaLogDefaultTime1="diaLogDefaultTime1" :diaLogDefaultTime2="diaLogDefaultTime2"></timeSelect>
          </div>
          <div class="dialog_btn">
            <btn btnText="查询" btnStyle="btn1Style" @btnEvent="btnEvent"></btn>
          </div>
        </div>

        <!--报损量-->
        <div class="dialog_content_bottom" v-if="diaLogName=='bsl'">
          <template>
            <el-table
              :data="toDiaLogData"
              :header-row-class-name="headerRowClassName"
              :row-class-name="table1RowClassName"
              height="380px"
              style="width: 100%">
              <el-table-column
                prop="ordertitle"
                label="婚礼"
                align="center"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="Number"
                label="数量"
                align="center"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="username"
                align="center"
                show-overflow-tooltip
                label="报损人">
              </el-table-column>
              <el-table-column
                prop="Remark"
                align="center"
                show-overflow-tooltip
                label="说明">
              </el-table-column>
            </el-table>

            <!--合计表格-->
            <el-table
              :data="toDiaLogHeJiData"
              :show-header="false"
              :row-class-name="table2RowClassName"
              style="width: 100%;height: auto;border: 0;">
              <el-table-column
                align="center"
                show-overflow-tooltip
              >
                <template>
                  <span>合计：</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="heJi"
                align="center"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                align="center"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                align="center"
                show-overflow-tooltip
              >
              </el-table-column>
            </el-table>
          </template>
        </div>
        <!--采购金额-->
        <div class="dialog_content_bottom" v-if="diaLogName=='cgje'">
          <template>
            <el-table
              :data="toDiaLogData"
              :header-row-class-name="headerRowClassName"
              :row-class-name="table1RowClassName"
              height="380px"
              style="width: 100%">
              <el-table-column
                prop="SupperName"
                label="供应商"
                align="center"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="PurchaseSum"
                label="数量"
                align="center"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="PurchaseMoney"
                align="center"
                show-overflow-tooltip
                label="单价">
              </el-table-column>
              <el-table-column
                prop="PurchaseTotal"
                align="center"
                show-overflow-tooltip
                label="金额">
              </el-table-column>
              <el-table-column
                prop="username"
                align="center"
                show-overflow-tooltip
                label="采购人">
              </el-table-column>
              <el-table-column
                prop="PurchaseEx"
                align="center"
                show-overflow-tooltip
                label="说明">
              </el-table-column>
            </el-table>

            <!--合计表格-->
            <el-table
              :data="toDiaLogHeJiData"
              :show-header="false"
              :row-class-name="table2RowClassName"
              style="width: 100%;height: auto;border: 0;">
              <el-table-column
                align="center"
                show-overflow-tooltip
              >
                <template>
                  <span>合计：</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="heJi1"
                align="center"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="heJi2"
                align="center"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="heJi3"
                align="center"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                align="center"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                align="center"
                show-overflow-tooltip
              >
              </el-table-column>
            </el-table>
          </template>
        </div>
        <!--使用价值-->
        <div class="dialog_content_bottom" v-if="diaLogName=='syjz'">
          <template>
            <el-table
              :data="toDiaLogData"
              :header-row-class-name="headerRowClassName"
              :row-class-name="table1RowClassName"
              height="380px"
              style="width: 100%">
              <el-table-column
                prop="ordertitle"
                label="婚礼"
                align="center"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="number"
                label="数量"
                align="center"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="Cost"
                align="center"
                show-overflow-tooltip
                label="金额">
              </el-table-column>
              <el-table-column
                prop="username"
                align="center"
                show-overflow-tooltip
                label="使用人">
              </el-table-column>
              <el-table-column
                prop="Remark"
                align="center"
                show-overflow-tooltip
                label="说明">
              </el-table-column>
            </el-table>

            <!--合计表格-->
            <el-table
              :data="toDiaLogHeJiData"
              :show-header="false"
              :row-class-name="table2RowClassName"
              style="width: 100%;height: auto;border: 0;">
              <el-table-column
                align="center"
                show-overflow-tooltip
              >
                <template>
                  <span>合计：</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="heJi1"
                align="center"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="heJi2"
                align="center"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                align="center"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                align="center"
                show-overflow-tooltip
              >
              </el-table-column>
            </el-table>
          </template>
        </div>
        <!--外借金额-->
        <div class="dialog_content_bottom" v-if="diaLogName=='wjje'">
          <template>
            <el-table
              :data="toDiaLogData"
              :header-row-class-name="headerRowClassName"
              :row-class-name="table1RowClassName"
              height="380px"
              style="width: 100%">
              <el-table-column
                prop="ordertitle"
                label="婚礼"
                align="center"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="number"
                label="数量"
                align="center"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="Cost"
                align="center"
                show-overflow-tooltip
                label="金额">
              </el-table-column>
              <el-table-column
                prop="username"
                align="center"
                show-overflow-tooltip
                label="使用人">
              </el-table-column>
              <el-table-column
                prop="Remark"
                align="center"
                show-overflow-tooltip
                label="说明">
              </el-table-column>
            </el-table>

            <!--合计表格-->
            <el-table
              :data="toDiaLogHeJiData"
              :show-header="false"
              :row-class-name="table2RowClassName"
              style="width: 100%;height: auto;border: 0;">
              <el-table-column
                align="center"
                show-overflow-tooltip
              >
                <template>
                  <span>合计：</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="heJi1"
                align="center"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="heJi2"
                align="center"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                align="center"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                align="center"
                show-overflow-tooltip
              >
              </el-table-column>
            </el-table>
          </template>
        </div>

      </div>
      <span slot="footer" class="dialog-footer">
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import timeSelect from '../timeSelect-dialog/timeSelect-dialog'
  import btn from '../btn/btn'

  export default {
    name: 'diaLog',
    props: ['show_dialogBox', 'toDiaLogData', 'diaLogName', 'toDiaLogHeJiData', 'diaLogTitle', 'diaLogDefaultTime1', 'diaLogDefaultTime2', 'getSTime', 'getETime'],
    methods: {
      //关闭弹框
      closeTip() {
        this.$emit('closeTip')
      },
      headerRowClassName({row, rowIndex}) {
        return 'tableHeaderStyle'
      },
      table1RowClassName({row, rowIndex}) {
        return 'tableTdStyle '
      },
      table2RowClassName({row, rowIndex}) {
        return 'table2TdStyle '
      },
      getStartTime2(val) {
        this.$emit('diaLogGetStartTime', val)
      },
      getEndTime2(val) {
        this.$emit('diaLogGetEndTime', val)
      },
      btnEvent() {
        this.$emit('diaLogBtnEvent')
      },
      toUpChildFA() {
        this.$refs.timeChild.updateTime();
      },
    },
    data() {
      return {}
    },
    created() {

    },
    updated() {
      if (this.show_dialogBox == true){
        this.$refs.timeChild.updateTime();
      }
    },
    components: {
      timeSelect: timeSelect,
      btn: btn,
    },

  }

</script>

<style scoped>

  >>> .dialogBox {
    height: 615px;
    padding: 0 15px;
  }

  >>> .closeIcon {
    width: 20px;
    height: 20px;
    display: block;
    background: url("../../../static/img/close3.png") no-repeat center center;
    position: absolute;
    right: 20px;
    top: 20px;
    cursor: pointer;
  }

  >>> .dialogBox .dialog_title {
    font-size: 17px;
    text-align: center;
    color: #4C4C4C;
  }

  >>> .dialogBox .el-dialog__header {
    padding: 40px 20px 10px;
  }

  >>> .dialogBox .dialog_content_top {
    display: flex;
  }

  >>> .dialogBox .dialog_timeSelect {
    margin-right: 15px;
  }

  >>> .dialogBox .dialog_content_bottom {
    height: 380px;
    margin-top: 20px;
  }

  >>> .dialogBox .el-table {
    height: 100%;
    border-radius: 4px;
    border: 1px solid #DDDDDD;
  }

  >>> .dialogBox .tableHeaderStyle > th {
    background: #E6E6E6;
    height: 48px;
    text-align: center;
    color: #3C3C3C;
    font-size: 14px;
    border: 0;
  }

  >>> .dialogBox .tableTdStyle > td {
    height: 52px;
    color: #3C3C3C;
    font-size: 14px;
    border-left: 1px solid #DDDDDD;
    border-bottom: 1px solid #DDDDDD;
  }

  >>> .dialogBox .tableTdStyle > td:first-of-type {
    border-left: 0;
  }

  >>> .dialogBox .table2TdStyle > td {
    border: 0;
    color: #FF0000;
  }

  >>> .dialogBox .table2TdStyle > td:first-of-type {
    text-align: left;
  }

  >>> .dialogBox .tableTdStyle:hover td, >>> .dialogBox .table2TdStyle:hover td {
    background: transparent;
  }

</style>
