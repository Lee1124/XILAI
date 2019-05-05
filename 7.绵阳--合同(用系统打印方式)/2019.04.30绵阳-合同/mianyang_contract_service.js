//设置全局变量
// var api = "http://192.168.1.253:8092";
// var orderid = "0006123a-ee99-4146-8e2a-ce3e7d55ba07";
// var userid = "2";

// var api = getkevalue().apiurl;
// // var api = "https://xilai99.com";
// var orderid = GetQueryString("orderid");
// var adduser = getkevalue().userid;
// var userid = getkevalue().userid;

//数据
var myData = {
    no: 1,//版本状态
    contentData: [],//页面渲染数据
    radioType: 1,//radio选中状态
    shadowType: false,//是否有禁用层  为了模板用

    api: getkevalue().apiurl,
    orderid: "57152652-58cc-4c7e-b6d4-efbed727e695",
    adduser: getkevalue().userid,

    /*甲方信息*/
    xl: {},
    xn: {},
    tel: {},
    yhType: {},

    /*乙方信息*/
    name: {},
    address: {},
    person: {},
    personTel: {},

    /*宴会信息*/
    date: {},
    num: {},
    yhAddress: {},

    /*服务项目*/
    num2: {},
    time1: {},
    time2: {},
    host: {},
    content: {},

    /*money*/
    allMoney: {},
    allMoneyToUpper: {},
    money01: {},
    money01ToUpper: {},
    money02: {},
    money02ToUpper: {},
    money03: {},
    money03ToUpper: {},

    /*合同时间*/
    time3: '',
    time4: '',




};
//事件
var myMethods = {
    //打印
    test() {
        window.print();
    },
    //radio选中状态
    radioClick(e) {
        let val;
        if ($(e.target).attr('data-time') == 'z') {
            this.radioType = 1;
            val = 2;
        } else {
            this.radioType = 2;
            val = 4;
        }
        this.changeNews(null, val);
    },

    getNowTime() {
        var myDate = new Date();
        var nowY = myDate.getFullYear();
        var nowM = myDate.getMonth() + 1;
        var nowD = myDate.getDate();
        var nowDay = nowY + "." + (nowM < 10 ? "0" + nowM : nowM) + "." + (nowD < 10 ? "0" + nowD : nowD);//当前日期
        return nowDay;
    },
    //获取页面信息
    getPageNews() {
        let _this = this;
        let url = this.api + '/xlapi/SysManage/Hotel/Hotel/ShengChengHetong2?orderid=' + this.orderid + '&adduser=' + this.adduser + '&no=' + this.no;
        $.ajax({
            type: 'get',
            url: url,
            success(res) {
                _this.xl = res[0];
                _this.xn = res[1];
                _this.tel = res[2];
                _this.name = res[3];
                _this.address = res[4];
                _this.person = res[5];
                _this.personTel = res[6];
                _this.date = {
                    year: res[7].Value.split('/')[0],
                    date: res[7].Value.split('/')[1],
                    day: res[7].Value.split('/')[2],
                    key: res[7].inspect
                };

                if (res[8].Value == '2') {
                    _this.radioType = 1;
                } else {
                    _this.radioType = 2;
                }
                _this.yhAddress = res[9];
                _this.num = res[10];
                _this.yhType = res[11];
                _this.num2 = res[12];
                _this.time1 = res[13];
                _this.time2 = res[14];
                _this.host = res[15];
                _this.content = res[16];

                _this.allMoney = res[17];
                _this.allMoneyToUpper = res[18];
                _this.money01 = res[19];
                _this.money01ToUpper = res[20];
                _this.money02 = res[21];
                _this.money02ToUpper = res[22];
                _this.money03 = res[23];
                _this.money03ToUpper = res[24];

                _this.time3 = _this.getNowTime();
                _this.time4 = _this.getNowTime();

            }
        })
    },

    // 修改信息
    changeNews(e, val) {
        let _this = this;
        let key;
        let value;
        if (val == 2 || val == 4) {
            key = 'OrderDateOther';
            value = val;
        } else if (val == undefined) {
            key = $(e.target).attr('data-key');
            value = $(e.target).val();
        } else if (val == 'money') {
            key = val;
            value = $(e.target).val();
            _this.numToUppercase(value, 'money');
        } else if (val == 'money01') {
            key = val;
            value = $(e.target).val();
            _this.numToUppercase(value, 'money01');
        } else if (val == 'money02') {
            key = val;
            value = $(e.target).val();
            _this.numToUppercase(value, 'money02');
        } else if (val == 'money03') {
            key = val;
            value = $(e.target).val();
            _this.numToUppercase(value, 'money03');
        }
        let url = this.api + '/xlapi/SysManage/Hotel/Hotel/EditHetong2?no=' + _this.no;
        if (key == 'year') {
            key = 'OrderDate';
            value = value + '/' + $('#month').val() + '/' + $('#day').val();
        } else if (key == 'date') {
            key = 'OrderDate';
            value = $('#year').val() + '/' + value + '/' + $('#day').val();
        } else if (key == 'day') {
            key = 'OrderDate';
            value = $('#year').val() + '/' + $('#month').val() + '/' + value;
        }
        let data = {
            key: key,//是	string	要修改的字段
            value: value,//	是	string	修改后的值
            orderid: this.orderid,//	是	string	订单ID
            userid: getkevalue().userid,//	是	int	修改人
        };
        $.ajax({
            type: 'post',
            url: url,
            data: data,
            success(res) {
                console.log(res)
            }
        })
    },
    // 小写转大写
    numToUppercase(num, type) {
        let _this = this;
        let url = this.api + '/xlapi/SysManage/Hotel/Hotel/MoneyToupper?money=' + num + '&no=' + this.no;
        $.ajax({
            type: 'get',
            url: url,
            success(res) {
                if (type == 'money') {
                    _this.allMoneyToUpper.Value = res;
                } else if (type == 'money01') {
                    _this.money01ToUpper.Value = res;
                } else if (type == 'money02') {
                    _this.money02ToUpper.Value = res;
                } else if (type == 'money03') {
                    _this.money03ToUpper.Value = res;
                }
            }
        })
    }
};


var Vue = new Vue({
    el: "#app",
    data: myData,
    methods: myMethods,
    created() {
        //获取页面信息
        // console.log()
        this.getPageNews();
        if (GetQueryString('disable')!=undefined){
            this.shadowType=true;
        }
    }
});



