// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import Axios from 'axios';


// Axios.defaults.baseURL = 'https://xilai99.com/';
Vue.config.productionTip = false;
Vue.prototype.$axios = Axios;

Axios.defaults.baseURL = 'http://192.168.1.79:8088/';


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
