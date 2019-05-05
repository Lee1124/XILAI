<template>
  <div id="diaLogView">
    <input type="text" id="imgInput" style="display: none;" value="">
    <!--右击菜单-->
    <rightMenu v-show="showRightMenu" :style="{'top':topY,'left':leftX,zIndex:'9999999999999'}" @goDDZL="goDDZL"
               @goItem="goItem"
               @goHotelItem="goHotelItem" @setPic="setPic" @setBranch="setBranch" :power="power"></rightMenu>

    <i class="closeIcon" @click="closeTip" v-if="showDialogBox">
      <img src="../../../static/img/close3.png" alt="关闭">
    </i>
    <el-dialog
      title=""
      :visible.sync="showDialogBox"
      :show-close=false
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @opened="loadRightClickEvent"
      @closed="closeRightClickEvent"
      custom-class="dialogBox1"
      center>
      <span class="dialog_switch dialog_switch_prev" v-show="playType==1">
        <img src="../../../static/img/switch-left.png">
      </span>
      <span class="dialog_switch dialog_switch_next" v-show="playType==1">
        <img src="../../../static/img/switch-right.png">
      </span>
      <div class="play-box">
        <div class="picture" @click="switchPicVideo(1)" :class="{'bacStyle':playType==2}"><img
          src="../../../static/img/pic.png"></div>
        <div class="video" @click="switchPicVideo(2)" :class="{'bacStyle':playType==1}"><img
          src="../../../static/img/video.png"></div>
      </div>
      <div class="dialog_content" id="dialog_content">
        <div v-show="playType==1" id="pictureViewType">
          <pictureView ref="pictureView"></pictureView>
        </div>
        <div v-show="playType==2" id="videoViewType">
          <videoView ref="videoView" @getResource="getResource"></videoView>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <!--<span class="footer-text">{{item.FILE_TITEL}}
            <span class="footer_news" @click="getNews" @mouseenter="showNews" @mouseleave="hideNews"
              v-if="isJGZS==3"></span>
        </span>-->
        <span class="footer-text">{{item.FILE_TITEL}}
            <span class="footer_news" @click="getNews" @mouseenter="showNews" @mouseleave="hideNews"
              v-if="isJGZS==3">
              <div class="newsView" v-if="isJGZS==3" v-show="isShowSelf">
                <div class="newsView-icon-box">
                  <img src="../../../static/img/sanjiao.png">
                </div>
                <div v-html="kaPianData"></div>
              </div>
            </span>
        </span>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import pictureView from '../picture-view/picture-view'
  import videoView from '../video-view/video-view'
  import rightMenu from '../right-click-menu/right-click-menu'

  var myMethods = {
    //出现异常时获取视频资源
    getResource(val) {
      this.$emit('getResource', val)
    },
    //鼠标移入显示信息卡
    showNews() {
      if (this.isShowHideNews) {
        $('.newsView').fadeIn(200);
      }
    },
    //鼠标移出隐藏信息卡
    hideNews() {
      if (this.isShowHideNews) {
        $('.newsView').fadeOut(200);
      }
    },

    //点击获取卡片信息
    getNews() {
      this.$axios({
        method: 'GET',
        url: this.api_8090 + '/View/GetDetialProjectshx.ashx?type=project&bid=&no=2&id=' + this.ProjectID,
        headers: {
          Authorization: this.Authorization
        }
      }).then(res => {
        $('.newsView').fadeIn(200);
        this.isShowHideNews = true;
        this.isShowSelf = true;
        this.kaPianData = res.data;
      }, err => {

      })
    },

    //打开弹框时的回调--加载鼠标右击事件
    loadRightClickEvent() {
      this.isJGZS = this.$route.query.id;
      if (this.isJGZS == 2) {
        this.yesRightClick = false;
      } else if (this.isJGZS == 6) {
        this.yesRightClick = false;
      } else {
        this.yesRightClick = true;
      }

      $(document).on('contextmenu', (e) => {
        if (this.yesRightClick) {
          e.preventDefault();//阻止鼠标右击默认事件
          this.showRightMenu = true;
          this.leftX = e.clientX + 'px';
          this.topY = e.clientY + 'px';
        }
      });

      $(document).on('click', (e) => {
        this.showRightMenu = false;
      });
      this.$emit('yesParentSwiper')
    },
    //关闭弹框时的回调
    closeRightClickEvent() {
      this.yesRightClick = false;
      this.isShowSelf = false;
      this.isShowHideNews = false;
      this.$emit('noParentSwiper')
    },

    //图片视频切换
    switchPicVideo(val) {
      if (val == 1) {
        this.playType = 1;
        this.isPlayVideo = false;
        if (this.fn_video_length != 0) {
          var isSetFullscreen = false;
          this.$refs.videoView.loadPlay(this.vediodata, this.isPlayVideo, isSetFullscreen, this.videoFileId);
        }
        //判断切换到图片时展示方式：默认/自适应
        if (this.ImageType == 1) {
          this.startShowImage = false;
        } else if (this.ImageType == 2) {
          this.startShowImage = true;
        }
        //调用子组件图片插件
        this.$refs.pictureView.loadPicPlay(this.imagedata, this.startShowImage);

      } else if (val == 2) {
        this.playType = 2;
        this.isPlayVideo = true;
        var isSetFullscreen;
        if (this.VideoType == 1) {
          isSetFullscreen = true;
        } else {
          isSetFullscreen = false;
        }
        //调用子组件视频插件
        this.$refs.videoView.loadPlay(this.vediodata, this.isPlayVideo, isSetFullscreen, this.videoFileId);
      }
    },

    loadPicOrVideo(obj) {
      if (obj == 'v0') {
        this.playType = 1;
        this.startShowImage = true;
        this.$refs.pictureView.loadPicPlay(this.imagedata, this.startShowImage);
      }
    },

    fn_video(obj, videoItemsObj) {
      this.videoDataObj=obj;
      this.videoFileId = videoItemsObj.FILE_ID;
      this.fn_video_length = obj.length;
      if (this.FistShow == 1) {
        if (obj.length != 0) {
          var isSetFullscreen;
          this.playType = 2;
          if (this.VideoType == 1) {
            isSetFullscreen = true;
          } else {
            isSetFullscreen = false;
          }
          this.$refs.videoView.loadPlay(obj, true, isSetFullscreen, this.videoFileId);
        } else {
          this.playType = 1;
          this.startShowImage = true;
          this.$refs.pictureView.loadPicPlay(this.imagedata, this.startShowImage);
        }
      }
    },
    //为了上级调用播放图片插件之方法
    fn_img(obj, itemObj, pageTotal,allCount) {
      this.pageTotal = pageTotal;
      this.allCount = allCount;
      this.ProjectID = itemObj.ProjectID;
      this.FILE_ID = itemObj.FILE_ID;
      if (obj.length != 0) {
        this.img_ID = obj[0].ID;
        this.image = obj[0].image;
      }else {
        $('.play-box').hide();
        var isSetFullscreen;
        this.playType = 2;
        if (this.VideoType == 1) {
          isSetFullscreen = true;
        } else {
          isSetFullscreen = false;
        }
        this.$refs.videoView.loadPlay(this.videoDataObj, true, isSetFullscreen, this.videoFileId);
      }
      this.hotelId = itemObj.Hotel;
      this.fn_img_length = obj.length;
      if (this.FistShow == 0) {
        this.playType = 1;
        this.$refs.pictureView.loadPicPlay(obj, true);
      }
      //调用
      this.getCheckUserIndex(itemObj.FILE_ID);
    },

    //获取点开当前的信息
    getCheckUserIndex(fid) {
      this.$axios({
        method: 'GET',
        url: this.api_8090 + '/View/CheckUserIdex.ashx?type=getordinfo&fid=' + fid,
        headers: {
          Authorization: this.Authorization
        }
      }).then(res => {
        this.ORDER_ID = res.data.ORDER_ID;
        this.CUSTOMER_ID = res.data.CUSTOMER_ID;
      })
    },
    //进入订单资料
    goDDZL() {
      window.open(this.api_8090 + '/View/Order_N/Index_New.aspx?coustomertype=1&orderID=' + this.ORDER_ID + '&CUSTOMER_ID' + this.CUSTOMER_ID + '&type=all&power=viewlist')
    },

    //进入酒店详情
    goHotelItem() {
      if (this.hotelId != '') {
        window.open(this.api_8090 + '/SysManage/HotelManage/jiudianguanli.html?id=' + this.hotelId + '&action=homeview')
      } else {
        this.$message({
          message: '无酒店相关资料',
          type: 'warning',
          duration: 3000,
        });
      }
    },

    //进入部分详情
    goItem(val) {
      let title;
      let layerWidth;
      let layerHeight;
      let contentUrl;
      let windowWidth = $(window).width();
      let windowHeight = $(window).height();
      if (val == 'jbzl') {
        title = '基本资料';
        layerWidth = 980;
        layerHeight = windowHeight * (0.71);
        contentUrl = this.api_8090 + '/View/new_designWorksList_ly_kxt/newpage/rightclick_anlibianji_details.html?fid=' + this.FILE_ID;
      } else if (val == 'albj') {
        title = '案例编辑';
        layerWidth = windowWidth * (0.60);
        layerHeight = windowHeight * (0.91);
        contentUrl = this.api_8090 + '/View/Order_N/DataPicture_New.aspx?type=branch&havetop=havetop&power=edit&idPath=&id=' + this.FILE_ID;
      } else if (val == 'jc') {
        title = '';
        layerWidth = windowWidth * (0.62);
        layerHeight = windowHeight * (0.98);

        if (this.playType == 1) {//为图片
          let setData = this.$refs.pictureView.toParentNews();//调用图片容器中的方法
          $('#imgInput').attr('value', setData.imgUrl);
          // alert('ok');
          setTimeout(()=>{
            contentUrl = this.api_8090 + '/FileManage/EditHomePage.aspx?type=list&id=' + this.FILE_ID + '&math=' + Math.random();
          });
        } else {//为视频
          $('#imgInput').attr('value', this.image);
          // alert('ok');
          setTimeout(()=>{
            contentUrl = this.api_8090 + '/FileManage/EditHomePage.aspx?type=list&id=' + this.FILE_ID + '&math=' + Math.random();
          });
        }
      }
      setTimeout(()=>{
        var that = this;
        layui.use('layer', function () {
          var layer = layui.layer;
          window.top.layer.open({
            type: 2,
            skin: '',
            title: title,
            area: [layerWidth + 'px', layerHeight + "px"],
            content: contentUrl
          })
        });
      });

    },

    //剪裁回调
    successJCIMG(){
      this.$emit('reloadData');
      this.$message({
        message: '剪裁封面成功!',
        type: 'success',
        customClass: 'messageStyle',
        duration: 1000,
      });
    },
    //关闭弹框
    closeTip() {
      this.$emit('closeTip')
    },
    //获取播放方式
    getPlayType() {
      let url = this.api + '/xlapi/SysManage/Hotel/Hotel/getinformationsetting?userid=' + this.userid + '&branid=' + getkevalue().branchid;
      this.$axios({
        method: 'GET',
        url: url,
        headers: {
          Authorization: this.Authorization
        }
      }).then(res => {
        /*
        "ID": 1,
        "UserID": 1,
        "FistShow": "1", 开始显示内容 0为图片 1为视频
        "ImageType": "2", 图片显示的方式 1为默认 2为自适应显示
        "VideoType": "2", 播放视频开始是否全屏显示  1表示全屏播放
        "CarType": "1", 登录是否清空购物车
        "CalendarType": "1",日历显示方式默认0覆盖,1是弹出
        "OrderViewType": "0" 订单管理查看方式 默认0：普通查看 1：弹出查看
        branlogo 店logo
        branip 店ip
        roul 权限 true false
        */
        // console.log(res.data)
        if (res.status == 200) {
          console.log("播放视频方式"+res.data.VideoType)
          this.power = res.data.roul;
          this.setLogo(res.data.branlogo);
          this.FistShow = res.data.FistShow;//后用======================
          // this.FistShow = 1;
          this.ImageType = res.data.ImageType;//后用======================
          // this.ImageType = 2;
          this.VideoType = res.data.VideoType;
          this.CarType = res.data.CarType;
          this.CalendarType = res.data.CalendarType;
          this.OrderViewType = res.data.OrderViewType;

          if (this.FistShow == 0) {
            this.playType = 1;
          } else if (this.FistShow == 1) {
            this.playType = 2;
          }

          //判断视频该不该一开始就播放
          if (this.playType == 1) {
            if (this.ImageType == 2) {
              this.startShowImage = true;
            }
            this.isPlayVideo = false;
          } else if (this.playType == 2) {
            this.isPlayVideo = true;
            this.startShowImage = false;
          }
        }
      }, err => {
        console.log(err)
      })
    },

    //设置logo图片
    setLogo(val) {
      $('#logoImg').attr('src', val)
    },

    //===设置图片===
    setPic(val) {
      if (this.playType == 1) {//为图片
        let setData = this.$refs.pictureView.toParentNews();//调用图片容器中的方法

        this.picTopOrBottomOrDel(setData, val)
      } else {//为视频
        let setData = {
          fileID: this.FILE_ID,
          imgID: this.img_ID,
          imgUrl: this.image
        };
        this.picTopOrBottomOrDel(setData, val)
      }
    },

    //===设置店===
    setBranch(val) {
      var that = this;
      if (val == 'top') {
        let params = new URLSearchParams();
        params.append('type', 'setupfileviewsortbybranch');
        params.append('fileid', this.FILE_ID);
        params.append('pageIndex', '1');
        params.append('filesortpage', '1');
        params.append('formType', '4');
        this.branchOrderBy(params);
      } else if (val == 'all') {
        let params = new URLSearchParams();
        params.append('type', 'setupfileviewsort');
        params.append('fileid', this.FILE_ID);
        params.append('pageIndex', '1');
        params.append('filesortpage', '1');
        params.append('formType', '4');
        this.branchOrderBy(params);
      } else if (val == 'move') {
        layui.use('layer', function () {
          var layer = layui.layer;
          layer.open({
            type: 1,
            skin: 'layerStyle',
            title: '移至',
            btn: ['确认'],
            area: ['300px', "200px"],
            content: '<div class="move">\n' +
            '  <span>移至</span>\n' +
            '  <input type="text" id="moveInputVal">\n' +
            '  <span>页</span>\n' +
            '  <span>（范围：1-' + that.pageTotal + '页）</span>\n' +
            '</div>',
            yes(index, layero) {
              console.log($('#moveInputVal').val())
              let num = $('#moveInputVal').val();
              if (/^[0-9]+$/.test(num)) {//正则表达是检查是否是数字
                if (num > that.pageTotal) {
                  alert('数字范围是1-' + that.pageTotal);
                  return false;
                }
                let params = new URLSearchParams();
                params.append('type', 'setupfileviewsortbybranch');
                params.append('fileid', that.FILE_ID);
                params.append('pageIndex', '1');
                params.append('filesortpage', num);
                params.append('formType', '4');
                that.branchOrderBy(params, val, index);
              } else if (/^-[0-9]+$/.test(num)) {
                alert('数字范围是1-' + that.pageTotal);
                return false;
              } else {
                alert('请输入数字');
                return false;
              }
            }
          })
        });
      } else if (val == 'more') {
        layui.use('layer', function () {
          var layer = layui.layer;
          layer.open({
            type: 1,
            skin: 'layerStyle layerStyle2',
            title: '更多排序',
            btn: ['确认'],
            area: ['350px', "220px"],
            content: '<div class="moreOrderBy move">\n' +
            '  <div class="moreOrderBy-inner">\n' +
            '    <span>请输入页码</span>\n' +
            '    <input type="text" id="val1">\n' +
            '    <span id="text1">（范围：1-' + that.pageTotal + '页）</span>\n' +
            '  </div> \n' +
            '  <div class="moreOrderBy-inner">\n' +
            '    <span>请输入序列</span>\n' +
            '    <input type="text" id="val2">\n' +
            '    <span id="text2">（范围：1-' + that.lastNum + '）</span>\n' +
            '  </div>\n' +
            '</div>',
            yes(index, layero) {
              let num1 = parseInt($('#val1').val());
              let num2 = parseInt($('#val2').val());
              let text1 = $('#text1').text();
              let text2 = $('#text2').text();
              if (/^[0-9]+$/.test(num1) && /^[0-9]+$/.test(num2)) {//正则表达是检查是否是数字
                let params = new URLSearchParams();
                params.append('type', 'custom');
                params.append('fileid', that.FILE_ID);
                params.append('seqNum', (num1-1)*8+(num2-1));
                params.append('formType', '4');
                that.branchOrderBy(params, val, index);
              } else if (/^-[0-9]+$/.test(num1) || text1 == '该页不在范围内') {
                alert('页码范围是1-' + that.pageTotal);
                return false;
              } else if (/^-[0-9]+$/.test(num2) || text2 == '该序列不在范围内') {
                alert('序列范围是1-' + that.lastNum);
                return false;
              } else {
                alert('请输入数字');
                return false;
              }
            }
          });
          $("#val1").on("input", function (e) {
            if (e.delegateTarget.value > that.pageTotal && e.delegateTarget.value != "") {
              $('#text1').text('该页不在范围内')
            } else if (e.delegateTarget.value < 1 && e.delegateTarget.value != "") {
              $('#text1').text('该页不在范围内')
            } else if (e.delegateTarget.value == '' || e.delegateTarget.value <= that.pageTotal) {
              $('#text1').text("（范围：1-" + that.pageTotal + "页）")
            }
          });
          $("#val2").on("focus", function (e) {
            let yeNum = parseInt($('#val1').val());
            if (yeNum < that.pageTotal) {
              $('#text2').text("（范围：1-8）");
              that.lastNum = 8;
              console.log(that.lastNum)
            } else if (yeNum == that.pageTotal) {
              let lastNum = that.allCount % 8;
              that.lastNum = lastNum;
              console.log(that.lastNum)
            }
          });
          $("#val2").on("input", function (e) {
            //获取input输入的值
            if (e.delegateTarget.value > that.lastNum && e.delegateTarget.value != "") {
              $('#text2').text('该序列不在范围内')
            } else if (e.delegateTarget.value < 1 && e.delegateTarget.value != "") {
              $('#text2').text('该序列不在范围内')
            } else if ( e.delegateTarget.value <= that.lastNum) {
              $('#text2').text("（范围：1-" + that.lastNum + "）")
            } else if (e.delegateTarget.value == "") {
              $('#text2').text("（范围：1-）")
            }
          });
        });

      }
    },

    //图片置顶/置底请求
    picTopOrBottomOrDel(valObj, val) {
      console.log(valObj)
      let url = this.api_8090 + "/Progect/PhotoManage/EditFile.ashx";
      if (val == 'top') {
        var params = new URLSearchParams();
        params.append('type', 'asc');
        params.append('aid', valObj.imgID);
        params.append('fid', valObj.fileID);
        params.append('tabletype', '0');
      } else if (val == 'bottom') {
        var params = new URLSearchParams();
        params.append('type', 'desc');
        params.append('aid', valObj.imgID);
        params.append('fid', valObj.fileID);
        params.append('tabletype', '0');
      } else if (val == 'del') {
        var params = new URLSearchParams();
        params.append('type', 'Delete');
        params.append('aid', valObj.imgID);
        params.append('tabletype', '0');
      }
      this.$axios({
        method: 'POST',
        url: url,
        data: params,
        headers: {
          Authorization: this.Authorization
        }
      }).then(res => {
        if (res.status == 200) {
          console.log(res)
          if (val == 'del') {
            this.$message({
              message: '删除成功!',
              type: 'success',
              customClass: 'messageStyle',
              duration: 1000,
            });
          } else {
            this.$message({
              message: '修改成功!',
              type: 'success',
              customClass: 'messageStyle',
              duration: 1000,
            });
          }

        }
      })
    },

    //店操作请求
    branchOrderBy(obj, val, index) {
      let url = this.api_8090 + '/View/Order_N/ProjectOperating_order.ashx';
      this.$axios({
        method: 'POST',
        url: url,
        data: obj,
        headers: {
          Authorization: this.Authorization
        }
      }).then(res => {
        if (res.status == 200) {
          console.log(res)
          this.$message({
            message: '修改成功!',
            type: 'success',
            customClass: 'messageStyle',
            duration: 2000,
          });
          if (val != 'move') {
            //重新加载数据
            this.$emit('reloadData');
          }
          if (val == 'move') {
            var layer = layui.layer;
            layer.close(index);
            //重新加载数据
            this.$emit('reloadData');
          }
          if (val == 'more') {
            var layer = layui.layer;
            layer.close(index);
            //重新加载数据
            this.$emit('reloadData');
          }
        }
      })
    },

    //回调函数
    SetFile(){
      this.goItem('albj')
    }
  };

  export default {
    name: 'diaLogView',
    props: ['showDialogBox', 'isType', 'vediodata', 'imagedata', 'item'],
    methods: myMethods,
    data() {
      return {

        power: false,//权限true或false

        pageTotal: '0',
        allCount: '0',
        lastNum: '',

        rightClickDialogBox: false,

        FILE_ID: '',
        img_ID: '',
        image: '',
        hotelId: '',

        videoFileId: '',
        videoDataObj: {},

        playType: 0,//1是图片、2是视频
        isPlayVideo: true,
        startShowImage: false,

        showRightMenu: false,//是否显示右击菜单
        yesRightClick: false,//是否显示右击菜单
        topY: 0,
        leftX: 0,

        isJGZS: 0,

        isShowSelf: false,

        ProjectID: '',

        isShowHideNews: false,
        kaPianData: '<p><span class="point_list">服务项目名称:</span><span class="point_title">单机跟拍王力</span></p><p><span class="point_list">所属分类:</span><span class="point_title">单机跟拍</span></p>  <p><span class="point_list">参考价格:</span><span class="point_title">￥-- </span></p><p><span class="point_list">项目说明:</span><span class="point_title">联系电话：18142568220；异地费实报实销--</span></p>',

        fn_video_length: 0,
        fn_img_length: 0,


        CUSTOMER_ID: '',
        ORDER_ID: '',

        //===请求数据参数
        api:getkevalue().apiurl,
        // api: 'https://xilai99.com',
        Authorization:localStorage.userinfo,
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
        OrderViewType: "" //订单管理查看方式 默认0：普通查看 1：弹出查看
        /*=====/获取播放类型=====*/
      }
    },
    created() {
      //获取播放方式
      this.getPlayType();
      window.SetFile=this.SetFile;
      window.successJCIMG=this.successJCIMG;
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
      rightMenu: rightMenu
    },
    watch: {
      showDialogBox(val) {
        if (val == false) {
          this.isPlayVideo = false;
          if (this.fn_video_length != 0) {
            this.$refs.videoView.loadPlay(this.vediodata, this.isPlayVideo);
          }
        } else {
          // $(".tipCt").show();
          setTimeout(function () {
            // $(".tipCt").hide();
          }, 200)
        }
      },
    }

  }

</script>

<style scoped>

  >>> .el-dialog {
    border-radius: 2px;
    border-top-left-radius: 0;
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
    background: #fff;
    text-align: center;
  }

  .play-box .bacStyle {
    background: #E6E6E6;
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

  .footer_news {
    width: 40px;
    height: 40px;
    float: right;
    text-align: center;
    display: inline-block;
    cursor: pointer;
    background: url("../../../static/img/clock0.png") no-repeat center center;
    position: absolute;
    top: 50%;
    right: -40px;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
  }

  .footer_news:hover {
    background: url("../../../static/img/click1.png") no-repeat center center;
  }

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
