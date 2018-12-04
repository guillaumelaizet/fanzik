<template lang="html">
  <div class="wrapper">
    <div class="friend">
      <div class="friend-info">
        <div class="avatar">
          <img v-if="friend.avatar" :src="friend.avatar" alt="">
          <img v-else src="../../assets/anonyme.jpeg" alt="">
        </div>
        <div class="pseudo">
          {{friend.pseudo}}
        </div>
      </div>
      <div class="choice">
        <button v-on:click="SendMessage()" type="button" name="button" class="btn btn-primary">Lui écrire un message</button>
      </div>
    </div>
  </div>
</template>

<script>
import Service from '../../service/serviceReal'

export default {

  name: 'friend',

  props: {
    friendId: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      friend: {},
      id: this.friendId
    }
  },

  created: function () {
    console.log(this.id)
    Service.instance.fetchUser(this.id).then((user) => {
      console.log(user)
      this.friend = user
    })
  },

  methods: {
    SendMessage () {
      this.$router.push('/messages?q=write')
    }
  }

}
</script>

<style src="./Friend.scss" lang="scss">
</style>
