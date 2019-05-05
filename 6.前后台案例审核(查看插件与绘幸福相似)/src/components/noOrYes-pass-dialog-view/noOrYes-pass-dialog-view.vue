<template>
  <div id="no-pass-dialog-view"
       :class="{'no-pass-dialog-view-white':urlAddress=='white','no-pass-dialog-view-black':urlAddress=='black'}">
    <!-- @opened="loadRightClickEvent"
   @closed="closeRightClickEvent"-->
    <el-dialog
      title=""
      :visible.sync="noOrYesPassDialogViewBox"
      :show-close=false
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="noPassDialogViewBox"
      center>
      <i class="closeIcon" @click="closeTip">
        <img src="../../../static/img/close.png" alt="关闭">
      </i>
      <div class="diaLog-content">
        <img src="../../../static/img/noPassTip.png" id="noPassTip" v-if="FileState=='2'">
        <img src="../../../static/img/passTip.png" id="passTip" v-if="FileState=='3'">
        <ul>
          <li>
            <span v-if="FileState=='2'">很抱歉，提交的案例</span>
            <span v-if="FileState=='3'">提交的案例</span>
          </li>
          <li>
            【{{title}}】
          </li>
          <li>
            <span v-if="FileState=='3'" style="color: #08ae14;">已通过审核</span>
            <span v-if="FileState=='2'">未通过审核</span>
          </li>
          <li>
            <span v-if="FileState=='3'">备注 :</span>
            <span v-if="FileState=='2'">可能是因为 :</span>
          </li>
          <li v-text="remark"></li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="closeTip">我知道了</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  //数据:
  let myData = {
    urlAddress: '',
    remark: '',//审核说明
    FileState: '',//1等待审核 2退回 3通过
    title: '',
  };
  //方法:
  let myMethods = {
    //关闭
    closeTip() {
      this.$emit('closeTip');
    },
    //获取审核说明
    getIsPassRemark(items) {
      this.remark = items.Remark;
      this.FileState = items.FileState;
      this.title = items.OrderTitle;
      if (this.remark == '') {
        this.remark = '无'
      }
    }

  };
  export default {
    name: "no-pass-dialog-view",
    props: ['noOrYesPassDialogViewBox'],
    data() {
      return myData;
    },
    methods: myMethods,
    created() {
      this.urlAddress = this.getUrlStyle()
    }
  }
</script>

<style scoped>
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

  >>> .noPassDialogViewBox .el-dialog__header,
  >>> .noPassDialogViewBox .el-dialog__body,
  >>> .noPassDialogViewBox .el-dialog__footer {
    padding: 0;
    margin: 0;
  }

  >>> .noPassDialogViewBox {
    width: 455px;
    height: 406px;
    border-radius: 5px;
    padding: 30px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .no-pass-dialog-view-white >>> .noPassDialogViewBox {
    background: rgba(255, 255, 255, 1);
  }

  .no-pass-dialog-view-black >>> .noPassDialogViewBox {
    background: rgba(252, 249, 242, 1);
  }

  .look-through-dialog-view-white >>> .el-dialog__header .el-dialog__title {
    color: #4C4C4C;
  }

  .look-through-dialog-view-black >>> .el-dialog__header .el-dialog__title {
    color: #6C583F;
  }

  >>> .noPassDialogViewBox .el-dialog__footer {
    position: absolute;
    bottom: 30px;
    left: 50%;
    -webkit-transform: translateX(-50%);
    -moz-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    -o-transform: translateX(-50%);
    transform: translateX(-50%);
  }

  >>> .el-dialog__footer button {
    padding: 0;
    width: 106px;
    height: 34px;
    border-radius: 5px;
    border: 0;
    font-size: 14px;
  }

  .no-pass-dialog-view-white >>> .el-dialog__footer button {
    background: rgba(187, 152, 96, 1);
  }

  .no-pass-dialog-view-black >>> .el-dialog__footer button {
    background: rgba(108, 88, 63, 1);
  }

  .diaLog-content {
    text-align: center;
  }

  .diaLog-content ul {
    max-height: 160px;
    overflow: auto;
    padding: 0 20px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .diaLog-content ul::-webkit-scrollbar {
    width: 3px;
    height: 4px;
    background: #E6E6E6;
    -webkit-border-radius: 1px;
    -moz-border-radius: 1px;
    border-radius: 1px;
  }

  .diaLog-content ul::-webkit-scrollbar-thumb {
    background-color: #BB9860;
    height: 3px;
    width: 3px;
    -webkit-border-radius: 1px;
    -moz-border-radius: 1px;
    border-radius: 1px;
  }

  .diaLog-content ul li {
    margin-bottom: 16px;
    font-size: 14px;
  }

  .diaLog-content ul li:last-child {
    margin-bottom: 0;
  }

  .diaLog-content ul li:nth-child(3) {
    color: #FF0000;
  }

  .diaLog-content ul li:nth-child(4) {
    color: #808080;
  }

  #noPassTip {
    margin: 10px 0 25px;
  }

  #passTip {
    margin: 10px 0 25px;
  }

</style>
