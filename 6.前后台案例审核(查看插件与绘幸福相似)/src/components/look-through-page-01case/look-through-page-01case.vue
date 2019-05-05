<template>
  <div id="look-through-page-01case">
    <img src="http://192.168.1.253:9527/common/images/home_logo.png" style="display: none;" @error="changeGetPicUrl">
    <div class="model" v-loading="loadding" v-if="loadding"
         :class="{'model-white':urlAddress=='white','model-black':urlAddress=='black'}"></div>
    <!--搜索栏-->
    <searchHeader ref="searchHeader" @fastSelect="fastSelect" @btnEvent="btnEvent"
                  @getStartTime="getStartTime" @getEndTime="getEndTime"
                  @getSelectZT="getSelectZT" @getSelectBranch="getSelectBranch"></searchHeader>
    <!--列表处-->
    <div class="case-list" :class="{'case-list-white':urlAddress=='white','case-list-black':urlAddress=='black'}">
      <!--案例审核列表-->
      <ul class="casePass clearfloat" v-show="showType==1">
        <template v-for="(items,index) in listData01">
          <li>
            <div class="case-list-content-top">
              <div class="img-box" @click="toLookVideoPic(items)" title="点击查看图片或视频"
                   :style="'background: url('+items.FMImg_YST+') no-repeat center center;'">
                <img :src="items.FMImg_YST"
                     @error="getImgItems($event,items)" v-show="isShowNoPic" style="width: 100%;height: 100%;">
              </div>
              <h2 v-text="items.OrderTitle"></h2>
              <img src="../../../static/img/tongGuo.png" class="tip-icon" v-if="items.FileState=='3'"><!--通过-->
              <img src="../../../static/img/daiShenHe.png" class="tip-icon" v-if="items.FileState=='1'"><!--待审核-->
              <img src="../../../static/img/tuiHui.png" class="tip-icon" v-if="items.FileState=='2'"><!--退回-->
            </div>
            <div class="case-list-content-bottom">
              <dl>
                <dd>
                  <span>图片数量：</span>
                  <span v-text="items.ImgSum"></span>
                </dd>
                <dd>
                  <span>视频大小：</span>
                  <span>{{items.VideoSize}}M</span>
                </dd>
                <dd>
                  <span>场布金额：</span>
                  <span>{{items.CBJE}}元</span>
                </dd>
                <dd>
                  <span>上传者：</span>
                  <span v-text="items.AddUserName"></span>
                </dd>
                <dd>
                  <span>操作：</span>
                  <span @click="lookOrder(items)">查看订单</span>
                  <span @click="toLookThrough(items)" v-if="items.FileState=='1'&&isPowerType">审核</span>
                  <span v-if="items.FileState=='2'||items.FileState=='3'"
                        @click="toLookThroughRemark(items)">审核说明</span>
                </dd>
              </dl>
            </div>
          </li>
        </template>
      </ul>

      <!--作品审核列表-->
      <ul class="worksPass clearfloat" v-show="showType==2">
        <template v-for="(items,index) in listData02">
          <li>
            <div class="case-list-content-top" @click="toLookVideoPic(items)">
              <div class="img-box"
                   :style="'background: url('+items.FMImg_YST+') no-repeat;'"></div>
              <h2>成都华尔道夫酒店.杨居潼杨居潼杨居潼杨居潼杨居潼 </h2>
            </div>
            <div class="case-list-content-bottom">
              <dl>
                <dd>
                  <span>本店评分：</span>
                  <span v-text="items.benDianPingFen"></span>
                </dd>
                <dd>
                  <span>评分店铺：</span>
                  <span v-text="items.pingFenDianPu"></span>
                </dd>
                <dd>
                  <span>操作：</span>
                  <span>查看订单</span>
                  <span>作品评分</span>
                </dd>
              </dl>
            </div>
          </li>
        </template>
      </ul>
    </div>
    <!--资料详情-->
    <dialogView :showDialogBox="showDialogBox" @closeTip="closeTip" @getResource="getResource"
                @closeBigPic="closeBigPic" ref="dialogView"></dialogView>

    <!--审核弹框-->
    <lookThroughDialogView :showLookThroughDialogViewBox="showLookThroughDialogViewBox"
                           @closeTip="closeTip" ref="lookThroughDialogView"
                           @updateData="updateData"></lookThroughDialogView>
    <!--审核说明弹框-->
    <noOrYesPassDialogView :noOrYesPassDialogViewBox="noOrYesPassDialogViewBox"
                           @closeTip="closeTip" ref="noOrYesPassDialogView"></noOrYesPassDialogView>

    <!--更新资源显示进度-->
    <loadingDialogView :loadingDialogViewBox="loadingDialogViewBox"></loadingDialogView>

  </div>
