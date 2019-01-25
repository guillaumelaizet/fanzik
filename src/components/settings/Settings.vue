<template lang="html">
  <div class="settings-bloc">
    <h1>Settings</h1>
    <form class="form" role="form">
      <div class="avatar-bloc">
        <img v-if="userMe.avatar" :src="userMe.avatar" alt="" class="avatar-img">
        <img v-else src="../../assets/anonyme.jpeg" alt="" class="avatar-img">
      </div>
      <div class="form-group">
        <label class="control-label" for="">Pseudo</label>
        <div class="input-group">
          <input id="pseudo" name="pseudo" type="text" class="form-control rounded-0" v-model="userMe.pseudo">
        </div>
      </div>
      <div class="form-group">
        <label for="">Email</label>
        <div class="input-group">
          <input id="email" name="email" type="text" class="form-control rounded-0" v-model="userMe.email">
        </div>
      </div>
      <div class="form-group">
        <label class="control-label" for="">Nom</label>
        <div class="input-group">
          <input id="pseudo" name="pseudo" type="text" class="form-control rounded-0" v-model="userMe.nom">
        </div>
      </div>
      <div class="form-group">
        <label class="control-label" for="">Prénom</label>
        <div class="input-group">
          <input id="pseudo" name="pseudo" type="text" class="form-control rounded-0" v-model="userMe.prenom">
        </div>
      </div>
      <div class="form-group">
        <label for="country">Pays</label>
        <select class="form-control" v-model="userMe.country">
          <option value="me.country" v-for="country in countries"
           :selected="country.name == userMe.country"
           :value="country.name"
           :key="country.code">{{country.name}}</option>
        </select>
      </div>
      <button v-on:click="updateSettings()" type="button" class="btn btn-primary float-right btn-info">Enregistrer</button>
    </form>

    <popup ref="popupSuccessUpdate">
      <div slot="body">
        <div class="headline-blue">
          <div class="h-aligner" slot="header" style="font-size: 18px; font-weight: bold; margin-top: 20px;">Félicitation <strong>Fanziker</strong> Tes informations on été mises à jour</div>
          <div style="margin-top: 20px; padding-bottom: 5px; font-size: 14px;">
          </div>
        </div>
        <div class="modal-button noselect" style="width: 200px; margin: auto; font-size: 12pt; border: none" v-on:click="closePopup($event)">
          <button class="v-aligned-child btn btn-primary btn-success-signin" style="vertical-align: -30px; text-align: center; color: white;">OK</button>
        </div>
      </div>
    </popup>
  </div>

</template>

<script>
import Service from '../../service/serviceReal.js'
import Popup from '../popup/Popup'

export default {
  name: 'settings',

  props: ['me', 'spoti'],

  components: {
    'popup': Popup
  },

  data () {
    return {
      countries: [],
      userMe: {}
    }
  },

  created: function () {
    this.countries = Service.instance.getCountriesList()
    Service.instance.fetchMe().then((user) => {
      console.log(user)
      this.userMe = user
    })
  },

  mounted: function () {
  },

  methods: {
    updateSettings () {
      Service.instance.updateUser(this.userMe).then((response) => {
        this.userMe = response
        this.$refs.popupSuccessUpdate.show = true
      })
    },

    closePopup () {
      this.$refs.popupSuccessUpdate.close()
    }
  }

}
</script>

<style src="./Settings.scss" lang="scss">
</style>
