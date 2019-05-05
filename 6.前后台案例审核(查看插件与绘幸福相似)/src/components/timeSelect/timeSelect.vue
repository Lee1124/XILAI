<template>
  <div id="app" v-marginRight="25"
       :class="['timeSelectStyle',{'timeSelectStyle-white':urlAddress=='white','timeSelectStyle-black':urlAddress=='black'}]">
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

  /*数据*/
  let myData = {
    value1: '',
    value2: '',
    urlAddress: '',
  };

  export default {
    name: "time_select2",
    methods: {
      changeStartTime(val) {
        //格式化转化
        let date = new Date(+val + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '').replace(/-/g, '-').split(" ")[0];
        if (date == '1970-01-01') {
          date = ''
        }
        this.$emit('getStartTime', date)
      },
      changeEndTime(val) {
        //格式化转化
        let date = new Date(+val + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '').replace(/-/g, '-').split(" ")[0];
        if (date == '1970-01-01') {
          date = ''
        }
        this.$emit('getEndTime', date)
      },
      //通过父级调用更新
      updateTime(obj) {
        this.value1 = obj.startTime;
        this.value2 = obj.endTime;
      }
    },
    mounted() {

    },
    created() {
      // this.value1 = this.getTime().startDate;
      // this.value2 = this.getTime().endDate;
      this.$nextTick(() => {
        this.urlAddress = this.getUrlStyle();
      });
    },
    data() {
      return myData;
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

  .timeSelectStyle-white .el-input--prefix .el-input__inner {
    border: 1px solid #DDD;
  }

  .timeSelectStyle-white .el-input--prefix .el-input__inner::placeholder {
    color: #4C4C4C;
  }

  .timeSelectStyle-black .el-input--prefix .el-input__inner {
    border: 1px solid #909399;
    background: transparent;
    color: #ccc;
  }

  .timeSelectStyle-black .el-input--prefix .el-input__inner::placeholder {
    color: #ccc;
  }

  .timeSelectStyle-white .el-input__icon {
    color: #BBBBBB;
  }

  .timeSelectStyle-black .el-input__icon {
    color: #909399;
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
