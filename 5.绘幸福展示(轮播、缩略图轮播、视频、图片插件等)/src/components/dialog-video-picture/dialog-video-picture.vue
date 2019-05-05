<template>
  <div id="diaLogPicVideoView">
    <el-dialog
      title=""
      :visible.sync="showDiaLogPicVideoBox"
      :show-close=false
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal="false"
      @opened="loadRightClickEvent"
      @closed="closeRightClickEvent"
      center>
      <i class="closeIcon" @click="closeTip" v-if="showDiaLogPicVideoBox">
        <img src="../../../static/img/close.png" alt="">
      </i>
      <div class="dialog_content" id="dialog_content">
        <div class="tipCt">
          正在等待视频
          <img src="../../../static/img/loading-video.gif">
        </div>
        <videoPictureView ref="videoPictureView"
                          :yesVideo="yesVideo" v-if="showView"></videoPictureView>
      </div>
      <span slot="footer" class="dialog-footer">
      </span>

    </el-dialog>
  </div>
</template>

<script>
  import videoPictureView from '../video-picture-view/video-picture-view'

  var myMethods = {

    loadRightClickEvent(){
      this.$emit('yesParentSwiper')
    },
    closeRightClickEvent(){
      this.$emit('noParentSwiper')
    },

    //关闭弹框
    closeTip() {
      this.$emit('closeTip')
    },

    //调用下级函数
    videoPictureView(obj) {
      this.$nextTick(function () {
        if (obj.videoObj != undefined) {
          $('.tipCt').show();
        } else {
          $('.tipCt').hide();
        }
        this.$refs.videoPictureView.loadView2(obj)
      })
    }
  };
  export default {
    name: 'diaLogPicVideoView',
    props: ['showDiaLogPicVideoBox'],
    methods: myMethods,
    data() {
      return {
        yesVideo: false,
        showView: false,
      }
    },
    created() {

    },
    mounted() {
    },
    components: {
      videoPictureView: videoPictureView
    },

    watch: {
      showDiaLogPicVideoBox(val) {
        if (val == false) {
          this.yesVideo = false;
          this.showView = false;
        } else {
          this.yesVideo = true;
          this.showView = true;
        }
      }
    }
  }

</script>

<style scoped>
  >>> .el-dialog__wrapper {
    top: 100px;
  }
  >>> .el-dialog {
    border-radius: 0;
    padding: 0;
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    margin: 0 !important;
    background: transparent;
  }

  .closeIcon {
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 68px;
    display: block;
    font-style: normal;
    position: absolute;
    right: 25px;
    top: 25px;
    cursor: pointer;
    z-index: 99988;
  }

  .closeIcon:hover {
    background: #E8E8E8;
  }

  .closeIcon img {
    transition: all .4s;
  }



  @media screen and (max-width: 1600px) {
    .closeIcon {
      width: 40px;
      height: 40px;
      line-height: 48px;
    }

  }

  .tipCt {
    color: #8C7D66;
    position: absolute;
    left: 50%;
    top: 38%;
    transform: translate(-50%, -50%);
    z-index: 999;
  }

  .tipCt img {
    vertical-align: middle;
    margin-top: -5px
  }

</style>
