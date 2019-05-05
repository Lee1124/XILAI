<template>
  <div id="app">
    <input type="text" class="inputSearch" id="inputSearch" autocomplete="off" :placeholder="placeholderText" @keyup="inputVal2">
  </div>
</template>

<script>
  export default {
    name: "inputSearch",
    props: ['placeholderText'],
    data(){
      return {
      }
    },
    methods:{
  //     if (e.keyCode==13){
  //   this.$emit('searchNews',this.searchText)
  // }
      inputVal2(e){
        let data={
          val:$(e.target).val(),
          keyCode:e.keyCode
        };
        this.$emit('inputVal2',data)
      }
    }
  }
</script>

<style scoped>
  .inputSearch {
    width: 160px;
    height: 30px;
    border: 1px solid rgba(221, 221, 221, 1);
    border-radius: 4px;
    outline: none;
    padding: 0 10px;
    box-sizing: border-box;
  }

  .inputSearch::-webkit-input-placeholder {
    color: #BBB;
    font-size: 14px;
  }
</style>
