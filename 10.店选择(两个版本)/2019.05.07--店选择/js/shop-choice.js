let myData = {
    api: getkevalue().apiurl,
    userid: getkevalue().userid,
    branchid: getkevalue().branchid,
    isroul: false,//true--需要根据用户权限获取店  false--不需要判断权限

    msg: 1,
    myHeight: '',
    myHeight2: '',
    newsData: {},
    filterShopList0: [],//筛选未分类的店列表
    filterShopList: [],//筛选后的店列表
    showChoiceShopList: [],//筛选后的店展示列表
    showChoiceShopListLength: 0,//筛选后的店的个数
    choiceProvinceId: '',//选择的省ID
    selectCityId: '',//选择的市ID

    no:1,
};
let myMethods = {
    //点击关闭按钮删除所选某店
    delChoiceShop(itemObj) {
        this.newsData.data.forEach((item, index, arr) => {
            arr[index].list.forEach((item2, index2, arr2) => {
                if (arr2[index2] == itemObj) {
                    arr2[index2].selected = false;
                }
            });
        });
        this.showChoiceShop();
    },
    //展示选择的店铺
    showChoiceShop() {
        this.showChoiceShopList = [];
        this.newsData.data.forEach((item, index, arr) => {
            arr[index].list.forEach((item2, index2, arr2) => {
                if (arr2[index2].selected) {
                    if (this.showChoiceShopList.indexOf(arr2[index2]) == -1) {
                        this.showChoiceShopList.push(arr2[index2])
                    }
                }
            });
        });
        this.showChoiceShopListLength = this.showChoiceShopList.length;
    },
    //选择某店
    changeCheckbox(itemObj) {
        itemObj.selected = !itemObj.selected;
        this.showChoiceShop();//展示选择的店铺
    },
    //选择当前类型
    spanIsChoiceThis(itemObj) {
        this.filterShopList = [];
        this.newsData.data.forEach((item, index, arr) => {
            arr[index].isChoiceThisType = false;
        });
        itemObj.isChoiceThisType = true;
        this.newsData.data.forEach((item, index, arr) => {
            if (arr[index].isChoiceThisType) {
                this.filterShopList = arr[index].list;
            }
        });
    },

    //设置默认显示店铺
    defaultShowShop() {
        this.newsData.data.forEach((item, index, arr) => {
            if (arr[index].isChoiceThisType) {
                this.filterShopList = arr[index].list;
            }
            arr[index].list.forEach((item2, index2, arr2) => {
                if (arr2[index2].bId == this.branchid) {
                    arr2[index2].isChoice = true;
                }
            });
            this.showChoiceShop();
        });
    },
    //获取全部信息(店铺、省市等)
    getNews() {
        console.log(this.api)
        let that = this;
        let url = this.api + '/xlapi/SysManage/Hotel/Hotel/GetBranlis?no='+this.no;
        let data = {
            userid: this.userid,
            isroul: this.isroul
        };
        $.ajax({
            type: 'POST',
            url: url,
            data: data,
            success(res) {
                console.log(res);
                res.data.forEach((item, index, arr) => {
                    arr[index].dataLength = 0;
                    arr[index].isChoiceThisType = false;
                    arr[index].showWillShop = [];//显示上右店铺
                    arr[0].isChoiceThisType = true;
                });
                res.data.forEach((item, index, arr) => {
                    arr[index].list.forEach((item1, index1, arr1) => {
                        arr1[index1].selected = false;
                        if (getkevalue().branchid==arr1[index1].bId){
                            arr1[index1].selected=true;
                        }
                    });
                });
                that.newsData = res;
                that.getCityId();
                that.startDefaultData();
                that.showChoiceShop();
            }
        })
    },
    //获取市id
    getCityId() {
        this.newsData.provdata.forEach((item, index, arr) => {
            arr[index].citys.forEach((item2, index2, arr2) => {
                if (arr2[index2].selected) {
                    this.selectCityId = arr2[index2].id;
                }
            })
        });
    },

    //初始渲染数据或选择市渲染数据
    startDefaultData() {
        this.newsData.data.forEach((item, index, arr) => {
            arr[index].showWillShop = [];
            arr[index].dataLength = 0;
        });
        this.newsData.data.forEach((item, index, arr) => {
            arr[index].list.forEach((item1, index1, arr1) => {
                if (arr1[index1].City == this.selectCityId) {
                    if (arr[index].showWillShop.indexOf(arr1[index1]) == -1) {
                        arr[index].showWillShop.push(arr1[index1]);
                        arr[index].dataLength = arr[index].showWillShop.length;
                    }
                }
            })
        });
    },

    //选择市
    choiceCity(itemObj) {
        this.newsData.provdata.forEach((item, index, arr) => {
            arr[index].citys.forEach((item2, index2, arr2) => {
                arr2[index2].selected = false;
            });
        });
        itemObj.selected = true;
        this.getCityId();
        this.startDefaultData();
    },

    //选择省
    choiceProvince(itemObj) {
        itemObj.selected = true;
        //选择时地区样式
        this.newsData.provdata.forEach((item, index, arr) => {
            if (arr[index].provinceID != itemObj.provinceID) {
                arr[index].selected = false;
                arr[index].citys.forEach((item2, index2, arr2) => {
                    arr2[index2].selected = false;
                })
            }
        });
        this.newsData.data.forEach((item, index, arr) => {
            arr[index].showWillShop = [];
            arr[index].dataLength = 0;
        });
        //选择时将筛选的加入自己的数组
        this.newsData.data.forEach((item, index, arr) => {
            arr[index].list.forEach((item1, index1, arr1) => {
                if (arr1[index1].Province == itemObj.id) {
                    if (arr[index].showWillShop.indexOf(arr1[index1]) == -1) {
                        arr[index].showWillShop.push(arr1[index1]);
                        arr[index].dataLength = arr[index].showWillShop.length;
                    }
                }
            })
        });
        this.clearCitySelected();//清除市选中状态
    },
    //清除市选中状态
    clearCitySelected() {
        this.newsData.provdata.forEach((item, index, arr) => {
            arr[index].citys.forEach((item2, index2, arr2) => {
                arr2[index2].selected = false;
            });
        });
    },

    //取消回调
    closeDiaLog() {
        parent.closeTip();
    },

    //确认回调
    confirmSelect() {
        let shopIdArr = [];//为了保存返回给父级选择的店铺ID，数组形式
        // let shopNameArr = [];//为了保存返回给父级选择的店铺ID，数组形式
        this.showChoiceShopList.forEach((item, index, arr) => {
            if (shopIdArr.indexOf(arr[index].bId) == -1) {
                // shopIdArr.push(arr[index].bId);
                // shopNameArr.push(arr[index].bName);
                shopIdArr.push({name:arr[index].bName,id:arr[index].bId})
            }
        });
        if (shopIdArr.length == 0) {
            this.$message.error('至少选择一个店铺！');
            return false;
        }
        if (GetQueryString('type') == 'getShopId') {//这样为了:可以写匹配自己的函数名
            parent.getShopId(shopIdArr);
        } else if (GetQueryString('type') == undefined) {
            parent.getShopId(shopIdArr);
        }
    }

};
let vm = new Vue({
    el: '#shopChoice',
    data() {
        return myData;
    },
    methods: myMethods,
    created() {
        this.$nextTick(() => {
            this.getNews();//获取信息
            console.log($(window).height())
            this.myHeight = $(window).height() * 0.54 + 'px';
            this.myHeight2 = $(window).height() * 0.15 + 'px';
        })
    },
});