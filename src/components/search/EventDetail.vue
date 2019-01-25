<template lang="html">
  <div class="global">
    <div v-if="ready" class="">

      <div class="go-back">
        <button v-on:click="goBack()" type="button" name="button" class="btn">Retour</button>
      </div>
      <div class="event">
        <div class="event-title">
          <h1>{{event.title}}</h1>
        </div>
        <div class="event-description">
          <div class="event-location">
            <p>Lieu: {{event.venue_name}}</p>
            <p>Pays: {{event.country_name}}</p>
          </div>
          <div class="event-date">
            <p>Date: {{getFriendlyDate}}</p>
            <p>Heure de début: {{getFriendlyStart}}</p>
          </div>
          <div v-if="event.artists !== undefined" class="">
            <div v-for="artist in event.artists" :key="artist.name" class="event-artist">
              <p>Artiste: {{artist.name}}</p>
            </div>
          </div>
          <div v-else class="">
            <p>Artiste: {{artist.name}}</p>
          </div>
        </div>
        <div class="event-choice">
          <div class="follow-event">
            <button v-if="eventFollowed" v-on:click="unFollowEvent()" type="button" name="button" class="btn followed">Evènement suivi</button>
            <button v-else v-on:click="followEvent()" type="button" name="button" class="btn">Suivre cet évènement</button>
          </div>
          <div class="participate-event">
            <button v-if="participateInEvent" v-on:click="unParticipateEvent()" type="button" name="button" class="btn participated">Participation a l'évènement </button>
            <button v-else v-on:click="participateEvent()" type="button" name="button" class="btn">Participer a cet évènement</button>
          </div>
        </div>
      </div>
    </div>

    <div id="spinner" class="" style="width:30px; height: 30px; position: absolute; top: 50%; transform: translateY(-50%); z-index: 50000; display: none;">
      <div class="spinner">
        <fade-loader loading="loading" color="orange" size="40px"></fade-loader>
      </div>
    </div>

  </div>

</template>

<script>
import route from '../../router/index.js'
import Service from '../../service/serviceReal.js'
import moment from 'moment'
import FadeLoader from 'vue-spinner/src/FadeLoader.vue'

export default {
  name: 'eventdetail',

  components: {
    FadeLoader
  },

  props: ['me'],

  data () {
    return {
      event: {},
      artist: {},
      isExist: false,
      ready: false
    }
  },

  mounted: function () {
    let artist = route.history.current.params.artist
    let id = route.history.current.params.id
    console.log(id)
    console.log(document.getElementById('spinner'))
    document.getElementById('spinner').style.display = 'initial'
    Service.instance.fetchExistingEvent(id).then((response) => {
      console.log(response)
      if (response.body === 'No Event found') {
        console.log('no event found')
        Service.instance.fetchEvent(artist, id).then((response) => {
          document.getElementById('spinner').style.display = 'none'
          this.ready = true
          let event = response.search.events.event[0]
          console.log(event)
          let artists = []
          if (event.performers !== '') {
            if (event.performers.performer.length !== undefined) {
              event.performers.performer.forEach((performer) => {
                artists.push({name: performer.name})
              })
            } else {
              artists.push({name: event.performers.performer.name})
            }
          }

          this.event = {
            idEvent: event.$.id,
            title: event.title,
            description: event.description,
            artists: artists,
            venue_name: event.venue_name,
            city_name: event.city_name,
            country_name: event.country_name,
            start_time: event.start_time,
            interestedUsers: [],
            participantUsers: []
          }
          console.log(event.start_time)
          let token = this.me.access_token
          if (token) {
            Service.instance.fetchArtistByName(token, artist).then((response) => {
              this.artist = response.body.artists.items[0]
              if (JSON.stringify(this.event.artists) === '[]') {
                this.event.artists.push({name: this.artist.name})
              }
              if (this.artist.length > 1) {
                this.artist = this.artist.reduce((a, b) => {
                  return a.followers.total > b.followers.total ? a : b
                })
              }
            })
          }
        })
      } else {
        console.log(response.body)
        this.event = response.body[0]
        document.getElementById('spinner').style.display = 'none'
        this.ready = true
        if (!this.event.participantUsers) {
          this.event.participantUsers = []
        }
        this.isExist = true
      }
    })
  },

  computed: {
    getFriendlyDate () {
      moment.locale('fr')
      return moment(this.event.date).format('LL')
    },

    getFriendlyStart () {
      moment.locale('fr')
      return moment(this.event.date).format('LT') + ' H'
    },

    eventFollowed () {
      if (this.event.interestedUsers) {
        return this.event.interestedUsers.filter(interested => interested._id === this.me._id).length > 0
      } else {
        return false
      }
    },

    participateInEvent () {
      if (this.event.participantUsers) {
        console.log(this.event.participantUsers)
        return this.event.participantUsers.filter(participant => participant._id === this.me._id).length > 0
      } else {
        return false
      }
    }
  },

  methods: {
    followEvent () {
      if (this.isExist) {
        let user = {
          _id: this.me._id,
          date: new Date()
        }
        this.event.interestedUsers.push(user)
        let event = {
          idEvent: this.event.idEvent,
          interestedUsers: this.event.interestedUsers
        }
        console.log(event)
        Service.instance.followEvent(event).then((event) => {
          this.event = event
        })
      } else {
        console.log(this.event.start_time)
        let event = {
          idEvent: this.event.idEvent,
          title: this.event.title,
          description: this.event.description,
          artists: this.event.artists,
          venue_name: this.event.venue_name,
          city_name: this.event.city_name,
          country_name: this.event.country_name,
          start_time: this.event.start_time,
          interestedUsers: []
        }
        let self = this
        event.interestedUsers.push({_id: this.me._id})
        console.log(event)
        Service.instance.eventCreation(event).then((event) => {
          self.event = event
          this.isExist = true
        })
      }
    },

    participateEvent () {
      if (this.isExist) {
        let user = {
          _id: this.me._id,
          date: new Date()
        }
        this.event.participantUsers.push(user)
        let event = {
          idEvent: this.event.idEvent,
          participantUsers: this.event.participantUsers
        }
        Service.instance.participateEvent(event).then((event) => {
          this.event = event
          console.log(event)
        })
      } else {
        let event = {
          idEvent: this.event.idEvent,
          title: this.event.title,
          description: this.event.description,
          artists: this.event.artists,
          venue_name: this.event.venue_name,
          city_name: this.event.city_name,
          country_name: this.event.country_name,
          start_time: this.event.start_time,
          participantUsers: []
        }
        let self = this
        event.participantUsers.push({_id: this.me._id})
        Service.instance.eventCreation(event).then((response) => {
          self.event = event
          console.log(event)
        })
      }
    },

    unFollowEvent () {
      this.event.interestedUsers = this.event.interestedUsers.filter((user) => {
        return user._id !== this.me._id
      })
      let event = {
        idEvent: this.event.idEvent,
        interestedUsers: this.event.interestedUsers
      }
      Service.instance.unFollowEvent(event).then((event) => {
        this.event = event
        console.log(event)
      })
    },

    unParticipateEvent () {
      this.event.participantUsers = this.event.participantUsers.filter((user) => {
        return user._id !== this.me._id
      })
      let event = {
        idEvent: this.event.idEvent,
        participantUsers: this.event.participantUsers
      }
      Service.instance.unParticipateEvent(event).then((event) => {
        this.event = event
        console.log(event)
      })
    },

    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style src="./EventDetail.scss" lang="scss">
</style>
