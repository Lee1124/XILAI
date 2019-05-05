<template>
  <div id="diaLogView" :class="{'diaLogView-white':urlAddress=='white','diaLogView-black':urlAddress=='black'}">
    <i class="closeIcon" @click="closeTip" v-if="showDialogBox">
      <img src="../../../static/img/close3.png" alt="关闭">
    </i>
    <!-- @opened="loadRightClickEvent"
      @closed="closeRightClickEvent"-->
    <el-dialog
      title=""
      :visible.sync="showDialogBox"
      :show-close=false
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="dialogBox1"
      center>
      <span class="dialog_switch dialog_switch_prev" v-show="playType==1">
        <img src="../../../static/img/switch-left.png">
      </span>
      <span class="dialog_switch dialog_switch_next" v-show="playType==1">
        <img src="../../../static/img/switch-right.png">
      </span>
      <div class="play-box" v-show="showPlayBox" v-if="urlAddress=='white'">
        <div class="picture" @click="switchPicVideo(1)" :class="{'bacStyle':playType==2}"><img
          src="../../../static/img/pic.png"></div>
        <div class="video" @click="switchPicVideo(2)" :class="{'bacStyle':playType==1}"><img
          src="../../../static/img/video.png"></div>
      </div>
      <div class="play-box" v-show="showPlayBox" v-if="urlAddress=='black'" style="margin-top: 10px">
        <div class="picture" @click="switchPicVideo(1)" :class="{'bacStyle':playType==2}"><img
          src="../../../static/img/pic2.png"></div>
        <div class="video" @click="switchPicVideo(2)" :class="{'bacStyle':playType==1}"><img
          src="../../../static/img/video2.png"></div>
      </div>
      <div class="dialog_content" id="dialog_content">
        <div v-show="playType==1" id="pictureViewType">
          <pictureView ref="pictureView" @closeBigPic="closeBigPic"></pictureView>
        </div>
        <div v-show="playType==2" id="videoViewType">
          <videoView ref="videoView" @getResource="getResource"></videoView>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <span class="footer-text">{{title}}</span>
      </span>
      <!--<span class="footer-text">{{item.FILE_TITEL}}-->
      <!--<span class="footer_news" @click="getNews" @mouseenter="showNews" @mouseleave="hideNews"-->
      <!--v-if="isJGZS==3">-->
      <!--<div class="newsView" v-if="isJGZS==3" v-show="isShowSelf">-->
      <!--<div class="newsView-icon-box">-->
      <!--<img src="../../../static/img/sanjiao.png">-->
      <!--</div>-->
      <!--<div v-html="kaPianData"></div>-->
      <!--</div>-->
      <!--</span>-->
      <!--</span>-->
      <!--</span>-->
    </el-dialog>
  </div>
</template>