</template>

<script>
  import searchHeader from '../search-header/search-header'
  import dialogView from '../dialog-view/dialog-view'
  import lookThroughDialogView from '../look-through-dialog-view/look-through-dialog-view'
  import noOrYesPassDialogView from '../noOrYes-pass-dialog-view/noOrYes-pass-dialog-view'

  import loadingDialogView from '../loading-dialog-view/loading-dialog-view'

  let myData = {
    isPowerType: true,//是否有权限审核 true 有  false  没有
    loadding: false,
    flag: true,//节流开关
    showDialogBox: false,
    urlAddress: '',
    showType: 1,//当前路由状态
    //列表数据
    listData01: [
      // {
      //   imgUrl: './static/img/1.jpg',
      //   title: '成都华尔道夫酒店.杨居潼杨居潼杨居潼杨居潼杨居潼',
      //   imgNum: '23',
      //   videoSum: '14.23M',
      //   price: '56789',
      //   people: '成都店-成都邬博文（2018-03-24）',
      // }, {
      //   imgUrl: './static/img/2.jpg',
      //   title: '成都华尔道夫酒店.杨居潼杨居潼杨居潼杨居潼杨居潼',
      //   imgNum: '23',
      //   videoSum: '14.23M',
      //   price: '56789',
      //   people: '成都店-成都邬博文（2018-03-24）',
      // }, {
      //   imgUrl: './static/img/1.jpg',
      //   title: '成都华尔道夫酒店.杨居潼杨居潼杨居潼杨居潼杨居潼',
      //   imgNum: '23',
      //   videoSum: '14.23M',
      //   price: '56789',
      //   people: '成都店-成都邬博文（2018-03-24）',
      // }, {
      //   imgUrl: './static/img/2.jpg',
      //   title: '成都华尔道夫酒店.杨居潼杨居潼杨居潼杨居潼杨居潼',
      //   imgNum: '23',
      //   videoSum: '14.23M',
      //   price: '56789',
      //   people: '成都店-成都邬博文（2018-03-24）',
      // }, {
      //   imgUrl: './static/img/1.jpg',
      //   title: '成都华尔道夫酒店.杨居潼杨居潼杨居潼杨居潼杨居潼',
      //   imgNum: '23',
      //   videoSum: '14.23M',
      //   price: '56789',
      //   people: '成都店-成都邬博文（2018-03-24）',
      // }, {
      //   imgUrl: './static/img/1.jpg',
      //   title: '成都华尔道夫酒店.杨居潼杨居潼杨居潼杨居潼杨居潼',
      //   imgNum: '23',
      //   videoSum: '14.23M',
      //   price: '56789',
      //   people: '成都店-成都邬博文（2018-03-24）',
      // }, {
      //   imgUrl: './static/img/1.jpg',
      //   title: '成都华尔道夫酒店.杨居潼杨居潼杨居潼杨居潼杨居潼',
      //   imgNum: '23',
      //   videoSum: '14.23M',
      //   price: '56789',
      //   people: '成都店-成都邬博文（2018-03-24）',
      // }, {
      //   imgUrl: './static/img/1.jpg',
      //   title: '成都华尔道夫酒店.杨居潼杨居潼杨居潼杨居潼杨居潼',
      //   imgNum: '23',
      //   videoSum: '14.23M',
      //   price: '56789',
      //   people: '成都店-成都邬博文（2018-03-24）',
      // }, {
      //   imgUrl: './static/img/1.jpg',
      //   title: '成都华尔道夫酒店.杨居潼杨居潼杨居潼杨居潼杨居潼',
      //   imgNum: '23',
      //   videoSum: '14.23M',
      //   price: '56789',
      //   people: '成都店-成都邬博文（2018-03-24）',
      // }, {
      //   imgUrl: './static/img/1.jpg',
      //   title: '成都华尔道夫酒店.杨居潼杨居潼杨居潼杨居潼杨居潼',
      //   imgNum: '23',
      //   videoSum: '14.23M',
      //   price: '56789',
      //   people: '成都店-成都邬博文（2018-03-24）',
      // }, {
      //   imgUrl: './static/img/1.jpg',
      //   title: '成都华尔道夫酒店.杨居潼杨居潼杨居潼杨居潼杨居潼',
      //   imgNum: '23',
      //   videoSum: '14.23M',
      //   price: '56789',
      //   people: '成都店-成都邬博文（2018-03-24）',
      // },
    ],
    listData02: [
      {
        imgUrl: './static/img/2.jpg',
        title: '成都华尔道夫酒店.杨居潼杨居潼杨居潼杨居潼杨居潼',
        benDianPingFen: '8.9',
        pingFenDianPu: '成都店',
      }, {
        imgUrl: './static/img/1.jpg',
        title: '成都华尔道夫酒店.杨居潼杨居潼杨居潼杨居潼杨居潼',
        benDianPingFen: '8.9',
        pingFenDianPu: '成都店',
      }, {
        imgUrl: './static/img/2.jpg',
        title: '成都华尔道夫酒店.杨居潼杨居潼杨居潼杨居潼杨居潼',
        benDianPingFen: '8.9',
        pingFenDianPu: '成都店',
      },
    ],
    isESC: 0,

    showLookThroughDialogViewBox: false,
    noOrYesPassDialogViewBox: false,
    loadingDialogViewBox: false,

    isShowNoPic: false,

    itemsData: {},//保存页面初始数据

    itemsObj: {},
    imgData: [],
    videoData: [],

    /*加载数据请求信息*/
    getImgVideoUrl: 'http://192.168.1.253:8095/',
    api: getkevalue().apiurl,
    Authorization: localStorage.userinfo,
    // Authorization: 'http://211.149.163.185:8090/|1|22|xlhl|http://171.211.126.122:8091/|http://171.211.126.122:8092/|1,1|http://192.168.1.253:8095|https://xilai99.com',
    UserId: getkevalue().userid,	//是	int	当前用户id
    StartDate: '',	//是	string	查询开始时间 yyyy-MM-dd 2019-03-01
    EndDate: '',	//是	string	查询结束时间 yyyy-MM-dd 2019-03-31
    SearchBranchId: '',	//	是	int	查询店铺id
    SearchState: 0,	//是	int	查询状态 0全部 1等待审核 2退回 3通过
    SearchType: 1,	//	是	int	1查询当前员工提交的案例

    // orderUrl: 'http://211.149.163.185:8090',//正式库
    orderUrl: 'http://192.168.1.253:9527',//测试库
    banBen: Math.random(),
  };
  let myMethods = {
    changeGetPicUrl() {
      var ImgObj = new Image();
      ImgObj.src = 'http://192.168.1.253:9527/common/images/home_logo.png';
      if (ImgObj.width > 0 && ImgObj.height > 0) {
        this.getImgVideoUrl = 'http://192.168.1.253:8095/'
      } else {
        this.getImgVideoUrl = Cosip;
      }
    },
    //隐藏加载图标
    hideLoading() {
      window.parent.document.getElementsByClassName("load_img_show")[0].style.display = "none";//onload_img
    },
    //查看订单
    lookOrder(itemObj) {
      let url = this.orderUrl + '/View/Order_N/Index_New.aspx?coustomertype=1&orderID=' + itemObj.OrderId + '&CUSTOMER_ID=' + itemObj.CUSTOMER_ID + '&type=all&power=edit' + '&no=' + this.banBen;
      let $width = window.screen.width * 0.75;
      let $height = window.screen.height * 0.75;
      let $left = (window.screen.width * 0.25) / 2;
      let $top = (window.screen.height * 0.25) / 2;
      var myWindow = window.open(url, "", "width=" + $width + ",height=" + $height + ",left=" + $left + ",top=" + $top + ",toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
      myWindow.focus();
    },
    //报错图片重新显示
    getImgItems(e, itemsObj) {
      $(e.target).show();
      $(e.target).attr('src', 'http://211.149.163.185:8090/Images/View/newimage/nophoto2.png');
      itemsObj.isZiYuanError = true;
      itemsObj.FMImg_YST = Cosip + itemsObj.FMImg_YST.split('8095/')[1];
      if (itemsObj.imgList != 0) {
        itemsObj.imgList.forEach((item, index, arr) => {
          arr[index].URLOriginal = Cosip + arr[index].URLOriginal.split('8095/')[1];
          arr[index].URLThumbnail = Cosip + arr[index].URLThumbnail.split('8095/')[1];
        })
      }
      if (itemsObj.videoList != 0) {
        itemsObj.videoList.forEach((item, index, arr) => {
          arr[index].URLOriginal = Cosip + arr[index].URLOriginal.split('8095/')[1];
        })
      }
    },
    //更新视频或图片资源
    getResource(type) {
      // this.selfGetResources(val);
      if (type == 'video') {
        this.videoData.forEach((item, index, arr) => {
          arr[index].file = Cosip + arr[index].file.split('8095/')[1];
          // if (arr[index].file.split('8095/')[1]==undefined){
          //   alert('请在腾讯云上确认资源是否有效！')
          // }
        });
        this.$refs.dialogView.fn_img_video(this.itemsObj, this.imgData, this.videoData);
      }
    },
    //手动下载资源
    selfGetResources(fileId) {
      this.loadingDialogViewBox = true;
      let url = this.api + '/xlapi/Progect/T_PUB_FILE/T_PUB_FILE/getresourcebyfileid?no=' + this.banBen;
      let data = {
        fid: fileId
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
            duration: 2000,
          });
          this.listData01.splice(0, 1);
          this.loadStartData();//更新页面数据
        }
      }, err => {
      })
    },

    //更新数据
    updateData() {
      this.loadStartData();
    },
    //点击查询
    btnEvent() {
      if (this.showType == 1) {
        if (this.flag) {
          this.flag = false;
          this.loadStartData();
        }
      } else {

      }

    },
    //关闭大图时候
    closeBigPic() {
      this.isESC = 1;
    },
    //键盘事件
    keyUp() {
      let that = this;
      $(document).keyup(function (event) {
        switch (event.keyCode) {
          case 27:
            let obj = that.$refs.dialogView.getType();
            if (obj.playType == 1 && obj.ImageType == '2') {
              if (that.isESC == 1) {
                that.showDialogBox = false;
              }
              that.isESC = 1;
            } else if (obj.playType == 1 && obj.ImageType == '1') {
              that.showDialogBox = false;
            } else if (obj.playType == 2 && obj.ImageType == '1') {
              if (that.isESC == 1) {
                that.showDialogBox = false;
              }
              that.isESC = 1;
            } else if (obj.playType == 2 && obj.ImageType != '1') {
              that.showDialogBox = false;
            }
          case 13:
            if (that.flag) {
              that.flag = false;
              that.loadStartData();
            }
        }
      });
    },
    //状态选择
    getSelectZT(val) {
      this.flag = true;
      this.SearchState = val;
    },
    //店铺选择
    getSelectBranch(val) {
      this.flag = true;
      if (val == -1) {
        this.SearchBranchId = '';
      } else {
        this.SearchBranchId = val;
      }
    },

    //获取更改的开始时间
    getStartTime(val) {
      this.flag = true;
      this.StartDate = val;
    },
    //获取更改的结束时间
    getEndTime(val) {
      this.flag = true;
      this.EndDate = val;
    },
    //快捷选择搜索
    fastSelect(val) {
      this.flag = true;
      if (val == 'J1Z') {
        this.$refs.searchHeader.updateTime(this.getTime(7));
        this.StartDate = this.getTime(7).startTime;
        this.EndDate = this.getTime(7).endTime;
        this.loadStartData();
      } else if (val == 'J1Y') {
        this.$refs.searchHeader.updateTime(this.getTime(30));
        this.StartDate = this.getTime(30).startTime;
        this.EndDate = this.getTime(30).endTime;
        this.loadStartData();
      } else if (val == 'J3Y') {
        this.$refs.searchHeader.updateTime(this.getTime(90));
        this.StartDate = this.getTime(90).startTime;
        this.EndDate = this.getTime(90).endTime;
        this.loadStartData();
      }
    },
    //调用子组件更新时间段
    updateTime(obj) {/*obj*/
      this.$refs.searchHeader.updateTime(obj)
    },
    //关闭弹框
    closeTip() {
      this.showDialogBox = false;
      this.showLookThroughDialogViewBox = false;
      this.noOrYesPassDialogViewBox = false;
    },
    //加载初始页面数据
    loadStartData() {
      this.loadding = true;
      let url = this.api + '/xlapi/ZiLiao/ZiLiaoShengHe/ZiLiaoShengHe/GetShengHeAnLi?no=' + this.banBen;
      var data;
      if (this.urlAddress == 'black') {
        data = {
          UserId: this.UserId,
          StartDate: this.StartDate,
          EndDate: this.EndDate,
          SearchBranchId: this.SearchBranchId,
          SearchState: this.SearchState,
          SearchType: this.SearchType,
        }
      } else if (this.urlAddress == 'white') {
        data = {
          UserId: this.UserId,
          StartDate: this.StartDate,
          EndDate: this.EndDate,
          SearchBranchId: this.SearchBranchId,
          SearchState: this.SearchState,
        }
      }

      this.$axios({
        method: 'POST',
        data: data,
        url: url,
        headers: {
          Authorization: this.Authorization
        }
      }).then(res => {
        this.loadding = false;
        if (this.urlAddress == 'white') {
          this.hideLoading();
        }
        res.data.data.forEach((item, index, arr) => {
          arr[index].isZiYuanError = false;
          if (arr[index].FMImg_YST == "") {
            arr[index].FMImg_YST = "https://xilai99.com/image/logo2.png";
          } else {
            arr[index].FMImg_YST = this.getImgVideoUrl + arr[index].FMImg_YST;
          }
          if (arr[index].imgList.length != 0) {
            arr[index].imgList.forEach((item, index, arr) => {
              arr[index].URLOriginal = this.getImgVideoUrl + arr[index].URLOriginal;
              arr[index].URLThumbnail = this.getImgVideoUrl + arr[index].URLThumbnail;
            });
          }
          if (arr[index].videoList.length != 0) {
            arr[index].videoList.forEach((item, index, arr) => {
              arr[index].URLOriginal = this.getImgVideoUrl + arr[index].URLOriginal;
            });
          }
        });

        this.listData01 = res.data.data;
        this.itemsData = res.data.data;
      })

    },
    //点击进入图片、视频弹框
    toLookVideoPic(itemsObj) {
      // if (!itemsObj.isZiYuanError) {
      //   this.showDialogBox = true;
      //   this.isESC = 0;
      //   this.loadPictures(itemsObj);
      // } else {
      //   //更新资源
      //   this.getResource(itemsObj.FileId);
      // }
      this.showDialogBox = true;
      this.isESC = 0;
      this.loadPictures(itemsObj);
    },
    //获取图片数据
    loadPictures(itemsObj) {
      let imgData = [
        // {image:'',thumb:''}
      ];
      if (itemsObj.imgList.length != 0) {
        itemsObj.imgList.forEach((item, index, arr) => {
          arr[index].image = arr[index].URLOriginal;
          arr[index].thumb = arr[index].URLThumbnail;
        });
      }
      imgData = itemsObj.imgList;
      this.loadVideos(itemsObj, imgData);
    },
    //获取视频数据
    loadVideos(itemsObj, imgData) {

      let videoData = [
        // {
        //   file: this.getImgVideoUrl + "v1/a3495fb7-9951-47bc-acab-3730326e8718/48562f3a-8e6d-4baf-ba31-5930ad423e78.mp4",
        //   default: false,
        //   title: '11111'
        // }, {
        //   file: this.getImgVideoUrl + "v1/a3495fb7-9951-47bc-acab-3730326e8718/48562f3a-8e6d-4baf-ba31-5930ad423e78.mp4",
        //   default: false,
        //   title: '22222'
        // },
      ];
      if (itemsObj.videoList.length != 0) {
        itemsObj.videoList.forEach((item, index, arr) => {
          arr[index].file = arr[index].URLOriginal;
          arr[index].default = false;
          arr[index].title = arr[index].Title;
        });
      }
      videoData = itemsObj.videoList;
      this.itemsObj = itemsObj;
      this.imgData = imgData;
      this.videoData = videoData;
      this.$refs.dialogView.fn_img_video(itemsObj, imgData, videoData);
    },

    //进入审核详情
    toLookThrough(items) {
      this.showLookThroughDialogViewBox = true;
      this.$refs.lookThroughDialogView.getLookThrough(items);
    },

    //查看审核说明
    toLookThroughRemark(items) {
      this.noOrYesPassDialogViewBox = true;
      this.$refs.noOrYesPassDialogView.getIsPassRemark(items)
    },
    // 判断是否有审核权限
    isPower() {
      let url = this.api + '/xlapi/ZiLiao/ZiLiaoShengHe/ZiLiaoShengHe/GetNeedShengHeAnLiState?no=' + this.banBen;
      let data = {
        UserId: getkevalue().userid,
        BranchId: getkevalue().branchid
      };
      this.$axios({
        method: 'POST',
        url: url,
        data: data,
      }).then(res => {
        if (res.data.fileStatus == 1) {
          this.isPowerType = true;
        } else {
          this.isPowerType = false;
        }
      })
    }
  };
  export default {
    name: "look-through-page-01case",
    inject: ['reload'],
    data() {
      return myData;
    },
    methods: myMethods,
    created() {
      this.changeGetPicUrl();//判断是否外网，用192的某张图片模拟
      this.urlAddress = this.getUrlStyle();
      this.keyUp();
      this.isPower();
      this.$nextTick(() => {
        this.showType = this.$route.query.id;
        this.StartDate = this.getTime(30).startTime;
        this.EndDate = this.getTime(30).endTime;
        setTimeout(() => {
          this.loadStartData();
        });
        this.updateTime(this.getTime(30));
      })

    },
    components: {
      searchHeader: searchHeader,
      dialogView: dialogView,
      lookThroughDialogView: lookThroughDialogView,
      noOrYesPassDialogView: noOrYesPassDialogView,
      loadingDialogView: loadingDialogView,
    },
    watch: {
      $route(to, from) {
        this.SearchBranchId = '';
        this.SearchState = 0;
        this.StartDate = this.getTime(30).startTime;
        this.EndDate = this.getTime(30).endTime;
        this.$refs.searchHeader.updateIiIndex();
        this.reload();//看不出的刷新页面  哈哈
      }
    },
  }
