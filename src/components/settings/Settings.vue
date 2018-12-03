<template lang="html">
  <div class="settings-bloc">
    <h1>Settings</h1>
    <form class="form" role="form">
      <div class="avatar-bloc">
        <input type="file" name="" value="" id="avatar">
        <!-- <img v-if="!me.avatar" class="avatar-img" id="avatar-img" src="../../assets/anonyme.jpeg" alt=""> -->
        <!-- <img v-else :src="../../assets/{{me.avatar}}" alt=""> -->
        <img :src="me.avatar" alt="" class="avatar-img">
      </div>
      <div class="form-group">
        <label class="control-label" for="">Pseudo</label>
        <div class="input-group">
          <!-- <font-awesome-icon class="icon" icon="user"/> -->
          <input id="pseudo" name="pseudo" type="text" class="form-control rounded-0" v-model="me.pseudo">
        </div>
      </div>
      <div class="form-group">
        <label for="">Email</label>
        <div class="input-group">
          <!-- <font-awesome-icon class="icon" icon="envelope-open"/> -->
          <input id="email" name="email" type="text" class="form-control rounded-0" v-model="me.email">
        </div>
      </div>
      <div class="form-group">
        <label for="country">Pays</label>
        <select class="form-control" v-model="me.country">
          <option value="me.country" v-for="country in countries"
           :selected="country.name == me.country"
           :value="country.name"
           :key="country.code">{{country.name}}</option>
        </select>
      </div>
      <div class="change-password">
        <p>Changer de mot de passe</p>
      </div>
      <button v-on:click="changeInfo()" type="button" class="btn btn-primary float-right btn-info">Enregistrer</button>
    </form>
  </div>

</template>

<script>
import Service from '../../service/serviceReal.js'

export default {
  name: 'settings',

  props: ['me', 'spoti'],

  data () {
    return {
      countries: []
    }
  },

  created: function () {
    this.countries = Service.instance.getCountriesList()
  },

  mounted: function () {
  },

  methods: {
  }

}
</script>

<style src="./Settings.scss" lang="scss">
</style>
