<template>
  <div id="dropDownSelect" class="floatL"
       :class="{'dropDownSelect-white':urlAddress=='white','dropDownSelect-black':urlAddress=='black'}">
    <el-select v-model="value2" @change="changeSelectVal2" popper-class="select-common-style" v-show="isShowDrop1">
      <el-option
        v-for="item in options2"
        :key="item.value2"
        :label="item.label2"
        :value="item.value2">
      </el-option>
    </el-select>

    <el-select v-model="value1" @change="changeSelectVal1" popper-class="select-common-style" v-show="isShowDrop2">
      <el-option
        v-for="item in options1"
        :key="item.value1"
        :label="item.label1"
        :value="item.value1">
      </el-option>
    </el-select>

  </div>
</template>


<script>
  /*数据*/
  export default {
    name: "dropDownSelect",
    methods: {
      //状态选择
      changeSelectVal1(val) {
        this.$emit('getSelectZT', val)
      },
      //店铺选择
      changeSelectVal2(val) {
        this.$emit('getSelectBranch', val)
      },
      //获取当前用户有权限的店铺
      getSelectBranId() {
        let data = {
          UserId: getkevalue().userid,//登录人
        };
        this.$axios({
          method: 'post',
          url: this.api + '/xlapi/OrderManager/NewPingFen/NewPingFen/GetNowUserBranch',
          data: data,
        }).then(res => {
          if (res.status == 200) {
            this.options2 = res.data.data;
            this.options2 = this.options2.map((item) => {
              return {
                value2: item.BranchId,
                label2: item.BranchName
              }
            });
            this.options2.unshift({
              value2: -1,
              label2: '全部店'
            });
            //默认全部店铺
            this.options2.forEach((item, index, arr) => {
              // if (arr[index].value2 == getkevalue().branchid) {
              //   this.value2 = arr[index].value2;
              // }
              if (arr[index].value2==-1){
                this.value2 = arr[index].value2;
              }
            })
          }
        }, err => {
          console.log(err)
        })
      }
    },
    data() {
      return {
        isShowDrop1: true,
        isShowDrop2: true,
        urlAddress: '',
        // urlAddress:'black',
        /*搜索*/
        /* 0全部 1等待审核 2退回 3通过*/
        options1: [
          {value1: 0, label1: '全部状态'},
          {value1: 1, label1: '待审核'},
          {value1: 2, label1: '已退回'},
          {value1: 3, label1: '已通过'}
        ],
        value1: 0,
        options2: [
          // {label2: "喜来德阳店", value2: 1},
          // {label2: "成都店", value2: 2}
        ],
        value2: 0,
        api: getkevalue().apiurl,//获取通用api
        // api: 'http://192.168.1.253:8092',//获取通用api

      }
    },
    created() {
      //获取当前用户有权限的店铺
      this.getSelectBranId();
      this.$nextTick(() => {
        this.urlAddress = this.getUrlStyle();
        if (this.$route.query.id == 2) {
          this.isShowDrop2 = false;
        }
      });

    }
  }
</script>

<style>
  #dropDownSelect {
    padding: 0;
  }

  #dropDownSelect .el-select:first-child {
    margin-right: 10px;
  }

  #dropDownSelect .el-input__inner {
    width: 158px;
    height: 30px;
    background: transparent;
  }

  .dropDownSelect-white .el-input__inner {
    border: 1px solid #DDD;
    color: #4C4C4C;
  }

  .dropDownSelect-black .el-input__inner {
    border: 1px solid #909399 !important;
    color: #CCC;
  }

  #dropDownSelect .el-select__caret {
    line-height: 32px;
  }

  #dropDownSelect .el-select .el-input.is-focus .el-input__inner {
    border-color: #BB9860 !important;
  }

  #dropDownSelect .el-select .el-input__inner:focus {
    border-color: #BB9860 !important;
  }

  .select-common-style .el-select-dropdown__item.selected {
    color: #BB9860 !important;
  }

  .select-common-style .el-select-dropdown__item {
    width: 142px;
    margin: 0 auto;
    color: #666;
    padding: 0 14px;
  }


</style>
