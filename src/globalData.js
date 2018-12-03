import Vue from 'vue'

export const globalData = new Vue({

  data: {
    me: {},
    spotiMe: {},
    currentArtist: {}
  },

  methods: {

    setMeInfo (info) {
      this.me = info
    },

    getMeInfo () {
      return this.me
    },

    setSpotiMeInfo (info) {
      this.spotiMe = info
    },

    getSpotiMeInfo () {
      return this.spotiMe
    },

    setArtistInfo (info) {
      this.currentArtist = info
    },

    getArtistInfo () {
      return this.currentArtist
    }

  }
})
