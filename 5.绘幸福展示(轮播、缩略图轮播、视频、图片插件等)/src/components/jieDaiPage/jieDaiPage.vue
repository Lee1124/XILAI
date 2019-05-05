<!--<template>-->
  <!--<div id="jieDaiPage">-->
    <!--<el-container>-->
      <!--&lt;!&ndash;导航栏&ndash;&gt;-->
      <!--<el-header>-->
        <!--<commonHeader @chanceThis="chanceThis"></commonHeader>-->
      <!--</el-header>-->
      <!--&lt;!&ndash;/导航栏&ndash;&gt;-->
      <!--<el-main>-->
        <!--<router-view></router-view>-->
        <!--&lt;!&ndash;<carouselView :loadType="loadType" ref="carouselView"></carouselView>&ndash;&gt;-->
      <!--</el-main>-->
    <!--</el-container>-->
  <!--</div>-->
<!--</template>-->

<!--<script>-->
  <!--import carouselView from '../carousel-view/carousel-view'-->
  <!--import commonHeader from '../common-header/common-header'-->


  <!--var myMethods = {-->
    <!--chanceThis(obj){-->
      <!--console.log(obj);-->
      <!--console.log("2222");-->
      <!--/*微定制 6 新人学堂 2 金刚展示 3 酒店展示 4*/-->
      <!--if (obj.name=='案例展示'){-->
        <!--this.loadType=4;-->
        <!--// this.$refs.carouselView.loadStartData();-->
      <!--}else if (obj.name=='金刚展示'){-->
        <!--this.loadType=3;-->
        <!--// this.$refs.carouselView.loadStartData();-->
      <!--}else if (obj.name=='微定制'){-->
        <!--this.loadType=6;-->
        <!--// this.$refs.carouselView.loadStartData();-->
      <!--}else if (obj.name=='新人学堂'){-->
        <!--this.loadType=2;-->
        <!--// this.$refs.carouselView.loadStartData();-->
      <!--}-->
    <!--}-->
  <!--};-->
  <!--export default {-->
    <!--name: "jieDaiPage",-->
    <!--data() {-->
      <!--return {-->
        <!--loadType:0-->
      <!--}-->
    <!--},-->
    <!--methods: myMethods,-->
    <!--created() {-->
      <!--window.Vue = this-->
    <!--},-->
    <!--mounted() {-->

    <!--},-->
    <!--components: {-->
      <!--carouselView: carouselView,-->
      <!--commonHeader: commonHeader,-->
      <!--// dialogView: dialogView,-->
    <!--}-->
  <!--}-->
<!--</script>-->

<!--<style scoped>-->
  <!--&gt;>> .el-header {-->
    <!--height: auto !important;-->
    <!--padding: 0;-->
  <!--}-->

  <!--&gt;>> .el-main {-->
    <!--padding: 0;-->
    <!--margin: 75px 130px 0;-->
    <!--min-width: 800px;-->
  <!--}-->

  <!--@media screen and (max-width: 1366px) {-->
    <!--&gt;>> .el-main {-->
      <!--margin: 25px 120px 0;-->
    <!--}-->
  <!--}-->

  <!--@media screen and (max-width: 1024px) {-->
    <!--&gt;>> .el-main {-->
      <!--margin: 60px 80px 0;-->
    <!--}-->
  <!--}-->


<!--</style>-->
