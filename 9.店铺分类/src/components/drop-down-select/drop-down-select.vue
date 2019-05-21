<template>
  <div id="dropDownSelect">

    <!--<el-select v-model="value1" @change="changeSelectVal1" popper-class="select-common-style" >-->
    <!--<el-option-->
    <!--v-for="item in options1"-->
    <!--:key="item.value1"-->
    <!--:label="item.label1"-->
    <!--:value="item.value1">-->
    <!--</el-option>-->
    <!--</el-select>-->

    <el-cascader
      :options="provinceList"
      v-model="selectedOptions"
      popper-class="provinceSelect"
      @change="handleChange">
    </el-cascader>

  </div>
</template>


<script>
  /*数据*/
  export default {
    name: "drop-down-select",
    props:['data'],
    methods: {
      //状态选择
      // changeSelectVal1(val) {
      //   this.$emit('getSelectZT', val)
      // },
      //获取省市
      getProvinceCity() {
        let url = this.api + '/xlapi/SysManage/BranchManage/BranchComputer/GetProvinces';
        this.$axios({
          method: 'GET',
          url: url,
        }).then(res => {

          res.data.forEach((item, index, arr) => {
            arr[index].children = arr[index].citys;
            arr[index].value = arr[index].id;
            arr[index].label = arr[index].province;
            arr[index].children.forEach((item2, index2, arr2) => {
              arr2[index2].value = arr2[index2].id;
              arr2[index2].label = arr2[index2].city;
            })
          });
          res.data.unshift({
            value:-1,
            label:'全部地区',
          });
          this.provinceList = res.data;
        })
      },
      handleChange(value) {
        let val;
        let Obj;
        if (value==-1){
          val=-1
        } else {
          val=value[1];
        }
        Obj={
          val:val,
          itemObj:this.data
        };
        this.$emit('getSelectZT', Obj)
      },
    },
    data() {
      return {
        provinceList: [],
        options: [{
          value: 'zhinan',
          label: '指南',
          children: [{
            value: 'shejiyuanze',
            label: '设计原则',
            children: [{
              value: 'yizhi',
              label: '一致'
            }, {
              value: 'fankui',
              label: '反馈'
            }, {
              value: 'xiaolv',
              label: '效率'
            }, {
              value: 'kekong',
              label: '可控'
            }]
          }, {
            value: 'daohang',
            label: '导航',
            children: [{
              value: 'cexiangdaohang',
              label: '侧向导航'
            }, {
              value: 'dingbudaohang',
              label: '顶部导航'
            }]
          }]
        }],
        selectedOptions: [-1],



        api: getkevalue().apiurl,//获取通用api
        // api: 'http://192.168.1.253:8092',//获取通用api

      }
    },
    created() {
      //获取当前用户有权限的店铺
      // this.getSelectBranId();
      this.$nextTick(() => {
        this.getProvinceCity();
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
    width: 160px;
    height: 32px;
    background: transparent;
    color: #4c4c4c;
  }

  #dropDownSelect .el-select__caret {
    line-height: 32px;
  }

  #dropDownSelect .el-select .el-input.is-focus .el-input__inner {
    border-color: #BB9860 !important;
  }

  #dropDownSelect .el-cascader .el-input.is-focus .el-input__inner, #dropDownSelect .el-input__inner:focus {
    border-color: #BB9860 !important;
  }

  .provinceSelect .el-cascader-menu__item.is-active {
    color: #BB9860 !important;
  }


</style>
