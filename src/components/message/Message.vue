<template lang="html">
  <div class="message">
    <div class="bloc">
      <div class="title">
        <p>écrit par: {{creator.pseudo}}<p>
          <p>titre: {{mess.title}}</p>

        </div>
        <div class="description">
          <p>contenu: {{mess.description}}</p>
        </div>
    </div>
    <div class="date">
      {{getFriendlyDate}}
    </div>
  </div>
</template>

<script>
import Service from '../../service/serviceReal'
import moment from 'moment'

export default {
  name: 'message',

  props: {
    message: {
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
      mess: this.message,
      creator: {},
      receivers: [],
    }
  },

  computed: {
    getFriendlyDate() {
      moment.locale('fr')
      return moment(new Date(this.mess.date)).fromNow()
    }
  },


  created: function () {

    Service.instance.fetchUser(this.mess.eventCreator).then((user) => {
      this.creator = user
    })

    Service.instance.fetchUsers(this.mess.eventReceivers).then((users) => {
      this.receivers = users
    })
  }
}
</script>

<style src="./Message.scss" lang="scss">
</style>
