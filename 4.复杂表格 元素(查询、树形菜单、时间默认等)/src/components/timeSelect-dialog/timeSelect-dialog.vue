<template>
  <div id="app" class="timeSelectStyle">
    <div class="block">
      <el-date-picker
        v-model="value1"
        type="date"
        @change="changeStartTime"
        popper-class="timeStyle"
        placeholder="开始日期">
      </el-date-picker>
    </div>
    <div class="time_line"></div>
    <div class="block">
      <el-date-picker
        v-model="value2"
        type="date"
        popper-class="timeStyle"
        @change="changeEndTime"
        placeholder="截止日期">
      </el-date-picker>
    </div>
  </div>
</template>

<script>
  export default {
    name: "time_select2",
    props:['getSTime','getETime'],
    methods: {
      changeStartTime(val) {
        //格式化转化
        let date = new Date(+val + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '').replace(/-/g, '/').split(" ")[0];
        if (date == '1970/01/01') {
          date = ''
        }
        this.$emit('getStartTime2', date)
      },
      changeEndTime(val) {
        //格式化转化
        let date = new Date(+val + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '').replace(/-/g, '/').split(" ")[0];
        if (date == '1970/01/01') {
          date = ''
        }
        this.$emit('getEndTime2', date)
      },
      updateTime() {
        this.value1=this.getSTime;
        this.value2=this.getETime;
      }
    },
    created() {

    },
    mounted(){
      this.value1=this.getSTime;
      this.value2=this.getETime;
    },
    data() {
      return {
        value1: '',
        value2: '',
      };
    }
  }
</script>

<style>
  .timeSelectStyle {
    padding: 0;
    display: flex;
    align-items: center;
  }

  .timeSelectStyle .el-input__inner {
    width: 160px;
    height: 30px;
  }

  .timeSelectStyle .el-input__icon {
    line-height: 32px;
  }

  .timeSelectStyle .el-input__prefix {
    right: 5px;
    left: auto;
  }

  .timeSelectStyle .el-input__suffix {
    right: 30px;
  }

  .timeSelectStyle .el-input--prefix .el-input__inner {
    padding-left: 12px;
  }

  .timeSelectStyle .el-input__inner:focus {
    border-color: #BB9860;
  }

  .timeStyle .el-date-table td.today span {
    color: #BB9860;
  }

  .timeStyle .el-date-table td.current:not(.disabled) span {
    background: #BB9860;
  }

  .timeStyle .el-date-table td.available:hover {
    color: #BB9860;
  }

  .timeSelectStyle .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 160px;
  }

  .time_line {
    width: 12px;
    height: 1px;
    background: #ccc;
    margin: 0 8px;
  }


</style>
