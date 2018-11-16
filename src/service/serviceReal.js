import Vue from 'vue'
import EventBus from '../event-bus.js'
import countries from './countries.json'

let singleInstance

class Service {
  constructor () {
    singleInstance = this
    this.countries = countries
    this.sessionId = null
  }

  static get instance () {
    if (!this.singleInstance) {
      this.singleInstance = new Service()
    }
    return singleInstance
  }

  storeSessionId (token) {
    this.sessionId = token
    if (this.sessionId) {
      window.localStorage.setItem('fanzik-token', this.sessionId)
    }
    this.setAuthorizationHeader(this.sessionId)
  }

  removeSessionId (token) {
    if (token) {
      this.sessionId = null
      window.localStorage.removeItem('fanzik-token')
    }
    this.setAuthorizationHeader(token)
  }

  getAuthorizationHeader () {
    return Vue.http.headers.common['Authorization']
  }

  getToken () {
    if (this.sessionId == null) {
      this.sessionId = window.localStorage.getItem('fanzik-token')
      console.log('from getToken ' + this.sessionId)

      this.setAuthorizationHeader(this.sessionId)
    }
    return this.sessionId
  }

  setAccessToken (token) {
    window.localStorage.setItem('spotify_access_token', token)
  }

  getAccessToken () {
    return window.localStorage.getItem('spotify_access_token')
  }

  getRefreshToken () {
    return window.localStorage.getItem('spotify_refresh_token')
  }

  setAuthorizationHeader (token) {
    if (token) {
      Vue.http.headers.common['Authorization'] = `Bearer ${token}`
      console.log('set authorization Hearder wtih Bearer  ' + Vue.http.headers.common['Authorization'])
    } else {
      console.log('delete session')
      delete Vue.http.headers.common['Authorization']
    }
  }

  getCountriesList () {
    return this.countries
  }

  register (userData) {
    const url = 'http://localhost:3000/api/register'
    let params = {
      pseudo: userData.pseudo,
      email: userData.email,
      password: userData.password,
      country: userData.country
    }

    console.log(JSON.stringify(params) + 'from service')
    return new Promise((resolve, reject) => {
      return Vue.http.post(url, params).then((response) => {
        resolve(response)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  login (userData) {
    const url = 'http://localhost:3000/api/login'
    let params = {
      pseudo: userData.pseudo,
      password: userData.password
    }

    return new Promise((resolve, reject) => {
      return Vue.http.post(url, params).then((response) => {
        resolve(response)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  logout () {
    this.removeSessionId(this.sessionId)
    EventBus.$emit('isLogout')
  }

  fetchMe () {
    const url = 'http://localhost:3000/api/user/me'
    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
        let user = response.data
        resolve(user)
      })
    })
  }

  fetchUsers () {
    const url = 'http://localhost:3000/api/users'
    console.log('ok from Service')
    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
        let users = JSON.stringify(response.data)
        console.log(users)
        resolve(users)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  fetchMusics (search) {
    const url = `http://localhost:3000/api/home/${search}`
    console.log(search)
    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
        let events = response.data.data.search.events.event
        // let events = response.data.data.search.events.event.filter((event) => {
        //   return event.country_name === 'France'
        // })
        resolve(events)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  fetchArtists (token, q) {
    const url = `http://localhost:3000/api/search/artists/${token}/${q}`
    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
        resolve(response)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  spotifyAuthentication () {
    Vue.http.options.xhr = {withCredentials: true}
    const url = 'http://localhost:3000/api/spotify/login'
    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
        resolve(response.data)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  receiveSpotifyCredentials (code, state) {
    const url = `http://localhost:3000/api/callback?code=${code}&state=${state}`
    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
        console.log(response.data)
        resolve(response.data)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  refreshSpotifyToken (token) {
    console.log('refresh from service')
    const url = `http://localhost:3000/api/refresh_token/${token}`
    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
        console.log(response.data)
        resolve(response.data)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  fetchUserPlaylist (token) {
    const url = `http://localhost:3000/api/user/spotify/playlist/${token}`
    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
        resolve(response.data)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  fetchUserWollowing (token) {
    console.log('entering following')
    const url = `http://localhost:3000/api/user/spotify/following/${token}`
    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
        resolve(response.data)
      })
    })
  }
}

export default Service
