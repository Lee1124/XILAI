<template>
  <div id="dropMenu">
    <ul class="dropMenu">
      <template v-for="item in dropMenuData">
        <li @click="toOtherLink(item)">{{item.name}}</li>
      </template>
      <img src="../../../static/img/zhixiang.png" class="zhixiang">
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'drop-menu',
    data() {
      return {
        dropMenuData: [
          {id: 1, name: '进入后台'},
          {id: 2, name: '常用链接'},
          {id: 3, name: '更多酒店'},
          {id: 4, name: '动态社区'},
          {id: 5, name: '退出登录'}
        ],
        api_8090: 'http://211.149.163.185:8090',
      }
    },
    methods:{
      toOtherLink(obj){
        if (obj.id==1){
          window.location.href=this.api_8090+'/Login/Index_New.aspx'
        }else if (obj.id==5){
          window.location.href=this.api_8090+'/siweite/html/slogin.aspx'
        }else if (obj.id==4){
          window.location.href='http://211.149.163.185:8090/FileManage/xilaidongtai.html'
        }else if (obj.id==3){
          let contentUrl=this.api_8090+'/Resources/HotelList/HotelSelect.aspx';
          layui.use('layer', function () {
            var layer = layui.layer;
            layer.open({
              type:2,
              title:'',
              skin:'moreHotel',
              area: ['760px', "500px"],
              content: [contentUrl,'no']
            })
          })

        }
      }
    }
  }

</script>

<style scoped>

  #dropMenu {
    width: 140px;
    padding: 2px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    box-shadow: 0px 4px 10px 0px rgba(184, 176, 162, 0.2);
    border: 1px solid rgba(240, 240, 240, 1);
    position: absolute;
    top: 88px;
    right: 10px;
    background: #fff;
    z-index: 99999;
    height: 0;
    overflow: hidden;
  }

  .dropMenu li {
    height: 48px;
    line-height: 48px;
    text-align: center;
    cursor: pointer;
    font-size: 14px;
    color: #B8B0A2;
    transition: all .3s;
  }

  .dropMenu li:hover {
    background-color: #FAF9F7;
  }

  .dropMenu .zhixiang {
    position: absolute;
    top: -14px;
    right: -2px;
  }
</style>
