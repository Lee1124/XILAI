<template>
  <div class="Header">
    <el-row :gutter="10">
      <el-col :xs="16" :sm="16" :md="16" :lg="16" :xl="16">
        <ul class="menu-selection">
          <li style="padding-top: 20px;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;padding-left: 0">
            <img src="" alt="logo" id="logoImg">
          </li>
          <template v-for="items in menuList">
            <router-link :to="{path:'/carouselPage',query:{id:items.id}}" :key="items.id" class="li"><!--/carousel-view-->
              <li>
                {{items.name}}<span class="bottomBorder"></span>
              </li>
            </router-link>
          </template>
        </ul>
      </el-col>
      <!--<el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">-->
        <!--<img :src="logoImgUrl" alt="喜来婚礼.源自爱" class="logo" v-if="!isShowOldImg">-->
        <!--<img src="../../../static/img/logo.png" alt="喜来婚礼.源自爱" class="logo" v-if="isShowOldImg">-->
      <!--</el-col>-->
      <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8" class="el-col3">
        <div class="managePerson" @mouseleave="hideDropMenuEvent" @mouseenter="showDropMenuEvent">
          <div class="managePerson-inner">
            <p class="userName"></p>
            <img src="../../../static/img/gr.png">
          </div>
          <dropMenu :class="{'dropMenuShow':showDropMenu,'dropMenuHide':!showDropMenu}"
                    @mouseenter="showDropMenuEvent"></dropMenu>
        </div>
        <div class="inputSearch">
          <input type="text" placeholder="搜索" id="inputText">
          <button id="search"><img src="../../../static/img/search.png" alt="查询"></button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import dropMenu from '../drop-menu/drop-menu'

  var myMethods = {
    chanceThis(obj) {
      this.menuList.forEach((item, index, arr) => {
        arr[index].isShowBorder = false;
      });
      obj.isShowBorder = !obj.isShowBorder;
    },
    //鼠标移入显示菜单
    showDropMenuEvent() {
      this.showDropMenu = true;
    },
    //鼠标移出隐藏菜单
    hideDropMenuEvent() {
      this.showDropMenu = false;
    },
    //获取用户名
    loadUserNews() {
      this.$axios({
        method: 'GET',
        url: this.api + '/xlapi/SysManage/Order/Designer/RetUser?userid=' + this.userid,
      }).then(res => {
        this.$nextTick(function () {
          $('.userName').text(res.data.NAME)
        })
      })
    },
  };
  export default {
    name: "common-header",
    methods: myMethods,
    data() {
      return {
        showDropMenu: false,
        // api:getkevalue().apiurl,
        api: 'https://xilai99.com',
        userid: getkevalue().userid,
        menuList: [
          {name: '案例展示', isShowBorder: true, id: 4},
          {name: '金刚展示', isShowBorder: false, id: 3},
          {name: '微定制', isShowBorder: false, id: 6},
          {name: '新人学堂', isShowBorder: false, id: 2},
        ],
        logoImgUrl: '',
        isShowOldImg:true,
      }
    },
    components: {
      dropMenu: dropMenu,
    },
    created() {
      this.loadUserNews();
    },

    mounted(){

    }

  }
</script>

<style scoped>

  .Header {
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.07);
    min-width: 1024px;
    box-sizing: border-box;
  }

  >>> .el-col {
    border-radius: 4px;
    height: 100px;
    text-align: center;
    position: relative;
  }

  .el-col3 {
    line-height: 100px;
  }

  .logo {
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }

  .menu-selection {
    height: 100px;
  }

  .menu-selection li {
    list-style: none;
    float: left;
    color: #B8B0A2;
    font-size: 14px;
    height: 100px;
    line-height: 100px;
    padding: 0 25px;
    cursor: pointer;
    position: relative;
  }

  .menu-selection li:hover {
    color: #BB9860 !important;
  }


  .inputSearch {
    float: right;
    display: flex;
    height: 100px;
    align-items: center;
  }

  .inputSearch input {
    width: 230px;
    height: 40px;
    outline: none;
    padding-left: 10px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    border: 1px solid rgba(227, 227, 227, 1);
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
    position: relative;
  }

  .inputSearch input::-webkit-input-placeholder {
    color: #B2B2B2;
  }

  .inputSearch button {
    width: 40px;
    height: 40px;
    background: rgba(251, 251, 251, 1);
    border: 1px solid rgba(227, 227, 227, 1);
    cursor: pointer;
    border-left: 0;
    outline: none;
  }

  .managePerson {
    float: right;
    padding-top: 4px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    width: 115px;
    text-align: right;
    line-height: 24px;
    cursor: pointer;
    height: 100%;
  }
  .managePerson-inner {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 100%;
  }

  .managePerson-inner p {
    color: #B8B0A2;
    font-size: 14px;
    margin-top: 5px;
    padding: 0 8px;
  }

  .managePerson img {
    cursor: pointer;
  }

  .bottomBorder {
    position: absolute;
    width: 26px;
    height: 2px;
    background-color: #BB9860;
    left: 50%;
    -webkit-transform: translateX(-50%);
    -moz-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    -o-transform: translateX(-50%);
    transform: translateX(-50%);
    bottom: 16px;
    transition: all .3s;
    display: none;
  }

  .hideBottomBorder {
    opacity: 0;
  }

  .showBottomBorder {
    opacity: 1;
  }

  .menu-selection .colorStyle {
    color: #B8B0A2;
  }

  .dropMenuHide {
    padding: 0 !important;
    border: 0 !important;
  }

  .dropMenuShow {
    height: auto !important;
    overflow: visible !important;
  }

  @media screen and (max-width: 1600px) {
    .menu-selection li {
      padding: 0 15px;
    }
    .inputSearch input {
      width: 205px;
    }
  }

  @media screen and (max-width: 1366px) {
    .menu-selection li {
      padding:0 10px;
    }
    .inputSearch input {
      width: 145px;
      height: 35px;
    }

    .inputSearch button {
      height: 35px;
    }

    .managePerson {
      width: 100px;
    }

  }
  @media screen and (max-width: 1100px) {
    .menu-selection li {
      padding:0 5px;
    }

    .inputSearch input {
      width: 100px;
      height: 35px;
    }
  }

</style>
