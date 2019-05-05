//设置全局变量
var SearchDate = '2019-01-01';
var Branch = '2';
var api = "http://192.168.1.112:8088";

(function () {
    function GetUrlString(name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        let r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    window.GetUrlString = GetUrlString;
})();

var $height = GetUrlString("height");
console.log($height)

$(".tbody").css({
    maxHeight: $height + "px"
})

//数据
var myData = {
    contentData: [],//页面渲染数据
    allJBGZ:0,
    allGWGZ:0,
    allKQ:0,
    allQQJ:0,
    allJSBZ:0,
    allCB:0,
    allGLGZ:0,
    allGRSB:0,
    allYJTC:0,
    allCKFY:0,
    allBMTZ:0,
    allQT:0,
    allHJ:0,
};


//加载初始数据
function loadStartData() {
    var url = api + "/xlapi/Homepage/Cost/CostStatistics/GetJBGZDetail";
    // console.log(url1)
    var data = {
        SearchDate: SearchDate,
        Branch: Branch,
    };
    $.ajax({
        type: "post",
        url: url,
        data: data,
        beforeSend: function (XHR) {
            // showLoading();
            // localStorage.userinfo
            XHR.setRequestHeader('Authorization', 'http://localhost:5080/|1|2|xlhl|http://localhost:5819/|http://171.211.126.122:8092/|1|http://192.168.1.253:8095|http://192.168.1.112:8088');
        },
        complete: function () {
            // hideLoading();
        },
        success: res => {
            // console.log(res.data);
            Vue.contentData = res.data;
            var allJBGZ=0;
            var allGWGZ=0;
            var allKQ=0;
            var allQKJ=0;
            var allJSBZ=0;
            var allCB=0;
            var allGLGZ=0;
            var allKGRSB=0;
            var allGLYJTC=0;
            var allZLCKFY=0;
            var allBMTZ=0;
            var allQT=0;
            var allHJ=0;
            for (var i=0;i<res.data.length;i++){
                allJBGZ+=res.data[i].JBGZ;
                allGWGZ+=res.data[i].GWGZ;
                allKQ+=res.data[i].KQ;
                allQKJ+=res.data[i].QKJ;
                allJSBZ+=res.data[i].JSBZ;
                allCB+=res.data[i].CB;
                allGLGZ+=res.data[i].GLGZ;
                allKGRSB+=res.data[i].KGRSB;
                allGLYJTC+=res.data[i].GLYJTC;
                allZLCKFY+=res.data[i].ZLCKFY;
                allBMTZ+=res.data[i].BMTZ;
                allQT+=res.data[i].QT;
                allHJ+=res.data[i].HJ;
            }

            Vue.allJBGZ=allJBGZ.toFixed(2);
            Vue.allGWGZ=allGWGZ.toFixed(2);
            Vue.allKQ=allKQ.toFixed(2);
            Vue.allQQJ=allQKJ.toFixed(2);
            Vue.allJSBZ=allJSBZ.toFixed(2);
            Vue.allCB=allCB.toFixed(2);
            Vue.allGLGZ=allGLGZ.toFixed(2);
            Vue.allGRSB=allKGRSB.toFixed(2);
            Vue.allYJTC=allGLYJTC.toFixed(2);
            Vue.allCKFY=allZLCKFY.toFixed(2);
            Vue.allBMTZ=allBMTZ.toFixed(2);
            Vue.allQT=allQT.toFixed(2);
            Vue.allHJ=allHJ.toFixed(2);
        }
    })
}

var Vue = new Vue({
    el: "#app",
    data: myData,
    // methods: myMethods,
    created() {
        //加载初始数据
        loadStartData();

    }
});


// //加载图标
// function showLoading() {
//     var html = "<img src=\"../images/loading.gif\" alt=\"正在加载...\" class='loadImg' style=\"position: absolute;top: 50%;left: 50%;z-index: 999;width: 40px;height: 40px;-webkit-transform: translate(-50%,-50%);-moz-transform: translate(-50%,-50%);-ms-transform: translate(-50%,-50%);-o-transform: translate(-50%,-50%);transform: translate(-50%,-50%);\">";
//     $("body").append(html)
// }
//
// function hideLoading() {
//     $(".loadImg").hide();
// }


