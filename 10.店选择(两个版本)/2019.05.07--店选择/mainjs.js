var serverurl = "";//服务端地址
var Cosip = "https://xlfile-1256392453.file.myqcloud.com/";
// var Cosip2 = "https://xlfile-1256392453.file.myqcloud.com/";
function getkevalue() {
    //var returnval = jsaction.getkeyvalue(); //本地代码获取基础数据  地址|用户id|用户店ID|key
    //var returnval = "http://218.6.160.126:8090|2|xlhl|http://http://218.6.160.126:8091/|http://171.211.126.122:8092/|1";

    // http://171.211.126.122:8092/ --localhost:5819 -- 514|25 --- 572|26

    //330
    var returnval = "";
    //if(window.localStorage.userinfo==undefined){
    //    window.localStorage.userinfo="http://localhost/|1|2|xlhl|http://localhost:5819/|http://171.211.126.122:8092/|1,1|http://192.168.1.253:8095/|http://192.168.1.98:8088";
    //}
    //   returnval="http://localhost/|1|2|xlhl|http://localhost:5819/|http://171.211.126.122:8092/|1,1|http://192.168.1.253:8095/|http://192.168.1.253:8092";
      returnval="http://localhost/|1|2|xlhl|http://localhost:5819/|http://171.211.126.122:8092/|1,1|http://192.168.1.253:8095/|https://xilai99.com";
     // var returnval = "http://localhost:5080/|1|2|xlhl|http://171.211.126.122:8091/|http://171.211.126.122:8092/|2,1|1|";
    //var returnval = "http://localhost:5080/|585|28|xlhl|http://localhost:5819/|http://171.211.126.122:8092/|3,1|3,1|192.168.1.193:8088";
    //var returnval = "http://localhost:5080/|606|32|xlhl|http://171.211.126.122:8091/|http://171.211.126.122:8092/|1,1|1|"
  //    var returnval = "http://localhost:5080/|1|2|xlhl|http://localhost:5819/|http://171.211.126.122:8092/|1|1|http://localhost:8088";
    // var returnval = "http://localhost:5080/|1|2|xlhl|http://localhost:5819/|http://171.211.126.122:8092/|3,1|3,1|http://localhost:8088";
    // var returnval = "http://localhost:5080/|619|3|xlhl|http://localhost:5819/|http://171.211.126.122:8092/|1|http://171.211.126.122:8092/";

    //var returnval = "http://localhost:5080/|28|2|xlhl|http://192.168.1.253:8095|6513513|123"
    // var returnval = "http://211.149.163.185:8090/|28|2|xlhl|http://171.211.126.122:8091|http://171.211.126.122:8092/|1";

    //   var returnval = "http://localhost:5080/|1|2|xlhl|http://192.168.1.253:8091";//

    // var returnval = "http://localhost:5080/|1|8|xlhl|http://218.6.160.126:8091/|http://218.6.160.126:8092/";
    //  var returnval = "http://localhost:5080/|9|314|xlhl|http://192.168.1.253:8091|http://192.168.1.253:8092";//

   //var returnval = window.localStorage.userinfo;
    if (returnval == "" || returnval == undefined) {

        alert("账号过期重新登入");
        window.location.href= "http://211.149.163.185:8090/Login/loginnew.aspx";
    }
    var vararry = returnval.split("|");
    var keyobj = new Object();
    keyobj.url = vararry[0];//处理服务器ip   211.
    keyobj.userid = vararry[1];
    keyobj.branchid = vararry[2];
    keyobj.key = vararry[3];
    keyobj.brinchip = vararry[4];//文件上传处理 171
    keyobj.branchshowip = vararry[5]; //文件展示ip
    keyobj.rolestate = vararry[6]; // 供应商时候标识供应商类型和权限 逗号隔开 第一个参数 1：桁架 2：灯光 3：灯光和桁架 第二个参数：1 代表管理员
    keyobj.loackshowip = vararry[7];
    keyobj.apiurl = vararry[8];//处理服务器ip   211.
    return keyobj;

}
function InsOperation(from, action) {

    var i = 0;
    var time = setTimeout(function () {
        if (i != 1) {
            i = 1;
            $.ajax({
                url: getkevalue().apiurl + "/xlapi/Login/Login/User/InsOPERATION?from=" + from + "&action=" + action,
                type: "get",
                success: res => {
                    console.log(res)
                    clearTimeout(time)
                },
                beforeSend: XHR => {
                    var returnval = window.localStorage.userinfo;
                    XHR.setRequestHeader('Authorization', returnval);
                }
            })
        }
    }, 3000);
}
//(function ($) {
//    var returnval = "http://localhost:5080/|585|28|xlhl|http://localhost:5819/|http://171.211.126.122:8092/|3,1|3,1|192.168.1.193:8088";
//    // var returnval = window.localStorage.userinfo;
//    //1.得到$.ajax的对象
//    var _ajax = $.ajax;
//    $.ajax = function (options) {
//        //2.每次调用发送ajax请求的时候定义默认的error处理方法
//        var fn = {
//            error: function (XMLHttpRequest, textStatus, errorThrown) {
//                alert("获取异常");
//                //  toastr.error(XMLHttpRequest.responseText, '错误消息', { closeButton: true, timeOut: 0, positionClass: 'toast-top-full-width' });
//            },
//            success: function (data, textStatus) { },
//            beforeSend: function (XHR) { },
//            complete: function (XHR, TS) { }
//        }
//        //3.扩展原生的$.ajax方法，返回最新的参数
//        var _options = $.extend({}, {
//            error: function (XMLHttpRequest, textStatus, errorThrown) {
//                fn.error(XMLHttpRequest, textStatus, errorThrown);
//            },
//            success: function (data, textStatus) {
//                fn.success(data, textStatus);
//            },
//            beforeSend: function (XHR) {

