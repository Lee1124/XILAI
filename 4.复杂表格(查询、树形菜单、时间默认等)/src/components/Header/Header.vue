<template>
  <div id="app">
    <div id="header">
      <span :class="{'underLine':showUnderLine}" @click="choiceTitle(1)">物品使用统计</span>
      <span :class="{'underLine':!showUnderLine}" @click="choiceTitle(2)">图表分析</span>
    </div>

    <!--搜索区-->
    <div class="searchRegion">
      <div class="searchRegion_inner">
        <timeSelect @getStartTime="getStartTime" @getEndTime="getEndTime" fff="2018"></timeSelect>
      </div>
      <div class="searchRegion_inner">
        <dropDownSelect @getSelectVal1="getSelectVal1" @getSelectVal2="getSelectVal2"></dropDownSelect>
      </div>
      <div class="searchRegion_inner">
        <inputSearch placeholderText="搜索物品" @inputVal2="inputVal2"></inputSearch>
      </div>
      <div class="searchRegion_inner">
        <btn btnText="查询" btnStyle="btn1Style" @btnEvent="btnEvent"></btn>
      </div>
    </div>

  </div>
</template>

<script>
  import btn from '../btn/btn'
  import inputSearch from '../inputSearch/inputSearch'
  import dropDownSelect from '../dropDownSelect/dropDownSelect'
  import timeSelect from '../timeSelect/timeSelect'

  var myMethods={
    //选择跳转
    choiceTitle(num) {
      if (num == 1) {
        this.showUnderLine = true;
      } else if (num == 2) {
        this.showUnderLine = false;
      }
    },
    getSelectVal1(val){
      this.$emit('getSelectVal1',val);
    },
    getSelectVal2(val){
      this.$emit('getSelectVal2',val);
    },
    btnEvent(){
      this.$emit('btnEvent');
    },
    inputVal2(obj){
      this.$emit('inputVal2',obj);
    },
    getStartTime(val){
      this.$emit('getStartTime',val);
    },
    getEndTime(val){
      this.$emit('getEndTime',val);
    },
  };

  export default {
    name: "Header",
    data() {
      return {
        showUnderLine: true,
      }
    },
    methods:myMethods,
    components: {
      btn: btn,
      inputSearch: inputSearch,
      dropDownSelect: dropDownSelect,
      timeSelect: timeSelect,
    },
  }
</script>

<style scoped>
  /*头部*/
  #header {
    text-align: center;
    font-size: 17px;
    color: #999999;
  }

  #header span {
    display: inline-block;
    height: 50px;
    line-height: 50px;
    cursor: pointer;
  }

  #header span:first-of-type {
    margin-right: 120px;
  }

  #header .underLine {
    color: #BB9860;
    border-bottom: 2px solid #BB9860;
  }
  /*搜索区*/
  .searchRegion {
    display: flex;
    padding: 40px 0 20px;
    border-bottom: 1px solid #DDDDDD;
  }

  .searchRegion_inner {
    margin-right: 15px;
  }

</style>
