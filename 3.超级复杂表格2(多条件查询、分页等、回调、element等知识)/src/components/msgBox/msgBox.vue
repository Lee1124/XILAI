<template>
  <div id="app" :class="{'box': !Opacity,'Opacity':Opacity,'showBox':showBox}">
    <!--增加-->
    <div class="modelBox" v-if="model_type=='add'">
      <div class="model_title">
        <p>新增销售机会</p>
        <i @click="hideModel"></i>
      </div>
      <p class="inner_title">请先对以下类型进行选择</p>
      <div class="model_content">
        <ul>
          <template v-for="(item,index) in list">
            <li @click="choiseThisAdd(item)"  @mouseenter="mouseenterThis(item)" :class="{'selfBorder':item.isChoise}">{{item.addName}}</li>
          </template>
        </ul>
      </div>
      <div class="model_foot">
        <!--<button @click="yesEvent_add($event)">确定</button>-->
        <!--<button @click="hideModel">取消</button>-->
      </div>
    </div>

    <!--回复-->
    <div class="modelBox" v-if="model_type=='return'">
      <div class="model_title">
        <p>回复</p>
        <i @click="hideModel"></i>
      </div>
      <!--<p class="inner_title">请先对以下类型进行选择</p>-->
      <div class="model_content model_content_return">
        <div class="ct_inner">
          <span>回复对象：</span>
          <span>{{retName}}</span>
        </div>
        <div class="ct_inner">
          <span>内&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;容：</span>
          <span>{{retCt}}</span>
        </div>
        <div class="ct_inner">
          <span>时&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;间：</span>
          <span>{{retTime}}</span>
        </div>
        <textarea id="return_textArea" placeholder="请输入您想要回复的内容"></textarea>
      </div>
      <div class="model_foot">
        <button @click="yesEvent_return($event)">确定</button>
        <button @click="hideModel">取消</button>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: "msgBox",
    props: ['Opacity','showBox','getText', 'list', 'model_type','retName','retCt','retTime'],
    data() {
      return {}
    },
    created() {
    },
    methods: {
      mouseenterThis(obj) {
        this.list.forEach((item, index) => {
          item.isChoise = false;
        });
        obj.isChoise = !obj.isChoise
      },
      hideModel() {
        this.$emit('hideModel')
      },
      choiseThisAdd(obj) {
        let type = 0;
        if (obj.addName == '添加婚礼销售机会') {
          type = 1;
        } else if (obj.addName == '添加宝宝宴销售机会') {
          type = 2;
        } else if (obj.addName == '添加生日宴销售机会') {
          type = 3;
        } else if (obj.addName == '添加添加商业庆典销售机会') {
          type = 4;
        } else if (obj.addName == '添加网络销售机会') {
          type = 6;
        } else if (obj.addName == '添加其他庆典销售机会') {
          type = 5;
        }
        // this.$emit('yesEvent_add', type)
        this.$emit('choiseThisAdd', type)
      },
      yesEvent_return() {
        let text=$("#return_textArea").val();
        this.$emit('yesEvent_return',text)
      },
    }
  }


</script>

