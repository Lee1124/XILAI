// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import manjs from '../static/js/mainjs';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
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


/* eslint-disable no-new */
var vm = new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
