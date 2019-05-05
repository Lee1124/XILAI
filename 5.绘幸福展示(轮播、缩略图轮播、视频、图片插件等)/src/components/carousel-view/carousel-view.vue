<template>
  <div id="carousel-view" v-loading="loading"><!--v-loading="loading"-->
    <dialogView :showDialogBox="showDialogBox" :isType="isType" @closeTip="closeTip"
                :vediodata="vediodata" :imagedata="imagedata" ref="diaLog" :item="item"
                @yesParentSwiper="yesParentSwiper" @noParentSwiper="noParentSwiper"
                @getResource="getResource" v-show="showDialogBox" @reloadData="reloadData"></dialogView>
    <diaLogPicVideoView :showDiaLogPicVideoBox="showDiaLogPicVideoBox" @closeTip="closeTip"
                        ref="diaLogPicVideoView" @yesParentSwiper="yesParentSwiper"
                        @noParentSwiper="noParentSwiper"></diaLogPicVideoView>
    <loadingDialogView :loadingDialogViewBox="loadingDialogViewBox"></loadingDialogView>
    <div v-show="false">{{msg}}</div>
    <div class="swiper-container" :style="{height:swiperContainerHeight}">
      <div class="swiper-wrapper" id="swiperWrapper">
        <div class="swiper-slide" v-for="item in swiperContent">
          <el-row :gutter="10" style="margin: 0;padding: 4px 2px;box-sizing: border-box" ref="elRow">
            <template v-for="item2 in item.list">
              <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6" style="padding: 0;">
                <div class="ct_box" v-if='type!=6' @click="toDetails(item2)">
                  <div class="img_box" ref="imgBox"
                       :style="{'height':imgBoxHeight,background:'url('+item2.URLThumbnail+') no-repeat center center','backgroundSize':'cover'}"
                       :class="{'bacStyle':item2.URLThumbnail=='https://xilai99.com/image/logo2.png'}">
                    <!--<img :src="Cosip+item2.URLThumbnail" alt="">-->
                    <!--<img :src="item2.URLThumbnail" alt="">-->
                    <img :src="item2.URLThumbnail"
                         @error="getImgItems($event,item2)" v-show="isShowNoPic">

                    <div class="img_shadow" v-if='type==6'>
                      <div class="img_shadow_inner">
                      </div>
                    </div>
                  </div>
                  <div class="ct_title">
                    <i class="icon"></i>
                    <span>{{item2.FILE_TITEL}}</span>
                  </div>
                </div>
                <div class="ct_box wdz_ct_box" v-if='type==6' @click="toDetails_wdz(item2)">
                  <div class="img_box" ref="imgBox"
                       :style="{'height':imgBoxHeight,background:'url('+item2.URLThumbnail+') no-repeat center center','backgroundSize':'cover'}"
                       :class="{'bacStyle':item2.URLThumbnail=='https://xilai99.com/image/logo2.png'}">
                    <img :src="item2.URLThumbnail"
                         @error="getImgItems($event,item2)" v-show="isShowNoPic">
                    <!--<img :src="Cosip+item2.URLThumbnail" alt="">-->
                    <!--<img :src="item2.URLThumbnail" alt="">-->
                    <div class="img_shadow" v-if='type==6'>
                      <div class="img_shadow_inner">
                        <p>{{item2.FILE_TITEL}}</p>
                        <p></p>
                        <p>{{item2.TotalPrice}}</p>
                      </div>
                    </div>
                  </div>
                  <div class="ct_title">
                    <i class="icon"></i>
                    <!--<span>{{item2.FILE_TITEL}}</span>-->
                    <span>{{item2.FILE_TITEL}}</span>
                  </div>
                </div>
              </el-col>
            </template>
          </el-row>
        </div>
      </div>
      <div class="swiper-button-prev"></div><!--左箭头-->
      <div class="swiper-button-next"></div><!--右箭头-->

      <div class="swiper-pagination"></div>
    </div>
  </div>
</template>

