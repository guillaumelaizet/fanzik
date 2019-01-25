<template lang="html">
  <div v-if="!alreadyAsk && !alreadyFriend" class="wrapper">
    <div class="user">
      <div v-on:click="goToUserWall()" class="user-info">
        <div class="avatar">
          <img v-if="suggestion.avatar" :src="suggestion.avatar" alt="">
          <img v-else src="../../assets/anonyme.jpeg" alt="">
        </div>
        <div class="pseudo">
          {{suggestion.pseudo}}
        </div>
      </div>
      <div class="choice">
        <button v-if="pending" type="button" name="button" class="btn btn-secondary">En attente de réponse</button>
        <button v-else v-on:click="askFriends(userMe._id, suggestion._id)" type="button" name="button" class="btn btn-primary">Demander en amis + </button>
      </div>
    </div>
  </div>
</template>

<script>
import Service from '../../service/serviceReal'

export default {
  name: 'suggestion',

  props: {
    suggestion: {
      type: Object,
      default: null
    },
    userMe: {
      type: Object,
      default: null
    }
  },

  data () {
    return {
      me: this.userMe
    }
  },

  computed: {
    pending () {
      return this.suggestion.friends.filter(friend => friend.id === this.me._id && friend.status === 'invitation recue').length > 0
    },

    alreadyAsk () {
      return this.suggestion.friends.filter(friend => friend.id === this.me._id && friend.status === 'invitation envoyée').length > 0
    },

    alreadyFriend () {
      return this.suggestion.friends.filter(friend => friend.id === this.me._id && friend.status === 'confirmed').length > 0
    }
  },


  methods: {

    askFriends (meId, userId) {
      let asking = {
        id: meId,
        status: 'invitation recue'
      }

      let receiving = {
        id: userId,
        status: 'invitation envoyée'
      }
      Service.instance.askFriend(asking, receiving).then((response) => {
        console.log(response.userReceiving)
        this.suggestion = response.userReceiving
      })
    },

    goToUserWall () {
      this.$router.push('/home?id=' + this.suggestion._id)
    }

  }

}
</script>

<style src="./Suggestion.scss" lang="scss">
</style>
