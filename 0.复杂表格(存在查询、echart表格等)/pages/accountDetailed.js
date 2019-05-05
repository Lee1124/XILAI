var selectText_01;
var selectText_02;
var selectText_03;
var searchText88;
var myWatch = {//查询方式监听
    selectText01(val) {
        if (val == '0') {
            selectText_01 = '嘻嘻,不能进入'
        } else if (val == '1') {
            selectText_01 = true
        } else if (val == '2') {
            selectText_01 = false
        }

    },
    selectText02(val) {
        if (val == '0') {
            selectText_02 = '嘻嘻,不能进入'
        } else if (val == '1') {
            selectText_02 = true
        } else if (val == '2') {
            selectText_02 = false
        }
    },
    selectText03(val) {
        if (val == '0') {
            selectText_03 = '嘻嘻,不能进入'
        } else if (val == '1') {
            selectText_03 = true
        } else if (val == '2') {
            selectText_03 = false
        }
    },
    searchText(val) {
        searchText88 = val
    }
};
var myMethods = {
    searchBth() {
        loadStartData(selectText_01, selectText_02, selectText_03, searchText88)
    },
    showJiSuanJinE(event) {
        $('.showTd').hide();
        $(event.target).children('.showTd').show();
    },
    intoEChart() {
        Vue.isShowEChart = false;
    },
    outEChart() {
        Vue.isShowEChart = true;
    }
};


//加载初始数据
var getkevalue = getkevalue();
var api = getkevalue.apiurl;//IP地址
var SearchDate = GetQueryString('SearchDate');//获取传的年月
var Branch = GetQueryString('Branch');//获取传的店ID
var SearchType = GetQueryString('SearchType');//获取传的查询类型
//Enter查询事件
$(document).keydown(function (e) {
    if (e.keyCode == 13) {
        e.preventDefault();
        loadStartData(selectText_01, selectText_02, selectText_03, searchText88)
    }
});

function loadStartData(val01, val02, val03, val04) {
    var selectVal01 = val01;
    var selectVal02 = val02;
    var selectVal03 = val03;
    var searchText88 = val04;
    var url1 = api + "/xlapi/Homepage/Cost/CostStatistics/GetBZAmountByMonth";
    var data1 = {
        SearchDate: SearchDate,
        Branch: Branch,
        SearchType: SearchType
    };
    $.ajax({
        type: "post",
        url: url1,
        data: data1,
        beforeSend: function (XHR) {
            showLoading();
            XHR.setRequestHeader('Authorization', localStorage.userinfo);
        },
        complete: function () {
            hideLoading();
        },
        success: res => {

            // console.log(res.data.TypeDetailList);

            if (res.data.TypeDetailList.length == 0) {
                var html = "<div style='position: absolute;top: 40%;left: 48%;z-index: 9999;color: #999;'>无数据</div>";
                $("body").append(html)
            }

            //重新排序
            var newArr = rearrangement(res.data.TypeDetailList);

            //有百分比的新数组：
            var newArr=percentageNewArr(newArr);

            //保存AmountApplyList长度为0的对象
            var noAmountApplyListArr = noAmountApplyList(newArr);

            //加总金额
            var newArr = addAllJiSuanJinEPrice(newArr);

            if (selectVal01 == true || selectVal01 == false) {
                // console.log("进入第1个函数")
                newArr = showSelectTextData(selectVal01, newArr).concat(noAmountApplyListArr);
            }
            if (selectVal02 == true || selectVal02 == false) {
                // console.log("进入第2个函数")
                newArr = showSelectText02Data(selectVal02, newArr).concat(noAmountApplyListArr);
            }
            if (selectVal03 == true || selectVal03 == false) {
                // console.log("进入第3个函数")
                newArr = showSelectText03Data(selectVal03, newArr).concat(noAmountApplyListArr);
            }

            if (searchText88 != undefined) {
                // console.log("进入函数第1层")
                if (searchText88 != "") {
                    // console.log("进入函数第2层")
                    newArr = showSearchText88Data(searchText88, newArr).concat(noAmountApplyListArr);
                }
            }

            // //有百分比的新数组：
            // var percentage=percentageNewArr(newArr);

            // console.log(percentage)

            //eChart图表
            loadEChart(newArr);

            Vue.contentData = newArr;
            loadTable01Data(res);


        }
    })
}


