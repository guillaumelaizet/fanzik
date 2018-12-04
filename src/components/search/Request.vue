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
        <button v-on:click="acceptFriendship()" type="button" name="button" class="btn btn-primary">Accepter</button>
        <button v-on:click="refuseFriendship()" type="button" name="button" class="btn btn-secondary btn-refuse">Refuser</button>
      </div>
    </div>
  </div>
</template>

<script>
import Service from '../../service/serviceReal'
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
      me: this.userMe
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
        console.log(user)
      })
    },

    refuseFriendship () {
      Service.instance.declineFriendship(this.user._id, this.me._id).then((user) => {
        console.log(user)
      })
    }
  }

}
</script>

<style src="./Request.scss" lang="scss">
</style>
