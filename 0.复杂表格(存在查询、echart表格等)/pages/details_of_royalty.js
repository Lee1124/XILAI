//设置全局变量
var SearchDate = GetQueryString('SearchDate');//获取传的年月
var Branch = GetQueryString('Branch');//获取传的店ID
var getkevalue = getkevalue();
var api = getkevalue.apiurl;//IP地址
var $height = GetQueryString("height");


$(".tbody").css({
    maxHeight: $height + "px"
})

//数据
var myData = {
    contentData: [],//页面渲染数据
    userid:getkevalue.userid,
    isShowNoNum:false
};

//事件
var myMethods={
    showFineDetail(UserId,OrderId){
        console.log("进来了")
        console.log(UserId)
        console.log(OrderId)
        var $height1 = $(document).height();
        console.log($height1)
        parent.layer.open({
            type: 2,
            skin: 'demo-class',
            title:"",
            area: ['1200px', "600px"],
            content: '../../SysManage/UserManage/Order_fineDetail.html?userid='+UserId+"&orderId="+OrderId
        })
    }
}


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
            showLoading();
            XHR.setRequestHeader('Authorization', 'http://localhost:5080/|1|2|xlhl|http://localhost:5819/|http://171.211.126.122:8092/|1|http://192.168.1.253:8095|http://192.168.1.112:8088');
            // XHR.setRequestHeader('Authorization', localStorage.userinfo)
        },
        complete: function () {
            hideLoading();
        },
        success: res => {
            // console.log(res.data);
            Vue.contentData=res.data
            if (res.data.length==0){
                Vue.isShowNoNum=true
            }
        }
    })
}


var Vue = new Vue({
    el: "#app",
    data: myData,
    methods: myMethods,
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

//加载图标
function showLoading() {
    var html = "<img src=\"../images/loading.gif\" alt=\"正在加载...\" class='loadImg' style=\"position: absolute;top: 50%;left: 50%;z-index: 999;width: 40px;height: 40px;-webkit-transform: translate(-50%,-50%);-moz-transform: translate(-50%,-50%);-ms-transform: translate(-50%,-50%);-o-transform: translate(-50%,-50%);transform: translate(-50%,-50%);\">";
    $("body").append(html)
}

function hideLoading() {
    $(".loadImg").hide();
}


