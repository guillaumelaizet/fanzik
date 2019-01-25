<template lang="html">
  <div class="artist">

    <div class="artist-info">
      <div class="artist-image">
        <img :src="artist.images[0].url" alt="">
      </div>
      <div class="artist-description">
        <div class="artist-sub-info">
          <div class="artist-title">
            <h3>{{artist.name}}</h3>
          </div>
          <div class="artist-genres">
            genre: <span v-for="genre in artist.genres" :key="genre"> {{genre}}<span> <span v-if="artist.genres.lastIndexOf(genre) !== artist.genres.length - 1" >,</span></span></span>
          </div>
          <div class="artist-followers">
            followers: {{artist.followers.total}}
          </div>
        </div>
      </div>
    </div>
    <h1>Artistes Associés</h1>
    <div class="related-artist">
      <div v-on:click="showArtist(artist.id)" v-for="artist in related" :key="artist.id" class="related-artist-info">
        <div class="related-artist-image">
          <img :src="artist.images[0].url" alt="">
        </div>
        <div class="related-artist-name">
          <p>{{artist.name}}</p>
        </div>
      </div>

    </div>
    <div class="artist-events">
      <h1>Ses prochains concerts</h1>
      <p v-if="events">{{events.length}} events trouvés</p>
      <p v-else>0 events trouvés</p>
      <div id="spinner" class="" style="width:30px; height: 30px; position: absolute; top: 50%; transform: translateY(-50%); z-index: 50000; display: none;">
        <div class="spinner">
          <fade-loader loading="loading" color="orange" size="40px"></fade-loader>
        </div>
      </div>
      <div v-if="ready" class="form-group">
        <select @click="showEvents(date, $event)" class="form-control" name="">
          <option  v-for="month in date" :value="month" :key="month.id">{{month}}</option>
        </select>
      </div>
      <div class="list-events" v-for="month in date" :key="month.id">
        <div v-on:click="checkEventDetail(event.title, event.$.id)" v-for="event in events" :key="event.id" class="events" :class="month">
          <div v-if="event.performers.performer && dateCorres(month, event)" class="event">
            <p>Date : {{event.start_time}}</p>
            <div class="icon">
              <img src="../../assets/icon-concert.png" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import FadeLoader from 'vue-spinner/src/FadeLoader.vue'
import route from '../../router/index.js'
import Service from '../../service/serviceReal.js'
import moment from 'moment'

export default {
  name: 'artist',

  components: {
    PulseLoader,
    FadeLoader
  },

  props: ['me', 'spoti'],
  data () {
    return {
      artist: [],
      related: [],
      events: [],
      user: {},
      date: [],
      ready: false
    }
  },

  mounted: function () {
    this.buildScreen()
  },

  computed: {
    setMe () {
      return this.me
    },

    friendlyDate () {
      return this.events.forEach((event) => {
        event.start_time = moment(event.start_time).format('LL') + ' à ' + moment(event.start_time).format('LT') + ' H'
        return event.start_time
      })
    }
  },

  methods: {

    init () {
      this.artist = []
      this.related = []
      this.events = []
      this.user = {}
    },

    buildScreen () {
      this.init()
      Service.instance.fetchMe().then((response) => {
        this.user = response
        let token = this.user.access_token
        let id = route.history.current.params.id
        Service.instance.fetchArtist(token, id).then((response) => {
          this.artist = response.body
          this.artist.images = this.artist.images.filter((image) => {
            return image.height === 640
          })
          Service.instance.fetchRelatedArtists(token, id).then((response) => {
            this.related = response.body.artists
            document.getElementById('spinner').style.display = 'initial'
            Service.instance.fetchMusic(this.artist.name).then((response) => {
              this.ready = true
              document.getElementById('spinner').style.display = 'none'
              this.date = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']

              this.events = response.search.events.event
              moment.locale('fr')
              if (this.events) {
                this.events.sort((a, b) => {
                  a = new Date(moment(a.start_time)).getTime()
                  b = new Date(moment(b.start_time)).getTime()
                  return a === b ? a : a > b ? 1 : -1
                })
              }
            })
          })
        })
      })
    },

    showArtist (id) {
      this.$router.push('/artist/' + id)
      this.buildScreen()
    },

    checkEventDetail (artist, id) {
      this.$router.push('/eventDetail/' + artist + '/' + id)
    },

    dateCorres (month, event) {
      moment.locale('fr')
      return moment(event.start_time).format('MMMM') === month
    },

    showEvents (date, e) {
      console.log('enter')
      let month = e.currentTarget.value
      let doc = document.getElementsByClassName(month)
      date.forEach((ele) => {
        if (ele !== month) {
          let element = document.getElementsByClassName(ele)
          for (let i = 0; i < doc.length; i++) {
            element[i].style.display = 'none'
          }
        }
      })
      for (let i = 0; i < doc.length; i++) {
        doc[i].style.display = 'initial'
      }
    }
  }
}
</script>

<style src="./Artist.scss" lang="scss">
</style>