function openXiangQing(obj) {
    var id = $(obj).find("span").text();
    layer.open({
        type: 2,
        skin: 'demo-class',
        title: "信息",
        area: ['700px', '450px'],
        content: "../../Amount/EditProject.aspx?id=" + id
    })
}

//加总金额
function addAllJiSuanJinEPrice(selectArr) {
    for (var i = 0; i < selectArr.length; i++) {
        var allPrice = 0;
        for (var j = 0; j < selectArr[i].AmountApplyList.length; j++) {
            var allPrice2 = 0;
            for (var k = 0; k < selectArr[i].AmountApplyList[j].projectlist.length; k++) {
                if (selectArr[i].AmountApplyList[j].projectlist[k].IsJiSuanJinE == true) {
                    allPrice += selectArr[i].AmountApplyList[j].projectlist[k].Amoumt;
                    allPrice2 += selectArr[i].AmountApplyList[j].projectlist[k].Amoumt;
                }
            }
            selectArr[i].AmountApplyList[j].JiSuanJinE = allPrice2.toFixed(2);
        }
        selectArr[i].NowTypeJiSuanJinE = allPrice.toFixed(2);
    }
    var newArr = selectArr;
    return newArr;
}

//加所有金额
function percentageNewArr(obj) {
    let addAllMoneyObj=0;//总金额
    for (let i=0;i<obj.length;i++){
        addAllMoneyObj+=parseFloat(obj[i].NowTypeJiSuanJinE)
    }
    for (let i=0;i<obj.length;i++){
        let percentage=parseFloat(obj[i].NowTypeJiSuanJinE)/addAllMoneyObj;
        percentage=toPercent(percentage);
        obj[i].percentage=percentage;//添加新属性
    }
    return obj;
}

function toPercent(point){
    var str=Number(point*100).toFixed(2);
    str+="%";
    return str;
}


//保存AmountApplyList长度为0的对象的函数
function noAmountApplyList(arr) {
    var newNoAmountApplyListArr = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].AmountApplyList.length == 0) {
            newNoAmountApplyListArr.push(arr[i])
        }
    }
    return newNoAmountApplyListArr;
}


//是否人员费用过滤函数
function showSelectTextData(selectVal, selectArr) {
    for (var i = selectArr.length - 1; i >= 0; i--) {
        for (var j = selectArr[i].AmountApplyList.length - 1; j >= 0; j--) {
            for (var k = selectArr[i].AmountApplyList[j].projectlist.length - 1; k >= 0; k--) {
                if (selectArr[i].AmountApplyList[j].projectlist[k].isPerson != selectVal) {
                    selectArr[i].AmountApplyList[j].projectlist.splice(k, 1);
                }
            }
            if (selectArr[i].AmountApplyList[j].projectlist.length == 0) {
                selectArr[i].AmountApplyList.splice(j, 1);
            }
        }
        if (selectArr[i].AmountApplyList.length == 0) {
            selectArr.splice(i, 1);
        }
    }
    var newArr = selectArr;
    return newArr;
}

//是否手动整理过滤函数
function showSelectText02Data(selectVal, selectArr) {
    for (var i = selectArr.length - 1; i >= 0; i--) {
        for (var j = selectArr[i].AmountApplyList.length - 1; j >= 0; j--) {
            for (var k = selectArr[i].AmountApplyList[j].projectlist.length - 1; k >= 0; k--) {
                if (selectArr[i].AmountApplyList[j].projectlist[k].IsOrder == selectVal) {
                    selectArr[i].AmountApplyList[j].projectlist.splice(k, 1);
                }
            }
            if (selectArr[i].AmountApplyList[j].projectlist.length == 0) {
                selectArr[i].AmountApplyList.splice(j, 1);
            }
        }
        if (selectArr[i].AmountApplyList.length == 0) {
            selectArr.splice(i, 1);
        }
    }
    var newArr = selectArr;
    return newArr;
}

