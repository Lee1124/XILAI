<template>
  <div id="app" class="mySelect">
    <el-select v-model="value" placeholder="请选择" @change="changeSelectVal">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>


<script>
  /*数据*/
  export default {
    name: "drop_down_select",
    methods: {
      changeSelectVal(val) {
        let selectVal = "";
        if (val == 1) {
          selectVal = 'orderdate';
        } else if (val == 2) {
          selectVal = 'adddate';
        }
        this.$emit('getSelectVal', selectVal)
      }
    },
    data() {
      return {
        options: [{
          value: '1',
          label: '服务日期'
        }, {
          value: '2',
          label: '添加时间'
        }],
        value: '1'
      }
    },
  }
</script>

<style scoped>
  #app {
    padding: 0;
  }

  /deep/ .el-input__inner {
    width: 120px;
    height: 32px;
    border: 1px solid #DDD;
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

</style>
