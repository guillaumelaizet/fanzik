import Vue from 'vue'
import Router from 'vue-router'
import Service from '../service/serviceReal.js'
import {globalData} from '../globalData.js'
import Home from '@/components/home/Home'
import WallMe from '@/components/wallme/WallMe'
import Message from '@/components/message/Messages'
import EventBus from '../event-bus.js'
import Events from '@/components/search/Events'
import Artist from '@/components/search/Artist'
import Settings from '@/components/settings/Settings'
import EventDetail from '@/components/search/EventDetail'
import UserList from '@/components/wallme/UserList'
import FriendList from '@/components/search/FriendList'

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
          console.log(Service.instance.getStoredId())
          next('/home?id=' + Service.instance.getStoredId())
        } else {
          next()
        }
      }
    },
    {
      path: '/home',
      name: 'wallme',
      component: WallMe
    },
    {
      path: '/messages',
      name: 'messages',
      component: Message
    },
    {
      path: '/events',
      name: 'events',
      component: Events
    },
    {
      path: '/artist/:id',
      name: 'artist',
      component: Artist
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings
    },
    {
      path: '/eventDetail/:artist/:id',
      name: 'eventdetail',
      component: EventDetail
    },
    {
      path: '/userList',
      name: 'userlist',
      component: UserList
    },
    {
      path: '/friendlist',
      name: 'friendlist',
      component: FriendList

    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.fullpath !== '/') {
    let now = new Date().getTime()
    let tokenValidity = new Date(globalData.getMeInfo().access_token_validate_time).getTime()
    let diff = (now - tokenValidity) / 1000
    if (diff >= 1000) {
      EventBus.$emit('token expired')
    }
  }
  if (from.fullPath !== '/' && to.fullPath === '/' && Service.instance.getToken() !== null) {
    next(from.fullPath)
  } else {
    next()
  }
})

export default router
