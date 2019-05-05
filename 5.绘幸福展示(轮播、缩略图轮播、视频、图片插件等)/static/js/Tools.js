function getUrlParam(strName) {
    var array = window.location.href.split("?");
    if ((parseInt(array.length) - parseInt(1)) > 0) {
        //有参数  
        var array1 = array[1].split("&");//？号后面参数部分  
        if (array1.length > 0) {
            //参数写法正确  
            for (var i = 0; i < array1.length; i++) {
                var array2 = array1[i].split("=");
                if (array2.length > 0) {
                    if (strName == array2[0]) {
                        return array2[1];
                    }
                }
            }
        }
    }
    return '';
}

//guid
function newGuid() {
    var guid = "";
    for (var i = 1; i <= 32; i++) {
        var n = Math.floor(Math.random() * 16.0).toString(16);
        guid += n;
        if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
            guid += "-";
    }
    return guid;
}

//时间转字符串格式化
function timeTostring(str, formStr) {
    //'/Date(1400046388387)/' , "yyyy-MM-dd hh:mm:ss"
    var d = eval('new ' + str.substr(1, str.length - 2)); //new Date()
    return d.Format(formStr)
}
function getDateByYearAndMonth(year, mon) {
    month = parseInt(mon, 10) + 1;
    var d = new Date(year, month, 0);
    return d.getDate();
}
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}



function addMonth(date, num) {
    num = parseInt(num);
    var sDate = date;
    if (num==-1) {
        num = 0;
    }
    var sYear = sDate.getFullYear();
    var sMonth = sDate.getMonth() + 1;
    var sDay = sDate.getDate();

    var eYear = sYear;
    var eMonth = sMonth + num;
    var eDay = sDay;
    while (eMonth > 12) {
        eYear++;
        eMonth -= 12;
    }
    var eDate = new Date(eYear, eMonth - 1, eDay);
    while (eDate.getMonth() != eMonth - 1) {
        eDay--;
        eDate = new Date(eYear, eMonth - 1, eDay);
    }
    return eDate;
}


//function addMonth(date, num) {
//    //date为格式化后的日期字符yyyy-MM-dd,num为增加的月份
//    console.log(date);
//    var monthnum = parseInt(num);
//    var sDate = date;
//    var year = sDate.getFullYear();
//    var month = sDate.getMonth()+1;
//    var day = sDate.getDate();
//    if (month + monthnum > 12) {
//        var newyear = year + 1;
//        var newmonth = month + monthnum - 12;
//        var newday = day;
//    }
//    else {
//        var newyear = year
//        var newmonth = month + monthnum;
//        var newday = day;
//    }
//    var newdate = newyear + "-" + newmonth + "-" + newday;
//    return newdate;
//}





function dateToDate(date) {
          var sDate = new Date();
          if (typeof date == 'object'
                && typeof new Date().getMonth == "function"
            ) {
                sDate = date;
          }
          else if (typeof date == "string") {
                var arr = date.split('-')
                if (arr.length == 3) {
                      sDate = new Date(arr[0] + '-' + arr[1] + '-' + arr[2]);
                }
          }

          return sDate;
    }
//检索数组元素序列
Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
//删除数组元素
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
//交换数组位置
Array.prototype.exchange = function (i, j) {
    var temp;
    temp = this[i];
    this[i] = this[j];
    this[j] = temp;
}

function ipReplace(ip, url, _this, ip1 = "https://xlfile-1256392453.cos.ap-chengdu.myqcloud.com/", ip2 = "http://192.168.1.253:8095/") {
    url = url.replace(ip, ip1);
    $.ajax({
        type: "GET",
        async: true,
        timeout: 2000, //超时时间设置，单位毫秒
        url: url,
        success(data) {
            //  console.log(data);
            $(_this).attr('src', url);
        },
        error() {
            url = url.replace(ip1, ip2).replace('com//', 'com/');
            $.ajax({
                type: "GET",
                async: true,
                timeout: 2000, //超时时间设置，单位毫秒
                url: url,
                success(data) {
                    console.log(url);
                    $(_this).attr('src', url);
                },
                error() {
                    $(_this).attr('onerror', 'null');
                    $(_this).attr('src', 'javascript:void(0);');
                }

            })
        }
    })
}

function downloadIpCheck(ip, url, fileName, ip1 = "http://192.168.1.253:8095", ip2 = "https://xlfile-1256392453.cos.ap-chengdu.myqcloud.com/") {
    //var uploader1 = new XLImageUploader({
    //    bucket: "xlfile-1256392453"
    //});
    //uploader1.download({
    //    url: url.replace(ip, ip1),
    //    fileName: fileName,
    //    otherurl: url.replace(ip, ip2),
    //});
    //return;
    var urls = url.split('.');
    fileName += '.' + urls[urls.length - 1]; 
    url = url.replace(ip, ip1);
    $.ajax({
        type: "GET",
        async: true,
        timeout: 1000, //超时时间设置，单位毫秒
        url: url,
        beforeSend: function (XHR) {
        },
        success(data) {
            download(url, fileName);
        },
        error() {
            url = url.replace(ip1, ip2).replace("com//","com/");

            var uploader1 = new XLImageUploader({
                bucket: "xlfile-1256392453"
            });
            uploader1.download({
                url: url,
                fileName: fileName,
            });

        }
    });

}