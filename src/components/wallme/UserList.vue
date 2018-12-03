<template lang="html">
  <div class="wrapper">
    <div class="container">
      <div class="user-list" >
        <div class="user" v-for="user in users" :key="user._id">
          <p v-on:click="goToUserWall(user._id)">{{user.pseudo}}</p>

        </div>
      </div>
    </div>

    <popup ref="popupNewUSer">
      <!-- <div slot="header" style="font-size: 18px; font-weight: bold; margin: 20px auto;">
        Salut a toi le nouveau
      </div> -->
      <div slot="body">
        <div class="body">
          <div class="h-aligner" slot="header" style="font-size: 18px; font-weight: bold; margin-top: 20px;">Salut a toi le nouveau</div>
          <div style="margin-top: 20px; padding-bottom: 5px; font-size: 14px;">
            Nous t'avons fait une sélection de fanziker pour pouvoir te lancer dans l'aventure
          </div>
        </div>
        <div class="modal-button noselect" style="width: 200px; font-size: 12pt; border: none" v-on:click="close($event)">
          <button type="button" name="button" class="btn">Ok</button>
        </div>
      </div>
      <div slot="footer" class="h-centred">
      </div>
    </popup>
  </div>

</template>

<script>
import Service from '../../service/serviceReal.js'
import Popup from '../popup/Popup'
export default {

  components: {
    'popup': Popup
  },

  data () {
    return {
      me: {},
      users: []
    }
  },

  mounted: function () {
    Service.instance.fetchMe().then((response) => {
      console.log(response)
      this.me = response
      if (this.me.friends.length <= 3) {
        this.$refs.popupNewUSer.show = true
      }
    })
  },

  methods: {
    close () {
      Service.instance.fetchAllUsers().then((response) => {
        console.log(response)
        this.users = response.body
        this.$refs.popupNewUSer.close()
      })
    },

    goToUserWall (id) {
      this.$router.push('/home/' + id)
    }
  }

}
</script>

<style src="./UserList.scss" lang="scss">
</style>
