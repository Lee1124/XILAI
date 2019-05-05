// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import manjs from '../static/js/mainjs';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
Vue.use(preview);
import Axios from 'axios';


// import store from './storeall/store'
Vue.use(ElementUI);
Vue.use(manjs);

Vue.config.productionTip = false;
// Axios.defaults.baseURL = 'https://xilai99.com/';
// Axios.defaults.baseURL = 'http://192.168.1.112:8088/';
Axios.defaults.baseURL = 'http://192.168.1.63:8088/';
Vue.prototype.$axios = Axios;
// Vue.prototype.$store = store;

Vue.directive('loadmore', {
  bind(el, binding) {
    const selectWrap = el.querySelector('.el-table__body-wrapper');
    selectWrap.addEventListener('scroll', function () {
      const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight;
      binding.value(scrollDistance,this.scrollTop)
    })
  }
});


//全局获取30天时间段
Vue.prototype.getTime=function () {
  var myDate = new Date();
  myDate.setDate(myDate.getDate() + 1);//加一天
  var nowY = myDate.getFullYear();
  var nowM = myDate.getMonth() + 1;
  var nowD = myDate.getDate();
  var enddate = nowY + "/" + (nowM < 10 ? "0" + nowM : nowM) + "/" + (nowD < 10 ? "0" + nowD : nowD);//当前日期
  //获取三十天前日期
  var lw = new Date(myDate - 1000 * 60 * 60 * 24 * 30);//最后一个数字30可改，30天的意思
  var lastY = lw.getFullYear();
  var lastM = lw.getMonth() + 1;
  var lastD = lw.getDate();
  var startdate = lastY + "/" + (lastM < 10 ? "0" + lastM : lastM) + "/" + (lastD < 10 ? "0" + lastD : lastD);//三十天之前日期
  return {
    startDate: startdate,
    endDate: enddate
  }
};


/* eslint-disable no-new */
var vm = new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
});
