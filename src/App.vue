<template>
  <div class="main-container" id="app">
    <div id="blur"></div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <!-- <img src="../assets/logo-music.png" alt="" width="60px" height="60px"> -->
      <a class="navbar-brand" href="#">Music Réseau Social</a>
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
          <a class="nav-link" v-if="!token" v-on:click="login()">Login</a>
          <a class="nav-link" v-if="!token">Register</a>
          <a class="nav-link admin" v-if="!token">Admin</a>
          <a class="nav-link accueil-nav" v-if="token"><span class="accueil">{{user.pseudo}}</span></a>
          <!-- <a class="nav-link">Message</a> -->
          <!-- <a class="nav-link">Friends</a> -->
          <!-- <a class="nav-link">Pseudo</a> -->
          <a class="nav-link" v-on:click="logout()" v-if="token" style="cursor:pointer">Logout</a>
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
// import EventBus from './event-bus.js'

export default {
  name: 'App',

  data () {
    return {
      token: null,
      user: {}
    }
  },

  // created: function () {
  //   this.token = Service.instance.getToken()
  //   EventBus.$on('isAuthenticate', () => {
  //     console.log('checked isAuthenticate')
  //     this.token = Service.instance.getToken()
  //     if (this.token) {
  //       Service.instance.fetchMe().then((response) => {
  //         console.log(response)
  //         this.user = response.body
  //         console.log(this.user)
  //       })
  //     }
  //   })
  // },

  // computed: {
  //   token () {
  //   }
  // },

  methods: {
    logout () {
      Service.instance.logout()
      // this.token = false
      this.$router.push('/')
    }
  }

  // mounted: {
  //   token () {
  //     return window.localStorage('token') !== undefined ? true : false
  //   }
  // }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.main-container {
  /* background: url('assets/music-background.jpg') no-repeat; */
  background: whitesmoke;
  background-attachment: fixed;
  max-width: 100%;
  min-height: 100vh;
  position: relative;
  z-index: 0;
}

.navbar {
  height: 80px;
}

.render {
  /* opacity: 0; */
  position: relative;
  min-height: 90vh;
  margin: 0 auto;
  width: 70vw;
  padding-top: 5vh;
  z-index: 2;
}
</style>
