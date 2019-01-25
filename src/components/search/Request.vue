<template lang="html">
  <div class="wrapper">
    <div class="user">
      <div class="user-info">
        <div class="avatar">
          <img v-if="user.avatar" :src="user.avatar" alt="">
          <img v-else src="../../assets/anonyme.jpeg" alt="">
        </div>
        <div class="pseudo">
          {{user.pseudo}}
        </div>
      </div>
      <div class="choice">
        <button v-if="!accepted" v-on:click="acceptFriendship()" type="button" name="button" class="btn btn-primary">Accepter</button>
        <button v-if="!accepted" v-on:click="refuseFriendship()" type="button" name="button" class="btn btn-secondary btn-refuse">Refuser</button>
        <button v-if="accepted" type="button" name="button" class="btn "disabled>demande accepté</button>
        <button v-if="notAccepted" type="button" name="button" class="btn btn-danger" disabled>demande refusé</button>
      </div>
    </div>
  </div>
</template>

<script>
import Service from '../../service/serviceReal'
import EventBus from '../../event-bus.js'
export default {
  name: 'request',

  props: {
    requestId: {
      type: String,
      default: null
    },
    userMe: {
      type: Object,
      default: null
    }
  },

  data () {
    return {
      id: this.requestId,
      user: {},
      me: this.userMe,
      accepted: false,
      notAccepted: false
    }
  },

  computed: {
    accepted () {
      return this.user.friends.filter(friend => friend.id === this.me._id && friend.status === 'confirmed').length > 0
    }
  },

  created: function () {
    Service.instance.fetchUser(this.id).then((user) => {
      this.user = user
      console.log(this.user)
    })
  },

  methods: {
    acceptFriendship () {
      let userId1 = {
        id: this.user._id
      }
      let userId2 = {
        id: this.me._id
      }

      Service.instance.acceptFriendship(userId1, userId2).then((user) => {
        this.accepted = true
        this.user = user.userId1

      })
    },

    refuseFriendship () {
      Service.instance.declineFriendship(this.user._id, this.me._id).then((user) => {
        this.user = user.userId1
        this.notAccepted = true
      })
    }
  }

}
</script>

<style src="./Request.scss" lang="scss">
</style>
