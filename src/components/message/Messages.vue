<template lang="html">
  <h1>Messages</h1>
</template>

<script>
// import {globalData} from '../../globalData.js'
import Service from '../../service/serviceReal.js'

export default {
  name: 'messages',

  props: ['me', 'spoti'],

  data () {
    return {
      userMe: {}
      // spoti: this.spoti
    }
  },

  created: function () {
    Service.instance.fetchMe().then((user) => {
      this.userMe = user
      let pending = this.userMe.friends.filter((user) => {
        return user.status === 'invitation recue'
      })
      console.log(pending)
    })
  }
}
</script>

<style lang="css">
</style>
