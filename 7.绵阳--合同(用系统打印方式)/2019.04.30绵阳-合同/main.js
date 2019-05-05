var server = ""//服务端地址
//crthuhuhiuhjkhjkhljjj
var Cosip = "https://xlfile-1256392453.file.myqcloud.com/";
var Cosip2 = "https://temp-1256392453.cos.ap-chengdu.myqcloud.com/";
function getkevalue() {
    // var returnval = window.localStorage.userinfo;
    // var returnval = jsaction.getkeyvalue(); //本地代码获取基础数据  地址|用户id|用户店ID|key

    //var returnval = "http://localhost:5080/|2222|2|xlhl|http://localhost:5819/|http://171.211.126.122:8092/|1|http://192.168.1.253:8095|http://localhost:8088"; //cr专用
//    var returnval = "http://localhost:5080/|1|2|xlhl|http://localhost:5819/|http://171.211.126.122:8092/|1|http://192.168.1.253:8095|https://xilai99.com"; //xl专用
//     var returnval = "http://localhost:5080/|1|2|xlhl|http://localhost:5819/|http://171.211.126.122:8092/|1|http://192.168.1.253:8095|http://192.168.1.112:8088"; //xl专用
    var returnval = "http://localhost:5080/|1|2|xlhl|http://localhost:5819/|http://171.211.126.122:8092/|1|http://192.168.1.253:8095|http://192.168.1.253:8092"; //xl专用
//     var returnval = "http://localhost:5080/|1|32|xlhl|http://localhost:5819/|http://171.211.126.122:8092/|1|http://192.168.1.253:8095|https://xilai99.com"; //xl专用

   window.localStorage.userinfo=returnval;
   // var returnval = "http://localhost:5080/|1|8|xlhl|http://localhost:5819/|http://171.211.126.122:8092/|1|http://192.168.1.253:8095|http://localhost:8088"; //cr专用
    
    var vararry = returnval.split("|");
    var keyobj = new Object();
    keyobj.url = vararry[0];//处理服务器ip   211.
    keyobj.userid = vararry[1];
    keyobj.branchid = vararry[2];
    keyobj.key = vararry[3];
    keyobj.brinchip = vararry[4];//文件上传处理 171 
    keyobj.branchshowip = vararry[5]; //文件展示ip
    keyobj.rolestate = vararry[6]; // 0 本店管理 1 管理员 10以上部门id
    keyobj.loackshowip = vararry[7];
    keyobj.apiurl = vararry[8];//处理服务器ip   211.
    return keyobj;
}
(function ($) {
    //var returnval = "http://localhost:5080/|1|2|xlhl|http://localhost:5819/|http://171.211.126.122:8092/|3,1|3,1|http://localhost:8088";
    //var returnval = "http://localhost:5080/|1|34|xlhl|http://localhost:5819/|http://171.211.126.122:8092/|3,1|3,1|http://192.168.1.76:8088";
     var returnval = "http://localhost:5080/|1|2|xlhl|http://localhost:5819/|http://171.211.126.122:8092/|3,1|3,1|http://localhost:8088";
    // var returnval = "http://localhost:5080/|1|32|xlhl|http://localhost:5819/|http://171.211.126.122:8092/|3,1|3,1|https://xilai99.com";//前端专用
   //var returnval = window.localStorage.userinfo;
    //1.得到$.ajax的对象
    var _ajax = $.ajax;
    $.ajax = function (options) {
        //2.每次调用发送ajax请求的时候定义默认的error处理方法
        var fn = {
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                // alert("获取异常");
                //  toastr.error(XMLHttpRequest.responseText, '错误消息', { closeButton: true, timeOut: 0, positionClass: 'toast-top-full-width' });
            },
            success: function (data, textStatus) { },
            beforeSend: function (XHR) { },
            complete: function (XHR, TS) { }
        }
        //3.扩展原生的$.ajax方法，返回最新的参数
        var _options = $.extend({}, {
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                fn.error(XMLHttpRequest, textStatus, errorThrown);
            },
            success: function (data, textStatus) {
                fn.success(data, textStatus);
            },
            beforeSend: function (XHR) {
                XHR.setRequestHeader('Authorization', returnval);
                fn.beforeSend(XHR);
                // showLoader();
            },
            complete: function (XHR, TS) {
                fn.complete(XHR, TS);
                // hideLoader();
            }
        }, options);
        //4.将最新的参数传回ajax对象
        _ajax(_options);
    };
})(jQuery);