//                XHR.setRequestHeader('Authorization', returnval);
//                fn.beforeSend(XHR);
//                showLoader();
//            },
//            complete: function (XHR, TS) {
//                fn.complete(XHR, TS);
//                hideLoader();
//            }
//        }, options);
//        //4.将最新的参数传回ajax对象
//        _ajax(_options);
//    };
//})(jQuery);
//新做的消息提醒框
function remind(oid, msg) {
    var html = "";
    html += "<div class='altermsgdiv' style=\"width:100%;height:100%;background-color:rgba(0,0,0,0.5);position:fixed;z-index:12000;\">";
    html += "    <div style=\"width:80%;height:153px;position:relative;top:50%;left:50%;margin-left:-40%;margin-top:-75px;background-color:#fff;border-radius:10px;\">";
    html += "        <div style=\"width:100%;height:110px;\">";
    html += "            <p style=\"font-size:16px;color:#222;font-weight:bolder;text-align:center;height:40px;line-height:50px;\">新消息</p>";
    html += "            <p style=\"width:100%;height:40px;margin-top:10px;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;padding:0px 25px 0px 25px;box-sizing:border-box;line-height:1.7;\">" + msg + "</p>";
    html += "        </div>";
    html += "        <div style=\"width:100%;height:40px;overflow:hidden;border-top:1px solid #ddd;\">";
    html += "            <p id=\"Dontsee\" style=\"float:left;width:49%;height:40px;text-align:center;line-height:40px;;border-right:1px solid #ddd;color:#099C09;\">暂不查看</p>";
    html += "            <p onclick=\"gotoordermsg('" + oid + "')\" style=\"float:left;width:50%;height:40px;text-align:center;line-height:40px;color:#099C09;\">立即查看</p>";
    html += "        </div>";
    html += "    </div>";
    html += "</div>";
    $("body").append(html);
    $("#Dontsee").click(function () {
        $(".altermsgdiv").css("display", "none");
        window.localStorage.listdata = '';
    })
}

function gotoordermsg(oid) {
    window.location.href = "messageSubject.html?orderid=" + oid;
}



function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}
//传入Arry转换为json字符串
function GetJsonList(list) {
    var inputValue = "";
    var modeltemp;
    var tempvale;
    for (var i = 0; i < list.length; i++) {
        modeltemp = "";
        for (var p in list[i]) {
            // 方法
            if (typeof (list[i][p]) == "function") {

            } else {
                ///  tempvale = list[i][p].replace("'", "\'");
                modeltemp = modeltemp + p + ": '" + list[i][p] + "',";

            }
        }
        if (modeltemp != "") {
            inputValue += "{" + modeltemp.substr(0, modeltemp.length - 1) + "},";
        }
    }
    if (inputValue != "") {
        inputValue = "[" + inputValue.substr(0, inputValue.length - 1) + "]";
    }
    return inputValue;
}

