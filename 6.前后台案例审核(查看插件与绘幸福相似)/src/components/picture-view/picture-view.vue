<template>
  <div id="pictureView" :class="{'pictureView-white':urlAddress=='white','pictureView-black':urlAddress=='black'}">
    <ul class="xl_dialog_show" id="xl_dialog_show">
    </ul>
  </div>
</template>

<script>
  var myMethods = {

    //加载初始数据
    loadPicPlay(imagedataObj, startShowImageObj) {
      this.imagedata = imagedataObj;
      this.$nextTick(function () {
        $('.galleria-info-text').text('合影区')
      });
      let that = this;
      Galleria.run('#xl_dialog_show', {
        dataSource: imagedataObj,
        width: that.playWidth,
        height: that.playHeight,
        debug: false,
        wait: true,
        extend: function () {
          var gallery = this;
          gallery.attachKeyboard({
            left: gallery.prev,
            right: gallery.next,
          });
          if (startShowImageObj == true) {
            gallery.openLightbox();//一开始就播放预览
          }
          //自定义左点击切换
          $(".dialog_switch_prev").click(function () {
            gallery.prev();
          });
          //自定义右点击切换
          $(".dialog_switch_next").click(function (e) {
            gallery.next();
          });
          //关闭
          $(".galleria-lightbox-close").click(function (e) {
            that.$emit('closeBigPic');
          });
          //关闭
          $(".galleria-lightbox-overlay").click(function (e) {
            that.$emit('closeBigPic');
          });
          //右击菜单绑定
          gallery.bind('image', function (e) {
            that.getimageAction(e.index, imagedataObj);
          });
        }
      });
      //双击图片放大
      $(".galleria-stage").dblclick(function (e) {
        $(".galleria-popout").click();
      });
    },
    getimageAction(index, imagedataObj) {


      if (index == undefined) {
        index = 0
      }
      if (index != undefined && this.imagedata != undefined) {
        this.imgID = this.imagedata[index].ID;
        this.imgUrl = this.imagedata[index].image;
        this.fileID = this.imagedata[index].fileID;
      }

      //
      // var userID = $("#hidUserID").val();
      // var url = "";
      // var userid = "";
      // var fid = "";
      // var aid = "";
      // if (this.showtype == "1") {//视频
      //   // $("#hidUrl").val(vediodata[index].fid);
      //   // $("#hidAddressid").val(vediodata[index].aid);
      //   // //url = vediodata[index].image;
      //   //
      //   // if (vediodata[index].file) {
      //   //     url = vediodata[index].file;
      //   // }
      //   // if (vediodata[index].sources) {
      //   //     url = vediodata[index].sources[0].file;
      //   // }
      //   // userid = vediodata[index].userid;
      //   // fid = vediodata[index].fid;
      //   // aid = vediodata[index].aid;
      // } else {
      //   ///改动：解决左右键报错问题
      //   while (index >= this.imagedata.length) {
      //     index = index - this.imagedata.length;
      //   }
      //   $("#hidUrl").val(this.imagedata[index].fid);
      //   $("#hidAddressid").val(this.imagedata[index].aid);
      //   url = this.imagedata[index].image;
      //   userid = this.imagedata[index].userid;
      //   fid = this.imagedata[index].fid;
      //   aid = this.imagedata[index].aid;
      // }
      //
      // // if (actionhtml != "") {
      // //     var html = tophtml + actionhtml;
      // //     $("#youjicaidan").html(html);
      // //     islikeload($("#hidislike").val());
      // //
      // // }
    },
    //向父级提供信息
    toParentNews() {
      let data = {
        imgID: this.imgID,
        imgUrl: this.imgUrl,
        fileID: this.fileID,
      };
      return data;
    },


  };
  export default {
    name: "pictureView",
    data() {
      return {
        playWidth: 0,
        playHeight: 0,
        imagedata: [
          {image: '../../../static/img/2.jpg', thumb: '../../../static/img/2.jpg'},
          {image: '../../../static/img/1.jpg', thumb: '../../../static/img/2.jpg',},
        ],
        showtype: 1,

        imgID: '',
        fileID: '',
        urlAddress: '',
      }
    },
    methods: myMethods,
    created() {
      window.Vue = this;
      this.urlAddress = this.getUrlStyle();
    },
    updated() {

    },
    mounted() {
      this.playWidth = $('#dialog_content').innerWidth();
      this.playHeight = $('#dialog_content').innerHeight();
    },
    watch: {}
  }
