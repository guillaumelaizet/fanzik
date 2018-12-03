<template lang="html">
  <div class="post">
    <div class="header-post">
      <div class="user">
        <div class="user-info">
          <div class="avatar">
            <div v-if="evt.creatorId === currentUser._id || ownPost" class="">
              <img v-if="currentUser.avatar" :src="currentUser.avatar" alt="">
              <img v-else src="../../assets/anonyme.jpeg" alt="">
            </div>
            <div v-else class="">
              <div v-on:click="goToUserWall(user._id)" class="blabla">
                <img v-if="evt.creatorId === user._id" src="../../assets/anonyme.jpeg" alt="">

              </div>
            </div>
          </div>
          <div class="title">
            <div v-if="!evt.creatorId" class="">
              <div v-if="ownPost && myWall" class="pseudo">
                Vous {{title}}
              </div>
              <div v-else class="pseudo">
                {{currentUser.pseudo}} {{title}}
              </div>
            </div>
            <div v-else class="">
              <div v-if="ownPost" class="pseudo">
              Vous avez écrit
              </div>
              <div v-else class="pseudo">
                {{user.pseudo}} a écrit
              </div>
            </div>
            <div class="time-post">
              {{friendlyDate}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="border border-top">
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
        <div class="" v-for="comment in evt.comments" :key="comment.id">
          <div class="comment">
            <div class="avatar">
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
                <input  id="comment" name="search" type="text" class="form-control" placeholder="Répondre...">
                <button type="button" v-on:click="commentPost()" class="btn btn-primary" name="button">submit</button>
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
      user: {},
      interestedfriends: [],
      particpateFriends: []
    }
  },

  mounted: function () {
    console.log(this.me)
    if (this.evt.creatorId) {
      Service.instance.fetchUser(this.evt.creatorId).then((user) => {
        this.user = user
      })
    } else if (this.evt.idEvent) {
      if (this.evt.interestedUsers) {
        let ids = []
        this.evt.interestedUsers.forEach((user) => {
          this.friends.forEach((friend) => {
            if (friend._id === user._id) {
              ids.push(user._id)
            }
          })
        })
        Service.instance.fetchUsers(ids).then((response) => {
          this.interestedfriends = response
        })
      } else if (this.evt.participantUsers) {
        let ids = []
        this.evt.participantUsers.forEach((user) => {
          this.friends.forEach((friend) => {
            if (friend._id === user._id) {
              ids.push(user._id)
            }
          })
        })
        Service.instance.fetchUsers(ids).then((response) => {
          this.particpateFriends = response
        })
      }
    }
  },

  computed: {
    friendlyDate () {
      if (this.evt.interestedUsers !== undefined && this.evt.interestedUsers.length !== 0) {
        let interested = this.evt.interestedUsers.filter((user) => {
          return user._id === this.currentUser._id
        })
        moment.locale('fr')
        return 'Le ' + moment(new Date(interested[0].date)).format('LL') + ' à ' + moment(new Date(interested[0].date)).format('LT') + ' H'
      } else if (this.evt.participantUsers !== undefined && this.evt.participantUsers.length !== 0) {
        let participate = this.evt.participantUsers.filter((user) => {
          return user._id === this.currentUser._id
        })
        console.log(participate)
        moment.locale('fr')
        return 'Le ' + moment(new Date(participate[0].date)).format('LL') + ' à ' + moment(new Date(participate[0].date)).format('LT') + ' H'
      } else {
        return 'Le ' + moment(new Date(this.evt.date)).format('LL') + ' à ' + moment(new Date(this.evt.date)).format('LT') + ' H'
      }
    },

    ownPost () {
      if (this.currentUser._id === this.me._id) {

      }
      if (this.evt.interestedUsers !== undefined && this.evt.interestedUsers.length !== 0) {
        return this.evt.interestedUsers.filter((user) => {
          return user._id === this.me._id
        })
      } else if (this.evt.participantUsers !== undefined && this.evt.participantUsers.length !== 0) {
        return this.evt.participantUsers.filter((user) => {
          return user._id === this.me._id
        })
      } else {
        return this.evt.creatorId === this.me._id
      }
    },

    title () {
      if (this.evt.interestedUsers !== undefined && this.evt.interestedUsers.length !== 0) {
        let interested = this.evt.interestedUsers.filter((user) => {
          return user._id === this.currentUser._id
        })
        if (interested) {
          return ' est intéressé par un evenement'
        }
      } else if (this.evt.participantUsers !== undefined && this.evt.participantUsers.length !== 0) {
        let participate = this.evt.participantUsers.filter((user) => {
          return user._id === this.currentUser._id
        })
        if (participate) {
          return ' participe a un évènement'
        }
      }
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
    }
  },

  methods: {
    goToUserWall (id) {
      this.$router.push('/home/' + id)
      EventBus.$emit('goToUserWall')
    },

    commentPost () {
      let post = {
        idEvent: this.evt._id,
        id: this.me._id,
        comment: document.getElementById('comment').value,
        pseudo: this.me.pseudo
      }
      if (this.me.avatar) {
        post.avatar = this.me.avatar
      }
      Service.instance.commentPost(post).then((event) => {
        EventBus.$emit('postComment', {event: event})
      })
    }
  }

}
</script>

<style src="./Posts.scss" lang="scss">
</style>
