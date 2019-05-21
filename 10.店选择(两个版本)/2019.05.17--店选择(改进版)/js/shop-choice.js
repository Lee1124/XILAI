let myData = {
    api: getkevalue().apiurl,
    userid: getkevalue().userid,
    branchid: getkevalue().branchid,
    isroul: false,//true--需要根据用户权限获取店  false--不需要判断权限

    msg: 1,
    myHeight: '',
    myHeight2: '',
    newsData: {},
    showChoiceShopList: [],//筛选后的店展示列表
    showChoiceShopListLength: 0,//筛选后的店的个数
    provinceId: '',//选择的省ID
    selectCityId: '',//选择的市ID
    options: [],//类型选择数据
    typeValue: 1,//类型
    searchInputValue: '',//搜索关键词

    no: 1,
};
let myMethods = {
    //获取类型
    getStartType() {
        if (GetQueryString('selectType') == undefined || isNaN(parseInt(GetQueryString('selectType')))) {
            this.typeValue = 0;
        } else {
            this.typeValue = parseInt(GetQueryString('selectType'));//传类型值有: 喜来婚庆1,仓库2,道具制作3,供应商4
        }
    },
    //点击查询按钮筛选
    searchClick() {
        this.getCityId();
        this.onProOrCityResetData();
        if (this.searchInputValue != '') {
            if (this.typeValue != 0) {
                this.newsData.data.forEach((item, index, arr) => {
                    if (index >= 1) {
                        for (let i = arr[index].showWillShop.length - 1; i >= 0; i--) {
                            if (arr[index].showWillShop[i].bName.indexOf(this.searchInputValue) == -1) {
                                arr[index].showWillShop.splice(i, 1);
                            }
                        }
                    }
                });
            } else {
                this.newsData.data.forEach((item, index, arr) => {
                    if (index == 0) {
                        for (let i = arr[index].showWillShop.length - 1; i >= 0; i--) {
                            if (arr[index].showWillShop[i].bName.indexOf(this.searchInputValue) == -1) {
                                arr[index].showWillShop.splice(i, 1);
                            }
                        }
                    }
                });
            }
        }
        this.getNum();
    },
    //根据省或市重置数据
    onProOrCityResetData() {
        this.newsData.data.forEach((item, index, arr) => {
            if (index >= 1) {
                arr[index].showWillShop = [];
            }
        });
        if (this.provinceId != '') {
            if (this.selectCityId != '') {
                this.newsData.data.forEach((item, index, arr) => {
                    if (index >= 1) {
                        arr[index].list.forEach((item2, index2, arr2) => {
                            if (arr2[index2].City == this.selectCityId) {
                                arr[index].showWillShop.push(arr2[index2]);
                            }
                        });
                    }
                });
            } else {
                this.newsData.data.forEach((item, index, arr) => {
                    if (index >= 1) {
                        arr[index].list.forEach((item2, index2, arr2) => {
                            if (arr2[index2].Province == this.provinceId) {
                                arr[index].showWillShop.push(arr2[index2]);
                            }
                        });
                    }
                });
            }
        } else {
            this.newsData.data.forEach((item, index, arr) => {
                if (index >= 1) {
                    arr[index].list.forEach((item2, index2, arr2) => {
                        arr[index].showWillShop.push(arr2[index2]);
                    });
                }
            });
        }
        this.getNum();
    },

    //点击全部店铺
    allShop() {
        this.clearCitySelected();//清除市选中状态
        this.clearProvZt();//清除省选中状态
        this.resetData();//重置数据
        this.getNum();//重置数量
        this.selectCityId = '';
        this.provinceId = '';
        this.searchClick();
    },
    //将所有省重置未选择状态
    clearProvZt() {
        this.newsData.provdata.forEach((item, index, arr) => {
            arr[index].selected = false;
        });
    },
    //重置全部类型
    resetAllData() {
        this.newsData.data[0].showWillShop = [];
        this.newsData.data.forEach((item, index, arr) => {
            if (index >= 1) {
                arr[index].list.forEach((item1, index1, arr1) => {
                    if (arr[0].showWillShop.indexOf(arr1[index1]) == -1) {
                        arr[0].showWillShop.push(arr1[index1]);
                    }
                })
            }
        });
        this.getNum();
    },
    //重置初始数据
    resetData() {
        this.newsData.data.forEach((item, index, arr) => {
            if (index >= 1) {
                arr[index].showWillShop = arr[index].list;
            }
        });
    },
    //点击关闭按钮删除所选某店
    delChoiceShop(itemObj) {
        this.newsData.data.forEach((item, index, arr) => {
            if (index >= 1) {
                arr[index].list.forEach((item2, index2, arr2) => {
                    if (arr2[index2] == itemObj) {
                        arr2[index2].selected = false;
                    }
                });
            }
        });
        this.showChoiceShop();
    },
    //展示选择的店铺
    showChoiceShop() {
        this.showChoiceShopList = [];
        this.newsData.data.forEach((item, index, arr) => {
            if (index >= 1) {
                arr[index].list.forEach((item2, index2, arr2) => {
                    if (arr2[index2].selected) {
                        if (this.showChoiceShopList.indexOf(arr2[index2]) == -1) {
                            this.showChoiceShopList.push(arr2[index2])
                        }
                    }
                });
            }

        });
        this.showChoiceShopListLength = this.showChoiceShopList.length;
    },
    //选择某店
    changeCheckbox(itemObj) {
        itemObj.selected = !itemObj.selected;
        this.showChoiceShop();//展示选择的店铺
    },

    //设置默认显示店铺
    defaultShowShop(data) {
        //根据登录信息默认店选择
        data.forEach((item, index, arr) => {
            arr[index].list.forEach((item1, index1, arr1) => {
                arr1[index1].selected = false;
                if (getkevalue().branchid == arr1[index1].bId) {
                    arr1[index1].selected = true;
                }
            });
        });
    },
    //获取全部信息(店铺、省市等)
    getNews() {
        let that = this;
        let url = this.api + '/xlapi/SysManage/Hotel/Hotel/GetBranlis?no=' + this.no;
        let data = {
            userid: this.userid,
            isroul: this.isroul
        };
        $.ajax({
            type: 'POST',
            url: url,
            data: data,
            success(res) {
                // console.log(res);
                //增加属性
                res.data.forEach((item, index, arr) => {
                    arr[index].dataLength = 0;
                    arr[index].label = arr[index].name + ' ' + arr[index].dataLength;
                    arr[index].typeValue = index + 1;
                    arr[index].isChoiceThisType = false;
                    arr[index].showWillShop = [];//显示上右店铺
                });
                that.defaultShowShop(res.data);
                that.newsData = res;
                that.options = res.data;
                that.options.unshift({
                    dataLength: '',
                    isChoiceThisType: false,
                    label: "",
                    list: [],
                    name: "全部类型",
                    showWillShop: [],
                    typeValue: 0
                });

                that.onBasisOfTypeChange();//根据类型进行显示
                that.getProId();//获取省ID
                that.getCityId();//获取城市ID
                that.startDefaultData();//默认店铺数据
                that.showChoiceShop();//店铺选择后展示
                that.getNum();//每个类型的数量
            }
        })
    },

    //根据类型进行显示(通用)
    onBasisOfTypeChange() {
        this.clearSelectedType();
        this.newsData.data.forEach((item, index, arr) => {
            if (arr[index].typeValue == this.typeValue) {
                arr[index].isChoiceThisType = true;
            }
        });
    },
    //将所有类型的isChoiceThisType=false(通用)
    clearSelectedType() {
        this.newsData.data.forEach((item, index, arr) => {
            arr[index].isChoiceThisType = false;
        });
    },
    //获取每个类型的数量
    getNum() {
        this.newsData.data.forEach((item, index, arr) => {
            arr[index].label = arr[index].name + ' ' + arr[index].showWillShop.length;
        });
    },

    //获取省id
    getProId() {
        this.newsData.provdata.forEach((item, index, arr) => {
            if (arr[index].selected) {
                this.provinceId = arr[index].id;
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
            if (index >= 1) {
                arr[index].list.forEach((item1, index1, arr1) => {
                    if (arr[0].showWillShop.indexOf(arr1[index1]) == -1) {
                        arr[0].showWillShop.push(arr1[index1]);
                    }
                    if (arr1[index1].City == this.selectCityId) {
                        if (arr[index].showWillShop.indexOf(arr1[index1]) == -1) {
                            arr[index].showWillShop.push(arr1[index1]);
                            arr[index].dataLength = arr[index].showWillShop.length;
                        }
                    }
                })
            }
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
        // this.searchClick();
        this.getNum();
        this.newsData.data.forEach((item, index, arr) => {
            if (index >= 1) {
                arr[index].list.forEach((item1, index1, arr1) => {
                    if (arr[0].showWillShop.indexOf(arr1[index1]) == -1) {
                        arr[0].showWillShop.push(arr1[index1]);
                    }
                })
            }
        });
    },

    //选择省
    choiceProvince(itemObj) {
        this.provinceId = itemObj.id;
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
        this.selectCityId = '';
        this.clearCitySelected();//清除市选中状态
        this.searchClick();
        this.resetAllData();
        this.getNum();
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
                shopIdArr.push({name: arr[index].bName, id: arr[index].bId})
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
            this.getStartType();//获取类型
            this.getNews();//获取信息
            this.myHeight = $(window).height() * 0.54 + 'px';
            this.myHeight2 = $(window).height() * 0.15 + 'px';
        })
    },
    watch: {
        typeValue(newVal) {
            if (newVal == 0) {
                this.allShop();
            }
            this.typeValue = newVal;
            this.onBasisOfTypeChange();//根据类型选择进行显示

        },
        searchInputValue(newVal) {
            this.searchInputValue = newVal;
            if (newVal == '') {
                this.onProOrCityResetData();
                this.resetAllData();
            }
        },
    }
});