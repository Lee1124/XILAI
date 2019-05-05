import Vue from 'vue'
import Router from 'vue-router'
import carouselPage from '@/components/carousel-view/carousel-view'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'carouselPage',
      component: carouselPage,
      redirect: "/carouselPage",
      children:[
        {
          path: '/carouselPage',
          name: 'carouselPage',
          component: carouselPage,
        }
      ]
    },
  ]
})





