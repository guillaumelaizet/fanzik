<template lang="html">
  <div class="wrapper">
    <div class="pending-request">

    </div>
    <nav class="nav nav-tabs">
      <a class="nav-item nav-link active show" href="#messages" data-toggle="tab" >Messages</a>
      <a class="nav-item nav-link" href="#write" data-toggle="tab" >Envoyer</a>

    </nav>
    <div class="tab-content">
      <div class="tab-pane fade active show" id="messages">
        <h1>Vos Messages</h1>
        <div class="messages">
          <message
          v-for="message in messages"
          :message="message"
          :key="message._id"
          :userMe="userMe">
        </message>
        </div>
      </div>
      <div class="tab-pane fade" id="write">
        <form class="form" role="form">
          <div class="form-group">
            <label for="title" class="control-label">Titre</label>
            <div class="input-group">
              <input type="text" name="title" value="" class="form-control rounded-0" required v-model="message.title">
            </div>
          </div>
          <div class="form-group">
            <label for="message">Ton message</label>
            <textarea name="message" rows="8" cols="80" class="form-control rounded-0" required v-model="message.description"></textarea>
          </div>
          <div class="form-group">
            <label class="control-label" for="friend">Selectionne un amis</label>
            <select class="" name="friend" id="receivers">
              <option v-on:click="addReceivers($event, eventReceivers)" v-for="friend in friendList" :key="friend._id"
              :value="friend._id"
              >{{friend.pseudo}}</option>
            </select>
          </div>
          <div v-if="receivers.length > 0" class="">
            <p>Ami<span v-if="receivers.length > 1">s </span> sélectionné<span v-if="receivers.length > 1">s</span>: {{beautifulReceivers}}</p>
          </div>
          <button v-on:click="createMessage()" type="button" name="button" class="btn btn-primary">Envoyer</button>
        </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import Friend from './Friend'
import Service from '../../service/serviceReal.js'
import Message from './Message'

export default {
  name: 'messages',

  components: {
    'message': Message
  },

  props: ['me', 'spoti'],

  data () {
    return {
      userMe: {},
      friends: [],
      messageList: [],
      friendList: [],
      messages: [],
      message: {},
      receivers: [],
      eventReceivers: []
    }
  },

  computed: {
    beautifulReceivers () {
      return this.receivers.join()
    },

    friendlyDate (date) {
      return moment(date).fromNow()
    }
  },


  created: function () {
    Service.instance.fetchMe().then((user) => {
      this.userMe = user
      this.friends = this.userMe.friends.filter((user) => {
        return user.status === 'confirmed'
      })
      console.log(this.friends)
      let ids = []
      this.friends.forEach((friend) => {
        ids.push(friend.id)
      })
      console.log('ids ' + ids)
      Service.instance.fetchUsers(ids).then((users) => {
        this.friendList = users

        Service.instance.fetchMessages(this.userMe._id).then((messages) => {
          this.messages = messages.body

        })
      })
    })
  },

  methods: {
    createMessage () {
      this.message.eventCreator = this.userMe._id
      this.message.eventReceivers = this.eventReceivers
      console.log(this.message.eventReceivers)
      Service.instance.createMessage(this.message).then((message) => {
        let newMessage = message.body
        console.log(this.messages)
        this.messages.push(newMessage)
      })
    },

    addReceivers (event, message) {
      console.log(event.target.text);
      let text = event.target.text
      console.log(document.getElementById('receivers'))
      let doc = document.getElementById('receivers').value
      console.log(doc)
      if (this.receivers.length > 0) {
        if (this.receivers.includes(text)) {
          this.receivers.splice(text.indexOf(), 1)
          message.splice(doc.indexOf(), 1)
        } else {
          this.receivers.push(text)
          message.push(doc)
        }
      } else {
        this.receivers.push(text)
        message.push(doc)
      }
    },

    // goToMessageDetail() {
    //   this.$router.push('messagedetail/' + )
    // }
  }
}
</script>

<style src="./Messages.scss" lang="scss">
</style>