<style scoped>
  * {
    margin: 0;
    padding: 0;
  }

  #app {
    padding: 0;
    margin: 0;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    opacity: 0;
    z-index: -1;
  }

  .Opacity {
    opacity: 1 !important;
    transform: scale(1) !important;
    z-index: 2018 !important;
    transition: all .2s;
    background: rgba(0, 0, 0, .4);
  }
  .showBox {
    background: rgba(0, 0, 0, 0);
  }

  .modelBox {
    width: 540px;
    height: 530px;
    padding: 20px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%) scale(0);
    -moz-transform: translate(-50%, -50%) scale(0);
    -ms-transform: translate(-50%, -50%) scale(0);
    -o-transform: translate(-50%, -50%) scale(0);
    transform: translate(-50%, -50%) scale(0);
    z-index: 2019;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #ebeef5;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);

  }

  .Opacity .modelBox {
    transform: translate(-50%, -50%) scale(1);
  }

  .model_title {
    text-align: center;
    color: #4C4C4C;
    font-size: 17px;
    position: relative;
  }

  .model_title i {
    background: url("../../../static/img/close3.png") no-repeat;
    font-style: normal;
    width: 20px;
    height: 20px;
    line-height: 20px;
    display: inline-block;
    position: absolute;
    right: 0;
    top: 0;
    cursor: pointer;
  }

  .model_foot {
    position: absolute;
    bottom: 20px;
    left: 20px;
    right: 26px;
  }

  .model_foot button {
    float: right;
    width: 120px;
    height: 38px;
    outline: none;
    border: 0;
    font-size: 15px;
    cursor: pointer;
    border-radius: 4px;
  }

  .model_foot button:nth-of-type(1) {
    background: #BB9860;
    color: #fff;
  }

  .model_foot button:nth-of-type(2) {
    color: #808080;
    background: #fff;
  }

  .inner_title {
    color: #808080;
    font-size: 14px;
    margin-top: 35px;
  }

  .model_content {
    height: 365px;
    border-bottom: 1px dashed #E6D5B9;
    overflow-x: hidden;
    overflow-y: auto;
  }

  /*滚动条的滑槽的样式*/
  .model_content::-webkit-scrollbar {
    width: 3px;
    height: 100%;
    background: #E6E6E6;
    -webkit-border-radius: 1px;
    -moz-border-radius: 1px;
    border-radius: 1px;
  }

  /*滚动条的滑块的样式*/
  .model_content::-webkit-scrollbar-thumb {
    background-color: #BB9860;
    width: 3px;
    height: 55px;
    -webkit-border-radius: 1px;
    -moz-border-radius: 1px;
    border-radius: 1px;
  }

  .model_content ul li {
    list-style: none;
    color: #4C4C4C;
    font-size: 15px;
    height: 45px;
    line-height: 45px;
    padding-left: 30px;
    border-radius: 5px;
    margin: 11px auto;
    transition: all .2s;
    cursor: pointer;
    width: 90%;
    border-radius: 5px;
    border: 1px solid #fff;
  }

  .selfBorder {
    border: 1px solid #BB9860 !important;
  }

  .model_content ul li:active {
    color: #BB9860;
    font-weight: 700;
  }

  .model_content_return {
    margin-top: 36px;
    border: 0;
    height: 380px;
  }

  .ct_inner {
    display: flex;
    flex-wrap: nowrap;
    font-size: 14px;
  }

  .ct_inner:nth-of-type(1) span:nth-of-type(1) {
    color: #808080;
    flex-basis: 17%;
  }

  .ct_inner:nth-of-type(2) span:nth-of-type(1) {
    color: #808080;
    flex-basis: 17%;
  }
  .ct_inner:nth-of-type(3) span:nth-of-type(1) {
    color: #808080;
    flex-basis: 17%;
  }

  .ct_inner:nth-of-type(1) span:nth-of-type(2) {
    flex-basis: 83%;
  }
  .ct_inner:nth-of-type(2) span:nth-of-type(2) {
    flex-basis: 83%;
  }
  .ct_inner:nth-of-type(3) span:nth-of-type(2) {
    flex-basis: 83%;
  }

  .ct_inner:nth-of-type(2) {
    margin: 5px 0;
  }

  .ct_inner span:nth-of-type(2) {
    color: #4C4C4C;
  }
  .ct_inner:last-of-type{
    margin-bottom: 10px;
  }

  #return_textArea {
    border: 0;
    width: 99%;
    resize: none;
    height: 280px;
    background: rgba(242, 242, 242, 1);
    border-radius: 5px;
    outline: none;
    box-sizing: border-box;
    padding: 15px 18px;
    font-size: 15px;
  }

  #return_textArea::-webkit-input-placeholder {
    color: #B2B2B2;
    font-size: 15px;
  }

  /*获取微信等信息*/
  .modelBox_getImg {
    width: 725px;
    height: 660px;
    padding: 20px 2px;
  }

  .modelBox_getImg .model_title {
    text-align: left;
    padding-left: 14px;
    color: #BB9860;
    font-size: 14px;
    font-weight: 700;
  }

  .modelBox_getImg .model_content {
    height: 95%;
    border: 0;
    overflow: hidden;
  }

  .modelBox_getImg .model_title i {
    border-radius: 50%;
    background: url("../../../static/img/close2.png") no-repeat #999 center center;
    right: -12px;
    top: -30px;
  }

  #getImg_iframe {
    width: 100%;
    height: 100%;
  }
</style>


