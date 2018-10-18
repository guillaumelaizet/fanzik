import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home/Home'
import WallMe from '@/components/wallMe/WallMe'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/wallme',
      name: 'wallme',
      component: WallMe
    }
  ]
})
