<template>
  <div id="look-through-dialog-view"
       :class="{'look-through-dialog-view-white':urlAddress=='white','look-through-dialog-view-black':urlAddress=='black'}">
    <!-- @opened="loadRightClickEvent"
   @closed="closeRightClickEvent"-->
    <el-dialog
      title="资料审核"
      :visible.sync="showLookThroughDialogViewBox"
      :show-close=false
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="lookThroughDialogViewBox"
      center>
      <i class="closeIcon" @click="closeTip">
        <img src="../../../static/img/close.png" alt="关闭">
      </i>
      <div class="diaLog-content">
        <div class="top-select clearfloat">
          <template v-for="(items,index) in checkedData">
            <div class="top-select-inner">
              <input type="radio" name="radio" :value="items.value" :checked="index==0" @change="checkedThis(index)">
              <label>{{items.name}}</label>
            </div>
          </template>
        </div>
        <div class="textArea">
          <textarea name="textArea" id="textArea" placeholder="审核说明..." v-model="textAreaText"></textarea>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="confirmChange">保 存</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  //数据:
  let myData = {
    checkedData:[
      {name:'等待',value:1,isChecked:true},
      {name:'退回',value:2,isChecked:false},
      {name:'通过',value:3,isChecked:false},
    ],

    textAreaText:'',
    urlAddress: '',
    flag:true,
    UserId: getkevalue().userid,//是	int	用户id
    FileId: '',//	是	string	案例id
    Remark: '',//	是	string	备注说明
    SearchState: 1,//	是	int	1等待审核 2退回 3通过

    api: getkevalue().apiurl,
    // Authorization: localStorage.userinfo,
    Authorization: 'http://211.149.163.185:8090/|1|22|xlhl|http://171.211.126.122:8091/|http://171.211.126.122:8092/|1,1|http://192.168.1.253:8095|https://xilai99.com',
  };
  //方法:
  let myMethods = {
    //关闭
    closeTip() {
      this.$emit('closeTip');
    },
    //更新数据
    updateData(){
      this.$emit('updateData');
    },
    //获取审核订单信息
    getLookThrough(obj) {
      this.textAreaText='';
      this.UserId = getkevalue().userid;
      this.FileId = obj.FileId;
    },
    // 保存修改
    confirmChange(){
      if (this.flag){
        this.flag=false;
        if (this.textAreaText==''){
          this.$message({
            message: '备注不能为空!',
            center: true
          });
          return false;
        }
        let url=this.api+'/xlapi/ZiLiao/ZiLiaoShengHe/ZiLiaoShengHe/UpdateAnLiState';
        let data={
          UserId: this.UserId,
          FileId: this.FileId,
          Remark: this.textAreaText,
          SearchState: this.SearchState
        };
        this.$axios({
          method:'POST',
          url:url,
          data:data,
          headers:{
            Authorization:this.Authorization
          }
        }).then(res=>{
          if (res.status==200){
            this.flag=true;
            this.closeTip();
            this.updateData();
            this.$message({
              type:'success',
              duration:1000,
              customClass:'tip-success',
              message: '修改成功',
              center: true
            });
          }
        })
      }

    },
    //单选框选择的选项
    checkedThis(index){
      this.flag=true;
      this.SearchState=index+1;
    }

  };
  export default {
    name: "look-through-dialog-view",
    props: ['showLookThroughDialogViewBox'],
    data() {
      return myData;
    },
    methods: myMethods,
    created() {
      this.urlAddress = this.getUrlStyle()
    },
    watch:{
      textAreaText(val){
        this.flag=true;
        this.textAreaText=val;
      }
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

  >>> .lookThroughDialogViewBox .el-dialog__header,
  >>> .lookThroughDialogViewBox .el-dialog__body,
  >>> .lookThroughDialogViewBox .el-dialog__footer {
    padding: 0;
    margin: 0;
  }

  >>> .lookThroughDialogViewBox {
    width: 455px;
    height: 384px;
    border-radius: 5px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .look-through-dialog-view-white >>> .lookThroughDialogViewBox {
    background: rgba(255, 255, 255, 1);
  }

  .look-through-dialog-view-black >>> .lookThroughDialogViewBox {
    background: rgba(252, 249, 242, 1);
  }

  >>> .lookThroughDialogViewBox .el-dialog__header {
    font-size: 17px;

    padding-top: 30px;
  }

  .look-through-dialog-view-white >>> .el-dialog__header .el-dialog__title {
    color: #4C4C4C;
  }

  .look-through-dialog-view-black >>> .el-dialog__header .el-dialog__title {
    color: #6C583F;
  }

  >>> .lookThroughDialogViewBox .el-dialog__body {
    padding: 25px 50px 20px;
  }

  >>> .lookThroughDialogViewBox .el-dialog__footer {
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
    width: 76px;
    height: 34px;

    border-radius: 5px;
    border: 0;
    font-size: 14px;
  }

  .look-through-dialog-view-white >>> .el-dialog__footer button {
    background: rgba(187, 152, 96, 1);
  }

  .look-through-dialog-view-black >>> .el-dialog__footer button {
    background: rgba(108, 88, 63, 1);
  }

  .top-select {
    border: 1px dashed #DDDDDD;
    padding: 20px 60px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
  }

  .diaLog-content .top-select-inner {
    float: left;
    margin-right: 32px;
    font-size: 14px;
  }

  .diaLog-content .top-select-inner label {
    color: #4C4C4C;
  }

  .diaLog-content .top-select-inner:last-child {
    margin-right: 0;
  }

  .diaLog-content .top-select-inner input[type=radio] {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    -webkit-appearance: none;
    border: 1px solid #DDDDDD;
    outline: none;
    vertical-align: -3px;
    cursor: pointer;
    margin-right: 5px;
  }

  .diaLog-content .top-select-inner input[type=radio]:checked {
    background-size: 100%;
    background: #BB9860;
    color: #fff;
  }

  .look-through-dialog-view-white .diaLog-content .top-select-inner input[type=radio]:checked {
    background: url("../../../static/img/cked.png") no-repeat center center !important;
  }

  .look-through-dialog-view-black .diaLog-content .top-select-inner input[type=radio]:checked {
    background: url("../../../static/img/cked2.png") no-repeat center center !important;
  }

  #textArea {
    width: 100%;
    height: 136px;
    border-radius: 5px;
    margin-top: 20px;
    border: 0;
    resize: none;
    outline: none;
    padding: 18px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .look-through-dialog-view-white #textArea {
    background: rgba(242, 242, 242, 1);
  }

  .look-through-dialog-view-black #textArea {
    background: rgba(108, 88, 63, .1);
  }

  #textArea::placeholder {
    font-size: 14px;
  }

  .look-through-dialog-view-white #textArea::placeholder {
    color: #B2B2B2;
  }

  .look-through-dialog-view-black #textArea::placeholder {
    color: #6C583F;
  }


</style>
