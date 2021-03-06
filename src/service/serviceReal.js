import Vue from 'vue'
import EventBus from '../event-bus.js'
import countries from './countries.json'

let singleInstance

let path = 'http://localhost:3000/'

// let path = 'http://www.fanzik.org/'

class Service {
  constructor () {
    singleInstance = this
    this.path = path
    this.countries = countries
    this.sessionId = null
  }

  static get instance () {
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

  // ------------------------------------------------------ UserData -------------------------------------------------------

  fetchMe () {
    console.log('enter fetchMe')
    const url = path + 'api/user/me'
    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
        let user = response.data
        resolve(user)
      })
    })
  }

  fetchUser (id) {
    const url = `${path}api/user/${id}`
    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
        let user = response.data
        resolve(user)
      })
    })
  }

  fetchUsers (ids) {
    const url = `${path}api/users/${ids}`
    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
        let user = response.data
        resolve(user)
      })
    })
  }

  fetchAllUsers () {
    const url = path + 'api/allusers'
    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((users) => {
        resolve(users.body)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  updateUser (user) {
    console.log(user)
    const url = `${path}api/user/update/`
    return new Promise((resolve, reject) => {
      return Vue.http.put(url, user).then((users) => {
        resolve(users.body)
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
      ids.push(friend._id)
    })
    const url = `${path}api/post/fetch/${id}/${ids}`
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
    const url = path + 'api/post/create'

    return new Promise((resolve, reject) => {
      return Vue.http.post(url, post).then((response) => {
        resolve(response.body)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  createPostOnFriendWall (post) {
    const url = path + 'api/post/createonfriendwall'

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
    const url = path + 'api/post/comment/create'

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
    const url = `${path}api/event/fetch/${id}`

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
    const url = `${path}api/events/favorite/${id}`

    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
        resolve(response.body)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  fetchFavoriteFromFriends (ids) {
    const url = `${path}api/events/friendsfavorite/${ids}`
    console.log(url)
    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
        resolve(response.body)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  eventCreation (event) {
    const url = path + 'api/event/create'

    return new Promise((resolve, reject) => {
      return Vue.http.post(url, event).then((response) => {
        resolve(response.data)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  followEvent (event) {
    const url = path + 'api/event/follow'

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
    const url = path + 'api/event/unfollow'
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
    const url = path + 'api/event/participate'

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
    const url = path + 'api/event/unparticipate'

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
    const url = `${path}api/user/eventful/${q}`
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

    const url = `${path}api/artist/eventful/${q}`

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

  fetchEvent (artist, id) {
    const url = `${path}api/event/eventful/${artist}/${id}`

    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
        let event = response.body.data
        resolve(event)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  fetchEventsFromLocation () {
    const url = path + 'api/eventful/searchall'

    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
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
    const url = path + 'api/spotify/login'
    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
        resolve(response.data)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  receiveSpotifyCredentials (id, code, state) {
    console.log('entering callback')
    const url = `${path}api/callback?code=${code}&state=${state}&id=${id}`
    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
        resolve(response.data)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  refreshSpotifyToken (token) {
    console.log('refresh from service')
    const url = `${path}api/refresh_token/${token}`
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
    const url = `${path}api/user/tokens/${accessToken}/${refreshToken}`
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
    const url = path + `api/user/newtoken/${token}`

    return new Promise((resolve, reject) => {
      return Vue.http.post(url).then((response) => {
        resolve(response.data)
      })
    })
  }

  fetChAccessTokenValidity () {
    const url = path + 'api/user/access_token/isvalidate'
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
    const url = `${path}api/user/spotify/me/${token}`
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
    const url = `${path}api/user/spotify/artists/${token}/${q}`
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
    const url = `${path}api/user/spotify/artist/${token}/${q}`
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
    const url = `${path}api/user/spotify/artist/byname/${token}/${q}`
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
    const url = `${path}api/spotify/artist/relatedartists/${token}/${id}`

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
    const url = `${path}api/user/spotify/playlist/${token}`
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
    const url = `${path}api/user/spotify/following/${token}`
    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
        resolve(response.data)
      })
    })
  }

  fetchUserTopArtists (token) {
    const url = `${path}api/user/spotify/top/${token}`
    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
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
    const url = path + 'api/friend/invite'
    return new Promise((resolve, reject) => {
      return Vue.http.put(url, data).then((response) => {
        resolve(response.body)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  acceptFriendship(userId1, userId2) {
    let data = {
      userId1: userId1,
      userId2: userId2
    }
    const url = path + 'api/friend/accept'
    return new Promise((resolve, reject) => {
      return Vue.http.put(url, data).then((response) => {
        resolve(response.body)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  declineFriendship (userId1, userId2) {
    let data = {
      userId1: userId1,
      userId2: userId2
    }
    const url = path + 'api/friend/decline'
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
    const url = `${path}api/friends/${id}`
    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
        resolve(response)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  fetchPending (id) {
    const url = `${path}api/friend/pending/${id}`
    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
        resolve(response)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  // --------------------------- Message ----------------

  fetchMessages (id) {
    const url = `${path}api/message/${id}`
    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
        resolve(response)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  createMessage (message) {
    const url = `${path}api/message/post`
    return new Promise((resolve, reject) => {
      return Vue.http.post(url, message).then((response) => {
        resolve(response)
      },
      (error) => {
        console.log(error)
      })
    })
  }
}

export default Service
