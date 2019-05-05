<template>
  <button :class="btnStyle" @click="btnEvent">{{btnText}}</button>
</template>

<script>
  export default {
    name: "btn",
    props: ['btnText', 'btnStyle'],
    methods: {
      btnEvent() {
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
    width: 54px;
    height: 30px;
    color: #222222;
    background: rgba(236, 236, 236, 1);
    border: 1px solid rgba(221, 221, 221, 1);
    border-radius: 4px;
    font-size: 14px;
    text-align: center;
    transition: all .2s;
  }

  .btn1Style:hover {
    background: rgb(225, 225, 225);
  }


</style>