</script>

<style>

  #pictureView .galleria-thumbnails-list::-webkit-scrollbar {
    width: 3px;
    height: 4px;
    background: #E6E6E6;
    -webkit-border-radius: 1px;
    -moz-border-radius: 1px;
    border-radius: 1px;
  }

  #pictureView .galleria-thumbnails-list::-webkit-scrollbar-thumb {
    background-color: #BB9860;
    height: 3px;
    width: 3px;
    -webkit-border-radius: 1px;
    -moz-border-radius: 1px;
    border-radius: 1px;
  }

  #pictureView .galleria-thumbnails {
    /*display: flex;*/
    /*flex-wrap: wrap;*/
    /*justify-content: space-around;*/
  }

  #pictureView .galleria-bar {
    background: #B8B0A2;
  }

  .pictureView-black .galleria-bar {
    background: #060606 !important;
  }

  #pictureView .galleria-s1, .galleria-s2 {
    background: #fff;
    width: 1px;
  }

  .pictureView-black .galleria-s1, .pictureView-black .galleria-s2 {
    background: #303133 !important;
  }

  #pictureView .galleria-s2 {
    display: none;
  }

  #pictureView .galleria-s3, .galleria-s4 {
    background: #B8B0A2;
  }

  .pictureView-black .galleria-s3, .pictureView-black .galleria-s4 {
    background: #303133 !important;
  }

  .pictureView-white .galleria-s3, .pictureView-white .galleria-s4 {
    background: #fff !important;
  }

  #pictureView .galleria-counter {
    background: #B8B0A2;
    border-right: 1px solid #fff;
    color: #fff;
  }

  .pictureView-black .galleria-counter {
    border-right: 1px solid #303133 !important;
  }

  .pictureView-black .galleria-counter {
    background: #060606 !important;
  }

  #pictureView .galleria-fullscreen:hover {
    /*background: none;*/
  }

  #pictureView .galleria-popout {
    right: 60px;
  }

  #pictureView .galleria-thumblink {
    right: 28px;
  }

  #pictureView .galleria-play {
    left: 0;
  }

  #pictureView .galleria-info {
    left: 40px;
    width: 200px;
  }

  #pictureView .galleria-info-text {
    color: #fff;
  }

  .pictureView-white .galleria-container.notouch .galleria-thumblink:hover, .pictureView-white .galleria-container.touch .galleria-thumblink:active, .pictureView-white .galleria-thumblink.open, .pictureView-white .galleria-container.notouch .galleria-fullscreen:hover, .pictureView-white .galleria-container.touch .galleria-fullscreen:active, .pictureView-white .galleria-container.notouch .galleria-play:hover, .pictureView-white .galleria-container.touch .galleria-play:active, .pictureView-white .galleria-container.notouch .galleria-popout:hover, .pictureView-white .galleria-container.touch .galleria-popout:active {
    background-color: #9e9688 !important;
  }

  .pictureView-black .galleria-container.notouch .galleria-thumblink:hover, .pictureView-black .galleria-container.touch .galleria-thumblink:active, .pictureView-black .galleria-thumblink.open, .pictureView-black .galleria-container.notouch .galleria-fullscreen:hover, .pictureView-black .galleria-container.touch .galleria-fullscreen:active, .pictureView-black .galleria-container.notouch .galleria-play:hover, .pictureView-black .galleria-container.touch .galleria-play:active, .pictureView-black .galleria-container.notouch .galleria-popout:hover, .pictureView-black .galleria-container.touch .galleria-popout:active {
    background-color: #000 !important;
  }

  #pictureView .galleria-image-nav-left, .galleria-image-nav-right {
    display: none !important;
  }

  .galleria-lightbox-nextholder, .galleria-lightbox-prevholder {
    height: 85% !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    margin-top: 0 !important;
  }

  .galleria-lightbox-next, .galleria-lightbox-prev {
    background: #ccc !important;
    font-size: 20px !important;
  }
  .galleria-lightbox-prev {
   padding-left: 0!important;
  }
  .galleria-lightbox-close:hover {
    color: rgb(97, 97, 97)!important;
  }


</style>
