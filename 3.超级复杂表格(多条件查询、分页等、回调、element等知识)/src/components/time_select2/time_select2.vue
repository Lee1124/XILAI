<template>
  <div id="app_time_select">
    <div class="block">
      <el-date-picker
        v-model="value1"
        type="date"
        @change="changeStartTime"
        placeholder="开始日期">
      </el-date-picker>
    </div>
    <div class="time_line"></div>
    <div class="block">
      <el-date-picker
        v-model="value2"
        type="date"
        @change="changeEndTime"
        placeholder="截止日期">
      </el-date-picker>
    </div>
  </div>
</template>

<script>
  export default {
    name: "time_select2",
    methods: {
      changeStartTime(val) {
        //格式化转化
        let date = new Date(+val + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '').replace(/-/g, '/').split(" ")[0];
        if (date=='1970/01/01'){
          date=''
        }
        this.$emit('getStartTime',date)
      },
      changeEndTime(val) {
        //格式化转化
        let date = new Date(+val + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '').replace(/-/g, '/').split(" ")[0];
        if (date=='1970/01/01'){
          date=''
        }
        this.$emit('getEndTime',date)
      },
    },
    data() {
      return {
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
        value1: '',
        value2: '',
      };
    }
  }
</script>

<style>
  #app {
    padding: 0;
  }

  #app_time_select {
    display: flex;
    align-items: center;
  }

  #app_time_select .el-input__inner {
    width: 160px;
    height: 32px;
  }

  #app_time_select .el-input__icon {
    line-height: 32px;
  }

  #app_time_select .el-input__inner:focus {
    border-color: #BB9860;
  }

  .el-date-table td.today span {
    color: #BB9860;
  }

  .el-date-table td.current:not(.disabled) span {
    background: #BB9860;
  }

  .el-date-table td.available:hover {
    color: #BB9860;
  }

  #app_time_select .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 160px;
  }

  .time_line {
    width: 12px;
    height: 1px;
    background: #ccc;
    margin: 0 8px;
  }
</style>