<script>
  import dialogView from '../dialog-view/dialog-view'
  import diaLogPicVideoView from '../dialog-video-picture/dialog-video-picture'
  import loadingDialogView from '../loading-dialog-view/loading-dialog-view'

  var myMethods = {
    //重新加载数据
    reloadData() {
      // this.loadStartData();
      this.reload();
    },
    //@error图片加载失败调用函数
    getImgItems(e, obj) {
      if (this.getImgItemsFlag) {
        $(e.target).show();
        $(e.target).attr('src', 'http://211.149.163.185:8090/Images/View/newimage/nophoto2.png');
        obj.isErrZiYuan = true;
      }
    },
    //打开弹框关闭轮播键盘事件
    yesParentSwiper() {
      this.mySwiper.keyboard.disable(); //禁止键盘控制
      this.isShowTips = false;
    },
    //关闭弹框打开轮播键盘事件
    noParentSwiper() {
      this.mySwiper.keyboard.enable(); //开启键盘控制
      this.isShowTips = true;
    },
    //监听浏览器窗口大小事件
    windowResize() {
      let that = this;
      $(window).resize(() => {
        let windowHeight = $(window).height();
        let windowWidth = $(window).width();
        $('.el-main').css({
          paddingLeft: (windowWidth * 0.10) + 'px',
          paddingRight: (windowWidth * 0.10) + 'px',
        });
        $('.Header').css({
          paddingLeft: (windowWidth * 0.10) + 'px',
          paddingRight: (windowWidth * 0.10) + 'px',
        });
        setTimeout(() => {
          let imgBoxWidth = $(that.$refs.imgBox).innerWidth();
          that.imgBoxHeight = imgBoxWidth / 1.75 + 'px';
          let ct_boxHeight = $('.ct_box').innerHeight();
          that.swiperContainerHeight = ct_boxHeight * 2 + windowHeight * 0.14 + 'px';
          let swiperContainerHeight = ct_boxHeight * 2 + windowHeight * 0.14;
          $('.el-main').css({
            paddingTop: (windowHeight - 100 - swiperContainerHeight) / 2,
          });
          $('.swiper-button-next, .swiper-button-prev').css({
            top: (windowHeight - 60) / 2 + 'px',
          })
        });
      });
    },
    //加载首页数据
    loadStartData(val) {
      if (val == undefined) {
        var params = new URLSearchParams();
        params.append('type', this.type);
        params.append('num', this.num);
        params.append('Where', this.Where);
        params.append('projecttype', this.projecttype);
        params.append('shopcarid', this.shopcarid);
        params.append('skipnum', this.skipnum);
        params.append('likeflag', this.likeflag);
        params.append('planuserid', this.planuserid);
        params.append('partakeuserid', this.partakeuserid);

        this.$axios({
          method: 'POST',
          url: this.api_8090 + '/View/GetFile.ashx',
          data: params,
          headers: {
            Authorization: this.Authorization,
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            Accept: '*/*',
            'X-Requested-With': 'XMLHttpRequest'
          },
        }).then(res => {
          // console.log(res.data[1]);
          this.swiperContent.splice(0, this.swiperContent.length);
          let total = Math.ceil(res.data[0] / 8);
          this.allCount = res.data[0];
          this.pageTotal = total;
          for (let i = 0; i < total; i++) {
            this.swiperContent.push({list: []})
          }
          res.data[1].forEach((item, index, arr) => {
            if (arr[index].URLThumbnail == '') {
              arr[index].URLThumbnail = 'https://xilai99.com/image/logo2.png'
            } else {
              arr[index].URLThumbnail = this.getImgVideoUrl + arr[index].URLThumbnail
            }
            arr[index].isErrZiYuan = false;
          });
          this.swiperContent[0] = {list: res.data[1]};
          this.$set(this.swiperContent, this.swiperContent[0], {list: res.data[1]});
          this.msg++;
          this.getImgItemsFlag = true;
          this.loading = false;
        }, err => {
          console.log(err)
        })
      } else {
        var params = new URLSearchParams();
        params.append('type', this.type);
        params.append('num', this.num);
        params.append('Where', this.Where);
        params.append('projecttype', this.projecttype);
        params.append('shopcarid', this.shopcarid);
        params.append('skipnum', this.skipnum);
        params.append('likeflag', this.likeflag);
        params.append('planuserid', this.planuserid);
        params.append('partakeuserid', this.partakeuserid);
        this.$axios({
          method: 'POST',
          url: this.api_8090 + '/View/GetFile.ashx',
          data: params,
          headers: {
            Authorization: this.Authorization,
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            Accept: '*/*',
            'X-Requested-With': 'XMLHttpRequest'
          },
        }).then(res => {
          res.data[1].forEach((item, index, arr) => {
            if (arr[index].URLThumbnail == '') {
              arr[index].URLThumbnail = 'https://xilai99.com/image/logo2.png';
            } else {
              arr[index].URLThumbnail = this.getImgVideoUrl + arr[index].URLThumbnail
            }
            arr[index].isErrZiYuan = false;
          });
          this.swiperContent[val - 1] = {list: res.data[1]};
          this.$set(this.swiperContent, this.swiperContent[val - 1], {list: res.data[1]});
          this.msg++;
          this.getImgItemsFlag = true;
          this.loading = false;
        }, err => {
          console.log(err)
        });
      }
    },
    //键盘事件
    keyUp() {
      let that = this;
      $(document).keyup(function (event) {
        switch (event.keyCode) {
          case 27:
            if (that.isESC == 1) {
              that.showDialogBox = false;
            }
            that.isESC = 1;
            that.showDiaLogPicVideoBox = false;
        }
      });
    },
    //显示展示弹框
    toDetails(obj) {
      this.PicFileID = obj.FILE_ID;
      if (!obj.isErrZiYuan) {//资源正常时
        this.showDialogBox = true;
        this.item = obj;
        this.isType = Math.random();
        this.isESC = 0;
        this.loadImgItem(obj, '!wdz');//非微定制
      } else {//资源需要手动下载时
        this.selfGetResources(obj.FILE_ID);
      }
    },

    //微定制
    toDetails_wdz(obj) {
      if (!obj.isErrZiYuan) {//资源正常时
        this.showDiaLogPicVideoBox = true;
        this.loadImgItem(obj, 'wdz');//微定制
      } else {//资源需要手动下载时
        this.selfGetResources(obj.FILE_ID);
      }
    },

    //视频出现异常时获取视频资源
    getResource(val) {
      console.log("视频出现异常时获取视频资源");
      this.selfGetResources(val);
    },

    //图片出现异常时获取图片资源
    change_img_urls() {
      console.log("图片出现异常时获取图片资源");
      this.selfGetResources(this.PicFileID);
    },

    //手动下载资源
    selfGetResources(idObj) {
      this.loadingDialogViewBox = true;
      let url = this.api + '/xlapi/Progect/T_PUB_FILE/T_PUB_FILE/getresourcebyfileid';
      let data = {
        fid: idObj
      };
      this.$axios({
        method: 'POST',
        url: url,
        data: data,
        headers: {
          Authorization: this.Authorization
        }
      }).then(res => {
        //向本地添加资源
        this.toLocalNews(res.data.list);
      }, err => {

      })
    },

    //向本地添加资源
    toLocalNews(obj) {
      let url = 'http://192.168.1.253:8091/SaveMaterialFile/TongbuFiles.ashx';
      var params = new URLSearchParams();
      params.append('list', JSON.stringify(obj));
      this.$axios({
        method: 'POST',
        url: url,
        data: params,
        headers: {
          Authorization: this.Authorization
        }
      }).then(res => {
        if (res.status == 200) {
          this.loadingDialogViewBox = false;
          this.$message({
            message: '更新成功,请重新打开！',
            type: 'success',
            duration: 3000,
          });
          this.reload();//刷新页面
        }
      }, err => {

      })
    },

    //加载视频数据
    loadVideoItem(obj, val, imgObj) {
      let url = this.api + '/xlapi/Progect/productDisplay/Files/getvideolist2';
      let data = {
        fid: obj.FILE_ID,
        oid: '123'
      };
      this.$axios({
        method: 'POST',
        url: url,
        data: data,
        headers: {
          Authorization: this.Authorization
        }
      }).then(res => {
        if (res.status == 200) {
          res.data.vlist.forEach((item, index, arr) => {
            arr[index].url = this.getImgVideoUrl + arr[index].url;
          });

          if (res.data.vlist.length != 0) {
            this.vediodata = res.data.vlist.map((item) => {
              return {
                ID: item.ID,
                file: item.url,
                title: item.Title,//为了多视频时候显示视频标题
              }
            });
            if (val == '!wdz') {
              if (imgObj.length == 0) {
                $('.play-box').hide();
              } else {
                $('.play-box').show();
              }
              this.$refs.diaLog.fn_video(this.vediodata, obj)
            } else if (val == 'wdz') {
              imgObj.unshift(this.imagedata[0]);
              var imgResult = [];
              for (var i = 0; i < imgObj.length; i += 6) {
                imgResult.push({list: imgObj.slice(i, i + 6)});
              }
              imgObj.shift();
              this.$refs.diaLogPicVideoView.videoPictureView({
                itemObj: obj,
                imgObj: imgObj,
                resultImgObj: imgResult,
                videoObj: this.vediodata
              })
            }

          } else {//无视频情况
            if (val == '!wdz') {
              $('.play-box').hide();
              this.$refs.diaLog.fn_video([], obj)
            } else if (val == 'wdz') {
              var imgResult = [];
              for (var i = 0; i < imgObj.length; i += 6) {
                imgResult.push({list: imgObj.slice(i, i + 6)});
              }
              this.$refs.diaLogPicVideoView.videoPictureView({itemObj: obj, imgObj: imgObj, resultImgObj: imgResult})
            }
          }
        }
      }, err => {
        console.log(err)
      })
    },
    //获取图片资源
    loadImgItem(obj, val) {
      let url = this.api + '/xlapi/Progect/productDisplay/Files/getimglist2';
      let data = {
        fid: obj.FILE_ID,
        oid: '123'
      };
      this.$axios({
        method: 'POST',
        url: url,
        data: data,
        headers: {
          Authorization: this.Authorization
        }
      }).then(res => {
        // console.log(res);
        if (res.status == 200) {
          if (val == '!wdz') {
            res.data.list.forEach((item, index, arr) => {
              arr[index].url = this.getImgVideoUrl + arr[index].url;
              arr[index].url_ys = this.getImgVideoUrl + arr[index].url_ys;
            });
            this.imagedata = res.data.list.map((item) => {
              return {
                ID: item.ID,
                areaID: item.areaID,
                fileID: item.fileID,
                parentID: item.parentID,
                seq: item.seq,
                title: item.title,
                type: item.type,
                image: item.url,
                thumb: item.url_ys,
              };
            });
            this.$refs.diaLog.fn_img(this.imagedata, obj, this.pageTotal, this.allCount);
            this.loadVideoItem(obj, '!wdz', this.imagedata);//再加载视频
          } else if (val == 'wdz') {
            res.data.vlist.forEach((item, index, arr) => {
              arr[index].url = this.getImgVideoUrl + arr[index].url;
              arr[index].url_ys = this.getImgVideoUrl + arr[index].url_ys;
            });
            this.imagedata = res.data.vlist.map((item) => {
              return {
                ID: item.ID,
                areaID: item.areaID,
                fileID: item.fileID,
                parentID: item.parentID,
                seq: item.seq,
                title: item.title,
                type: item.type,
                image: item.url,
                thumb: item.url_ys,
              };
            });
            this.imagedata.forEach(function (item, index, arr) {
              arr[index].imgId = index
            });
            this.loadVideoItem(obj, 'wdz', this.imagedata);//再加载视频
          }
        }
      }, err => {
        console.log(err)
      })
    },

    //关闭弹框
    closeTip() {
      this.showDialogBox = false;
      this.showDiaLogPicVideoBox = false;
    },
    //初始化页面展示内容
    _initSwiper() {
      let that = this;
      that.mySwiper = new Swiper('.swiper-container', {
        observer: true,//修改swiper自己或子元素时，自动初始化swiper
        observeParents: true,//修改swiper的父元素时，自动初始化swiper
        allowTouchMove: false,//禁止触摸翻页加载
        mousewheel: true,//禁止触摸翻页加载
        speed: 500,
        keyboard: {
          enabled: true,
          onlyInViewport: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          type: 'bullets',
          dynamicBullets: true,
          // dynamicMainBullets: 3,
          renderBullet: function (index, className) {
            return '<span class="' + className + '">' + (index + 1) + '</span>';
          },
        },
        lazy: {
          loadPrevNext: true,
        },
        on: {//切换时
          // slideNextTransitionStart: function () {
          slideChangeTransitionStart: function () {
            let activeIndex = this.activeIndex;
            if (that.isShowTips) {
              // if (parseInt(activeIndex) + 1 == that.pageTotal) {
              //   that.$message({
              //     message: '已经是最后一页啦！',
              //     type: 'warning'
              //   });
              // }
            }
            for (let i = 0; i < that.oldLoadData.length; i++) {
              if (that.oldLoadData[i] != activeIndex + 1) {
                if (that.oldLoadData.indexOf(activeIndex + 1) == -1) {
                  that.num = activeIndex + 1;
                  that.loading = true;
                  that.oldLoadData.push(activeIndex + 1);
                  that.loadStartData(activeIndex + 1);
                  that.mySwiper.update();
                }
              }
            }
            if (activeIndex=='0'){
              that.num=1;
              that.loadStartData(activeIndex + 1);
            }
          }
        }
      });
    },
    //搜索刷新数据
    searchLoad(val){
      var params = new URLSearchParams();
      params.append('type', this.type);
      params.append('num', this.num);
      params.append('Where', this.Where);
      params.append('projecttype', this.projecttype);
      params.append('shopcarid', this.shopcarid);
      params.append('skipnum', this.skipnum);
      params.append('likeflag', this.likeflag);
      params.append('planuserid', this.planuserid);
      params.append('partakeuserid', this.partakeuserid);

      this.$axios({
        method: 'POST',
        url: this.api_8090 + '/View/GetFile.ashx',
        data: params,
        headers: {
          Authorization: this.Authorization,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          Accept: '*/*',
          'X-Requested-With': 'XMLHttpRequest'
        },
      }).then(res => {
        // console.log(res.data[1]);
        this.swiperContent.splice(0, this.swiperContent.length);
        let total = Math.ceil(res.data[0] / 8);
        this.allCount = res.data[0];
        this.pageTotal = total;
        for (let i = 0; i < total; i++) {
          this.swiperContent.push({list: []})
        }
        res.data[1].forEach((item, index, arr) => {
          if (arr[index].URLThumbnail == '') {
            arr[index].URLThumbnail = 'https://xilai99.com/image/logo2.png'
          } else {
            arr[index].URLThumbnail = this.getImgVideoUrl + arr[index].URLThumbnail
          }
          arr[index].isErrZiYuan = false;
        });
        console.log(val)
        // this.swiperContent[0] = {list: res.data[1]};
        this.swiperContent[val - 1] = {list: res.data[1]};
        this.$set(this.swiperContent, this.swiperContent[val - 1], {list: res.data[1]});
        this.msg++;
        this.getImgItemsFlag = true;
        this.loading = false;
      }, err => {
        console.log(err)
      })
    },
    //加载事件
    loadEvent() {
      let that = this;
      $('#search').click(function () {
        that.Where = 'filename@' + $('#inputText').val() + '!';
        that.oldLoadData=[1];
        that.searchLoad(parseInt(that.num));
      });
      $("#inputText").on("input", function (e) {
        //获取input输入的值
        if (e.delegateTarget.value == '') {
          that.Where = '';
          that.oldLoadData=[1];
          that.searchLoad(parseInt(that.num));
        }
      });

      $(document).keyup(function (event) {
        //阻止默认事件
        event.stopPropagation();
        event.cancelBubble = true;
        if (event.keyCode == 13) {
          that.Where = 'filename@' + $('#inputText').val() + '!';
          that.oldLoadData=[1];
          that.searchLoad(parseInt(that.num));
        }
      });
    },
    // 更多酒店查询回调函数
    moreHotel(id){
      console.log("进来了")
      this.Where = 'hotel_name@'+id+'!';
      this.num=1;
      this.loadStartData();
    }
  };
  export default {
    name: "carousel-view",
    inject: ['reload'],
    methods: myMethods,
    data() {
      return {
        isShowTips: true,
        getImgItemsFlag: false,
        isShowNoPic: false,
        imgBoxHeight: '',
        swiperContainerHeight: '',
        diaLogData: [],//打开弹框所传内容
        mySwiper: {},
        item: {},
        isESC: 0,//自定义按ESC时的状态值
        isType: 0,
        showDialogBox: false,
        showDiaLogPicVideoBox: false,
        loadingDialogViewBox: false,
        loading: true,//加载
        pageTotal: 0,//总页数
        allCount: 0,//总条数
        msg: 1,//自增刷新
        getImgVideoUrl: 'http://192.168.1.253:8095/',
        Authorization: localStorage.userinfo,
        // Authorization: 'http://211.149.163.185:8090/|1|22|xlhl|http://171.211.126.122:8091/|http://171.211.126.122:8092/|1,1|http://192.168.1.253:8095|https://xilai99.com',
        api: getkevalue().apiurl,
        // api: 'https://xilai99.com',
        api_8090: 'http://211.149.163.185:8090',//正式库用
        // api_8090: 'http://192.168.1.253:9527',//测试库用
        type: 4,//类型
        num: 1,//当前页
        Where: '',//搜索条件 如： 梦幻
        projecttype: '',
        shopcarid: '',
        skipnum: 8,//每页多少条
        likeflag: '',
        planuserid: '',
        partakeuserid: '',

        oldLoadData: [1],

        vediodata: [],
        imagedata: [],

        swiperContent: [
          {
            list: [
              {URLThumbnail: "../../../static/img/2.jpg", FILE_ID: "dfe7f21f-832e-4884-a9f5-287b562cf2a9-2"},
              {URLThumbnail: "../../../static/img/2.jpg", FILE_ID: "fe9067c4-3fdd-462b-b771-5b614092382e-2"},
              {URLThumbnail: "../../../static/img/2.jpg"},
              {URLThumbnail: "../../../static/img/2.jpg"},
              {URLThumbnail: "../../../static/img/2.jpg"},
              {URLThumbnail: "../../../static/img/2.jpg"},
              {URLThumbnail: "../../../static/img/2.jpg"},
              {URLThumbnail: "../../../static/img/2.jpg"}
            ]
          },
          {
            list: [
              // {title: '陈柯 徐文治 （白金设计感）. 20180526', imgUrl: '../../../static/img/1.jpg'},
              // {title: '陈柯 徐文治 （白金设计感）. 20180526', imgUrl: '../../../static/img/1.jpg'},
              // {title: '陈柯 徐文治 （白金设计感）. 20180526', imgUrl: '../../../static/img/1.jpg'},
              // {title: '陈柯 徐文治 （白金设计感）. 20180526', imgUrl: '../../../static/img/1.jpg'},
              // {title: '陈柯 徐文治 （白金设计感）. 20180526', imgUrl: '../../../static/img/1.jpg'},
              // {title: '陈柯 徐文治 （白金设计感）. 20180526', imgUrl: '../../../static/img/1.jpg'},
              // {title: '陈柯 徐文治 （白金设计感）. 20180526', imgUrl: '../../../static/img/1.jpg'},
              // {title: '陈柯 徐文治 （白金设计感）. 20180526', imgUrl: '../../../static/img/1.jpg'},
            ]
          },
          {
            list: [
              // {title: '陈柯 徐文治 （白金设计感）. 20180526', imgUrl: '../../../static/img/2.jpg'},
            ]
          },
        ],

      }
    },
    created() {
      window.moreHotel=this.moreHotel;//更多酒店
      var that = this;
      if (this.$route.query.id == undefined) {
        this.type = 4;//默认
      } else {
        this.type = this.$route.query.id;
      }

      this.windowResize();
      //初始化swiper
      this.$nextTick(function () {
        this.loadEvent();
        this._initSwiper();
        $('.bottomBorder').each(function (index, element) {
          $(element).hide();
          $(element).click(function () {
            $(this).show();

          })
        });
        if (that.type == 4) {
          $('.bottomBorder').eq(0).show();
          $('.menu-selection li').css({
            color: '#B8B0A2'
          });
          $('.bottomBorder').eq(0).parent().css({
            color: '#BB9860'
          })
        } else if (that.type == 6) {
          $('.bottomBorder').eq(2).show();
          $('.menu-selection li').css({
            color: '#B8B0A2'
          });
          $('.bottomBorder').eq(2).parent().css({
            color: '#BB9860'
          })
        } else if (that.type == 3) {
          $('.bottomBorder').eq(1).show();
          $('.menu-selection li').css({
            color: '#B8B0A2'
          });
          $('.bottomBorder').eq(1).parent().css({
            color: '#BB9860'
          })
        } else if (that.type == 2) {
          $('.bottomBorder').eq(3).show();
          $('.menu-selection li').css({
            color: '#B8B0A2'
          });
          $('.bottomBorder').eq(3).parent().css({
            color: '#BB9860'
          })
        }
        //加载首页数据
        this.loadStartData();
        let imgBoxWidth = $(this.$refs.imgBox).innerWidth();
        this.imgBoxHeight = imgBoxWidth / 1.75 + 'px';
      });

      //键盘事件
      this.keyUp();
    },

    mounted() {
      let windowHeight = $(window).height();
      let windowWidth = $(window).width();
      $('.el-main').css({
        paddingLeft: (windowWidth * 0.10) + 'px',
        paddingRight: (windowWidth * 0.10) + 'px',
      });
      $('.Header').css({
        paddingLeft: (windowWidth * 0.10) + 'px',
        paddingRight: (windowWidth * 0.10) + 'px',
      });
      setTimeout(() => {
        let ct_boxHeight = $('.ct_box').innerHeight();
        this.swiperContainerHeight = ct_boxHeight * 2 + windowHeight * 0.14 + 'px';
        let swiperContainerHeight = ct_boxHeight * 2 + windowHeight * 0.14;
        $('.el-main').css({
          paddingTop: (windowHeight - 100 - swiperContainerHeight) / 2 + 'px',
        });
        $('.swiper-button-next, .swiper-button-prev').css({
          top: (windowHeight - 60) / 2 + 'px',
        })
      }, 10)

    },
    components: {
      dialogView: dialogView,
      diaLogPicVideoView: diaLogPicVideoView,
      loadingDialogView: loadingDialogView
    },
    watch: {
      $route(to, from) {
        this.reload();//看不出的刷新页面  哈哈
      }
    },
  }