document.onclick = function(e){
    var e = e||window.event;
    var tg = e.target||e.srcElement;
    // console.log("你点击的标签名称为："+tg.tagName, e);
    var class_ = $(tg).attr("class");
    // console.log("class_", class_);

    if(class_ && class_.indexOf('showAppImg') != -1){
        $(".erweima", parent.document).addClass("flex_")
    }else{
        $(".erweima", parent.document).removeClass("flex_")
    }
}
$(function(){
    $("html").off('click').on("click", function(e){
        var e = e||window.event;
        var tg = e.target||e.srcElement;
        // console.log("你点击的标签名称为："+tg.tagName, e);
        var class_ = $(tg).attr("class");
        // console.log("class_", class_);

        if(class_ && class_.indexOf('showAppImg') != -1){
            $(".erweima", parent.document).addClass("flex_")
        }else{
            $(".erweima", parent.document).removeClass("flex_")
        }
   });
})
//显示加载器  
function showLoader(msg) {
    if (msg == undefined || msg == null || msg == "") {
        msg = '';
    }
    var eTip = document.createElement('div');
    eTip.setAttribute('id', 'tipDiv');
    eTip.style.position = 'absolute';
    eTip.style.display = 'none';

    eTip.style.padding = '5px 15px';
    eTip.style.top = '45%';
    eTip.style.left = '45%';
    eTip.style.zIndex = 9999;

    eTip.innerHTML = '<img style=\"width:32px;height:32px;\" src=\'http://211.149.163.185:8090/Phone/NEW-xilai/img/loading.gif\' style=\'float:left;\' />&nbsp;&nbsp;<span style=\'color:#ffffff; font-size:12px\'>' + msg + '</span>';
    try {
        document.body.appendChild(eTip);
    } catch (e) {
    }
    $("#tipDiv").css("float", "right");
    $("#tipDiv").css("z-index", "99");
    $('#tipDiv').fadeIn();
}
//隐藏加载器.for jQuery Mobile 1.2.0  
function hideLoader() {
    //隐藏加载器  
    //$.mobile.loading('hide');
    $('#tipDiv').fadeOut();
}

//js实例对象序列化为json字符串
function Serialize(obj) {
    switch (obj.constructor) {
        case Object:
            var str = "{";
            for (var o in obj) {
                str += o + ":" + Serialize(obj[o]) + ",";
            }
            if (str.substr(str.length - 1) == ",")
                str = str.substr(0, str.length - 1);
            return str + "}";
            break;
        case Array:
            var str = "[";
            for (var o in obj) {
                str += Serialize(obj[o]) + ",";
            }
            if (str.substr(str.length - 1) == ",")
                str = str.substr(0, str.length - 1);
            return str + "]";
            break;
        case Boolean:
            return "\"" + obj.toString() + "\"";
            break;
        case Date:
            return "\"" + obj.toString() + "\"";
            break;
        case Function:
            break;
        case Number:
            return "\"" + obj.toString() + "\"";
            break;
        case String:
            return "\"" + obj.toString().replace(/"/g, "\\\"") + "\"";
            break; 
    }
}
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

//新增加载图标   可以显示在指定区域
(function () {
    var loading = {
        img: document.createElement("img"),
        imgSrc: ['http://211.149.163.185:8090/Phone/NEW-xilai/img/loading.gif'],
        showImg: function (selectorObj) {/*注意：obj是传进来的id选择器,在这里只支持id选择器*/
            this.initImg(selectorObj);
        },
        hideImg: function (selectorObj) {
            document.getElementById(selectorObj).removeChild(this.img);
        },
        initImg: function (selectorObj) {
            this.img.src = this.imgSrc[0];
            this.img.className = "loadingImg";
            document.getElementById(selectorObj).appendChild(this.img);
            this.img.style.position = "absolute";
            this.img.style.top = "50%";
            this.img.style.left = "50%";
            this.img.style.width = "30px";
            this.img.style.height = "30px";
            this.img.style.transform = "translate(-50%,-50%)";
            this.img.style.zIndex = "999999";
        }
    };
    window.loading = loading;
})();
