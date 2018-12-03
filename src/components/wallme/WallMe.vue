<template lang="html">
  <div class="blocglobal">
    <div v-on:click="authSpotify()" v-if="spoti_auth === false" class="auth-spotify">
      <img src="../../assets/spotify.png" alt="" class="spotify-image">
      <div class="auth-text">
        Synchronise avec ton compte spotify pour pouvoir profiter au maximum de ton expérience
      </div>
    </div>
    <div class="blocinter">
      <div v-if="isFriend || meWall" class="globalEvents">
        <div class="globalPost">
          <form class="form" role="form">
            <div class="form-group">
              <div class="input-group">
                <input  id="search" name="search" type="text" class="form-control" placeholder="Ecrire un post">
                <button @click="createPost($event)" type="button" name="button">submit</button>
              </div>
            </div>
          </form>
        </div>

        <div class="renderEventsList">
          <posts
          v-for="event in events"
          :key="event._id"
          :evt="event"
          :me="me"
          :currentUser="currentUser"
          :user="user"
          :friends="friends">
          </posts>
        </div>

        <div id="spinner" class="" style="width:30px; height: 30px; position: absolute; top: 50%; transform: translateY(-50%); z-index: 50000; display: none;">
          <div class="spinner">
            <fade-loader loading="loading" color="orange" size="40px"></fade-loader>
          </div>
        </div>

      </div>
      <div v-else class="not-friend">
        <div class="bloc-not-friend">
          <p>Vous n'êtes pas amis</p>
          <button v-if="!isFriend && !pending" type="button" name="button" class="btn" v-on:click="askFriends(userMe._id, currentUser._id)">Ajouter + </button>
          <p v-if="pending">En attente d'une réponse à votre demande d'amis</p>
        </div>
      </div>
      <div class="information">
        <div v-on:click="goToSettings()" v-if="currentUser.avatar" class="circle">
          <img :src="currentUser.avatar" alt="">
          <p>{{currentUser.pseudo}}</p>
        </div>
        <div v-else v-on:click="goToSettings()" class="circle">
          <img src="../../assets/anonyme.jpeg" alt="">
          <p>{{currentUser.pseudo}}</p>
        </div>
        <div class="">

        </div>
        <div class="info-user">
          <p>Event suivi: <span>{{interestedEvents.length}}</span></p>
          <p>Participation: <span>{{participateEvents.length}}</span></p>
        </div>
        <div class="friends-user">
          <p>Ami(s): <span>{{this.myFriends.length}}</span></p>
        </div>
        <div class="friends-list">
          <div v-if=" currentUser.friends && currentUser.friends.length > 0" class="list">
            <div v-if="currentUser._id === userMe._id " class="">
              <div class="" v-for="friend in myFriends" :key="friend._id">
                <div v-on:click="goToUserWall(friend._id)" class="friend">
                  <div class="avatar">
                    <img v-if="friend.avatar" :src="friend.avatar" alt="">
                    <img v-else src="../../assets/anonyme.jpeg" alt="">
                  </div>
                  <div class="pseudo">
                    {{friend.pseudo}}
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="list">
              <div class="" v-for="friend in friends" :key="friend._id">
                <div v-on:click="goToUserWall(friend._id)" class="friend">
                  <div class="avatar">
                    <img v-if="friend.avatar" :src="friend.avatar" alt="">
                    <img v-else src="../../assets/anonyme.jpeg" alt="">
                  </div>
                  <div class="pseudo">
                    {{friend.pseudo}}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="remi-sans-famille">
            <div v-if="meWall && suggestions" class="">
              <h5>Suggestions</h5>
              <div  v-for="suggestion in suggestions" :key="suggestion._id">
                <div class="suggestion" v-if="suggestion._id !== me._id">
                  <div class="user-info">
                    <div class="avatar">
                      <img v-if="suggestion.avatar" :src="suggestion.avatar" alt="">
                      <img v-else src="../../assets/anonyme.jpeg" alt="">
                    </div>
                    <div class="pseudo">
                      {{suggestion.pseudo}}
                    </div>
                  </div>
                  <div class="friends-demand">
                    <button v-on:click="askFriends(me._id, suggestion._id)" type="button" name="button" class="btn">Ajouter +</button>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <popup ref="popupSuccessAuthSpotify">
      <div slot="body">
        <div class="headline-blue">
          <!-- <img src="/assets/checked.svg" width="48px" height="48px" /> -->
          <div class="h-aligner" slot="header" style="font-size: 18px; font-weight: bold; margin-top: 20px;">Parfait, ton compte spoti est bien synchro, tu peux commencer ton expérience ;-)</div>
          <div style="margin-top: 20px; padding-bottom: 5px; font-size: 14px;">
          </div>
        </div>
      </div>
      <div slot="footer" class="h-centred">
        <div class="modal-button noselect" style="width: 200px; margin: 8px; font-size: 12pt; border: none" v-on:click="closePopup($event)">
          <span class="v-aligned-child" style="vertical-align: -30px; text-align: center; color: white;">OK</span>
        </div>
      </div>
    </popup>

  </div>
