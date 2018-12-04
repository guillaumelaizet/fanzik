<template lang="html">
  <div class="post">
    <div class="header-post">
      <div class="">
        <div v-if="myWall" class="user">
          <div v-if="evt.creatorId" class="user-info">
            <div v-if="evt.receiverId && evt.receiverId === me._id" class="post-receive">
              <div class="creator">
                <div class="avatar">
                  <img v-if="creator.avatar" :src="creator.avatar" alt="">
                  <img v-else src="../../assets/anonyme.jpeg" alt="">
                </div>
                <div class="info">
                  <p>{{creator.pseudo}} a posté sur votre mur</p>
                </div>
              </div>
              <div class="title">
                <p>{{friendlyDate(evt.date)}}</p>
              </div>
            </div>
            <div v-if="evt.receiverId && evt.creatorId === me._id" class="post-send">
             <div class="receiver">
               <div v-on:click="goToUserWall(receiver._id)" class="avatar">
                 <img v-if="receiver.avatar" :src="receiver.avatar" alt="">
                 <img v-else src="../../assets/anonyme.jpeg" alt="">
               </div>
               <div class="info">
                 <p>{{receiver.pseudo}} (Vous avez poster sur son mur)</p>
               </div>
             </div>
             <div class="title">
               {{friendlyDate(evt.date)}}
             </div>
            </div>
            <div v-if="evt.creatorId === me._id && !evt.receiverId" class="post-write">
              <p>Vous avez poster<p>
              <p>{{friendlyDate(evt.date)}}</p>
            </div>
            <div v-if="evt.creatorId !== me._id && !evt.receiverId" class="post-friend">
              <div class="avatar">
                <div v-on:click="goToUserWall(creator._id)" class="avatar">
                  <img v-if="creator.avatar" :src="creator.avatar" alt="">
                  <img v-else src="../../assets/anonyme.jpeg" alt="">
                </div>
              </div>
              <div class="info">
                {{creator.pseudo}} a poster
              </div>
            </div>
          </div>
          <div v-else class="user-info">
            <div v-if="favoriteFromMe"class="favorite-event">
              <p>Vous êtes intéressé par cet évènement</p>
              <p>{{friendlyDate(date)}}</p>
            </div>
            <div v-if="favoriteFromUsers" class="favorite-event-user">
              <div class="creator">
                <div class="avatar" v-on:click="goToUserWall(interestedfriends[0]._id)">
                  <img v-if="interestedfriends[0].avatar" :src="interestedfriends[0].avatar" alt="">
                  <img v-else src="../../assets/anonyme.jpeg" alt="">
                </div>
                <div class="info">
                  <p>{{interestedfriends[0].pseudo}} s'est intéressé(e) à cet évènement</p>
                </div>
              </div>
              <div class="title">
                {{friendlyDate(date)}}
              </div>
            </div>
            <div v-if="participateFromMe"class="participate-event">
              <p>Vous participez à cet évènement</p>
              <p>{{friendlyDate(date)}}</p>
            </div>
            <div v-if="participateFromUsers" class="participate-event-user">
              <div class="creator">
                <div  v-on:click="goToUserWall(interestedfriends[0]._id)" class="avatar">
                  <img v-if="particpateFriends[0].avatar" :src="particpateFriends[0].avatar" alt="">
                  <img v-else src="../../assets/anonyme.jpeg" alt="">
                </div>
                <div class="info">
                  <p>{{particpateFriends[0].pseudo}} participe à cet évènement</p>
                </div>
              </div>
              <div class="title">
                {{friendlyDate(date)}}
              </div>
            </div>
          </div>
        </div>
        <div v-else class="other-wall">
          <div v-if="evt.creatorId"class="post">
            <div v-if="evt.receiverId && evt.receiverId === me._id" class="post">
              <div class="bloc-user">
                <div  v-on:click="goToUserWall(creator._id)" class="avatar">
                  <img v-if="creator.avatar" :src="creator.avatar" alt="">
                  <img v-else src="../../assets/anonyme.jpeg" alt="">
                </div>
                <div class="info">
                  <p>{{creator.pseudo}} a écrit sur votre mur</p>
                </div>
              </div>
              <div class="date">
                {{friendlyDate(evt.date)}}
              </div>
            </div>
            <div v-if="evt.creatorId === me._id && evt.receiverId === currentUser._id "class="post">
              <div class="bloc-user">
                <div  v-on:click="goToUserWall(creator._id)" class="avatar">
                  <img v-if="creator.avatar" :src="creator.avatar" alt="">
                  <img v-else src="../../assets/anonyme.jpeg" alt="">
                </div>
                <div class="info">
                  <p>Vous avez écrit sur son mur</p>
                </div>
              </div>
              <div class="date">
                {{friendlyDate(evt.date)}}
              </div>
            </div>
            <div v-if="evt.creatorId === currentUser._id && !evt.receiverId" class="post">
              <div class="bloc-user">
                <div v-on:click="goToUserWall(creator._id)" class="avatar">
                  <img v-if="creator.avatar" :src="creator.avatar" alt="">
                  <img v-else src="../../assets/anonyme.jpeg" alt="">
                </div>
                <div class="info">
                  <p>{{creator.pseudo}} a écrit</p>
                </div>
              </div>
              <div class="date">
                {{friendlyDate(evt.date)}}
              </div>
            </div>
            <div v-if="evt.creatorId === currentUser._id && evt.receiverId && evt.receiverId !== me._id "class="post">
              <div class="bloc-user">
                <div class="avatar">
                  <img v-on:click="goToUserWall(creator._id)" v-if="creator.avatar" :src="creator.avatar" alt="">
                  <img v-else src="../../assets/anonyme.jpeg" alt="">
                </div>
                <div class="info">
                  <p>{{creator.pseudo}} a écrit sur le mur de {{receiver.pseudo}}</p>
                </div>
              </div>
              <div class="date">
                {{friendlyDate(evt.date)}}
              </div>
            </div>
          </div>
          <div v-else class="event">
            <div v-if="favoriteFromMe" class="favorite">
              <div class="bloc-user">
                <div class="avatar">
                  <img v-if="currentUser.avatar" :src="currentUser.avatar" alt="">
                  <img v-else src="../../assets/anonyme.jpeg" alt="">
                </div>
                <div class="info">
                  <p>{{currentUser.pseudo}} est intéressé par cet event</p>
                </div>
              </div>
              <div class="date">
                {{friendlyDate(date)}}
              </div>
            </div>
            <div v-if="participateFromMe" class="participate">
              <div class="bloc-user">
                <div class="avatar">
                  <img v-if="currentUser.avatar" :src="currentUser.avatar" alt="">
                  <img v-else src="../../assets/anonyme.jpeg" alt="">
                </div>
                <div class="info">
                  <p>{{currentUser.pseudo}} participe a cet evènement</p>
                </div>
              </div>
              <div class="date">
                {{friendlyDate(date)}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="border-top">
    </div>
    <div class="body-post">
      <div v-if="evt.creatorId" class="post-no-event">
        {{evt.post}}
      </div>
      <div v-else class="post-event">
        <div class="event-info">
          évènement: {{evt.title}}<br>
          lien : <a :href="'/eventDetail/' + evt.title + '/' +  evt.idEvent">concert</a>
        </div>
        <div class="event-related">
          <div v-if="interestedfriends !== 0" class="interested related">
            <p v-if="mutualInterest && !myWall">Vous suivez aussi cet évent</p>
            <p v-if="myWall">{{interestedfriends.length}} amis suit cet évènement</p>
          </div>
          <div v-if="particpateFriends.length !== 0" class="participants related">

          </div>
        </div>
      </div>
    </div>
    <div class="border">
    </div>
    <div v-if="evt.creatorId" class="footer-post">
      <div v-if="evt.comments.length > 0" class="list-comments">
        <div class="" v-for="comment in evt.comments" :key="comment._id">
          <div class="comment">
            <div v-on:click="goToUserWall(comment.id)" class="avatar">
              <img v-if="comment.avatar" :src="comment.avatar" alt="">
              <img v-else src="../../assets/anonyme.jpeg" alt="">
              <p>{{comment.pseudo}}</p>
            </div>
            <div class="comment-post">
              {{comment.comment}}
            </div>
          </div>
        </div>
      </div>
      <div class="post-comment">
        <div class="avatar">
          <img :src="me.avatar" alt="">
        </div>
        <div class="" style="width: 90%;">
          <form class="form" role="form">

            <div class="form-group">
              <div class="input-group">
                <input  :id="evt._id" name="search" type="text" class="form-control" placeholder="Répondre...">
                <button type="button" v-on:click="commentPost(evt._id)" class="btn btn-primary" name="button">submit</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import moment from 'moment'
import Service from '../../service/serviceReal'
import EventBus from '../../event-bus.js'

export default {

  name: 'posts',

  props: ['me', 'spoti', 'evt', 'posts', 'friends', 'currentUser'],

  data () {
    return {
      creator: {},
      receiver: {},
      interestedfriends: [],
      particpateFriends: [],
      date: String
    }
  },

  mounted: function () {

    if (this.evt.creatorId) {
      Service.instance.fetchUser(this.evt.creatorId).then((user) => {
        this.creator = user
      })

      if (this.evt.receiverId) {
        console.log('receiver' + this.evt.receiverId)
        Service.instance.fetchUser(this.evt.receiverId).then((receiver) => {
          this.receiver = receiver
        })
      }
    } else if (this.evt.idEvent) {
      if (this.evt.interestedUsers) {
        console.log(this.friends)
        let ids = []
        this.evt.interestedUsers.forEach((user) => {
          this.friends.forEach((friend) => {
            console.log(friend)
            if (friend._id === user._id) {
              ids.push(user._id)
              this.date = user.date
            }
          })
          if (user._id === this.currentUser._id) {
            this.date = user.date
          }
        })
        if (ids.length > 0) {
          Service.instance.fetchUsers(ids).then((response) => {
            this.interestedfriends = response
          })
        }
      } if (this.evt.participantUsers.length > 0) {
        let ids = []
        this.evt.participantUsers.forEach((user) => {
          this.friends.forEach((friend) => {
            if (friend._id === user._id) {
              ids.push(user._id)
              this.date = user.date
            }
          })
          if (user._id === this.currentUser._id) {
            this.date = user.date
          }
        })
        if (ids.length > 0) {
          Service.instance.fetchUsers(ids).then((response) => {
            this.particpateFriends = response
          })
        }
      }
    }
  },

  computed: {

    validDate() {
      // if (this.evt.interestedUsers)
    },

    myWall () {
      return this.currentUser._id === this.me._id
    },

    mutualInterest () {
      if (this.evt.interestedUsers && this.evt.interestedUsers.length > 0) {
        return this.evt.interestedUsers.filter(user => user.id === this.currentUser_id || user.id === this.me._id).length > 1
      } else {
        return false
      }
    },

    favoriteFromMe () {
      if (this.evt.interestedUsers) {
        return this.evt.interestedUsers.filter(interest => interest._id === this.currentUser._id).length > 0
      }
    },

    favoriteFromUsers () {
      if (this.evt.interestedUsers) {
        return this.evt.interestedUsers.filter(interest => interest._id !== this.currentUser._id).length > 0
      }
    },

    participateFromMe () {
      if (this.evt.participantUsers) {
        return this.evt.participantUsers.filter(interest => interest._id === this.currentUser._id).length > 0
      }
    },

    participateFromUsers () {
      if (this.evt.participantUsers) {
        return this.evt.participantUsers.filter(interest => interest._id !== this.currentUser._id).length > 0
      }
    }


  },

  methods: {
    goToUserWall (id) {
      this.$router.push({path: '/home', query: {id: id}})
      EventBus.$emit('goToUserWall')
    },

    commentPost (id) {
      let post = {
        idEvent: this.evt._id,
        id: this.me._id,
        comment: document.getElementById(id).value,
        pseudo: this.me.pseudo
      }
      if (this.me.avatar) {
        post.avatar = this.me.avatar
      }
      Service.instance.commentPost(post).then((event) => {
        document.getElementById(id).value = ''
        EventBus.$emit('postComment', {event: event})
      })
    },

    friendlyDate (date) {
      moment.locale('fr')
      return moment(date).fromNow()
    },
  }

}
</script>

<style src="./Posts.scss" lang="scss">
</style>
