import Vue from 'vue'
import Router from 'vue-router'
import Service from '../service/serviceReal.js'
import Home from '@/components/home/Home'
import WallMe from '@/components/wallme/WallMe'
import Message from '@/components/message/Message'
import EventBus from '../event-bus.js'
import Events from '@/components/search/Events'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      beforeEnter: (to, from, next) => {
        if (from.fullPath === '/' && Service.instance.getToken() !== null) {
          console.log('redirected to home')
          EventBus.$emit('isAuthenticate')
          next('/home')
          // next('/home?access_token=' + window.localStorage.getItem('spotify_access_token'))
        } else {
          next()
        }
      }
    },
    {
      // path: '/home?access_token=' + window.localStorage.getItem('spotify_access_token'),
      path: '/home',
      // query: 'access_token' + window.localStorage.getItem('spotify_access_token') + '&refresh_token' + window.localStorage.getItem('spotify_refresh_token'),
      name: 'wallme',
      component: WallMe
    },
    {
      path: '/message',
      name: 'message',
      component: Message
    },
    {
      path: '/events',
      // query: 'access_token' + window.localStorage.getItem('spotify_access_token') + '&refresh_token' + window.localStorage.getItem('spotify_refresh_token'),
      name: 'events',
      component: Events
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (from.fullPath !== '/' && to.fullPath === '/' && Service.instance.getToken() !== null) {
    next(from.fullPath)
  } else {
    next()
  }
})

export default router
