import Vue from 'vue'
import Router from 'vue-router'
import Axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Axios.defaults.baseURL = 'http://192.168.1.112:8088/';
// Axios.defaults.baseURL = 'http://192.168.1.253:8092/';
Vue.config.productionTip = false
Vue.prototype.$axios = Axios;

Vue.use(ElementUI);
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'reference',
      component: resolve => require(['@/components/reference'],resolve)
    },
  ]
})
