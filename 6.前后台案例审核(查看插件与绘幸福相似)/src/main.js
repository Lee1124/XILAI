// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import manjs from '../static/js/mainjs';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// import preview from 'vue-photo-preview'
// import 'vue-photo-preview/dist/skin.css'
// Vue.use(preview);
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


//自定义指令
Vue.directive('marginRight', {
  bind(el, binding) {
    el.style.marginRight = parseInt(binding.value) + 'px'
  }
});

//定义全局获取地址栏信息返回值的方法
Vue.prototype.getUrlStyle=function () {
  return GetQueryString('urlAddress');
  // return 'white';
  // return 'black';
};

// Vue.directive('loadmore', {
//   bind(el, binding) {
//     const selectWrap = el.querySelector('.el-table__body-wrapper');
//     selectWrap.addEventListener('scroll', function () {
//       const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight;
//       binding.value(scrollDistance,this.scrollTop)
//     })
//   }
// });
//
//
//全局获取相应的时间段
Vue.prototype.getTime=function (dayNumber) {//参数1：天数
  var myDate = new Date();
  myDate.setDate(myDate.getDate() + 1);//加一天
  var nowY = myDate.getFullYear();
  var nowM = myDate.getMonth() + 1;
  var nowD = myDate.getDate();
  var endTime = nowY + "/" + (nowM < 10 ? "0" + nowM : nowM) + "/" + (nowD < 10 ? "0" + nowD : nowD);//当前日期(注意：多加了1天)
  //获取相应的日期
  var lw = new Date(myDate - 1000 * 60 * 60 * 24 * parseInt(dayNumber));//最后一个数字是几天的意思
  var lastY = lw.getFullYear();
  var lastM = lw.getMonth() + 1;
  var lastD = lw.getDate();
  var startTime = lastY + "/" + (lastM < 10 ? "0" + lastM : lastM) + "/" + (lastD < 10 ? "0" + lastD : lastD);
  return {
    startTime: startTime,
    endTime: endTime
  }
};


/* eslint-disable no-new */
var vm = new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>',

});
