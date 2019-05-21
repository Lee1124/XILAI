<template>
  <button :class="btnStyle" @click="btnEvent">{{btnText}}</button>
</template>

<script>
  export default {
    name: "btn",
    props: ['btnText', 'btnStyle'],
    methods:{
      btnEvent(){
        this.$emit('btnEvent')
      }
    }
  }
</script>

<style scoped>
  button {
    cursor: pointer;
    outline: none;
  }

  .btn1Style {
    height: 32px;
    padding: 0 15px;
    color: #BB9860;
    background: #fff;
    border: 1px solid rgba(187, 152, 96, 1);
    border-radius: 4px;
    font-size: 15px;
    text-align: center;
    transition: all .2s;
  }

  .btn1Style:hover {
    color: #af8e59;
    border: 1px solid #af8e59;
  }

  .btn2Style {
    height: 32px;
    line-height: 32px;
    padding: 0 35px;
    color: #fff;
    background: #BB9860;
    border-radius: 4px;
    font-size: 15px;
    text-align: center;
    transition: all .2s;
    outline: none;
    border: 0;
  }

  .btn2Style:hover {
    background: #af8e59;
  }
</style>
