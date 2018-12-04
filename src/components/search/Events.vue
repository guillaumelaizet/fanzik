<template lang="html">
  <div class="wrapper" id="wrapper">
    <nav class="nav nav-tabs">
      <a v-if="me.access_token" class="nav-item nav-link active show" href="#p1" data-toggle="tab" >Recherche</a>
      <a v-else class="nav-item nav-link active show" href="#p1" data-toggle="tab" >Recherche d'évènements</a>
      <a class="nav-item nav-link" data-toggle="tab" href="#p3" v-on:click="fetchFavoriteEvents()">Favoris</a>
    </nav>
    <div class="tab-content">
      <div  class="tab-pane fade active show" id="p1">
        <div class="search-events">
          <form class="form" role="form">
            <div class="form-group">
              <!-- <label for="">Chercher des concerts par artistes ou groupes</label> -->
              <div class="input-group">
                <input id="search" name="search" type="text" class="form-control" placeholder="ex: paul kalkbrenner" v-model="search">
              </div>
            </div>
          </form>
          <h2 v-if="ready">Resultats</h2>
          <div v-if="me.access_token" class="search-events-spoti">
            <div class="artists-list">
              <div class="artist" v-for="artist in artists" :key="artist.id" v-on:click='checkArtistDetail(artist.id)'>
                <div class="images">
                  <div v-if="artist.images !== []" class="">
                    <div v-for="info in artist.images" :key="info.url">
                      <img  v-bind:src="info.url" alt="" class="artist-image">
                    </div>
                  </div>
                  <div v-if="JSON.stringify(artist.images) == '[]'" class="">
                    <img src="../../assets/anonyme.jpeg" alt="" class="artist-image">
                  </div>
                </div>
                <div class="artist-info">
                  {{getFrienddlyName(artist.name)}}
                </div>
              </div>
            </div>
          </div>
          <div v-else class="search-no-spoti">
            <div class="events-list">
              <div  v-on:click="checkEventDetail(event.title, event.$.id)" class="event" v-for="event in events" :key="event.$.id">
                <div class="title">
                  <h3>{{event.title}}</h3>
                </div>
                <div class="info-bloc">
                  <div class="info">
                    <p v-if="event.performers.performer">Artiste: {{event.performers.performer.name}}</p>
                    <p>Lieu: {{friendlyVenue(event.venue_name)}} - {{event.country_name}}</p>
                  </div>
                  <div class="date">
                    <p>Date : {{friendlyDate(event.start_time)}}</p>
                    <p>Heure: {{friendlyHour(event.start_time)}}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="events === undefined && ready" class="no-events">
            <p>Pas de résultats trouvés</p>
          </div>
        </div>

        <div id="spinner" class="" style="width:30px; height: 30px; position: absolute; top: 50%; transform: translateY(-50%); z-index: 50000; display: none;">
          <div class="spinner">
            <fade-loader loading="loading" color="orange" size="40px"></fade-loader>
          </div>
        </div>

      </div>
      <div  class="tab-pane fade" id="p3">
        <nav class="nav nav-tabs">
          <a class="nav-item nav-link active" data-toggle="tab" href="#interested">Intéressé</a>
          <a class="nav-item nav-link" data-toggle="tab" href="#participate">Participe</a>
        </nav>
        <div class="tab-content">
          <div class="tab-pane fade show active" id="interested">
            <h2>Intéressé</h2>
            <div v-on:click="checkEventDetail(event.title, event.idEvent)" v-for="event in interestedEvents" :key="event.idEvent" class="event">
              <div class="title">
                <h3>{{event.title}}</h3>
              </div>
              <div class="info-bloc">
                <div class="info">
                  <p v-if="event.performers">Artiste: {{event.performers.performer.name}}</p>
                  <p>Lieu: {{friendlyVenue(event.venue_name)}} - {{event.country_name}}</p>
                </div>
                <div class="date">
                  <p>Date : {{friendlyDate(event.start_time)}}</p>
                  <p>Heure: {{friendlyHour(event.start_time)}}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="tab-pane fade" id="participate">
            <h2>Participe</h2>
            <div v-on:click="checkEventDetail(event.title, event.idEvent)" v-for="event in participateEvents" :key="event.idEvent" class="event">
              <div class="title">
                <h3>{{event.title}}</h3>
              </div>
              <div class="info-bloc">
                <div class="info">
                  <p v-if="event.performers">Artiste: {{event.performers.performer.name}}</p>
                  <p>Lieu: {{friendlyVenue(event.venue_name)}} - {{event.country_name}}</p>
                </div>
                <div class="date">
                  <p>Date : {{friendlyDate(event.start_time)}}</p>
                  <p>Heure: {{friendlyHour(event.start_time)}}</p>
                </div>
              </div>
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
import EventDetail from './EventDetail'
import moment from 'moment'
import FadeLoader from 'vue-spinner/src/FadeLoader.vue'
// import Vue from 'vue'

