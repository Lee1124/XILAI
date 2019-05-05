  //身份验证
var app = getApp();
var txsing;
var Bucket = 'temp-1256392453';//存储桶 temp-1256392453
var Region = 'ap-chengdu';
var protocol = 'https:';
var prefix = protocol + '//' + Bucket + '.cos.' + Region + '.myqcloud.com/';
// var returnval = "http://localhost:5080/|1|1|xlhl|http://localhost:5819/|http://171.211.126.122:8092/|3,1|3,1|http://localhost:8088";//请求头
var returnval = "http://localhost:5080/|1|1|xlhl|http://localhost:5819/|http://171.211.126.122:8092/|3,1|3,1|https://xilai99.com/";//请求头
function authentication(){
  wx.request({
    url: app.globalData.url + '/xlapi/Authentication/AppletUser/Authentication/OpenIdVerify',
    method: 'POST',
    data: { openId: app.globalData.openid },
    success: function (res) {
      // 处理黑名单用户的跳转
      if (res.data.status == "OK" && res.data.ishmd) {
        wx.redirectTo({
          url: "/pages/Blacklist/Blacklist"
        })
        return false;
      }
      // 是否是-预约成功的游客
      if (res.data.status == "OK" && res.data.yymodel.status) {
        app.globalData.isYuYueOk = true;
        var data_ = res.data.yymodel.branchdata;
        app.globalData.dianpuName = data_.name;
        app.globalData.dianpuPhone = data_.tel;
        app.globalData.youkeName = res.data.yymodel.userda;
        wx.redirectTo({
          url: '/pages/Login/Login'
        })
        return false;
      }
      
      if (res.data.code == '0') {
        app.globalData.skip=true;
        //redirectTo
        wx.redirectTo({
          url: '/pages/Login/Login'
        })
      }
    }
  })
}

function getUserInfo(e,that) {
  console.log("执行commin.js/getUserInfo");
  if (e.detail.errMsg == 'getUserInfo:fail auth deny') {
    return false
  } else {
    that.setData({
      userToggle: false
    })
  }
  app.globalData.userInfo = e.detail.userInfo
  //判断用户是否存在
  app.userIsGet(app.globalData.openid);
  // wx.login({
  //   success: res => {
  //     wx.request({
  //       url: app.globalData.url + '/xlapi/Mini/Ins/Anli/GetOpenID?loginCode=' + res.code,
  //       method: "GET",
  //       success: function (res) {
  //         var openid = JSON.parse(res.data).openid;
  //         app.globalData.openid = openid//用户openid

  //       }
  //     })
  //   }
  //})
}
 //删除当前图片
function img_del(e, img,isf) {
  var that = this
  var id = e;
  var data = { id: id, Tid: this.alid };
    delObject(img, false, function (res) {
      if(isf)
      {
        if (res == "1001" || res == 1001) {
          wx.request({
            url: app.globalData.url + "/xlapi/Mini/Ins/Img/DelImg",
            method: 'POST',
            data: data,
            success: function (res) {
              console.log("OK");
            }
          })
        }
      }
      
    })
}
function delObject(key, isImg, callback) {
  var img = key.split("?")[0].split('com')[1].substring(1)
  var url = prefix + img;
  console.log(img)
  GetTxsing("/" + img, "DELETE", false)//获取当前文件签名
  wx.request({
    url: url,
    method:'DELETE',
    header: { 'Authorization': txsing},
    success:function(xhr){
      if (xhr.status === 200 || xhr.status === 204) {
        callback(1001)
      } else {
        callback(1002)
      }
    }
  })


  // var xhr = new XMLHttpRequest();
  // xhr.open('DELETE', url, true);
  // xhr.setRequestHeader('Authorization', txsing);
  // xhr.onload = function () {
  //   if (xhr.status === 200 || xhr.status === 204) {
  //     callback(1001)
  //   } else {
  //     callback(1002)
  //   }
  // }
  // xhr.send()
}
function GetTxsing(key, strModel, isbool) {//获取签名
  // 请求用到的参数
  var url = app.globalData.url+"/xlapi/Login/Login/User/gettxkey?strModel=" + strModel + "&pathname=" + key + "&qheaderlist=&qurlparamlist=&strtime="

  wx.request({
    url: url,
    method:'GET',
    header: { 'Authorization': returnval},
    success:function(data){
      txsing = data.data;
    }
  })
}

module.exports.authentication = authentication

module.exports.getUserInfo = getUserInfo

module.exports.img_del = img_del

