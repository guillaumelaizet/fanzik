<template>
  <div class="main-container" id="app">
    <div id="blur"></div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <!-- <img src="../assets/logo-music.png" alt="" width="60px" height="60px"> -->
      <a class="navbar-brand" href="#" v-on:click="goHome()">Music Réseau Social</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <div class="navbar-nav mr-auto">
          <!-- <form class=" ml-0">
            <input type="text" placeholder="search" id="search" [(ngModel)]="search" [ngModelOptions]="{standalone: true}">
            <button type="submit" (click)="submitSearch($event)"></button>
          </form> -->
      </div>
        <ul class="navbar-nav ml-auto">
          <a class="nav-link signin" v-if="token == null || undefined" v-on:click="login()">SignIn</a>
          <a class="nav-link badge-signup" v-if="token == null || undefined" v-on:click="register()"><div>SignUp</div></a>
          <!-- <a class="nav-link admin" v-if="!token">Admin</a> -->
          <a class="nav-link accueil-nav" v-if="token" v-on:click="goToWallMe()"><span class="accueil">{{user.pseudo}}</span></a>
          <a class="nav-link" v-if="token" v-on:click="goToPrivatemessage()">Message</a>
          <a class="nav-link" v-if="token" v-on:click="goToEventsSearch()">Events</a>
          <!-- <a class="nav-link">Pseudo</a> -->
          <a class="nav-link" v-on:click="logout()" v-if="token" style="cursor:pointer"><font-awesome-icon class="icon icon-logout" icon="sign-out-alt"/></a>
        </ul>
      </div>
    </nav>
    <div class="render">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Service from './service/serviceReal.js'
import EventBus from './event-bus.js'
// import Vue from 'vue'

export default {
  name: 'App',

  data () {
    return {
      token: null,
      user: {},
      search: {}
    }
  },

  created: function () {
    this.token = Service.instance.getToken()
    if (this.token) {
      Service.instance.fetchMe().then((response) => {
        this.user = response
        console.log('user info ' + this.user)
      })
    }
    EventBus.$on('isAuthenticate', () => {
      console.log('checked isAuthenticate')
      this.token = Service.instance.getToken()
      if (this.token) {
        Service.instance.fetchMe().then((response) => {
          this.user = response
          console.log('user info ' + this.user)
        })
      }
    })

    EventBus.$on('isLogout', () => {
      console.log('logout')
      this.token = Service.instance.getToken()
      console.log(this.token)
    })
  },

  methods: {
    goHome () {
      this.$router.push('/')
    },

    logout () {
      Service.instance.logout()
      this.$router.push('/')
    },

    login () {
      EventBus.$emit('pressLoginButton')
    },

    register () {
      EventBus.$emit('pressRegisterButton')
    },

    goToPrivatemessage () {
      this.$router.push('/message')
    },

    goToEventsSearch () {
      this.$router.push('events')
      // this.$router.push('/events?access_token=' + window.localStorage.getItem('spotify_access_token'))
    },

    goToWallMe () {
      this.$router.push('home')
    }
  }

}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}

.main-container {
  /* background: url('assets/music-background.jpg') no-repeat; */
  background: #F0F0F0;
  background-attachment: fixed;
  max-width: 100%;
  min-height: 100vh;
  position: relative;
  z-index: 0;
}

.navbar {
  height: 80px;
}

.nav-link {
  text-align: center;
}

.signin {
  margin: auto;
}

.badge-signup, .accueil-nav {
  border: 1px solid transparent;
  padding: 5px;
  border-radius: 5px;
  background: red;
  margin: auto;
  color: #fff !important;
}

.icon-logout {
  color: red !important;
}

.render {
  /* opacity: 0; */
  position: relative;
  min-height: 90vh;
  margin: 0 auto;
  width: 80vw;
  padding-top: 5vh;
  z-index: 2;
}
</style>
