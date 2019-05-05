<template>
  <div id="app">
    <!--删除订单-->
    <el-dialog
      title="删除订单"
      :visible.sync="showDialogBox"
      :show-close=false
      custom-class="del_dialogBox"
      width="350px"
      center>
      <div class="content_top">
        <p>您确定要删除以下订单吗？</p>
        <p>{{rowNewsText}}</p>
      </div>
      <div class="dialog_content">
        <textarea placeholder="请输入退款原因" id="textArea"></textarea>
      </div>
      <div class="content_bottom">
        * 注意：点击确认删除，需等待管理员审核确认
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="cancelEvent">取消</el-button>
    <el-button type="primary" @click="confirmEvent('del')">删除</el-button>
      </span>
    </el-dialog>

    <!--机会流失-->
    <el-dialog
      title="流失机会"
      :visible.sync="show_chance_dialogBox"
      :show-close=false
      custom-class="del_dialogBox chance_dialogBox"
      center>
      <div class="content_top">
        <p>您确定要流失以下订单吗？</p>
        <p>{{rowNewsText}}</p>
      </div>
      <div class="dialog_content">
        <textarea placeholder="请输入流失原因" id="chance_textArea"></textarea>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="cancelEvent">取消</el-button>
    <el-button type="primary" @click="confirmEvent('chance')">确定</el-button>
      </span>
    </el-dialog>

    <!--申请流失处理-->
    <el-dialog
      title="销售机会流失审核"
      :visible.sync="show_lossManage_dialogBox"
      :show-close=false
      custom-class="del_dialogBox chance_dialogBox lossManage_dialogBox"
      center>
      <div class="content_top">
        <!--<p>您确定要流失以下订单吗？</p>-->
        <p>{{rowNewsText}}</p>
      </div>
      <i class="closeIcon" @click="closeTip"></i>
      <div class="dialog_content">
        <div id="lossManage_textArea">
          <template v-for="(item,index) in lossManageData">
          <div class="loss_ct_inner">
          <span v-if="index==0">申请理由：</span>
          <span v-if="index==1">申请时间：</span>
          <span v-if="index==2">申请人：</span>
          <span>{{item}}</span>
          </div>
          </template>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="returnLossManage">退回</el-button>
    <el-button type="primary" @click="confirmEvent('lossManage')">通过</el-button>
      </span>
    </el-dialog>


    <!--人员筛选-->
    <el-dialog
      title=""
      :visible.sync="show_personChance_dialogBox"
      :show-close=false
      custom-class="personChance_dialogBox"
      top="50px"
      width="740px"
      center>
      <i class="closeIcon" @click="closeTip"></i>
      <div class="dialog_content">
        <iframe :src="personChanceSrc" frameborder="0" id="personChance_iframe"></iframe>
      </div>
      <span slot="footer" class="dialog-footer">
      </span>
    </el-dialog>

    <!--微信绑定-->
    <el-dialog
      :title="getText"
      :visible.sync="show_wx_dialogBox"
      :show-close=false
      custom-class="wx_dialogBox"
      top="50px"
      width="740px"
      center>
      <i class="closeIcon" @click="closeTip"></i>
      <div class="dialog_content">
        <iframe :src="wxPageSrc" frameborder="0" id="wx_iframe"></iframe>
      </div>
      <span slot="footer" class="dialog-footer">
    <!--<el-button @click="returnLossManage">退回</el-button>-->
        <!--<el-button type="primary" @click="confirmEvent('lossManage')">通过</el-button>-->
      </span>
    </el-dialog>


    <!--添加沟通记录-->
    <el-dialog
      :title="getText"
      :visible.sync="show_addSay_dialogBox"
      :show-close=false
      custom-class="addSay_dialogBox"
      width="600px"
      center>
      <i class="closeIcon" @click="closeTip"></i>
      <div class="dialog_content">
        <iframe :src="addSayPageSrc" frameborder="0" id="addSay_iframe"></iframe>
      </div>
      <span slot="footer" class="dialog-footer">
    <!--<el-button @click="returnLossManage">退回</el-button>-->
        <!--<el-button type="primary" @click="confirmEvent('lossManage')">通过</el-button>-->
      </span>
    </el-dialog>


    <!--查看流失原因-->
    <el-dialog
      title="查看流失原因"
      :visible.sync="showLiuShiDialogBox"
      :show-close=false
      custom-class="del_dialogBox liuShi_dialogBox "
      width="350px"
      center>
      <div class="content_top">
        <p>{{rowNewsText}}</p>
      </div>
      <i class="closeIcon" @click="closeTip"></i>
      <div class="dialog_content">
        <textarea id="liuShi_textArea" :placeholder="liuShiTextAreaText" disabled>
        </textarea>
      </div>
      <span slot="footer" class="dialog-footer">
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'diaLog',
    props: ['rowNewsText', 'showDialogBox', 'show_chance_dialogBox', 'show_lossManage_dialogBox',
      'show_personChance_dialogBox', 'show_wx_dialogBox', 'show_addSay_dialogBox',
      'lossManageData', 'personChanceSrc', 'wxPageSrc', 'addSayPageSrc', 'getText',
      'showLiuShiDialogBox', 'liuShiTextAreaText'],
    methods: {
      //取消
      cancelEvent() {
        this.$emit('cancelEvent')
      },
      //流失处理驳回
      returnLossManage() {
        this.$emit('returnLossManage')
      },
      //删除确认
      confirmEvent(obj) {
        this.$emit('confirmEvent', obj)
      },
      //关闭
      closeTip() {
        this.$emit('closeTip')
      },
    },
    data() {
      return {}
    }
  }

