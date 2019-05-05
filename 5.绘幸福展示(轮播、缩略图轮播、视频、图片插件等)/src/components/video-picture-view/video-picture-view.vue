<template>
  <div id="videoPictureView">
    <div class="swiper-box">
      <div class="images-view images-anim">
        <div class="swiper-container swiper-imagse-show">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-show="videoLength">
              <div id="videoId" v-if="yesVideo" style="width: 100%;height: 100%;">
              </div>
            </div>
            <template v-for="(item,index) in swiperTopContent">
              <div class="swiper-slide">
                <div id="my" class="myImg">
                  <img onclick="screenShow(this);" class="swiper-lazy"
                       :src="item.image">
                </div>
              </div>
            </template>
          </div>
          <div class="swiper-button-next next" style="right: 8%;">
            <img src="../../../static/img/slt-icon1.png" alt="">
          </div>
          <div class="swiper-button-prev prev" style="left: 8%;">
            <img src="../../../static/img/slt-icon1.png" alt="" style="transform: rotate(180deg)">
          </div>
        </div>
      </div>

      <footer class="xl-footer images-anim">
        <div class="footer-more" @click="toMoreLink">
          更多
          <i></i>
          <!--<img src="../../../static/img/nexticon_no.png">-->
        </div>
        <div class="fot-content">
          <div class="swiper-button-next next1" style="right: 5%;position: absolute;">
            <img src="../../../static/img/slt-icon.png">
          </div>
          <div class="swiper-button-prev prev1" style="left: 5%;position: absolute;">
            <img src="../../../static/img/slt-icon.png" style="transform: rotate(180deg)">
          </div>
          <div class="swiper-parent" ref="swiperParent">
            <div class="swiper-container swiper-footer-slide">
              <div class="swiper-wrapper" style="padding: 0 1px;">
                <template v-for="item in swiperBottomContent">
                  <div class="swiper-slide swiper-no-swiping" :style="{'padding-top':swiperSlidePadding}">
                    <template v-for="(item2,index) in item.list">
                      <div class="video-cover-parent" @click="clickThisYoSwiper(item2,index)"
                           :style="{'height':videoCoverParenHeight}">
                        <div class="video-cover">
                          <img class="swiper-lazy" :src="item2.thumb">
                        </div>
                      </div>
                    </template>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>

  var myMethods = {
    //初始化swiper
    loadSwiper() {
      var that = this;
      this.mySwiper = new Swiper('.swiper-imagse-show', {
        speed: 500,
        effect: 'fade',
        allowTouchMove: false,//禁止触摸翻页加载
        mousewheel: true,//禁止触摸翻页加载
        observer: true,//修改swiper自己或子元素时，自动初始化swiper
        observeParents: true,//修改swiper的父元素时，自动初始化swiper
        navigation: {
          nextEl: '.next',
          prevEl: '.prev',
        },
        fadeEffect: {
          crossFade: true,
        },
        lazy: {
          loadOnTransitionStart: true
        },
        on: {
          transitionEnd: function () {
            let activeIndex = this.activeIndex;
            if (that.videoLength) {
              if (activeIndex != 0) {
                that.ckplayer.videoPause();//视频暂停
              } else {
                that.ckplayer.videoPlay();//视频播放
              }
            }
            $('.swiper-footer-slide .swiper-slide').children('.video-cover-parent').removeClass('on');
            $('.video-cover-parent').eq(activeIndex).addClass('on');
          },
          slideNextTransitionEnd: function () {
            let activeIndex = this.activeIndex;
            that.yoSwiper.slideTo(Math.floor(activeIndex / 6));//右滑同步缩略轮播
          },
          slidePrevTransitionEnd: function () {
            let activeIndex = this.activeIndex;
            that.yoSwiper.slideTo(Math.floor((activeIndex - 1) / 5));//左滑同步缩略轮播
          }
        }
      });

      this.yoSwiper = new Swiper('.swiper-footer-slide', {
        speed: 500,
        observer: true,//修改swiper自己或子元素时，自动初始化swiper
        observeParents: true,//修改swiper的父元素时，自动初始化swiper
        navigation: {
          nextEl: '.next1',
          prevEl: '.prev1',
        },
        lazy: {
          loadOnTransitionStart: true
        },
        on: {
          tap: function (event) {

          }
        }
      });
    },
    //加载视频
    loadView2Video(obj) {
      this.ckplayer = new Dvideo({
        ele: '#videoId',
        title: '',
        showNext: true,
        width: '100%',
        height: '100%',
        src: obj.src,
        autoplay: true,
        ctrSpeedDuration:500,
      })
    },
    //为了上级调用
    loadView2(obj) {
      this.fid=obj.itemObj.FILE_ID;
      this.swiperBottomContent = obj.resultImgObj;
      this.swiperTopContent = obj.imgObj;
      if (obj.videoObj != undefined) {
        this.videoLength = true;
        this.$nextTick(function () {
          $('.video-cover-parent').eq(0).addClass('on');

          this.loadView2Video({
            src: obj.videoObj[0].file
          });
          this.setImgBoxWH();
        });
        setTimeout(function () {
          $('.tipCt').hide();
        }, 400)
      } else {
        this.videoLength = false;
        this.$nextTick(function () {
          $('.video-cover-parent').eq(0).addClass('on');
          this.setImgBoxWH();
        });
      }
    },

    //设置缩略图的宽高
    setImgBoxWH() {
      this.videoCoverParenHeight = $('.on').innerWidth() / 1.85 + 'px';
      this.swiperSlidePadding = ($('.xl-footer').innerHeight() - $('.on').innerWidth() / 1.85) / 2 + 'px';
    },
    //停止视频播放
    stopVideo() {
      this.ckplayer.videoPause();//视频暂停
    },
    //点击当前缩略图
    clickThisYoSwiper(obj, index) {
      if (this.videoLength) {
        if (index == 0&&obj.imgId==0) {
          $('.swiper-footer-slide .swiper-slide').children('.video-cover-parent').removeClass('on');
          $('.video-cover-parent').eq(0).addClass('on');
          this.mySwiper.slideTo(0);
        } else {
          let id = parseInt(obj.imgId) + 1;
          $('.swiper-footer-slide .swiper-slide').children('.video-cover-parent').removeClass('on');
          $('.video-cover-parent').eq(id).addClass('on');
          this.mySwiper.slideTo(id);
        }

      } else {
        $('.swiper-footer-slide .swiper-slide').children('.video-cover-parent').removeClass('on');
        $('.video-cover-parent').eq(obj.imgId).addClass('on');
        this.mySwiper.slideTo(obj.imgId)
      }
    },
    //左右键盘事件
    keyUp() {
      let that = this;
      $(document).keyup(function (event) {
        //阻止默认事件
        event.stopPropagation();
        event.cancelBubble = true;
        if (event.keyCode == 37) {
          let activeIndex1 = that.mySwiper.activeIndex;
          that.mySwiper.slideTo(activeIndex1 - 1);
        } else if (event.keyCode == 39) {
          let activeIndex2 = that.mySwiper.activeIndex;
          that.mySwiper.slideTo(activeIndex2 + 1);
        }
      });
    },
    //进入更多
    toMoreLink(){
      /*?fid=6d0be09f-a1fe-46d2-a6f2-31b2174371bc#/place*/
      window.open(this.openUrl+'/weidingzhi/dist/index.html?fid='+this.fid)
    }
  };
  export default {
    name: "video-picture-view",
    props: ['yesVideo'],
    data() {
      return {
        openUrl:'http://211.149.163.185:8090',
        fid:'',
        videoLength: false,
        videoCoverParenHeight: '0',
        swiperSlidePadding: '',
        ckplayer: {},
        mySwiper: {},
        yoSwiper: {},
        swiperTopContent: [
          // {imgSrc: '../../../static/img/1.jpg'},
          // {imgSrc: '../../../static/img/2.jpg'},
          // {imgSrc: '../../../static/img/1.jpg'},
          // {imgSrc: '../../../static/img/2.jpg'},
          // {imgSrc: '../../../static/img/1.jpg'},
          // {imgSrc: '../../../static/img/2.jpg'},
        ],
        swiperBottomContent: [
          // {
          //   list: [
          //     {imgSrc: '../../../static/img/1.jpg'},
          //     {imgSrc: '../../../static/img/2.jpg'},
          //     {imgSrc: '../../../static/img/1.jpg'},
          //     {imgSrc: '../../../static/img/2.jpg'},
          //     {imgSrc: '../../../static/img/1.jpg'},
          //     {imgSrc: '../../../static/img/2.jpg'},
          //   ]
          // }
        ]
      }
    },
    methods: myMethods,
    created() {
      this.keyUp();
      this.$nextTick(function () {
        this.loadSwiper();
      })
    },
    mounted() {

    },
    components: {},

  }


