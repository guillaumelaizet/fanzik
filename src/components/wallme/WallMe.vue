<template lang="html">
  <div class="blocglobal">
    <button type="button" name="button" class="btn" v-on:click="authSpotify()" v-if="spoti_auth === false">Se connecter avec spotify</button>
    <!-- <button type="button" name="button" v-on:click="getUserPlaylists()"> Afficher playlist</button> -->
    <div class="blocinter">
      <div class="globalEvents">
        <h1>GlobalEvents</h1>
      </div>
      <div class="information">
        <div class="circle">
          Guiguizzz
        </div>
        <div class="">

        </div>
        <div class="info-user">

        </div>
        <div class="friend-user">

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Service from '../../service/serviceReal.js'
import route from '../../router/index.js'
// import Vue from 'vue'

export default {
  name: 'wallme',

  data () {
    return {
      spoti_auth: false
    }
  },

  created: function () {
    console.log('test' + route.history.current.query.code)
    console.log(this.spoti_auth)
    if (Service.instance.getAccessToken() === null && route.history.current.query.code === undefined) {
      console.log('enter auth')
      this.authSpotify()
    }

    if (window.localStorage.getItem('spotify_access_token')) {
      this.spoti_auth = true
    }
    Service.instance.getToken()
    Service.instance.fetchMe().then((response) => {
      if (route.history.current.query.code !== undefined) {
        console.log('entering fetchSpotify info')
        let code = route.history.current.query.code
        let state = route.history.current.query.state
        Service.instance.receiveSpotifyCredentials(code, state).then((response) => {
          console.log(response)
          if (!window.localStorage.getItem('spotify_access_token')) {
            window.localStorage.setItem('spotify_access_token', response.access_token)
          }
          if (!window.localStorage.getItem('spotify_refresh_token')) {
            window.localStorage.setItem('spotify_refresh_token', response.refresh_token)
          }
          this.spoti_auth = true
          // window.location.href = response.url
        })
      }
    })
  },

  methods: {
    authSpotify () {
      Service.instance.spotifyAuthentication().then((response) => {
        console.log(response)
        window.location.href = response.url
      })
    },

    getUserPlaylists () {
      let accessToken = route.history.current.query.access_token
      Service.instance.fetchUserPlaylist(accessToken).then((response) => {
        console.log(response)
      })
    }
  }
}

</script>

<style src="./Wallme.scss" lang="scss">
</style>
