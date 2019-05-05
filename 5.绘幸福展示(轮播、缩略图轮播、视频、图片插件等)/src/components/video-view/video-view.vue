<template>
  <div class="video_dialog_show" id="video_dialog_show"></div>
</template>

<script>
  var myMethods = {
    //播放视频
    loadPlay(vediodataObj, isPlayVideoObj,isSetFullscreen,idObj) {
      let that=this;
      that.obj1=vediodataObj;
      that.obj2=isPlayVideoObj;
      that.obj3=isSetFullscreen;
      that.obj4=idObj;
      if (vediodataObj.length==1){
        jwplayer("video_dialog_show").setup({
          file: vediodataObj[0].file,
          height: this.playHeight,
          image: vediodataObj[0].image,
          displaytitle: false,
          autostart: isPlayVideoObj,//是否自动播放
          mute: false,
          width: this.playWidth,
          events: {
            onComplete: function () {
              console.log("播放结束!!!");
            },
            onVolume: function () {
              console.log("声音大小改变!!!");
            },
            onReady: function () {
              console.log("准备就绪!!!");
            },
            onPlay: function () {
              console.log("开始播放!!!");
            },
            onPause: function () {
              console.log("暂停!!!");
            },
            onBufferChange: function () {
              console.log("缓冲改变!!!");
            },
            onBufferFull: function () {
              console.log("视频缓冲完成!!!");
            },
            onError: function (obj) {
              console.log("播放器出错!!!" + obj.message);
              that.$emit('getResource',idObj)
            },
            onFullscreen: function (obj) {
              if (obj.fullscreen) {
                console.log("全屏");
              } else {
                console.log("非全屏");
              }
            },
            onMute: function (obj) {
              console.log("静音/取消静音");
            }
          }
        });
      }else if (vediodataObj.length>1){
        jwplayer("video_dialog_show").setup({
          playlist: vediodataObj,
          width: this.playWidth,
          height: this.playHeight,
          displaytitle: false,
          autostart: isPlayVideoObj,//是否自动播放
          mute: false,
          listbar: {
            position: "right",
            size: 220
          },
          events: {
            onPlaylistItem: function (event) {
              var index = event.index;
              console.log(index)
              // that.getimageAction(index);
              //$("#hidUrl").val(vediodata[index].fid);
              //$("#hidAddressid").val(vediodata[index].aid);
            },
            onComplete: function () {
              console.log("播放结束!!!");
            },
            onVolume: function () {
              console.log("声音大小改变!!!");
            },
            onReady: function () {
              console.log("准备就绪!!!");
            },
            onPlay: function () {
              console.log("开始播放!!!");
            },
            onPause: function () {
              console.log("暂停!!!");
            },
            onBufferChange: function () {
              console.log("缓冲改变!!!");
            },
            onBufferFull: function () {
              console.log("视频缓冲完成!!!");
            },
            onError: function (obj) {
              console.log("播放器出错!!!" + obj.message);
              that.$emit('getResource',idObj)
            },
            onFullscreen: function (obj) {
              if (obj.fullscreen) {
                console.log("全屏");
              } else {
                console.log("非全屏");
              }
            },
            onMute: function (obj) {
              console.log("静音/取消静音");
            }
          }
        });
      }

      //是否全屏
      if (isSetFullscreen){
        jwplayer().setFullscreen();
      }
    },
    getimageAction(index) {
      if (index == undefined) {
        index = 0
      }
      var userID = $("#hidUserID").val();
      var url = "";
      var userid = "";
      var fid = "";
      var aid = "";
      if (this.showtype == "1") {//视频
        $("#hidUrl").val(this.vediodata[index].fid);
        $("#hidAddressid").val(this.vediodata[index].aid);
        //url = vediodata[index].image;

        if (this.vediodata[index].file) {
          url = this.vediodata[index].file;
        }
        if (this.vediodata[index].sources) {
          url = this.vediodata[index].sources[0].file;
        }
        userid = this.vediodata[index].userid;
        fid = this.vediodata[index].fid;
        aid = this.vediodata[index].aid;
      } else {
        ///改动：解决左右键报错问题
        while (index >= this.imagedata.length) {
          index = index - this.imagedata.length;
        }
        $("#hidUrl").val(this.imagedata[index].fid);
        $("#hidAddressid").val(this.imagedata[index].aid);
        url = this.imagedata[index].image;
        userid = this.imagedata[index].userid;
        fid = this.imagedata[index].fid;
        aid = this.imagedata[index].aid;
      }

      // if (actionhtml != "") {
      //     var html = tophtml + actionhtml;
      //     $("#youjicaidan").html(html);
      //     islikeload($("#hidislike").val());
      //
      // }
    },

  };
  export default {
    name: "video-view",
    data() {
      return {
        videoData: [
          {
            file: "",
            default: false
          },
        ],
        isPlayVideoUpdate: true,
        obj1:{},
        obj2:{},
        obj3:{},
        obj4:{},
      }
    },
    methods: myMethods,
    mounted() {
      this.playWidth = $('#dialog_content').innerWidth();
      this.playHeight = $('#dialog_content').innerHeight();

      // $(window).resize(() => {
      //   this.playWidth = $('#dialog_content').innerWidth();
      //   this.playHeight = $('#dialog_content').innerHeight();
      //   console.log($('#dialog_content').innerWidth())
      //   this.loadPlay(this.obj1,this.obj2,this.obj3,this.obj4)
      // })
    },
  }
</script>

<style scoped>

</style>