//处理json格式化和的时间处理
function ChangeDateFormat(cellval) {
    try {
        var date = new Date(parseInt(cellval.replace("/Date(", "").replace(")/", ""), 10));
        var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        return date.getFullYear() + "-" + month + "-" + currentDate;
    } catch (e) {
        return "";
    }
}

function ChangeDate(data_star_val) {//时间处理
    data_star = new Object()
    data_star.date = new Date(parseInt(data_star_val.replace("/Date(", "").replace(")/", ""), 10));//时间
    data_star.getYear = data_star.date.getFullYear();
    data_star.month = data_star.date.getMonth() + 1 < 10 ? "0" + (data_star.date.getMonth() + 1) : data_star.date.getMonth() + 1;//月
    data_star.currentDate = data_star.date.getDate() < 10 ? "0" + data_star.date.getDate() : data_star.date.getDate();//日
    data_star.house = data_star.date.getHours() < 10 ? "0" + data_star.date.getHours() : data_star.date.getHours();//时
    data_star.minnues = data_star.date.getMinutes() < 10 ? "0" + data_star.date.getMinutes() : data_star.date.getMinutes();//分
    data_star.time = (data_star.date).getTime();//毫秒
    data_star.all = data_star.date.getFullYear() + "-" + data_star.month + "-" + data_star.currentDate;//时间格式
    return data_star;
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
                debugger;
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

    eTip.innerHTML = '<img style=\"width:50px;height:50px;\" src=\'http://211.149.163.185:8090/Phone/NEW-xilai/img/loading.jpg\' style=\'float:left;\' />&nbsp;&nbsp;<span style=\'color:#ffffff; font-size:12px\'>' + msg + '</span>';
    try {
        document.body.appendChild(eTip);
    } catch (e) { }
    $("#tipDiv").css("float", "right");
    $("#tipDiv").css("z-index", "99");
    $('#tipDiv').fadeIn();
}
function shoujishowLoader(container) {
    if (container.progressbar({
        progress: 0
    }).show()) {
        simulateLoading(container, 0);
    }
    function simulateLoading(container, progress) {
        if (typeof container === 'number') {
            progress = container;
            container = 'body';
        }
        setTimeout(function () {
            progress += Math.random() * 20;
            mui(container).progressbar().setProgress(progress);
            if (progress < 90) {
                simulateLoading(container, progress);
            } else {

            }
        }, 10);
    }
}
function shoujihideLoader(container) {

    mui(container).progressbar({
        progress: 100
    }).hide();
}
//if (msg == undefined || msg == null || msg == "") {
//    msg = '加载中...';
//}
////显示加载器.for jQuery Mobile 1.2.0
//$.mobile.loading('show', {
//    text: msg, //加载器中显示的文字
//    textVisible: true, //是否显示文字
//    theme: 'a',        //加载器主题样式a-e
//    textonly: false,   //是否只显示文字
//    html: ""           //要显示的html内容，如图片等
//});
//}

//隐藏加载器.for jQuery Mobile 1.2.0
function hideLoader() {
    //隐藏加载器
    //$.mobile.loading('hide');
    $('#tipDiv').fadeOut();
}
function showalter(text) {
    var popupDialogId = 'popupDialog';
    $('<div data-role="popup" id="' + popupDialogId + '" data-confirmed="no" data-transition="pop" data-overlay-theme="b" data-theme="b" data-dismissible="false" style="max-width:500px;"> \
                    <div role="main" class="ui-content">\
                        <h3 class="ui-title">' + text + '</h3>\
                        <a href="#" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b optionConfirm" data-rel="back">确定</a>\
                        \
                    </div>\
                </div>')
        .appendTo($.mobile.pageContainer);
    var popupDialogObj = $('#' + popupDialogId);
    popupDialogObj.trigger('create');
    popupDialogObj.popup({
        afterclose: function (event, ui) {
            popupDialogObj.find(".optionConfirm").first().off('click');
            var isConfirmed = popupDialogObj.attr('data-confirmed') === 'yes' ? true : false;
            $(event.target).remove();
            if (isConfirmed && callback) {
                callback();
            }
        }
    });
    popupDialogObj.popup('open');

}

