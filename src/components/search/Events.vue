<template lang="html">
  <div class="wrapper">
    <nav class="nav nav-tabs">
      <a class="nav-item nav-link active" href="#p1" data-toggle="tab">Recherche</a>
      <a class="nav-item nav-link" href="#p2" data-toggle="tab">Concerts a coté</a>
    </nav>
    <div class="tab-content">
      <div class="tab-pane fade show active" id="p1">
        <div class="search-events">
          <form class="form" role="form">
            <div class="form-group">
              <!-- <label for="">Chercher des concerts par artistes ou groupes</label> -->
              <div class="input-group">
                <input id="search" name="search" type="text" class="form-control" v-model="search">
                <button type="button" name="button" v-on:click="fetchArtists()">artistes</button>
              </div>
            </div>
          </form>

          <div class="events-list">
            <div class="event" v-for="event in events" :key="event.id">
              <div class="event-image">
                <img v-bind:src="event.image.url" alt="">
              </div>
              <div class="event-info">
                {{event.title}}
                {{event.start_time}}
              </div>
            </div>

          </div>
        </div>
      </div>
      <div class="tab-pane fade" id="p2">
        <div class="relatedEvents">

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import route from '../../router/index.js'
import Service from '../../service/serviceReal.js'
// import Vue from 'vue'

export default {
  name: 'events',

  data () {
    return {
      search: '',
      events: null
    }
  },

  create: function () {
  },

  mounted: function () {
    // let self = this
    //
    // this.$el.addEventListener('keyup', this.debounce(function () {
    //   Service.instance.fetchMusics(self.search).then((events) => {
    //     console.log('fetchMusics')
    //     console.log(events)
    //     self.events = events.sort((a, b) => {
    //       a = a.title.toLowerCase()
    //       b = b.title.toLowerCase()
    //       return a === b ? 0 : a > b ? 1 : -1
    //     })
    //     self.events = events
    //   })
    // }, 100))
  },

  // watch: {
  //   events: function (newValue, oldValue) {
  //     console.log(newValue)
  //     return this.events
  //   }
  // },

  methods: {
    debounce (vm, duration) {
      let timer
      return () => {
        clearTimeout(timer)
        timer = setTimeout(vm, duration)
      }
    },

    fetchArtists () {
      Service.instance.fetchArtists(this.search).then((response) => {
        console.log(response)
        if (response.body.error) {
          if (response.body.error.message === 'The access token expired') {
            Service.instance.refreshSpotifyToken().then((response) => {
              console.log(response)
            })

          }
        }
      })
    }

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
</style>