<script>
  import pictureView from '../picture-view/picture-view'
  import videoView from '../video-view/video-view'

  var myMethods = {
    //关闭放大图
    closeBigPic(){
      this.$emit('closeBigPic');
    },
    //出现异常时获取视频资源
    getResource(val) {
      this.$emit('getResource', val);
    },
    // //鼠标移入显示信息卡
    // showNews() {
    //   if (this.isShowHideNews) {
    //     $('.newsView').fadeIn(200);
    //   }
    // },
    // //鼠标移出隐藏信息卡
    // hideNews() {
    //   if (this.isShowHideNews) {
    //     $('.newsView').fadeOut(200);
    //   }
    // },
    //
    // //点击获取卡片信息
    // getNews() {
    //   this.$axios({
    //     method: 'GET',
    //     url: this.api_8090 + '/View/GetDetialProjectshx.ashx?type=project&bid=&no=2&id=' + this.ProjectID,
    //     headers: {
    //       Authorization: this.Authorization
    //     }
    //   }).then(res => {
    //     $('.newsView').fadeIn(200);
    //     this.isShowHideNews = true;
    //     this.isShowSelf = true;
    //     this.kaPianData = res.data;
    //   }, err => {
    //
    //   })
    // },

    //图片视频切换
    switchPicVideo(val) {
      if (val == 1) {//图片
        this.playType = 1;
        this.$refs.videoView.loadVideoPlay(this.videoDataObj, false, false);//停止播放
        this.$refs.pictureView.loadPicPlay(this.imgDataObj, this.imgIsFullScreen);
      } else if (val == 2) {//视频
        this.playType = 2;
        //调用子组件视频插件
        this.$refs.videoView.loadVideoPlay(this.videoDataObj, true, this.videoIsFullScreen);
      }
    },

    //方便父组件调用图片、视频插件函数
    fn_img_video(itemsObj, picObj, videoObj) {
      this.title = itemsObj.OrderTitle;
      this.imgDataObj = picObj;
      this.videoDataObj = videoObj;
      this.$nextTick(() => {
        if (picObj.length != 0) {//有图片
          if (this.FistShow == 0) {//显示图片
            this.playType = 1;
            this.$refs.pictureView.loadPicPlay(picObj, this.imgIsFullScreen);
            if (videoObj.length == 0) {//无视频
              this.showPlayBox = false;
            } else {
              this.showPlayBox = true;
            }
          } else if (this.FistShow == 1) {//显示视频
            if (videoObj.length != 0) {//有视频
              this.showPlayBox = true;
              this.playType = 2;
              this.$refs.videoView.loadVideoPlay(videoObj, true, this.videoIsFullScreen,itemsObj.FileId);//数据、自动播放、是否全屏
            } else {//无视频
              this.showPlayBox = false;
              this.playType = 1;
              this.$refs.pictureView.loadPicPlay(picObj, this.imgIsFullScreen);
            }
          }
        } else {//无图片
          this.showPlayBox = false;
          this.playType = 2;
          var isSetFullscreen;
          if (this.VideoType == 1) {
            isSetFullscreen = true;
          } else {
            isSetFullscreen = false;
          }
          this.$refs.videoView.loadVideoPlay(videoObj, true, isSetFullscreen);//数据、自动播放、
        }
      });
    },

    // //获取点开当前的信息
    // getCheckUserIndex(fid) {
    //   this.$axios({
    //     method: 'GET',
    //     url: this.api_8090 + '/View/CheckUserIdex.ashx?type=getordinfo&fid=' + fid,
    //     headers: {
    //       Authorization: this.Authorization
    //     }
    //   }).then(res => {
    //     this.ORDER_ID = res.data.ORDER_ID;
    //     this.CUSTOMER_ID = res.data.CUSTOMER_ID;
    //   })
    // },


    //关闭弹框
    closeTip() {
      this.$emit('closeTip');
      if (this.playType == 2) {//停止播放
        this.$refs.videoView.loadVideoPlay(this.videoDataObj, false, false);
      }
    },

    //获取播放方式
    getPlayType() {
      let url = this.api + '/xlapi/SysManage/Hotel/Hotel/getinformationsetting?userid=' + this.userid + '&branid=' + getkevalue().branchid+'&no='+Math.random();
      this.$axios({
        method: 'GET',
        url: url,
        headers: {
          Authorization: this.Authorization
        }
      }).then(res => {
        if (res.status == 200) {
         // console.log(res.data)
          this.FistShow=res.data.FistShow;
          this.ImageType=res.data.ImageType;
          this.VideoType=res.data.VideoType;
          this.OrderViewType=res.data.OrderViewType;
        }

        if (this.ImageType == 1) {//图片显示的方式 1为默认 2为自适应显示
          this.imgIsFullScreen = false;
        } else if (this.ImageType == 2) {
          this.imgIsFullScreen = true;
        }

        if (this.VideoType == 1) {//播放视频开始是否全屏显示  1表示全屏播放
          this.videoIsFullScreen = true;
        } else if (this.VideoType == 2) {
          this.videoIsFullScreen = false;
        }

      }, err => {
        console.log(err)
      })
    },
    //为了上级获取目前的播放的内容及方式
    getType(){
      console.log(this.playType);
      return {
        playType:this.playType,//1图片 2视频
        ImageType:this.ImageType,//图片显示的方式 1为默认 2为自适应显示
      }
    }

  };

  export default {
    name: 'diaLogView',
    props: ['showDialogBox'], /*, 'isType', 'vediodata', 'imagedata', 'item'*/
    methods: myMethods,
    data() {
      return {
        urlAddress: '',
        title: '',
        power: false,//权限true或false

        pageTotal: '0',
        allCount: '0',
        lastNum: '',

        FILE_ID: '',
        img_ID: '',
        image: '',
        hotelId: '',

        videoFileId: '',
        imgDataObj: {},
        imgIsFullScreen: false,//图片是否全屏
        videoDataObj: {},
        videoIsFullScreen: false,

        // playType: 0,//1是图片、2是视频
        playType: 1,//1是图片、2是视频
        isPlayVideo: true,
        startShowImage: false,


        showPlayBox: true,//是否显示切换部分


        ProjectID: '',

        kaPianData: '<p><span class="point_list">服务项目名称:</span><span class="point_title">单机跟拍王力</span></p><p><span class="point_list">所属分类:</span><span class="point_title">单机跟拍</span></p>  <p><span class="point_list">参考价格:</span><span class="point_title">￥-- </span></p><p><span class="point_list">项目说明:</span><span class="point_title">联系电话：18142568220；异地费实报实销--</span></p>',

        fn_video_length: 0,
        fn_img_length: 0,


        CUSTOMER_ID: '',
        ORDER_ID: '',

        //===请求数据参数
        api: getkevalue().apiurl,
        // api: 'https://xilai99.com',
        Authorization: localStorage.userinfo,
        // Authorization: 'http://211.149.163.185:8090/|1|22|xlhl|http://171.211.126.122:8091/|http://171.211.126.122:8092/|1,1|http://192.168.1.253:8095|https://xilai99.com',
        api_8090: 'http://211.149.163.185:8090',//正式库用
        // api_8090: 'http://192.168.1.253:9527',//测试库用


        userid: getkevalue().userid,
        // userid: '1',
        //===请求数据参数

        /*=====获取播放类型=====*/
        ID: 1,
        UserID: 1,
        FistShow: "", //开始显示内容 0为图片 1为视频
        ImageType: "", //图片显示的方式 1为默认 2为自适应显示
        VideoType: "",// 播放视频开始是否全屏显示  1表示全屏播放
        CarType: "", //登录是否清空购物车
        CalendarType: "",//日历显示方式默认0覆盖,1是弹出
        OrderViewType: "" ,//订单管理查看方式 默认0：普通查看 1：弹出查看
        /*=====/获取播放类型=====*/

        // /*=====获取播放类型=====测试，上为正式*/
        // ID: 1,
        // UserID: 1,
        // FistShow: "0", //开始显示内容 0为图片 1为视频
        // ImageType: "1", //图片显示的方式 1为默认 2为自适应显示
        // VideoType: "2",// 播放视频开始是否全屏显示  1表示全屏播放
        // CarType: "", //登录是否清空购物车
        // CalendarType: "",//日历显示方式默认0覆盖,1是弹出
        // OrderViewType: "" //订单管理查看方式 默认0：普通查看 1：弹出查看
        // /*=====/获取播放类型=====*/
      }
    },
    created() {
      //获取播放方式
      this.getPlayType();
      this.urlAddress = this.getUrlStyle();
    },
    mounted() {
      this.$nextTick(() => {
        let windowWidth = $(window).width();
        let windowHeight = $(window).height();
        $('.dialogBox1').css({
          width: windowWidth * 0.58 + 'px',
          height: windowWidth * 0.58 * 0.6 + 'px',
        });
      })
    },
    components: {
      pictureView: pictureView,
      videoView: videoView,
      // rightMenu: rightMenu
    },
    watch: {
      showDialogBox(val) {
        if (val == false) {
          this.$refs.videoView.loadVideoPlay(this.videoDataObj, false, false);//停止播放
        }
      },
    }

  }