function confirmDialog(text, callback) {
    var popupDialogId = 'popupDialog';
    $('<div data-role="popup" id="' + popupDialogId + '" data-confirmed="no" data-transition="pop" data-overlay-theme="b" data-theme="b" data-dismissible="false" style="max-width:500px;"> \
                    <div data-role="header" data-theme="a">\
                        <h1>Question</h1>\
                    </div>\
                    <div role="main" class="ui-content">\
                        <h3 class="ui-title">' + text + '</h3>\
                        <a href="#" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b optionConfirm" data-rel="back">Yes</a>\
                        <a href="#" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b optionCancel" data-rel="back" data-transition="flow">No</a>\
                    </div>\
                </div>')
        .appendTo($.mobile.pageContainer);
    var popupDialogObj = $('#' + popupDialogId);
    popupDialogObj.trigger('create');
    popupDialogObj.popup({
        afterclose: function (event, ui) {
            popupDialogObj.find(".optionConfirm").first().off('click');
            var isConfirmed = popupDialogObj.attr('data-confirmed') === 'yes' ? true : false;
            $(event.target).remove();
            if (isConfirmed && callback) {
                callback();
            }
        }
    });
    popupDialogObj.popup('open');
    popupDialogObj.find(".optionConfirm").first().on('click', function () {
        popupDialogObj.attr('data-confirmed', 'yes');
    });
}

/*Trim(string):去除字符串两边的空格*/
function Trim(str) {
    return RTrim(LTrim(str));
}
/*LTrim(string):去除左边的空格*/
function LTrim(str) {
    var whitespace = new String(" \t\n\r");
    var s = new String(str);
    if (whitespace.indexOf(s.charAt(0)) != -1) {
        var j = 0, i = s.length;
        while (j < i && whitespace.indexOf(s.charAt(j)) != -1) {
            j++;
        }
        s = s.substring(j, i);
    }
    return s;
}
/*RTrim(string):去除右边的空格*/
function RTrim(str) {
    var whitespace = new String(" \t\n\r");
    var s = new String(str);
    if (whitespace.indexOf(s.charAt(s.length - 1)) != -1) {
        var i = s.length - 1;
        while (i >= 0 && whitespace.indexOf(s.charAt(i)) != -1) {
            i--;
        }
        s = s.substring(0, i + 1);
    }
    return s;
}
UrlParm = function () { // url参数
    var data, index;
    (function init() {
        data = [];
        index = {};
        var u = window.location.search.substr(1);
        if (u != '') {
            var parms = decodeURIComponent(u).split('&');
            for (var i = 0, len = parms.length; i < len; i++) {
                if (parms[i] != '') {
                    var p = parms[i].split("=");
                    if (p.length == 1 || (p.length == 2 && p[1] == '')) {// p | p=
                        data.push(['']);
                        index[p[0]] = data.length - 1;
                    } else if (typeof (p[0]) == 'undefined' || p[0] == '') { // =c | =
                        data[0] = [p[1]];
                    } else if (typeof (index[p[0]]) == 'undefined') { // c=aaa
                        data.push([p[1]]);
                        index[p[0]] = data.length - 1;
                    } else {// c=aaa
                        data[index[p[0]]].push(p[1]);
                    }
                }
            }
        }
    })();
    return {
        // 获得参数,类似request.getParameter()
        parm: function (o) { // o: 参数名或者参数次序
            try {
                return (typeof (o) == 'number' ? data[o][0] : data[index[o]][0]);
            } catch (e) {
            }
        },
        //获得参数组, 类似request.getParameterValues()
        parmValues: function (o) { //  o: 参数名或者参数次序
            try {
                return (typeof (o) == 'number' ? data[o] : data[index[o]]);
            } catch (e) { }
        },
        //是否含有parmName参数
        hasParm: function (parmName) {
            return typeof (parmName) == 'string' ? typeof (index[parmName]) != 'undefined' : false;
        },
        // 获得参数Map ,类似request.getParameterMap()
        parmMap: function () {
            var map = {};
            try {
                for (var p in index) { map[p] = data[index[p]]; }
            } catch (e) { }
            return map;
        }
    }
}();

