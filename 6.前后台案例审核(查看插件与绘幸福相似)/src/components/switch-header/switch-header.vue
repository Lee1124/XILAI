<template>
  <div id="switch-header"
       :class="{'switch-header-white':urlAddress=='white','switch-header-black':urlAddress=='black'}">
    <ul>
      <!--<router-link :to="{path:'/carouselPage',query:{id:items.id}}" :key="items.id" class="li"></router-link>-->
      <li @click="clickThis(0)" @mouseenter="mouseenterSelf($event)" @mouseleave="mouseleaveSelf($event)"
          :class="[{'li-Style':isThisLi01}]">案例审核
      </li>
      <li @click="clickThis(1)" @mouseenter="mouseenterSelf($event)" @mouseleave="mouseleaveSelf($event)"
          :class="[{'li-Style':!isThisLi01}]">作品审核
      </li>
    </ul>
  </div>
</template>

<script>
  //数据
  let myData = {
    urlAddress: '',
    isThisLi01: true,
    urlId:'',
  };
  //方法
  let myMethods = {
    mouseenterSelf(e) {
      $(e.target).addClass('li-Style-color');
    },
    mouseleaveSelf(e) {
      $(e.target).removeClass('li-Style-color');
    },
    clickThis(val) {
      if (val == 0) {
        this.isThisLi01 = true;
        this.$router.push({path:'/casePassPage01Case',query:{id:1}});
      } else {
        this.isThisLi01 = false;
        this.$router.push({path:'/casePassPage01Case',query:{id:2}});
      }
    }
  };
  export default {
    name: "switch-header",
    data() {
      return myData;
    },
    methods: myMethods,
    created() {
      this.urlAddress = this.getUrlStyle();
      if (this.$route.query.id==undefined){
        this.$router.push({path:'/casePassPage01Case',query:{id:1}});
        this.isThisLi01 = true;
      }else if (this.$route.query.id==1) {
        this.isThisLi01 = true;
      }else if (this.$route.query.id==2){
        this.isThisLi01 = false;
      }
    },
  }
</script>

<style scoped>
  #switch-header {
    height: 64px;
    font-size: 16px;
    position: relative;
  }

  .switch-header-white {
    border-bottom: 1px solid #EEEEEE;
    color: #4C4C4C;
  }

  .switch-header-black {
    border-bottom: 1px solid #2A2A2A;
    color: #fff;
  }

  ul {
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }

  ul > li:first-child {
    margin-right: 110px;
  }

  ul > li {
    float: left;
    height: 64px;
    line-height: 65px;
    cursor: pointer;
  }

  .li-Style {
    color: #BB9860;
    border-bottom: 2px solid #BB9860;
  }

  .li-Style-color {
    color: #BB9860;
  }
</style>
