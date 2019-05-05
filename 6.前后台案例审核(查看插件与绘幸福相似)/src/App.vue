<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name:'App',
    components:{
    },
    created(){
      if (this.getUrlStyle()=='white'){
        $('body').css('backgroundColor','#fff');
      } else {
        $('body').css('backgroundColor','#272524');
      }
      window.document.title='案例/作品.审核';
    }
  }
</script>

<style scoped>

  #app {
  }


</style>