//是否超期报账过滤函数
function showSelectText03Data(selectVal, selectArr) {
    for (var i = selectArr.length - 1; i >= 0; i--) {
        for (var j = selectArr[i].AmountApplyList.length - 1; j >= 0; j--) {
            for (var k = selectArr[i].AmountApplyList[j].projectlist.length - 1; k >= 0; k--) {
                if (selectArr[i].AmountApplyList[j].projectlist[k].IsYc != selectVal) {
                    selectArr[i].AmountApplyList[j].projectlist.splice(k, 1);
                }
            }
            if (selectArr[i].AmountApplyList[j].projectlist.length == 0) {
                selectArr[i].AmountApplyList.splice(j, 1);
            }
        }
        if (selectArr[i].AmountApplyList.length == 0) {
            selectArr.splice(i, 1);
        }
    }
    var newArr = selectArr;
    return newArr;
}


//模糊查询
function showSearchText88Data(searchText, selectArr) {
    for (var i = selectArr.length - 1; i >= 0; i--) {
        for (var j = selectArr[i].AmountApplyList.length - 1; j >= 0; j--) {
            for (var k = selectArr[i].AmountApplyList[j].projectlist.length - 1; k >= 0; k--) {
                if (selectArr[i].AmountApplyList[j].projectlist[k].payAddressStr.indexOf(searchText) == -1) {
                    selectArr[i].AmountApplyList[j].projectlist.splice(k, 1);
                }
            }
            if (selectArr[i].AmountApplyList[j].projectlist.length == 0) {
                selectArr[i].AmountApplyList.splice(j, 1);
            }
        }
        if (selectArr[i].AmountApplyList.length == 0) {
            selectArr.splice(i, 1);
        }
    }
    var newArr = selectArr;
    return newArr;
}

//冒泡排序
function rearrangement(arr) {
    var len = arr.length;
    for (var i = 0; i < len; i++) {
        for (var j = 0; j < len - 1 - i; j++) {
            if (arr[j].NowTypeJiSuanJinE > arr[j + 1].NowTypeJiSuanJinE) {//相邻元素两两对比
                var temp = arr[j + 1]; //元素交换
                arr[j + 1] = arr[j];
                arr[j] = temp;
            }
        }
    }
    var reArr = arr.reverse();
    return reArr;
}

function loadTable01Data(resData) {//判断是否离职
    for (var i = 0; i < resData.data.TypeDetailList.length; i++) {
        for (var j = 0; j < resData.data.TypeDetailList[i].AmountApplyList.length; j++) {
            if (resData.data.TypeDetailList[i].AmountApplyList[j].addusername.indexOf("离职") != -1) {
                resData.data.TypeDetailList[i].AmountApplyList[j].addusername = resData.data.TypeDetailList[i].AmountApplyList[j].addusername.split("<")[0] + "（离职）"
            }
            for (var k = 0; k < resData.data.TypeDetailList[i].AmountApplyList[j].projectlist.length; k++) {
                if (resData.data.TypeDetailList[i].AmountApplyList[j].projectlist[k].addusername.indexOf("离职") != -1) {
                    resData.data.TypeDetailList[i].AmountApplyList[j].projectlist[k].addusername = resData.data.TypeDetailList[i].AmountApplyList[j].projectlist[k].addusername.split("<")[0] + "（离职）"
                }
            }
        }

    }

}

var Vue = new Vue({
    el: "#app",
    data() {
        return {
            select01Data: [{value: '0', name: '全部'},
                {value: '1', name: '是'},
                {value: '2', name: '否'}],
            select02Data: [{value: '0', name: '全部'},
                {value: '1', name: '是'},
                {value: '2', name: '否'}],
            select03Data: [{value: '0', name: '全部'},
                {value: '1', name: '是'},
                {value: '2', name: '否'}],
            contentData: [],//content数据
            selectText01: 0,
            selectText02: 0,
            selectText03: 0,
            searchText: "",
            isShowEChart: false
        }
    },
    methods: myMethods,
    watch: myWatch,
    created() {
        //加载初始数据
        loadStartData();
    }
});

