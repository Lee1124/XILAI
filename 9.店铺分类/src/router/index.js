import Vue from 'vue'
import Router from 'vue-router'
import storeClassifyPage from '@/components/store-classify-page/store-classify-page'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'storeClassifyPage',
      component: storeClassifyPage,
    },
  ]
})