</script>
<!---->
<style>
  #videoPictureView .Dvideo-content {
    background: transparent !important;
    padding: 25px 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  #videoPictureView .Dvideo-content .Dvideo-ctrl .Dvideo-detail .Dvideo-ctrl-state .Dvideo-ctrl-next {
    display: none;
  }
  #videoPictureView .Dvideo-content .Dvideo-ctrl .Dvideo-detail .Dvideo-menu-right-content .Dvideo-definition{
    display: none;
  }

  #videoPictureView .xl-footer .swiper-slide {
    display: flex;
    justify-content: flex-start;
    position: relative;
  }

  #videoPictureView .swiper-container {
    padding-bottom: 0;
  }

  #videoPictureView .swiper-slide {
    background: none;
  }

  #videoPictureView .video-cover-parent {
    flex-basis: 16%;
    height: 100%;
    margin-right: 13px;
    outline: 1px solid #fff;
    transition: all .3s;
  }

  #videoPictureView .video-cover-parent:hover {
    outline: 1px solid #7c7469;
  }

  #videoPictureView .video-cover-parent:nth-of-type(6n) {
    margin-right: 0;
  }

  #videoPictureView .video-cover {
    height: 100%;
  }

  #videoPictureView .video-cover-parent:nth-child(7n) {
    margin-right: 0;
  }

  #videoPictureView .video-cover-parent {
    position: relative;
  }

  #videoPictureView .video-cover-parent:before {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
  }

  #videoPictureView .video-cover-parent.on:before {
    background: initial;
    outline: 1px solid #B8B0A2;
  }

  #videoPictureView .Dvideo-header {
    display: none !important;
  }

  #videoPictureView .xl-footer {
    height: 22%;
  }

  #videoPictureView .fot-content {
    width: 100%;
    height: 100%;
    position: relative;
  }

  #videoPictureView .swiper-parent, .swiper-footer-slide {
    height: 100%;

  }

  #videoPictureView .swiper-parent {
    padding: 0 180px;
    background: #fff;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  #videoPictureView .swiper-parent img {
    width: 100%;
    height: 100%;
  }

  #videoPictureView .swiper-footer-slide .swiper-slide {
    padding: 0;
  }

  #videoPictureView .swiper-box {
    cursor: pointer;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    background: rgba(241, 241, 241, .96);
  }

  #videoPictureView .images-view {
    height: 78%;
    padding: 25px 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  #videoPictureView .swiper-imagse-show {
    height: 100%;
  }

  #videoPictureView .myImg {
    width: 80%;
    height: 100%;
    margin-left: 10%;
    overflow: hidden;
    position: relative;
  }

  #videoPictureView .myImg img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 100%;
  }

  #videoPictureView .next, #videoPictureView .prev {
    position: absolute;
    background: transparent !important;
    width: 70px;
    height: 94px;
    text-align: center;
    line-height: 110px;
    transition: all .4s;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
    margin-top: auto;
    box-shadow: none;
  }

  #videoPictureView .next:hover, #videoPictureView .prev:hover {
    background: #E8E8E8 !important;
  }

  #videoPictureView .next1, #videoPictureView .prev1 {
    background: transparent !important;
    width: 44px;
    height: 60px;
    text-align: center;
    line-height: 72px;
    transition: all .4s;
    outline: none;
    box-shadow: none;
  }

  #videoPictureView .next1:hover, #videoPictureView .prev1:hover {
    background: #F1F1F1 !important;
  }

  #videoPictureView .next1:active, #videoPictureView .prev1:active {
    outline: none;
  }

  #videoPictureView .swiper-button-disabled {
    opacity: .6 !important;
  }

  #videoPictureView .Dvideo-content .Dvideo-ctrl {
    background: rgba(184, 176, 162, .4) !important;
  }

  .footer-more {
    position: absolute;
    z-index: 9999;
    right: 35px;
    bottom: 35px;
    color: #BBBBBB;
    font-size: 14px;
    transition: all .3s;
  }

  .footer-more i {
    width: 10px;
    height: 14px;
    display: inline-block;
    vertical-align: middle;
    margin-top: -4px;
    background: url("../../../static/img/nexticon_no.png") no-repeat center center;
    -webkit-transform: scale(.7);
    -moz-transform: scale(.7);
    -ms-transform: scale(.7);
    -o-transform: scale(.7);
    transform: scale(.7);
  }



  .footer-more:hover {
    color: #bb9860;
  }
  .footer-more:hover i{
    background: url("../../../static/img/nexticon_yes.png") no-repeat center center;
  }

  @media screen and (max-width: 1600px) {
    #videoPictureView .next, #videoPictureView .prev {
      width: 50px;
      height: 70px;
      line-height: 70px;
      margin-top: 26px;
      padding-top: 8px;
      box-sizing: border-box;
    }
  }

  @media screen and (max-width: 1024px) {
    #videoPictureView .images-view {
      height: 50%;
    }

    #videoPictureView .xl-footer {
      height: 9%;
    }

    #videoPictureView .next {
      right: 6% !important;
    }

    #videoPictureView .prev {
      left: 6% !important;
    }
  }

</style>
