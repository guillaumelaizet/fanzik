<template lang="html">
  <div class="wrapper">
    <nav class="nav nav-tabs">
      <a class="nav-item nav-link active show" href="#amis" data-toggle="tab" >Amis</a>
      <a class="nav-item nav-link" href="#requests" data-toggle="tab" >Demandes recues</a>
      <a class="nav-item nav-link" href="#suggestions" data-toggle="tab" >Suggestions</a>
    </nav>
    <div class="tab-content">
      <div class="tab-pane fade active show" id="amis">
        <div class="amis">
          <friend v-for="friend in amis" :friendId="friend.id" :key="friend.id" class="">
          </friend>
        </div>
      </div>
      <div class="tab-pane fade" id="requests">
        <h3>Ces fanzikers t'ont demandé en amis !</h3>
        <div v-if="requests.length > 0" class="requests">
          <request v-for="request in requests" :requestId="request.id"  :userMe="userMe" :key="request.id"></request>
        </div>
        <div v-else class="no-request">
          <p>Tu n'as pas de demande d'amis en attente</p>
        </div>
      </div>
      <div class="tab-pane fade" id="suggestions">
        <h3>Voila une petite sélection de fanzikers pour t'aider à débuter !</h3>
        <div v-if="suggs" class="suggestions">
          <suggestion id="suggestion" v-for="suggestion in suggs" :userMe="userMe" :suggestion="suggestion" :key="suggestion._id"></suggestion>
        </div>
        <div v-else class="no-suggestion">
          <p>Nous n'avons pas de fanziker a te proposer pour le moment</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import Friend from './Friend'
import Suggestion from './Suggestion'
import Request from './Request'
import Service from '../../service/serviceReal.js'
export default {
  name: 'friendlist',

  components: {
    'friend': Friend,
    'suggestion': Suggestion,
    'request': Request
  },


  data () {
    return {
      friends: [],
      userMe: {},
      pendingRequest: [],
      suggestions: [],
      ready: false
    }
  },

  computed: {
    requests () {
      if (this.pendingRequest) {
        return this.pendingRequest
      }
    },

    suggs () {
      if (this.suggestions) {
        return this.suggestions
      }
    },

    amis () {
      if (this.friends) {
        return this.friends
      }
    }
  },

  created: function () {
    Service.instance.fetchMe().then((user) => {
      this.userMe = user
      console.log(this.userMe)
      this.pendingRequest = this.userMe.friends.filter((user) => {
        return user.status === 'invitation recue'
      })
      console.log(this.pendingRequest)
      this.friends = this.userMe.friends.filter((user) => {
        return user.status === 'confirmed'
      })

      console.log(this.friends)

      Service.instance.fetchAllUsers().then((users) => {
        console.log(users)
        this.suggestions = users.filter((user) => {
          return user._id !== this.userMe._id && user.pseudo !== 'admin'
        })
        console.log(this.suggestions)
      })
    })
  },

}
</script>

<style src="./FriendList.scss" lang="scss">
</style>
