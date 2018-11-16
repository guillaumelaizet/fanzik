<template lang="html">
  <div class="wrapper">
    <nav class="nav nav-tabs">
      <a class="nav-item nav-link active" href="#p1" data-toggle="tab">Recherche</a>
      <a class="nav-item nav-link" href="#p2" data-toggle="tab" v-on:click="nearShows()">Concerts a coté</a>
    </nav>
    <div class="tab-content">
      <div class="tab-pane fade show active" id="p1">
        <div class="search-events">
          <form class="form" role="form">
            <div class="form-group">
              <!-- <label for="">Chercher des concerts par artistes ou groupes</label> -->
              <div class="input-group">
                <input id="search" name="search" type="text" class="form-control" v-model="search">
              </div>
            </div>
          </form>
          <div class="artists-list">
            <div class="artist" v-for="artist in artists" :key="artist.id">
              <div class="images">
                <div v-if="artist.images !== []" class="">
                  <div v-for="info in artist.images" :key="info.url">
                    <img  v-bind:src="info.url" alt="" class="artist-image">
                  </div>

                </div>
                <div v-if="JSON.stringify(artist.images) == '[]'" class="">
                  <img src="../../../src/assets/anonyme.jpeg" alt="" class="artist-image">
                </div>
              </div>
              <div class="artist-info">
                {{getFrienddlyName(artist.name)}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="tab-pane fade" id="p2">
        <div class="relatedEvents">
          <div class="relatedEvent" v-for="followed in followedArtist" :key="followed.id">
            <div class="images">
              <div v-if="followed.images !== []" class="">
                <div class="followed-images" v-for="image in followed.images">
                  <img :src="image.url" alt="" class="followed-image">
                </div>
              </div>
              <div v-if="JSON.stringify(followed.images) == '[]'" class="">
                <img src="../../../src/assets/anonyme.jpeg" alt="" class="artist-image">
              </div>
            </div>
            <div class="followed-info">
              {{followed.name}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import route from '../../router/index.js'
import Service from '../../service/serviceReal.js'
// import Vue from 'vue'

export default {
  name: 'events',

  data () {
    return {
      search: '',
      events: null,
      artists: null,
      followedArtist: null
    }
  },

  create: function () {
  },

  mounted: function () {
    let self = this
    //
    let accessToken = Service.instance.getAccessToken()
    this.$el.addEventListener('keyup', this.debounce(function () {
      console.log('debounce')
      Service.instance.fetchArtists(accessToken, self.search).then((response) => {
        console.log(response.body.error)
        if (response.body.error) {
          if (response.body.error.message === 'The access token expired') {
            console.log('enter')
            let refreshToken = Service.instance.getRefreshToken()
            Service.instance.refreshSpotifyToken(refreshToken).then((response) => {
              Service.instance.setAccessToken(response.access_token)
              Service.instance.fetchArtists(accessToken, self.search).then((response) => {
                console.log('entering fetchArtist after refresh token')
                self.artists = response.body.artists.items
                self.artists.forEach((artist) => {
                  return artist.images.splice(1, artist.images.length - 1)
                })
              })
            })
          }
        } else {
          console.log('enter fetchArtists response')
          self.artists = response.body.artists.items
          self.artists.forEach((artist) => {
            return artist.images.splice(1, artist.images.length - 1)
          })
          console.log(self.artists)
        }
      })
    }, 500))
  },

  methods: {
    debounce (vm, duration) {
      let timer
      return () => {
        clearTimeout(timer)
        timer = setTimeout(vm, duration)
      }
    },

    getFrienddlyName (name) {
      if (name.length >= 12) {
        return name.slice(0, 12) + '...'
      }
      else {
        return name
      }
    },

    nearShows () {
      Service.instance.fetchUserWollowing(Service.instance.getAccessToken()).then((following) => {
        console.log(following)
        this.followedArtist = following.artists.items
        this.followedArtist.sort((a, b) => {
          a = a.name.toLowerCase()
          b = b.name.toLowerCase()
          return a === b ? a : a > b ? 1 : -1
        })
        this.followedArtist.forEach((followed) => {
          return followed.images.splice(1, followed.images.length - 1)
        })
      },
      (error) => {
        console.log(error)
      })
    }

    // fetchArtists (token, search) {
    //   Service.instance.fetchArtists(token, search).then((response) => {
    //     if (response.body.error) {
    //       if (response.body.error.message === 'The access token expired') {
    //         let refreshToken = Service.instance.getRefreshToken()
    //         Service.instance.refreshSpotifyToken(refreshToken).then((response) => {
    //           console.log(response)
    //         })
    //       }
    //     } else {
    //       console.log('enter fetchArtists response')
    //       this.artists = response.body.artists
    //       console.log(this.artists)
    //     }
    //   })
    // }

  }
}

</script>

<style lang="css">

.wrapper {
  background: white;
  border-radius: 10px;
  padding: 40px;
}

.nav-item {
  color: red;
}

.nav-item.active {
  background: red !important;
  color: white !important;
}

.search-events {
  margin-top: 40px;
}

#search {
  max-width: 50%;
}

.event {
  display: flex;
}

.artists-list, .relatedEvents {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.artist, .relatedEvent {
  /* padding: 5px; */
  margin: 40px 0;
  width: 200px;
  height: 200px;
  position: relative
}

.artist-image, .followed-image {
  border-radius: 10px;
  width: 200px;
  height: 200px;
}

.artist-info, .followed-info {
  position: absolute;
  top: 80%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 1.2em
}


</style>
