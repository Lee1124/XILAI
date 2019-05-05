<template>
  <div id="app">
    <el-container>
      <!--导航栏-->
      <el-header>
        <commonHeader></commonHeader>
      </el-header>
      <!--/导航栏-->
      <el-main>
        <router-view v-if="isRouterAlive"></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import carouselView from './components/carousel-view/carousel-view'
  import commonHeader from './components/common-header/common-header'

  var myMethods = {
    reload () {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      })
    },

  };
  export default {
    name: "jieDaiPage",
    provide () {
      return {
        reload: this.reload
      }
    },
    data() {
      return {
        isRouterAlive:true
      }
    },
    methods: myMethods,
    created() {
      window.Vue = this;
      window.document.title = "案例展示";
    },
    mounted() {

    },
    components: {
      carouselView: carouselView,
      commonHeader: commonHeader,
      // dialogView: dialogView,
    },

  }


</script>

<style scoped>
  >>> .el-header {
    height: auto !important;
    padding: 0;
  }

  >>> .el-main {
    padding: 0;
    min-width: 800px;
  }

</style>