</template>

<script>
import Service from '../../service/serviceReal.js'
import route from '../../router/index.js'
import {globalData} from '../../globalData.js'
import Popup from '../popup/Popup'
import Posts from './Posts'
import EventBus from '../../event-bus.js'
import FadeLoader from 'vue-spinner/src/FadeLoader.vue'

export default {
  name: 'wallme',

  components: {
    'popup': Popup,
    'posts': Posts,
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
      spoti_auth: false,
      events: [],
      user: {},
      userMe: {},
      currentUser: {},
      users: {},
      friends: [],
      myFriends: [],
      pendingRequest: [],
      interestedEvents: [],
      participateEvents: []
    }
  },

  created: function () {
    this.buildScreen()
    EventBus.$on('goToUserWall', () => {
      console.log('goToUserWall')
      this.buildScreen()
    })
    EventBus.$on('postComment', (newevent) => {
      this.events.forEach((event) => {
        if (event._id === newevent.event._id) {
          event.comments = newevent.event.comments
        }
      })
    })
  },

  computed: {
    suggestions () {
      let friendsId = []
      this.friends.forEach((friend) => {
        friendsId.push(friend._id)
      })
      if (this.users && this.users.length > 0) {
        return this.users.filter((user) => {
          return friendsId.indexOf(user._id) === -1
        })
      }
    },

    meWall () {
      return this.currentUser._id === this.userMe._id
    },

    isFriend () {
      if (this.friends.length !== 0) {
        return this.friends.filter((user) => {
          user.friends.filter(friend => friend.id === this.userMe._id && friend.status === 'confirmed').length > 0
        })
      } else {
        return false
      }
    },

    pending () {
      if (this.pendingRequest.length !== 0) {
        return this.pendingRequest.filter((user) => {
          user.friends.filter(friend => friend.id === this.currentUser._id && friend.status === 'invitation recu').length > 0
        })
      } else {
        return false
      }
    }

  },

  mounted: function () {
    if (route.history.current.query.auth === 'accept') {
      Service.instance.fetchMe().then((response) => {
        this.userMe = response
        globalData.setMeInfo(response)
      })
      this.$refs.popupSuccessAuthSpotify.show = true
    }
  },

  methods: {

    buildScreen () {
      let id = route.history.current.query.id
      console.log(route.history.current.query.code)
      if (route.history.current.query.code !== undefined) {
        console.log('go receive credentials')
        this.receiveSpotifyCredentials()
      } else {

        // document.getElementById('spinner').style.display = 'initial'
        Service.instance.fetchMe().then((response) => {
          this.userMe = response
          console.log('userMe ' + this.userMe)
          Service.instance.fetchFriends(this.userMe._id).then((friends) => {
            this.myFriends = friends.body
          })
          Service.instance.fetchPending(this.userMe._id).then((user) => {
            console.log('pending request ' + user.body)
            this.pendingRequest = user.body
          })
          if (route.history.current.query.id === this.userMe._id) {
            console.log('my wall')
            this.currentUser = this.userMe
            if (this.me.friends.length <= 1) {
              Service.instance.fetchAllUsers().then((users) => {
                this.users = users.body
              })
            }
            Service.instance.fetchFriends(this.userMe._id).then((friends) => {
              this.friends = friends.body
              console.log('friends ' + this.friends)
              let ids = []
              this.friends.forEach((friend) => {
                ids.push(friend._id)
              })
              Service.instance.fetchFavorite(this.userMe._id).then((events) => {
                document.getElementById('spinner').style.display = 'none'
                this.interestedEvents = events.filter((event) => {
                  if (event.interestedUsers.length > 0) {
                    return event.interestedUsers.filter((user) => {
                      return user._id === this.userMe._id
                    })
                  } else {
                    this.interestedUsers = []
                  }
                })
                this.participateEvents = events.filter((event) => {
                  if (event.participantUsers.length > 0) {
                    return event.participantUsers.filter((user) => {
                      return user._id === this.userMe._id
                    })
                  } else {
                    this.participantUsers = []
                  }
                })
                this.events = events
                this.fetchPostFromMe()
              })
            })

            globalData.setMeInfo(response)
            if (this.userMe.access_token) {
              this.spoti_auth = true
              this.fetchSpotifyInfo(this.userMe.access_token)
            }
          } else {
            // console.log('id' + id)
            Service.instance.fetchUser(id).then((user) => {
              this.currentUser = user
              console.log(this.currentUser)
              Service.instance.fetchFriends(this.currentUser._id).then((friends) => {
                this.friends = friends.body
                let ids = []
                console.log(this.friends)
                this.friends.forEach((friend) => {
                  ids.push(friend._id)
                })
                Service.instance.fetchFavorite(this.currentUser._id).then((events) => {
                  document.getElementById('spinner').style.display = 'none'
                  this.interestedEvents = events.filter((event) => {
                    if (event.interestedUsers.length > 0) {
                      return event.interestedUsers.filter((user) => {
                        return user._id === this.currentUser._id
                      })
                    } else {
                      this.interestedUsers = []
                    }
                  })
                  this.participateEvents = events.filter((event) => {
                    if (event.participantUsers.length > 0) {
                      return event.participantUsers.filter((user) => {
                        return user._id === this.currentUSer._id
                      })
                    } else {
                      this.participantUsers = []
                    }
                  })
                  this.events = events
                  this.fetchPostFromCurrentUser()
                })
              })

              globalData.setMeInfo(response)
              if (this.me.access_token) {
                this.spoti_auth = true
                this.fetchSpotifyInfo(this.me.access_token)
              }
            })
          }
        })
      }
    },
    // ----------------------------------- Spoti ------------------------
    authSpotify () {
      Service.instance.spotifyAuthentication().then((response) => {
        window.location.href = response.url
      })
    },

    receiveSpotifyCredentials () {
      console.log('credential')
      let code = route.history.current.query.code
      let state = route.history.current.query.state
      let id = window.localStorage.getItem('fanzik-id')
      Service.instance.receiveSpotifyCredentials(id, code, state).then((response) => {
        console.log(response)
        let spotiInfo = response.data
        let url = response.url
        Service.instance.saveTokens({access_token: response.access_token, refresh_token: response.refresh_token, avatar: spotiInfo.images[0].url}).then((response) => {
          globalData.setSpotiMeInfo(spotiInfo)
          window.location.href = url
          this.spoti_auth = true
        })
      })
    },

    fetchSpotifyInfo (accessToken) {
      Service.instance.fetchSpotifyInfo(accessToken).then((response) => {
        globalData.setSpotiMeInfo(response.body)
        this.userSpoti = response.body
      })
    },

    getUserPlaylists () {
      let accessToken = route.history.current.query.access_token
      Service.instance.fetchUserPlaylist(accessToken).then((response) => {
      })
    },
    // --------------------------------------- post ---------------------------
    createPost (e) {
      let post = {
        creatorId: this.userMe._id,
        post: document.getElementById('search').value
      }

      Service.instance.createPost(post).then((response) => {
        this.events.push(response)
      })
    },

    fetchPostFromMe (e) {
      Service.instance.fetchPosts(this.userMe._id, this.friends).then((response) => {
        console.log(response)
        this.events = this.events.concat(response)
      })
    },

    fetchPostFromCurrentUser () {
      Service.instance.fetchPosts(this.currentUser._id, this.friends).then((response) => {
        this.events = this.events.concat(response)
      })
    },
    // ----------------------------------- friends ----------------------------
    askFriends (meId, userId) {
      let asking = {
        id: meId,
        status: 'invitation recue'
      }

      let receiving = {
        id: userId,
        status: 'invitation envoyée'
      }
      let self = this
      Service.instance.askFriend(asking, receiving).then((response) => {
        console.log(response.userReceiving)
        let rec = response.userReceiving
        self.pendingRequest.push(rec)
        console.log(self.pendingRequest)
      })
    },
    // ------------------------------------ action -------------------------
    closePopup () {
      this.$refs.popupSuccessAuthSpotify.close()
      this.$router.push('home')
    },

    goToSettings () {
      if (this.currentUser._id === this.userMe._id) {
        this.$router.push('/settings')
      }
    },

    goToUsersList () {
      this.$router.push('/userlist')
    },

    goToUserWall (id) {
      this.$router.push('/home/' + id)
      EventBus.$emit('goToUserWall')
    }
  }
}

</script>

<style src="./Wallme.scss" lang="scss">
</style>
