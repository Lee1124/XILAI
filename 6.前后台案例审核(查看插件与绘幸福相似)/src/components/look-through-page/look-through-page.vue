<template>
  <div id="look-through-page"
       :class="{'look-through-page-white':urlAddress=='white','look-through-page-black':urlAddress=='black'}">
    <switchHeader></switchHeader>
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
  import switchHeader from '../switch-header/switch-header'
  let myData = {
    // urlAddress: 'white',
    urlAddress:'black',
    isRouterAlive:true
  };
  export default {
    name: "look-through-page",
    data() {
      return myData;
    },
    methods:{
      reload () {
        this.isRouterAlive = false;
        this.$nextTick(function () {
          this.isRouterAlive = true;
        })
      },
    },
    created(){
      this.urlAddress=this.getUrlStyle();
    },
    components: {
      switchHeader: switchHeader,
    },
    provide () {
      return {
        reload: this.reload
      }
    },
  }
</script>

<style scoped>
  #look-through-page {
    padding: 0 20px 20px;
    min-width: 1024px;
  }


</style>