</script>

<style scoped>
  /*修改加载图标*/
  >>> .el-loading-spinner .path {
    display: none;
  }

  >>> .el-loading-spinner {
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

  .model-white >>> .el-loading-mask {
    background-color: rgba(255, 255, 255, 0.5);
  }

  .model-black >>> .el-loading-mask {
    background-color: rgba(180, 180, 180, 0.5);
  }

  .case-list {
    position: absolute;
    top: 130px;
    bottom: 0;
    left: 0;
    overflow: auto;
    padding: 20px;

  }

  .case-list-black {
    /*padding: 20px 0 20px 50px;*/
  }

  .case-list::-webkit-scrollbar {
    width: 3px;
    height: 4px;
    background: #E6E6E6;
    -webkit-border-radius: 1px;
    -moz-border-radius: 1px;
    border-radius: 1px;
  }

  .case-list::-webkit-scrollbar-thumb {
    background-color: #BB9860;
    height: 3px;
    width: 3px;
    -webkit-border-radius: 1px;
    -moz-border-radius: 1px;
    border-radius: 1px;
  }

  .case-list > ul > li {
    width: 280px;
    height: 346px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 0 9px 0 rgba(0, 0, 0, 0.14);
    border-radius: 5px;
    float: left;
    margin-right: 20px;
    margin-bottom: 16px;
    padding: 15px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .case-list > ul.worksPass > li {
    height: 300px;
  }

  .case-list-content-top {
    position: relative;
    overflow: hidden;
    border-radius: 5px;
    cursor: pointer;
  }

  .case-list-content-top .img-box {
    height: 150px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    position: relative;
    overflow: hidden;
    background-size: cover !important;
  }

  .case-list-content-top h2 {
    font-size: 15px;
    font-weight: 400;
    margin: 15px 0 10px;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .case-list-white ul > li {
    background: #fff;
    transition: all .2s;
  }

  .case-list-white ul > li:hover {
    background: #F6F6F6;
  }

  .case-list-white h2 {
    color: #000;
  }

  .case-list-black ul > li {
    background: rgba(0, 0, 0, .2);
    transition: all .2s;
  }

  .case-list-black ul > li:hover {
    background: rgba(0, 0, 0, .4);
  }

  .case-list-black h2 {
    color: #ccc;
  }

  .case-list-content-bottom {
    font-size: 13px;
  }

  .case-list-content-bottom dl > dd {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 24px;
  }

  .case-list-content-bottom dl > dd:last-child span {
    margin-right: 10px;
    cursor: pointer;
    transition: all .2s;
  }

  .case-list-content-bottom dl > dd:last-child span:first-child {
    margin-right: 0;
    cursor: default;
  }

  .case-list-content-bottom dl > dd:last-child span:nth-child(2):hover,
  .case-list-content-bottom dl > dd:last-child span:nth-child(3):hover {
    color: #BB9860;
    text-decoration: underline;
  }

  .case-list-white .case-list-content-bottom dl > dd span:nth-of-type(1) {
    color: #808080;
  }

  .case-list-white .case-list-content-bottom dl > dd span:nth-of-type(2) {
    color: #4C4C4C;
  }

  .case-list-white .case-list-content-bottom dl > dd span:nth-of-type(3) {
    color: #4C4C4C;
  }

  .case-list-black .case-list-content-bottom dl > dd span:nth-of-type(1) {
    color: #808080;
  }

  .case-list-black .case-list-content-bottom dl > dd span:nth-of-type(2) {
    color: #ccc;
  }

  .case-list-black .case-list-content-bottom dl > dd span:nth-of-type(3) {
    color: #ccc;
  }

  .tip-icon {
    position: absolute;
    top: 0;
    left: 0;
  }

  .model {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 99999999999999999;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

</style>