function jsonDateFormat(jsonDate) {//json日期格式转换为正常格式
    try {//出自http://www.cnblogs.com/ahjesus 尊重作者辛苦劳动成果,转载请注明出处,谢谢!
        var date = new Date(parseInt(jsonDate.replace("/Date(", "").replace(")/", ""), 10));
        var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        var milliseconds = date.getMilliseconds();
        return date.getFullYear() + "-" + month + "-" + day;
    } catch (ex) {//出自http://www.cnblogs.com/ahjesus 尊重作者辛苦劳动成果,转载请注明出处,谢谢!
        return "";
    }
}

//进入页面先存储页面
function saveurl() {
    if (window.localStorage) {
        var url = window.location.href;
        if (url.indexOf("/msg/index.html") >= 0) {
            window.localStorage.locurl = "undefined";
        }
        if (window.localStorage.locurl == "undefined") {//如果存地址的locurl有值
            var ay = new Array();
            ay[0] = url;
            localStorage.setItem('locurl', JSON.stringify(ay));
            var read = JSON.parse(localStorage.getItem('locurl'));
        }
        else {
            //判断 uri he
            var read = JSON.parse(localStorage.getItem('locurl'));
            if (read != null) {


                var readLen = read.length;
                var locurlLen = window.localStorage.locurl.length;
                if (url != read[readLen - 1]) {
                    read.push(url);
                    localStorage.setItem('locurl', JSON.stringify(read));
                }
            }
        }
    }
}
function pback() {
    if (ispback == "0") {
        goback();
    }
}
//后退
function goback() {
    var read = JSON.parse(localStorage.getItem('locurl'));
    var readLen = read.length;
    var beformRead = read[readLen - 2];//倒数第二个
    var thisUrl = window.location.href;
    var thisUrlEnd = thisUrl.split("?")[0];
    var thisIndex = readLenInit(readLen, read, thisUrlEnd);
    if (thisIndex != "" && thisIndex != undefined && thisIndex >= 0) {
        read.splice(thisIndex, readLen);
        localStorage.setItem('locurl', JSON.stringify(read));
        window.location.href = read[thisIndex - 1];
    } else {
        read.splice(readLen - 1, 1);//如果是正常的就访问倒数第一个
        localStorage.setItem('locurl', JSON.stringify(read));
        window.location.href = beformRead;
    }
}
function readLenInit(readLen, read, thisUrlEnd) {
    for (var i = 0; i < readLen; i++) {
        var readUrl = read[i].split("?")[0];
        if (readUrl == thisUrlEnd) {
            return i;
        }
    }
}
function gohome() {
    window.location = "index.html";
}
var ispback = "0"
$(function () {
    //    $("")
    ispback = "0";
    // document.oncontextmenu = function () {
    //     return false;
    // }
     saveurl();
});

// 算时间差 时间 day <= 30 mon < 12
function GetTime(mon, day) {
    var myDate = new Date();
    var newdata = "";
    var yer = myDate.getFullYear();
    var mo = parseInt(myDate.getMonth()) + 1;
    var da = myDate.getDate();

    var a = 0;
    var thismon = new Date(myDate.getFullYear(), (myDate.getMonth() + 1), 0).getDate(); // 这个月有几天
    var frimon = new Date(myDate.getFullYear(), (myDate.getMonth()), 0).getDate();// 上个月有几天
    if (parseInt(day) >= 0) { // 加几天
        if (parseInt(thismon) >= (parseInt(da) + parseInt(day))) // 没超出这月总天数
        {
            da = parseInt(da) + parseInt(day);
        } else {
            a += 1;
            da = parseInt(da) + parseInt(day) - parseInt(thismon);
        }
    } else { // 减几天
        if ((parseInt(da) + parseInt(day)) > 0) {
            da = parseInt(da) + parseInt(day);
        } else {
            a += -1;
            da = parseInt(frimon) + parseInt(da) + parseInt(day);
        }
    }
    if (parseInt(mon) >= 0) {// 加几月
        if (parseInt(mon) + parseInt(mo) + a <= 12) {
            mo = parseInt(mon) + parseInt(mo) + a
        } else {
            mo = parseInt(mon) + parseInt(mo) + a - 12;
            yer = parseInt(yer) + 1;
        }
    } else { // 减几个月
        if (parseInt(mon) + parseInt(mo) + a > 0) {
            mo = parseInt(mon) + parseInt(mo) + a;
        } else {
            yer = parseInt(yer) - 1;
            mo = 12 + parseInt(mo) + parseInt(mon);
        }
    }
    newdata = yer + "/" + mo + "/" + da;
    return newdata;
}



