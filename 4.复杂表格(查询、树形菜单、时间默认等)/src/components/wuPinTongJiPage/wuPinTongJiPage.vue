<template>
  <div id="app" class="bigStyle">

    <!--内容区-->
    <!--<div class="content">-->
    <!---->
    <!---->
    <!--</div>-->

    <el-container>
      <el-header>
        <!--头部-->
        <Header @getSelectVal1="getSelectVal1" @getSelectVal2="getSelectVal2" @btnEvent="btnEvent"
                @inputVal2="inputVal2" @getStartTime="getStartTime" @getEndTime="getEndTime"></Header>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <div class="content_left" :style="{'height':leftHeight}">
            <Tree @handleNodeClick="handleNodeClick"></Tree>
          </div>
        </el-aside>
        <el-main>
          <div class="content_right">
            <tableContent ref="tableContent" :SelectVal1="SelectVal1" :SelectVal2="SelectVal2" :inputVal="inputVal"
                          :toInputVal="toInputVal" :StartTime="StartTime" :EndTime="EndTime"
                          :handleNodeClickData="handleNodeClickData"></tableContent>
          </div>
        </el-main>
      </el-container>
    </el-container>


  </div>
</template>


<script>
  import Header from '../Header/Header'
  import Tree from '../Tree/Tree'
  import tableContent from '../tableContent/tableContent'

  export default {
    name: "wuPinTongJiPage",
    data() {
      return {
        leftHeight: '',
        SelectVal1: '',
        SelectVal2: '',
        inputVal: '',
        toInputVal: '',
        StartTime: '',
        EndTime: '',
        handleNodeClickData: ''
      }
    },
    components: {
      Header: Header,
      Tree: Tree,
      tableContent: tableContent,
    },
    methods: {
      getSelectVal1(val) {
        if (val == -1) {
          val = "";
        }
        this.SelectVal1 = val;
      },
      getSelectVal2(val) {
        this.SelectVal2 = val;
      },
      btnEvent() {
        this.inputVal = $('#inputSearch').val();
      },
      inputVal2(obj) {
        this.toInputVal = obj;
      },
      getStartTime(val) {
        this.$refs.tableContent.StartTime(val);
      },
      getEndTime(val) {
        this.$refs.tableContent.EndTime(val);
      },
      handleNodeClick(data) {
        this.handleNodeClickData = data;
      },
    },
    created() {
      let tableHeight = $(document).height() - 290;
      this.leftHeight = tableHeight + 50 + 'px';
    },
  }
</script>

<style scoped>
  .bigStyle {
    padding: 15px 20px 0;
  }

  >>> .el-header {
    height: 142px !important;
    z-index: 99 !important;
  }

  >>> .el-aside {
    padding: 20px 0 20px 10px;
    border-right: 1px solid #DDDDDD;
    width: 210px !important;
  }

  >>> .el-aside::-webkit-scrollbar {
    width: 3px;
    height: 3px;
    background: #E6E6E6;
    -webkit-border-radius: 1px;
    -moz-border-radius: 1px;
    border-radius: 1px;
  }

  >>> .el-aside::-webkit-scrollbar-thumb {
    background-color: #BB9860;
    height: 3px;
    width: 3px;
    -webkit-border-radius: 1px;
    -moz-border-radius: 1px;
    border-radius: 1px;
  }
</style>
