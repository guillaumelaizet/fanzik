<template lang="html">
  <div class="blocglobal">
    <button type="button" name="button" class="btn" v-on:click="AuthSpotify()">Se connecter avec spotify</button>
    <button type="button" name="button" v-on:click="getUserPlaylists()"> Afficher playlist</button>
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

  created: function () {
    // console.log('header in wallme ' + Vue.http.headers.common['Authorization'])
    Service.instance.getToken()
    Service.instance.fetchMe().then((response) => {
      // console.log(response)
      // console.log(route.history.current.query)
      if (route.history.current.query.code) {
        console.log('entering fetchSpotify info')
        let code = route.history.current.query.code
        let state = route.history.current.query.state
        Service.instance.receiveSpotifyCredentials(code, state).then((response) => {
          console.log(response)
          // if (!window.localStorage.getItem('spotify_access_token')) {
          //   window.localStorage.setItem('spotify_access_token', response.access_token)
          // }
          // if (!window.localStorage.getItem('spotify_refresh_token')) {
          //   window.localStorage.setItem('spotify_refresh_token', response.refresh_token)
          // }
          window.location.href = response.url
        })
      }

      // if (route.history.current.query.access_token || window.localStorage.getItem('spotify_access_token') !== '') {
      //   let accessToken = route.history.current.query.access_token
        // Service.instance.fetchUserPlaylist(accessToken).then((response) => {
        //   console.log(response)
        // })
      // }
      // Service.instance.fetchMusics().then((response) => {
      //   console.log(response.data.search.events)
      //   console.log(response.data.search.events.event[0])
      //   let events = response.data.search.events.event
      //   events.forEach((event) => {
      //     console.log(event.performers.performer.name)
      //   })
      // })
    })
  },

  methods: {
    AuthSpotify () {
      Service.instance.spotifyAuthentication().then((response) => {
        console.log(response)

        // document.cookie = 'spotify_auth_state=' + response.cookie
        window.location.href = response.url
      })
    },

    getUserPlaylists () {
      window.localStorage.setItem('spotify_access_token', route.history.current.query.access_token)
      // window.local
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