//展开第一个表格
function showAndHideTableData_box(obj) {
    var $tableData_box = $(obj).next();
    var $downIcon = $(obj).find(".downIcon");
    if ($tableData_box.is(":hidden")) {
        $(".downIcon").css({
            transform: ""
        });
        $tableData_box.slideDown(200).siblings(".tableData_box").slideUp(200);
        $downIcon.css({
            transform: "rotate(180deg)"
        });
        $(".inner_table").hide();
    } else {
        $tableData_box.slideUp(200);
        $downIcon.css({
            transform: ""
        });
    }
}

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
        var $yesStyle = $tableData_box02.children().children(".tableData_box02").children().children("tbody").children(".yesStyle");
        if ($yesStyle.length == 0) {
            var ff = $tableData_box02.children().children(".tableData_box02").next(".showIsJiSuanJinE");
            ff.hide();
        }
        var $span = $tableData_box02.children().children(".tableData_box02").next(".showIsJiSuanJinE").find("span");
        $span.text("显示 同一条报账中不计入该分类明细");

        var $img = $tableData_box02.children().children(".tableData_box02").next(".showIsJiSuanJinE").find("img");
        $img.css({
            transform: "rotate(180deg)"
        });
        $yesStyle.hide();
    } else {
        $tableData_box02.slideUp(0);
        $downIcon.css({
            transform: "rotate(180deg)"
        });
    }
}

//展开
function isShowIsJiSuanJinE(obj) {
    var $IsJiSuanJinE = $(obj).prev().children().children().eq(1).children(".yesStyle");
    if ($IsJiSuanJinE.length != 0 && $IsJiSuanJinE.is(":hidden")) {
        $IsJiSuanJinE.show();
        $(obj).find("span").text("隐藏 同一条报账中不计入该分类明细");
        $(obj).find("img").css({
            transform: "rotate(0deg)"
        })
    } else {
        $IsJiSuanJinE.hide();
        $(obj).find("img").css({
            transform: "rotate(180deg)"
        });
        $(obj).find("span").text("显示 同一条报账中不计入该分类明细");
    }
}



//eCharts表格
function loadEChart(obj) {
    let newObj=obj.map(function (item,index) {
        return {
            value:item.NowTypeJiSuanJinE,
            name:item.TypeName,
            zb:item.percentage,
        }
    });

    for (let i=newObj.length-1;i>=0;i--){
        if (newObj[i].zb=='0.00%'){
            newObj.splice(i,1)
        }
    }
    var seriesData = newObj;
    console.log(seriesData)

    var myCharts = echarts.init(document.getElementById("eChart-main"));
    var option = {
        tooltip: {
            trigger: 'item',
            formatter: function (data) {
                // console.log(data.data)
                let showStr = "";
                showStr = data.data.name + "：";
                showStr += data.data.zb;
                return showStr
            }
        },
        //饼状图各项颜色：
        color: ['#CCCC33', '#3DA01A', '#43B9B9', '#836FB0', '#CC9933', '#009999',
            '#CCCCFF', '#CCCC66', '#996600', '#FF9966', '#669933', '#660033',
            '#CC6600', '#666633', '#6B99C4', '#EB9947',],
        series: [{
            type: 'pie',
            radius: '160',
            center: ['50%', '35%'],
            selectedMode: 'single',
            data: seriesData,
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
                normal: {
                    label: {        //此处为指示线文字
                        // show: true,
                        // position: 'inner', //标签的位置
                        textStyle: {
                            fontWeight: 400,
                            fontSize: 13,    //文字的字体大小
                            color: "#666"
                        },
                        formatter: function (data) {   //指示线对应文字
                            let showStr = "";
                            showStr = data.data.name + "：";
                            showStr += data.data.zb;
                            return showStr
                        }
                    },
                    labelLine: {    //指示线状态
                        show: true,
                        smooth: 0.2,
                        length: 30,
                        length2: 20
                    }
                }
            }
        }],

    };
    myCharts.setOption(option);
}

//加载图标
function showLoading() {
    var html = "<img src=\"../images/loading.gif\" alt=\"正在加载...\" class='loadImg' style=\"position: absolute;top: 50%;left: 50%;z-index: 999;width: 40px;height: 40px;-webkit-transform: translate(-50%,-50%);-moz-transform: translate(-50%,-50%);-ms-transform: translate(-50%,-50%);-o-transform: translate(-50%,-50%);transform: translate(-50%,-50%);\">";
    $("body").append(html)
}

function hideLoading() {
    $(".loadImg").hide();
}


