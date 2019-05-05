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
// console.log($height)

$(".tbody").css({
    maxHeight: $height + "px"
})

//数据
var myData = {
    contentData: [],//页面渲染数据
};


function loadStartData() {
    var url = api + "/xlapi/Homepage/Cost/CostStatistics/GetTCMXDetail";
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
            /*localStorage.userinfo*/
            XHR.setRequestHeader('Authorization', 'http://localhost:5080/|1|2|xlhl|http://localhost:5819/|http://171.211.126.122:8092/|1|http://192.168.1.253:8095|http://192.168.1.112:8088');
        },
        complete: function () {
            // hideLoading();
        },
        success: res => {
            // console.log(res.data);
            Vue.contentData=res.data
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

//展开第二个表格
function showAndHideTableData_box02(obj) {
    var $tableData_box02 = $(obj).next();
    var $downIcon = $(obj).find(".downIcon02");
    if ($tableData_box02.is(":hidden")) {
        $(".downIcon02").css({
            transform: "rotate(180deg)"
        });
        $tableData_box02.slideDown(0).siblings(".inner_table").slideUp(0);
        $downIcon.css({
            transform: "rotate(0deg)"
        });
    } else {
        $tableData_box02.slideUp(0);
        $downIcon.css({
            transform: "rotate(180deg)"
        });
    }
}

// //加载图标
// function showLoading() {
//     var html = "<img src=\"../images/loading.gif\" alt=\"正在加载...\" class='loadImg' style=\"position: absolute;top: 50%;left: 50%;z-index: 999;width: 40px;height: 40px;-webkit-transform: translate(-50%,-50%);-moz-transform: translate(-50%,-50%);-ms-transform: translate(-50%,-50%);-o-transform: translate(-50%,-50%);transform: translate(-50%,-50%);\">";
//     $("body").append(html)
// }
//
// function hideLoading() {
//     $(".loadImg").hide();
// }


