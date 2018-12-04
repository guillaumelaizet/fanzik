<template>
  <div class="main-container" id="app">
    <div id="blur"></div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <!-- <img src="../assets/logo-music.png" alt="" width="60px" height="60px"> -->
      <a class="navbar-brand" href="#">FANZIK <span>Music Réseau Social</span></a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <div class="navbar-nav mr-auto">
      </div>
        <ul class="navbar-nav ml-auto">
          <a class="nav-link signin" v-if="token == null || undefined" v-on:click="login()">SignIn</a>
          <a class="nav-link badge-signup" v-if="token == null || undefined" v-on:click="register()"><div>SignUp</div></a>
          <a class="nav-link admin" v-if="token && user.id_flag">Admin</a>
          <a class="nav-link settings-nav" v-on:click="goToFriendList()" v-if="token"><font-awesome-icon class="icon icon-users" icon="users"/></a>
          <a class="nav-link" v-if="token" v-on:click="goToPrivatemessage()"><font-awesome-icon class="icon icon-icon-envelope" icon="envelope-open"/></a>
          <a class="nav-link" v-if="token" v-on:click="goToEventsSearch()"><font-awesome-icon class="icon icon-icon-calendar" icon="calendar-alt" aria-hidden="true" title="events" alt="title"/></a>
          <!-- <a class="nav-link">Pseudo</a> -->
          <a class="nav-link accueil-nav" v-if="token" v-on:click="goToWallMe()">
            <span class="accueil">
              <img class="nav-img" v-if="user.avatar !== undefined" :src="user.avatar"/>
              <img class="nav-img" v-else src="./assets/anonyme.jpeg" alt="">
            </span></a>
          <a class="nav-link" v-on:click="logout()" v-if="token" style="cursor:pointer"><font-awesome-icon class="icon icon icon-logout" icon="sign-out-alt" title="title" alt="title"/></a>
        </ul>
      </div>
    </nav>
    <div class="render">
      <router-view :me="user" :spoti="spoti"></router-view>
    </div>
    <footer class="page-footer font-small bg-dark">

      <!-- Copyright -->
      <div class="footer-copyright text-center py-3 color-light ">© 2018 Copyright : Fanzik.org
      </div>
      <!-- Copyright -->

    </footer>

  </div>
</template>

<script>
import Service from './service/serviceReal.js'
import EventBus from './event-bus.js'
import {globalData} from './globalData.js'
// import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

export default {
  name: 'App',

  // components: {
  //   PulseLoader
  // },

  data () {
    return {
      token: null,
      user: {},
      search: {},
      spoti: null
    }
  },

  created: function () {
    EventBus.$on('token expired', () => {
      console.log('token expired')
      Service.instance.fetchMe().then((response) => {
        let refreshToken = response.refresh_token
        Service.instance.refreshSpotifyToken(refreshToken).then((response) => {
          Service.instance.saveNewToken(response.access_token).then((response) => {
            this.user = response
            globalData.setMeInfo(response)
          })
        })
      })
    })
    this.token = Service.instance.getToken()
    if (this.token) {
      Service.instance.fetchMe().then((response) => {
        this.user = response
        let accessToken = response.access_token
        let accessTokenValidity = response.access_token_validate_time
        let now = new Date().getTime()
        let tokenValidity = new Date(accessTokenValidity).getTime()
        let diff = (now - tokenValidity) / 1000
        if (diff >= 30) {
          let refreshToken = response.refresh_token
          Service.instance.refreshSpotifyToken(refreshToken).then((response) => {
            Service.instance.saveNewToken(response.access_token).then((response) => {
              this.user = response
              console.log(globalData.me)
              globalData.setMeInfo(response)
            })
          })
        }

        Service.instance.fetchSpotifyInfo(accessToken).then((response) => {
          this.spoti = response.body
          globalData.setSpotiMeInfo(response.body)
        })
      })
    }
    EventBus.$on('isAuthenticate', () => {
      this.token = Service.instance.getToken()
      if (this.token) {
        Service.instance.fetchMe().then((response) => {
          this.user = response
        })
      }
    })

    EventBus.$on('isLogout', () => {
      console.log('logout')
      this.token = Service.instance.getToken()
      const url = 'https://accounts.spotify.com/en/logout'
      const spotifyLogoutWindow = window.open(url, 'Spotify Logout', 'width=700,height=500,top=40,left=40')
      setTimeout(() => spotifyLogoutWindow.close(), 20)
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
      this.$router.push('/messages')
    },

    goToEventsSearch () {
      this.$router.push('/events')
    },

    goToWallMe () {
      console.log(this.user)
      this.$router.push('/home?id=' + this.user._id)
      EventBus.$emit('goToUserWall')
    },

    goToFriendList () {
      this.$router.push('/friendlist')
    }
  }

}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Roboto+Condensed:700');

#app {
  font-family: 'Roboto Condensed', sans-serif;
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

.navbar-brand span{
  font-size: 0.8em;
  margin-left: 5px;
}

.navbar {
  /* height: 80px; */
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
  /* background: red; */
  margin: auto;
  color: #fff !important;
}

.badge-signup {
  background: red;
}

.acceuil-nav {
}

.acceuil {
  width: 50px;
  height: 50px;
  border-radius: 50px;
}

.nav-img {
  width: 30px;
  height: 30px;
  border-radius: 30px;
}

.icon-logout {
  color: red !important;
}

.icon {

  transform: scale(1.3, 1.3)
}
.render {
  /* opacity: 0; */
  position: relative;
  min-height: 90vh;
  margin: 0 auto;
  width: 80vw;
  padding: 5vh 0;
  z-index: 2;
}

.footer-copyright {
  color: white;
}
</style>
