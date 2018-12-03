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

  getCountriesList () {
    return this.countries
  }

  // ----------------------------------------------------- Credential/Session ----------------------------------------------------

  storeId (id) {
    window.localStorage.setItem('fanzik-id', id)
  }

  removeId () {
    window.localStorage.removeItem('fanzik-id')
  }

  getStoredId () {
    return window.localStorage.getItem('fanzik-id')
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

  setAuthorizationHeader (token) {
    if (token) {
      Vue.http.headers.common['Authorization'] = `Bearer ${token}`
      console.log('set authorization Hearder wtih Bearer  ' + Vue.http.headers.common['Authorization'])
    } else {
      console.log('delete session')
      delete Vue.http.headers.common['Authorization']
    }
  }

  // --------------------------------------------------------- Auth -------------------------------------------------------

  register (userData) {
    const url = 'http://localhost:3000/api/register'
    let params = {
      pseudo: userData.pseudo,
      email: userData.email,
      password: userData.password,
      country: userData.country
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
    this.removeId()
    EventBus.$emit('isLogout')
  }

  // ------------------------------------------------------ UserData -------------------------------------------------------

  fetchMe () {
    console.log('enter fetchMe')
    const url = 'http://localhost:3000/api/user/me'
    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
        let user = response.data
        resolve(user)
      })
    })
  }

  fetchUser (id) {
    const url = `http://localhost:3000/api/user/${id}`
    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
        let user = response.data
        resolve(user)
      })
    })
  }

  fetchUsers (ids) {
    const url = `http://localhost:3000/api/users/${ids}`
    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
        let user = response.data
        resolve(user)
      })
    })
  }

  fetchAllUsers () {
    const url = 'http://localhost:3000/api/allusers'
    console.log('ok from Service')
    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((users) => {
        console.log(users)
        resolve(users)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  // --------------------------------------------------------- Post ---------------------------------------------------

  fetchPosts (id, friends) {
    let ids = []
    friends.forEach((friend) => {
      console.log(friend._id)
      ids.push(friend._id)
    })
    console.log(ids)
    const url = `http://localhost:3000/api/post/fetch/${id}/${ids}`
    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
        resolve(response.body)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  createPost (post) {
    console.log(post)
    const url = 'http://localhost:3000/api/post/create'

    return new Promise((resolve, reject) => {
      return Vue.http.post(url, post).then((response) => {
        resolve(response.body)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  commentPost (post) {
    const url = 'http://localhost:3000/api/post/comment/create'

    return new Promise((resolve, reject) => {
      return Vue.http.post(url, post).then((response) => {
        resolve(response.body)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  // ---------------------------------------------------------- Event -----------------------------------------------------

  fetchExistingEvent (id) {
    const url = `http://localhost:3000/api/event/fetch/${id}`

    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
        resolve(response)
      },
      (error) => {
        resolve(error)
      })
    })
  }

  fetchFavorite (id) {
    // console.log('id ' + id)
    const url = `http://localhost:3000/api/events/favorite/${id}`

    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
        console.log(response.body)
        resolve(response.body)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  eventCreation (event) {
    const url = 'http://localhost:3000/api/event/create'

    return new Promise((resolve, reject) => {
      return Vue.http.post(url, event).then((response) => {
        console.log(response)
        resolve(response.data)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  followEvent (event) {
    console.log(event)
    const url = 'http://localhost:3000/api/event/follow'

    return new Promise((resolve, reject) => {
      return Vue.http.post(url, event).then((response) => {
        resolve(response.body)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  unFollowEvent (event) {
    console.log(event)
    const url = 'http://localhost:3000/api/event/unfollow'
    return new Promise((resolve, reject) => {
      return Vue.http.post(url, event).then((response) => {
        resolve(response.body)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  participateEvent (event) {
    const url = 'http://localhost:3000/api/event/participate'

    return new Promise((resolve, reject) => {
      return Vue.http.post(url, event).then((response) => {
        resolve(response.body)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  unParticipateEvent (event) {
    const url = 'http://localhost:3000/api/event/unparticipate'

    return new Promise((resolve, reject) => {
      return Vue.http.post(url, event).then((response) => {
        resolve(response.body)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  // --------------------------------------------------------- EventFul ----------------------------------------------------

  fetchMusics (artists) {
    console.log(artists)
    let q = []
    artists.forEach((artist) => {
      if (artist.includes('&')) {
        artist = artist.substring(0, artist.indexOf('&') - 1)
      }
      artist = artist.replace(/\s/g, '_')
      q.push(artist)
    })

    q = q.slice(0, 9)
    // let d = 'kalkbrenner'
    // const url = `http://localhost:3000/api/user/eventful/search/${d}`
    const url = `http://localhost:3000/api/user/eventful/${q}`
    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
        if (JSON.stringify(response.body.data) !== '[]') {
          let events = response.body.data
          resolve(events)
        } else {
          resolve(response.body.data)
        }
      },
      (error) => {
        console.log(error)
      })
    })
  }

  fetchMusic (artist) {
    let q = artist

    const url = `http://localhost:3000/api/artist/eventful/${q}`

    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
        if (JSON.stringify(response.body.data) !== '[]') {
          let events = response.body.data
          console.log(events)
          resolve(events)
        } else {
          resolve(response.body.data)
        }
      },
      (error) => {
        console.log(error)
      })
    })
  }

  fetchEvent (artist, id) {
    console.log('fetchEvent')
    const url = `http://localhost:3000/api/event/eventful/${artist}/${id}`

    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
        console.log(response)
        let event = response.body.data
        resolve(event)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  fetchEventsFromLocation () {
    const url = 'http://localhost:3000/api/eventful/searchall'

    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
        console.log(response)
        let event = response.body.data
        resolve(event)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  // --------------------------------------------------------- Spotify --------------------------------------------------------

  // --------------- ------------------------------------------- Auth -------------------------------------------------------------

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
        resolve(response.data)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  saveTokens (tokens) {
    let accessToken = tokens.access_token
    let refreshToken = tokens.refresh_token
    let avatar = {avatar: tokens.avatar}
    const url = `http://localhost:3000/api/user/tokens/${accessToken}/${refreshToken}`
    return new Promise((resolve, reject) => {
      return Vue.http.post(url, avatar).then((response) => {
        resolve(response.data)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  saveNewToken (token) {
    const url = `http://localhost:3000/api/user/newtoken/${token}`

    return new Promise((resolve, reject) => {
      return Vue.http.post(url).then((response) => {
        resolve(response.data)
      })
    })
  }

  fetChAccessTokenValidity () {
    const url = 'http://localhost:3000/api/user/access_token/isvalidate'
    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
        resolve(response.data)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  // ------------------------------------------------------------ Data --------------------------------------------------------------

  fetchSpotifyInfo (token) {
    const url = `http://localhost:3000/api/user/spotify/me/${token}`
    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
        resolve(response)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  fetchArtists (token, q) {
    const url = `http://localhost:3000/api/user/spotify/artists/${token}/${q}`
    console.log(url)
    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
        resolve(response)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  fetchArtist (token, q) {
    const url = `http://localhost:3000/api/user/spotify/artist/${token}/${q}`
    console.log(url)
    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
        resolve(response)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  fetchArtistByName (token, q) {
    const url = `http://localhost:3000/api/user/spotify/artist/byname/${token}/${q}`
    console.log(url)
    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
        resolve(response)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  fetchRelatedArtists (token, id) {
    const url = `http://localhost:3000/api/spotify/artist/relatedartists/${token}/${id}`

    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
        resolve(response)
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

  fetchUserTopArtists (token) {
    const url = `http://localhost:3000/api/user/spotify/top/${token}`
    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
        console.log(response.data)
        resolve(response.data)
      })
    })
  }

  // -------------------------------------- friendship --------------------

  askFriend (asking, receiving) {
    let data = {
      asking: asking,
      receiving: receiving
    }
    const url = 'http://localhost:3000/api/friend/invite'
    return new Promise((resolve, reject) => {
      return Vue.http.put(url, data).then((response) => {
        resolve(response.body)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  fetchFriends (id) {
    const url = `http://localhost:3000/api/friends/${id}`
    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
        console.log(response)
        resolve(response)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  fetchPending (id) {
    const url = `http://localhost:3000/api/friend/pending/${id}`
    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
        console.log(response)
        resolve(response)
      },
      (error) => {
        console.log(error)
      })
    })
  }
}

export default Service
