import Vue from 'vue'
import Router from 'vue-router'
import casePassPage from '@/components/look-through-page/look-through-page'
import casePassPage01Case from '@/components/look-through-page-01case/look-through-page-01case'
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'casePassPage',
      component: casePassPage,
      children:[
        {
          path: '/casePassPage01Case',
          name: 'casePassPage01Case',
          component: casePassPage01Case,
        },
      ]
    },
  ]
})





