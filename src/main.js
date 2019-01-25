// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import BootstrapVue from 'bootstrap-vue'
import AuthService from './service/authService.js'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCoffee, faUser, faLock, faEnvelopeOpen, faUsers, faMusic, faThumbsUp, faSignOutAlt, faCog, faCalendarAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faCoffee, faUser, faUsers, faLock, faMusic, faEnvelopeOpen, faThumbsUp, faSignOutAlt, faCog, faCalendarAlt)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(VueResource)

AuthService.create()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
