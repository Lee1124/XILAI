<template>
  <div class="right-click-menu">
    <ul class="mainMenu">
      <li>文件操作</li>
      <li v-if="power">图片管理<i></i>
        <ul class="sonMenu">
          <li @click="goItem('jc')">设为封面</li>
          <li @click="setPictrue('top')">图片置顶</li>
          <li @click="setPictrue('bottom')">图片置底</li>
          <li @click="setPictrue('del')">删除图片</li>
        </ul>
      </li>
      <li>案例管理<i></i>
        <ul class="sonMenu">
          <li @click="goItem('jbzl')">基本资料</li>
          <li @click="goItem('albj')" v-if="power">案例编辑</li>
          <li @click="goItem('jc')" v-if="power">剪裁封面</li>
          <!--<li>复制到酒店小程序</li>-->
          <li @click="goDDZL" v-if="power">订单资料</li>
        </ul>
      </li>
      <li v-if="power">案例排序<i></i>
        <ul class="sonMenu">
          <li @click="setBranch('top')">本店置顶</li>
          <li @click="setBranch('all')">全局置顶</li>
          <li @click="setBranch('move')">移至</li>
          <li @click="setBranch('more')">更多排序</li>
        </ul>
      </li>
      <li @click="goHotelItem">查看酒店资料</li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "right-click-menu",
    props:['power'],
    methods: {
      goDDZL() {
        this.$emit('goDDZL')
      },
      goItem(val) {
        this.$emit('goItem', val)
      },
      goHotelItem() {
        this.$emit('goHotelItem')
      },
      //操作图片
      setPictrue(val){
        this.$emit('setPic',val)
      },
      //操作店
      setBranch(val){
        this.$emit('setBranch',val)
      },
    }
  }
</script>

<style scoped>
  .right-click-menu {
    position: absolute;
    z-index: 9999;
  }

  .mainMenu {
    box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
  }

  .mainMenu > li {
    height: 40px;
    line-height: 40px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 0 36px 0 20px;
    color: #999999;
    cursor: pointer;
    border-bottom: 1px solid #F8F7F6;
    transition: all .2s;
    position: relative;
    font-size: 14px;
    background: #fff;
  }

  .mainMenu > li:hover {
    background: #F7F6F5;
  }

  .mainMenu > li:hover .sonMenu {
    display: block;
  }

  .mainMenu > li:last-of-type {
    border-bottom: 1px solid #fff;
  }

  .mainMenu > li:first-of-type {
    background: linear-gradient(0deg, rgba(213, 200, 187, 1), rgba(234, 227, 222, 1));
    color: #AD957E;
    cursor: default;
    font-size: 16px;
  }

  .mainMenu > li > i {
    width: 10px;
    height: 10px;
    display: block;
    position: absolute;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
    right: 10px;
    background: url("../../../static/img/right-click.png") no-repeat center center;
  }

  .sonMenu {
    position: absolute;
    right: -135px;
    top: 0;
    background: #F7F6F5;
    width: 135px;
    text-align: center;
    padding: 0 10px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    display: none;
  }

  .sonMenu > li {
    border-bottom: 1px solid #F1F0EE;
    height: 38px;
    line-height: 38px;
    color: #BBBBBB;
    transition: all .2s;
    cursor: pointer;
    text-align: center;
  }

  .sonMenu > li:last-of-type {
    border-bottom: 0;
  }

  .sonMenu > li:hover {
    color: #CCAC7A;
  }


</style>