export default {
  name: 'events',

  components: {
    'event-detail': EventDetail,
    FadeLoader
  },

  props: {
    me: {
      type: Object,
      default: null
    },
    spoti: {
      type: Object,
      default: null
    }
  },

  data () {
    return {
      noEvents: false,
      search: '',
      events: [],
      artists: null,
      followedArtist: null,
      topsImage: [],
      tops: [],
      offset: 0,
      interestedEvents: [],
      participateEvents: [],
      ready: false
    }
  },

  created: function () {
  },

  beforeMount: function () {
    document.removeEventListener('scroll', this.handleScroll)
    document.addEventListener('scroll', this.handleScroll)
  },

  mounted: function () {
    let self = this
    console.log(this.me)
    let accessToken = this.me.access_token
    document.addEventListener('keypress', (e) => {
      if (e.keyCode === 13) {
        e.preventDefault()
      }
    })
    this.$el.addEventListener('keyup', this.debounce(function () {
      self.ready = false
      document.getElementById('spinner').style.display = 'initial'
      if (accessToken) {
        Service.instance.fetchArtists(accessToken, self.search).then((response) => {
          if (response.body.error) {
            if (response.body.error.message === 'The access token expired') {
              let refreshToken = this.me.refresh_token
              Service.instance.refreshSpotifyToken(refreshToken).then((response) => {
                Service.instance.setAccessToken(response.access_token)
                Service.instance.fetchArtists(accessToken, self.search).then((response) => {
                  document.getElementById('spinner').style.display = 'none'
                  self.ready = true
                  self.artists = response.body.artists.items
                  self.artists.forEach((artist) => {
                    return artist.images.splice(1, artist.images.length - 1)
                  })
                })
              })
            }
          } else {
            document.getElementById('spinner').style.display = 'none'
            self.ready = true
            self.artists = response.body.artists.items
            self.artists.forEach((artist) => {
              return artist.images.splice(1, artist.images.length - 1)
            })
          }
        })
      } else {
        Service.instance.fetchMusic(self.search).then((response) => {
          document.getElementById('spinner').style.display = 'none'
          self.ready = true
          self.events = response.search.events.event
          console.log(JSON.stringify(self.events))
          if (self.events) {
            self.events.sort((a, b) => {
              a = new Date(moment(a.start_time)).getTime()
              b = new Date(moment(b.start_time)).getTime()
              return a === b ? a : a > b ? 1 : -1
            })
          }
        })
      }
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

    handleScroll (e) {
      if (window.scrollY + window.innerHeight === window.document.body.clientHeight) {
        this.offset += 10
        if (this.offset < this.tops.length) {
          if (this.offset + 10 <= this.tops.length) {
            this.fetchMusic(this.tops.slice(this.offset, this.offset + 10))
          } else {
            this.fetchMusic(this.tops.slice(this.offset, this.tops.length - 1))
          }
        }
      }
    },

    handleFocus () {
      let input = document.getElementById('search')
      return input.focus()
    },

    getFrienddlyName (name) {
      if (name.length >= 12) {
        return name.slice(0, 12) + '...'
      } else {
        return name
      }
    },

    nearShows () {
      Service.instance.fetchUserWollowing(Service.instance.getAccessToken()).then((following) => {
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
    },

    fetchTopArtists () {
      let token = this.me.access_token
      if (token) {
        Service.instance.fetchUserTopArtists(token).then((top) => {
          let tops = []
          top.items.forEach((item) => {
            tops.push(item.name)
            this.topsImage.push({name: item.name, image: item.images[0]})
          })
          this.tops = tops.sort((a, b) => {
            a = a.toLowerCase()
            b = b.toLowerCase()
            return a === b ? a : a > b ? 1 : -1
          })
          if (this.offset < this.tops.length) {
            if (this.offset + 10 <= this.tops.length) {
              this.fetchMusic(this.tops.slice(this.offset, this.offset + 10))
            } else {
              this.fetchMusic(this.tops.slice(this.offset, this.tops.length - 1))
            }
          }
        })
      } else {
        Service.instance.fetchEventsFromLocation().then((response) => {
          this.events = response.search.events.event
          this.events.forEach((event) => {
            console.log(event.performers)
          })
        })
      }
    },

    fetchMusic (array) {
      let self = this
      Service.instance.fetchMusics(array).then((response) => {
        if (JSON.stringify(response) !== '[]') {
          response.forEach((event) => {
            if (event.search.events.event) {
              if (event.search.events.event.length > 1) {
                event.search.events.event.forEach((each) => {
                  if (each !== 'undefined') {
                    self.events.push(each)
                  }
                })
              } else {
                self.events.push(event.search.events.event)
              }
            }
            if (this.events.length < 10) {
              this.offset += 10
              this.fetchMusic(this.tops.slice(this.offset, this.tops.length - 1))
            }
          })
        } else {
          this.offset += 10
          if (this.offset <= this.tops.length - 1) {
            this.fetchMusic(this.tops.slice(this.offset, this.offset + 10))
          } else {
            this.fetchMusic(this.tops.slice(this.offset, this.tops.length - 1))
          }
        }

        this.events.forEach((event) => {
          if (event) {
            if (event.performers.performer !== 'undefined') {
              this.topsImage.forEach((top) => {
                if (event.title.toLowerCase().includes(top.name.toLowerCase())) {
                  event.image = top.image
                }
              })
            }
          }
        })
      })
    },

    fetchFavoriteEvents () {
      let id = this.me._id
      Service.instance.fetchFavorite(id).then((events) => {
        this.interestedEvents = events.filter((event) => {
          if (event.interestedUsers.length > 0) {
            return event.interestedUsers.filter((interest) => {
              return interest._id === id
            })
          }
        })
        this.participateEvents = events.filter((event) => {
          if (event.participantUsers.length > 0) {
            return event.participantUsers.filter((participate) => {
              return participate._id === id
            })
          }
        })
      })
    },

    checkArtistDetail: function (id) {
      this.$router.push('/artist/' + id)
    },

    checkEventDetail: function (title, id) {
      let artist = title
      this.$router.push('/eventDetail/' + artist + '/' + id)
    },

    friendlyDate (date) {
      moment.locale('fr')
      return moment(date).format('LL')
    },

    friendlyHour (date) {
      moment.locale('fr')
      return moment(date).format('LT') + ' H'
    },

    friendlyVenue (venue) {
      if (venue.length >= 25) {
        return venue.substr(0, 25) + '...'
      }
    }

  },

  beforeDestroy: function () {
    document.removeEventListener('scroll', this.handleScroll)
  }
}

</script>

<style src="./Events.scss" lang="scss"></style>
