<template>
  <div class="container">
    <div class="landing-page-content bg1" id="image-background">
      <div class="large-logo">Join the new fan's music community</div>
      <div class="btn-auth">
        <div v-on:click="goToLogin($event)" class="btn btn-primary btn-lg btn-link-login">SIGNIN</div>
        <div v-on:click="goToSignin()" class="btn btn-success btn-lg btn-link-signin">SIGNUP</div>
      </div>
    </div>
    <div class="landing-description">
      <div class="text-info">
        <font-awesome-icon class="icon icon-info" icon="music"/>
        Find shows near you.<br>
      </div>
      <div class="text-info">
        <font-awesome-icon class="icon icon-info" icon="users"/>
        Build your community.<br>
      </div>
      <div class="text-info">
        <font-awesome-icon class="icon icon-info" icon="thumbs-up"/>
        Start your journey.
      </div>
    </div>

    <!-- ---------------------------------------------------- Popup Auth --------------------------------------------------------------- -->

    <popupauth ref='popupLogin'>
      <div slot="header">
        <h2>Login</h2>
      </div>
      <div class="h-aligner" slot="body">
        <form class="form" role="form">
          <div class="form-group">
            <label class="control-label" for="pseudo">Pseudo</label>
            <div class="input-group">
              <font-awesome-icon class="icon-auth" icon="user"/>
              <input name="pseudo" type="text" class="form-control rounded-0" required placeholder="name" v-model="userLoginData.pseudo">
            </div>
          </div>
          <div class="form-group">
            <label class="control-label" for="password">mot de passe</label>
            <div class="input-group">
              <font-awesome-icon class="icon-auth" icon="lock"/>
              <input name="password" type="password" class="form-control rounded-0" required placeholder="password" v-model="userLoginData.password">
            </div>
          </div>
          <span>mot de passe oublié ?</span>
          <button v-on:click="login(userLoginData)" type="button" class="btn btn-success float-right btn-login">login</button>
        </form>
      </div>
    </popupauth>

    <popupauth ref="popupRegister">
      <div slot="header">
        <h2>SignIn</h2>
      </div>
      <div class="" slot="body">
        <form class="form" role="form">
          <div class="form-group">
            <label class="control-label" for="">Pseudo*</label>
            <div class="input-group">
              <font-awesome-icon class="icon-auth" icon="user"/>
              <input id="pseudo" name="pseudo" type="text" class="form-control rounded-0" v-model="userSignInData.pseudo">
            </div>
          </div>
          <div class="form-group">
            <label for="">Email*</label>
            <div class="input-group">
              <font-awesome-icon class="icon-auth" icon="envelope-open"/>
              <input id="email" name="email" type="text" class="form-control rounded-0" v-model="userSignInData.email">
            </div>
          </div>
          <div class="form-group">
            <label for="">mot de passe*</label>
            <div class="input-group">
              <font-awesome-icon class="icon-auth" icon="lock"/>
              <input id="password" name="password" type="password" class="form-control rounded-0" title="votre mot de passe doit contenir au moins 8 caractères" v-model="userSignInData.password">
            </div>
          </div>
          <div class="form-group">
            <label for="country">Pays</label>
            <select class="form-control" v-model="userSignInData.country">
              <option value="France" v-for="country in countries" :key="country.code">{{country.name}}</option>
            </select>
          </div>
          <button v-on:click="signIn(userSignInData)" type="button" class="btn btn-primary float-right btn-signin">SignIn</button>
        </form>
      </div>
    </popupauth>

    <popup ref="popupSuccessRegister">
      <div slot="body">
        <div class="headline-blue">
          <div class="h-aligner" slot="header" style="font-size: 18px; font-weight: bold; margin-top: 20px;">Félicitation ton inscritpion est fini</div>
          <div style="margin-top: 20px; padding-bottom: 5px; font-size: 14px;">
            Tu sera redirigé en cliquant sur le petit bouton :-)
          </div>
        </div>
        <div class="modal-button noselect" style="width: 200px; margin: auto; font-size: 12pt; border: none" v-on:click="goToProfile($event)">
          <button class="v-aligned-child btn btn-primary btn-success-signin" style="vertical-align: -30px; text-align: center; color: white;">OK</button>
        </div>
      </div>
      <!-- <div slot="footer" class="h-centred"> -->
      <!-- </div> -->
    </popup>

  </div>
</template>

<script>
// import Vue from 'vue'
import Service from '../../service/serviceReal.js'
import Popup from '../popup/Popup'
import PopupAuth from '../popup/PopupAuth'
import EventBus from '../../event-bus.js'

export default {
  name: 'home',

  components: {
    'popup': Popup,
    'popupauth': PopupAuth
  },

  props: ['me'],

  data () {
    return {
      userLoginData: {},
      userSignInData: {},
      countries: [],
      user: {}
    }
  },

  created: function () {
    EventBus.$on('pressRegisterButton', () => {
      this.$refs.popupRegister.show = true
    })
    EventBus.$on('pressLoginButton', () => {
      this.$refs.popupLogin.show = true
    })
    this.countries = Service.instance.getCountriesList()
  },

  mounted: function () {
  },

  methods: {
    goToLogin () {
      this.$refs.popupLogin.show = true
    },

    goToSignin () {
      this.$refs.popupRegister.show = true
    },

    login (userData) {
      Service.instance.login(userData).then((response) => {
        this.$refs.popupLogin.close()
        this.user = response.body.user
        Service.instance.storeSessionId(response.body.token)
        Service.instance.storeId(response.body.user._id)
        EventBus.$emit('isAuthenticate')
        this.$router.push({path: '/home', query: {id: response.body.user._id}})
      })
    },

    signIn (userData) {
      Service.instance.register(userData).then((response) => {
        this.$refs.popupRegister.close()
        this.user = response.body.registeredUser
        console.log(response.body.registeredUser)
        this.$refs.popupSuccessRegister.show = true
        Service.instance.storeId(response.body.registeredUser._id)
        Service.instance.storeSessionId(response.body.token)
      })
    },

    goToProfile () {
      this.$refs.popupSuccessRegister.close()
      EventBus.$emit('isAuthenticate')
      this.$router.push({path: '/home', query: {id: this.user._id}})
    }
  }

}
</script>

<style scoped src="./home.scss" lang="scss"></style>
