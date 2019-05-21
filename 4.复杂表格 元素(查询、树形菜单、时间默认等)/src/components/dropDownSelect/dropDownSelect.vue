<template>
  <div id="app">
    <el-select v-model="value1" @change="changeSelectVal1">
      <el-option
        v-for="item in options1"
        :key="item.value1"
        :label="item.label1"
        :value="item.value1">
      </el-option>
    </el-select>

    <el-select v-model="value2" @change="changeSelectVal2">
      <el-option
        v-for="item in options2"
        :key="item.value2"
        :label="item.label2"
        :value="item.value2">
      </el-option>
    </el-select>
  </div>
</template>


<script>
  /*数据*/
  export default {
    name: "dropDownSelect",
    methods: {
      changeSelectVal1(val) {
        this.$emit('getSelectVal1',val)
      },
      changeSelectVal2(val) {
        this.$emit('getSelectVal2',val)
      },
      getSelectBranId() {
        let data={
          parentid:'22',//类型 例 22
          CompanyType:'',//类型 例 酒店，租赁
          name:'',//查询店名
          userid:getkevalue().userid,//登录人
        };
        this.$axios({
          method: 'post',
          url: this.api + '/xlapi/SysManage/Hotel/Hotel/SelectBranlis',
          data: data,
        }).then(res => {
          if (res.status == 200) {
            this.options2=res.data;
            this.options2=this.options2.map((item)=>{
              return {
                value2:item.BRANCH_ID,
                label2:item.BRANCH_NAME
              }
            });
          }
        }, err => {
          console.log(err)
        })
      }
    },
    data() {
      return {
        /*搜索*/
        options1: [
          {value1: '-1', label1: '全部类型'},
          {value1: '0', label1: '租赁品'},
          {value1: '1', label1: '消耗品'},
          {value1: '2', label1: '服务品'},
          {value1: '3', label1: '定制道具'},
          {value1: '4', label1: '仓库耗材'},
          {value1: '5', label1: '本店硬件'}
        ],
        value1: '-1',
        options2: [],
        value2: '喜来成都店',
        api: getkevalue().apiurl,//获取通用api
        // api: 'http://192.168.1.253:8092',//获取通用api
      }
    },
    created() {
      this.getSelectBranId();
    }
  }
</script>

<style scoped>
  #app {
    padding: 0;
  }

  /deep/ .el-input__inner {
    width: 158px;
    height: 30px;
    border: 1px solid #DDD;
    color: #323232;
  }

  /deep/ .el-select__caret {
    line-height: 32px;
  }

  /deep/ .el-select .el-input.is-focus .el-input__inner {
    border-color: #BB9860;
  }

  /deep/ .el-select .el-input__inner:focus {
    border-color: #BB9860;
  }

  .el-select-dropdown__item.selected {
    color: #BB9860;
  }

  .el-select-dropdown__item {
    width: 142px;
    margin: 0 auto;
    color: #666;
    padding: 0 14px;
  }


</style>