</script>

<style scoped>

  /deep/ .el-dialog__footer {
    position: absolute;
    bottom: 10px;
    width: 92%;
  }

  /deep/ .el-dialog__footer button:nth-of-type(1) {
    background: #fff;
    color: #808080;
    border: 0;
  }

  /deep/ .el-dialog__footer button:nth-of-type(2) {
    background: #BB9860;
    color: #fff;
    border: 0;
  }

  >>> .del_dialogBox {
    width: 540px !important;
    height: 500px;
  }

  >>> .del_dialogBox .el-dialog__title {
    color: #4C4C4C;
    font-size: 17px;
  }

  >>> .del_dialogBox .content_top {
    color: #4C4C4C;
    font-size: 17px;
  }

  >>> .del_dialogBox .el-dialog--center .el-dialog__body {
    padding-top: 0;
  }

  >>> .del_dialogBox .content_top {
    padding: 0 0 10px;
    border-bottom: 1px dashed #E6D5B9;
  }

  >>> .del_dialogBox .content_top p:nth-of-type(1) {
    color: #4C4C4C;
    font-size: 14px;
  }

  >>> .del_dialogBox .content_top p:nth-of-type(2) {
    color: #4C4C4C;
    font-size: 15px;
    font-weight: 700;
    margin: 20px;
  }

  >>> .del_dialogBox .dialog_content #textArea, #liuShi_textArea,#chance_textArea,#lossManage_textArea {
    margin: 12px 0;
    background: #F2F2F2;
    width: 100%;
    resize: none;
    height: 160px;
    outline: none;
    padding: 15px 20px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    font-size: 14px;
    border: 0;
    border-radius: 4px;
  }

  #chance_textArea {
    height: 200px;
  }


  >>> .del_dialogBox #textArea::placeholder {
    color: #B3B3B3;
  }

  >>> .del_dialogBox .content_bottom {
    color: #B2B2B2;
    font-size: 13px;
    padding-left: 10px;
  }

  >>> .del_dialogBox .el-dialog__footer {
    text-align: right;
    width: 96%;
  }

  >>> .del_dialogBox button {
    width: 120px;
    height: 38px;
    border-radius: 4px;
    outline: none;
    border: 0;
    font-size: 17px;
    line-height: 17px;
  }

  >>> .del_dialogBox button:nth-of-type(1) {
    color: #808080;
  }

  >>> .del_dialogBox button:nth-of-type(1):hover {
    background: #fff;
  }

  >>> .del_dialogBox button:nth-of-type(2):hover {
    background: rgb(175, 140, 88);
  }

  >>> .del_dialogBox .el-button + .el-button {
    background: rgba(187, 152, 96, 1);
  }

  /*流失处理*/
  /deep/ .lossManage_dialogBox {
    height: 500px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  /deep/ .lossManage_dialogBox  .content_top p:nth-of-type(1){
    font-weight: 700;
  }

  /deep/ .lossManage_dialogBox .el-dialog__header .el-dialog__title {
    color: #4C4C4C;
  }
  /deep/ .lossManage_dialogBox #lossManage_textArea{
    height: 240px;
  }


  /deep/ .lossManage_dialogBox .loss_ct_inner {
    display: flex;
    flex-wrap: nowrap;
    margin-bottom: 30px;
    padding: 0 10px;
  }

  /deep/ .lossManage_dialogBox .loss_ct_inner span:nth-of-type(1) {
    width: 18%;
    color: #666;
  }

  /deep/ .lossManage_dialogBox .loss_ct_inner span:nth-of-type(2) {
    word-wrap: break-word;
    width: 78%;
    color: #000;
  }


  /*修改负责人*/
  /deep/ .personChance_dialogBox {
    height: 600px;
  }

  /deep/ .personChance_dialogBox .el-dialog__body {
    padding: 0;
  }

  /deep/ #personChance_iframe {
    width: 100%;
    height: 600px;
  }

  /*微信绑定*/
  /deep/ .wx_dialogBox {
    height: 600px;
  }

  /deep/ .wx_dialogBox .el-dialog__header {
    text-align: left;
    height: 10px;
  }

  /deep/ .wx_dialogBox .el-dialog__header .el-dialog__title {
    color: #BB9860;
    font-size: 15px;
    font-weight: 700;
  }

  /deep/ .wx_dialogBox .el-dialog__body {
    padding: 0;
  }

  /deep/ #wx_iframe {
    width: 100%;
    height: 600px;
  }

  /*添加沟通记录*/
  /deep/ .addSay_dialogBox {
    height: 460px;
    overflow: hidden;
  }

  /deep/ .addSay_dialogBox .el-dialog__header {
    display: none;
  }

  /deep/ .addSay_dialogBox .el-dialog__body {
    padding: 0;
  }

  /deep/ .addSay_dialogBox .el-dialog__footer {
    display: none;
  }

  /deep/ .personChance_dialogBox .el-dialog__footer {
    display: none;
  }

  /deep/ #addSay_iframe {
    width: 100%;
    height: 600px;
  }

  /*查看流失原因*/
  >>> .closeIcon{
    width: 20px;
    height: 20px;
    display: block;
    background: url("../../../static/img/close3.png") no-repeat center center;
    position: absolute;
    right: 20px;
    top: 20px;
    cursor: pointer;
  }

  >>> .liuShi_dialogBox .content_top p {
    color: #4C4C4C;
    font-size: 15px;
    font-weight: 700;
    margin: 20px 0;
  }

  >>> #liuShi_textArea {
    height: 270px;
  }

  >>> #liuShi_textArea::placeholder {
    color: #666;
  }

</style>
