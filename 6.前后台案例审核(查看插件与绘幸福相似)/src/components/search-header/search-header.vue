<template>
  <div id="search-header" :class="{'search-header-white':urlAddress=='white','search-header-black':urlAddress=='black'}">
    <!--时间选择-->
    <timeSelect class="floatL" ref="timeSelect" @getStartTime="getStartTime" @getEndTime="getEndTime"></timeSelect>
    <!--最近选择-->
    <div v-marginRight="25"
         :class="['lately-search', 'floatL',{'lately-search-white':urlAddress=='white','lately-search-black':urlAddress=='black'}]">
      <ul class="clearfloat" v-hoverStyle>
        <li :class="{'li-click-style':liIndex==0}" @click="fastSelect('J1Z')">近1周</li>
        <li :class="{'li-click-style':liIndex==1}" @click="fastSelect('J1Y')">近1月</li>
        <li :class="{'li-click-style':liIndex==2}" @click="fastSelect('J3Y')">近3月</li>
      </ul>
    </div>

    <!--下拉选择-->
    <dropDownSelect @getSelectZT="getSelectZT" @getSelectBranch="getSelectBranch"></dropDownSelect>

    <!--按钮-->
    <btn btnText="查询" :btnStyle="btnStyle" @btnEvent="btnEvent" style="margin-left: 20px"></btn>

  </div>
</template>

<script>
  import timeSelect from '../timeSelect/timeSelect'
  import dropDownSelect from '../dropDownSelect/dropDownSelect'
  import btn from '../btn/btn'

  let myData = {
    urlAddress: '',
    liIndex: 1,
    btnStyle: '',
  };
  let myMethods = {
    //通过父级调用更新
    updateTime(obj) {
      this.$refs.timeSelect.updateTime(obj);
    },
    //快捷选择
    fastSelect(val) {
      this.$emit('fastSelect', val)
    },
    //点击查询
    btnEvent(){
      this.$emit('btnEvent')
    },
    //获取开始时间
    getStartTime(val){
      this.liIndex=-1;
      this.$emit('getStartTime',val)
    },
    //获取结束时间
    getEndTime(val){
      this.liIndex=-1;
      this.$emit('getEndTime',val)
    },
    //状态选择
    getSelectZT(val){
      this.$emit('getSelectZT',val)
    },
    //店铺选择
    getSelectBranch(val){
      this.$emit('getSelectBranch',val)
    },
    //重置li的状态
    updateIiIndex(){
      this.liIndex=1;
    }
  };
  export default {
    name: "search-header",
    data() {
      return myData;
    },
    created() {
      this.urlAddress = this.getUrlStyle();
      window.vm = this;
      if (this.urlAddress == 'white') {
        this.btnStyle = 'btn1Style'
      } else {
        this.btnStyle = 'btn2Style'
      }
    },
    methods: myMethods,
    components: {
      timeSelect: timeSelect,
      dropDownSelect: dropDownSelect,
      btn: btn,
    },
    //自定义指令
    directives: {
      'hoverStyle': function (el, binding) {
        $(el).children().each(function (index, element) {
          $(element).mouseenter(function () {
            $(this).css({
              color: '#BB9860',
              // borderBottom:'1px solid #BB9860'
            })
          });
          $(element).mouseleave(function () {
            $(this).css({
              color: '',
              borderBottom: ''
            })
          });
          $(element).click(function () {
            vm.liIndex = index;
          })
        })
      }
    },

  }
</script>

<style scoped>
  #search-header {
    height: 75px;
    padding: 22px 0 21px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .search-header-black {
    /*padding: 22px 0 21px 45px!important;*/
  }

  .lately-search {
    margin-top: 5px;
  }

  .lately-search ul li {
    float: left;
    font-size: 14px;
    color: #4C4C4C;
    cursor: pointer;
  }

  .lately-search ul li:nth-child(2) {
    margin: 0 20px;
  }

  .lately-search-white ul li {
    color: #4C4C4C;
    cursor: pointer;
  }

  .lately-search-black ul li {
    color: #CCCCCC;
  }

  .li-click-style {
    color: #BB9860 !important;
    border-bottom: 1px solid #BB9860;
  }

</style>