</script>

<style>


  /*修改加载图标*/
  #carousel-view .el-loading-spinner .path {
    display: none;
  }

  #carousel-view .el-loading-spinner {
    background: url("../../../static/img/loading.gif") no-repeat;
    background-size: 30px 30px;
    position: absolute;
    width: 30px;
    height: 30px;
    left: 50%;
    -webkit-transform: translateX(-50%);
    -moz-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    -o-transform: translateX(-50%);
    transform: translateX(-50%);
  }

  #carousel-view .swiper-slide {
    background: #fff;
    width: 100% !important;
  }

  #carousel-view .swiper-container {
    padding-bottom: 60px;
    box-sizing: border-box;

  }

  #carousel-view .box {
    width: 200px;
    height: 200px;
    float: left;
    margin-right: 10px;
  }

  #carousel-view .swiper-pagination-bullet {
    width: 25px;
    height: 25px;
    color: #969696;
    line-height: 25px;
    text-align: center;
    background: #fff;
    font-size: 14px;
    outline: none;
    opacity: 1;
  }

  #carousel-view .swiper-pagination-bullet:active {
    outline: none;
  }

  #carousel-view .swiper-pagination-bullets-dynamic {
    font-size: 14px;
  }

  #carousel-view .swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-prev,
  #carousel-view .swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-prev-prev,
  #carousel-view .swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-next,
  #carousel-view .swiper-pagination-bullets-dynamic .swiper-pagination-bullet-active-next-next {
    -webkit-transform: scale(1);
    -moz-transform: scale(1);
    -ms-transform: scale(1);
    -o-transform: scale(1);
    transform: scale(1);
  }

  #carousel-view .swiper-pagination-bullet-active {
    background: #BB9860;
    color: #fff;
  }

  #carousel-view .swiper-button-next, .swiper-button-prev {
    position: fixed;
    box-shadow: 0px 0px 6px 0px rgba(230, 230, 230, 1);
    width: 40px;
    height: 80px;
    outline: none;
  }

  #carousel-view .swiper-button-next:active, .swiper-button-prev:active {
    outline: none;
  }

  #carousel-view .swiper-button-next {
    background: url("../../../static/img/nexticon_yes.png") no-repeat center center;
    right: 0;
  }

  #carousel-view .swiper-button-prev {
    background: url("../../../static/img/previcon_yes.png") no-repeat center center;
    left: 0;
  }

  #carousel-view .swiper-button-next.swiper-button-disabled, .swiper-button-prev.swiper-button-disabled {
    opacity: 1;
  }

  #carousel-view .swiper-button-next.swiper-button-disabled {
    background: url("../../../static/img/nexticon_no.png") no-repeat center center;
    outline: none;
  }

  #carousel-view .swiper-button-prev.swiper-button-disabled {
    background: url("../../../static/img/pervicon_no.png") no-repeat center center;
    outline: none;
  }

  #carousel-view .swiper-button-next:hover, .swiper-button-prev:hover {
    opacity: .8;
  }

  /*内容区*/
  .ct_box {
    width: 100%;
    padding: 15px 15px 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    cursor: pointer;
    transition: all .3s;
    margin: 0 auto 20px;
    overflow: hidden;
  }

  .ct_box:hover {
    box-shadow: 0px 0px 10px 0px rgba(176, 159, 131, 0.26);
    background-color: #fff;
  }

  .ct_box:hover .icon {
    background: url("../../../static/img/icon1.png");
    background-size: 100% 100%;
  }

  .ct_box:hover .ct_title {
    color: #BB9860;
  }

  .ct_box:hover .img_shadow {
    height: 100%;
  }

  .wdz_ct_box:hover {
    box-shadow: none;
  }

  .img_box {
    width: 100%;
    height: 260px;
    position: relative;
    -webkit-background-size: cover !important;
    background-size: cover !important;
  }

  .bacStyle {
    background-size: 100% 100% !important;
  }

  .img_box img {
    width: 100%;
    height: 100%;
  }

  .icon {
    display: inline-block;
    width: 14px;
    height: 14px;
    vertical-align: middle;
    margin-top: -4px;
    margin-right: 8px;
    background: url("../../../static/img/icon0.png");
    transition: all .2s;
    background-size: 100% 100%;
  }

  .ct_title {
    color: #B2B2B2;
    font-size: 14px;
    height: 54px;
    line-height: 54px;
    transition: all .2s;
  }

  .img_shadow {
    position: absolute;
    width: 100%;
    height: 0;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, .3);
    overflow: hidden;
    transition: all .4s;
  }

  .img_shadow_inner {
    text-align: center;
    color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .img_shadow_inner p:nth-of-type(1) {
    font-size: 22px;
  }

  .img_shadow_inner p:nth-of-type(2) {
    width: 150px;
    height: 1px;
    background: rgba(255, 255, 255, 1);
    opacity: 0.3;
    margin: 20px auto;
  }

  .img_shadow_inner p:nth-of-type(3) {
    font-size: 16px;
  }

  @media screen and (min-width: 1500px) {
    #carousel-view .swiper-container {
      padding-bottom: 70px;
    }

    /*#carousel-view .swiper-button-next, .swiper-button-prev {*/
    /*top: 48%;*/
    /*}*/
  }

  @media screen and (max-width: 1600px) {
    .ct_title {
      font-size: 12px;
    }
  }

  @media screen and (max-width: 1680px) {
    .ct_title {
      font-size: 12px;
    }
  }

  @media (max-width: 1366px) {

    #carousel-view .swiper-container {
      padding-bottom: 45px;
    }
  }

  @media screen and (max-width: 1024px) {
    /*#carousel-view .swiper-button-next, .swiper-button-prev {*/
    /*top: 23%;*/
    /*}*/
  }

</style>
