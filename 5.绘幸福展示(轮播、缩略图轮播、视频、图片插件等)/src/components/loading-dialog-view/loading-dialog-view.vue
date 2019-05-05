<template>
  <div id="loading-dialog-view">
    <el-dialog
      title="正在更新资料,请稍后..."
      :visible.sync="loadingDialogViewBox"
      :show-close=false
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal="false"
      custom-class="loadingDialogView"
      center>
      <div class="dialog_content" id="dialog_content">
        <img src="../../../static/img/onloading.gif" alt="">
      </div>
      <span slot="footer" class="dialog-footer">
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "loading-dialog-view",
    props: ['loadingDialogViewBox']
  }
</script>

<style scoped>

  >>> .loadingDialogView {
    width: 270px;
    padding-top: 20px;
    padding-bottom: 20px;
    top: 20%;
  }
  >>> .loadingDialogView .el-dialog__header .el-dialog__title{
    color: #BB9860;
    font-size: 14px;
  }

  >>> .loadingDialogView  .el-dialog__body{
    padding: 0 25px;
  }

</style>