</script>

<style scoped>

  >>> .el-dialog {
    border-radius: 2px;
    border-top-left-radius: 0 !important;
  }

  .diaLogView-white >>> .dialogBox1 {
    background: #fff;
  }

  .diaLogView-black >>> .dialogBox1 {
    background: url("../../../static/img/xl_dialogbg.jpg") no-repeat;
    background-size: 100% 100%;
  }

  >>> .el-dialog__header {
    display: none;
  }

  >>> .el-dialog--center .el-dialog__body {
    padding: 0;
  }

  .dialog_content {
    height: 100%;
  }

  .play-box {
    position: absolute;
    top: 0;
  }

  .play-box div {
    cursor: pointer;
    text-align: center;
  }

  .diaLogView-white .play-box div {
    background: #fff;
  }

  .diaLogView-white .play-box .bacStyle {
    background: #E6E6E6;
  }

  .diaLogView-black .play-box div {
    background: -webkit-gradient(linear, 0 0, 0 100%, from(#AE8654), to(#E5C475));
  }

  .diaLogView-black .play-box div:hover {
    background: -webkit-gradient(linear, 0 0, 0 100%, from(#AE8654), to(#E5C475));
  }

  .diaLogView-black .play-box .bacStyle {
    background: #261f19;
  }

  .play-box .picture {
    border-top-left-radius: 2px;
  }

  .play-box .video {
    border-bottom-left-radius: 2px;
  }

  .closeIcon {
    width: 45px;
    height: 45px;
    text-align: center;
    line-height: 40px;
    display: block;
    font-style: normal;
    position: absolute;
    right: 50px;
    top: 50px;
    cursor: pointer;
    z-index: 99988;
    padding-top: 9px;
    box-sizing: border-box;
    transition: all .3s;
  }

  .closeIcon:hover {
    background-color: rgba(184, 176, 162, .2);
  }

  /*.tipCt {*/
  /*color: #8C7D66;*/
  /*position: absolute;*/
  /*left: 50%;*/
  /*top: 50%;*/
  /*transform: translate(-50%, -50%)*/
  /*}*/

  /*.tipCt img {*/
  /*vertical-align: middle;*/
  /*margin-top: -5px*/
  /*}*/

  .dialog_switch {
    position: absolute;
    width: 50px;
    height: 50px;
    text-align: center;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    background: rgba(0, 0, 0, .2);
    z-index: 2019325;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
    cursor: pointer;
    transition: all .2s;
  }

  .dialog_switch:hover {
    background: #B8B0A2;
  }

  .dialog_switch img {
    margin-top: 17px;
  }

  .dialog_switch_prev {
    left: -100px;
  }

  .dialog_switch_prev img {
    margin-left: -5px;
  }

  .dialog_switch_next {
    right: -100px;
  }

  .dialog_switch_next img {
    margin-left: 5px;
  }

  /*.footer_news {*/
  /*width: 40px;*/
  /*height: 40px;*/
  /*float: right;*/
  /*text-align: center;*/
  /*display: inline-block;*/
  /*cursor: pointer;*/
  /*background: url("../../../static/img/clock0.png") no-repeat center center;*/
  /*position: absolute;*/
  /*top: 50%;*/
  /*right: -40px;*/
  /*-webkit-transform: translateY(-50%);*/
  /*-moz-transform: translateY(-50%);*/
  /*-ms-transform: translateY(-50%);*/
  /*-o-transform: translateY(-50%);*/
  /*transform: translateY(-50%);*/
  /*}*/

  /*.footer_news:hover {*/
  /*background: url("../../../static/img/click1.png") no-repeat center center;*/
  /*}*/

  .newsView {
    width: 245px;
    position: absolute;
    background: #D1CABD;
    padding: 15px 20px;
    -webkit-border-radius: 2px;
    -moz-border-radius: 2px;
    border-radius: 2px;
    z-index: 9999;
    /*display: none;*/
    bottom: 40px;
  }

  .newsView-icon-box {
    position: absolute;
    bottom: -10px;
    left: 15px;
  }

  >>> .newsView p {
    line-height: 21px;
    text-align: left;
  }

  >>> .newsView .point_list {
    color: #fff;
    margin-right: 5px;
    font-size: 14px;
  }

  >>> .newsView .point_title {
    color: #fff;
    font-weight: 700;
    font-size: 14px;
  }

  >>> .dialogBox1 {
    padding: 12px 12px 0;
  }

  >>> .el-dialog--center .el-dialog__body {
    height: 90%;
  }

  >>> .el-dialog--center .el-dialog__footer {
    padding: 0;
    color: #8C7D66;
    height: 10%;
    font-size: 15px;
    position: relative;
  }

  .footer-text {
    position: absolute;
    left: 0;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
  }

  @media screen and (min-width: 1600px) {
    .play-box {
      width: 60px;
      left: -60px;
    }

    .play-box div {
      height: 60px;
    }

    .play-box div img {
      width: 25px;
      height: 25px;
      margin-top: 17px;
    }
  }

  @media screen and (max-width: 1600px) {
    .play-box {
      width: 50px;
      left: -50px;
    }

    .play-box div {
      height: 50px;
    }

    .play-box div img {
      width: 20px;
      height: 20px;
      margin-top: 15px;
    }
  }
</style>
