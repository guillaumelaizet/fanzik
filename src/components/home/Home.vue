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
              <font-awesome-icon class="icon" icon="user"/>
              <input name="pseudo" type="text" class="form-control rounded-0" required placeholder="name" v-model="userLoginData.pseudo">
            </div>
          </div>
          <div class="form-group">
            <label class="control-label" for="password">mot de passe</label>
            <div class="input-group">
              <font-awesome-icon class="icon" icon="lock"/>
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
              <font-awesome-icon class="icon" icon="user"/>
              <input id="pseudo" name="pseudo" type="text" class="form-control rounded-0" v-model="userSignInData.pseudo">
            </div>
          </div>
          <div class="form-group">
            <label for="">Email*</label>
            <div class="input-group">
              <font-awesome-icon class="icon" icon="envelope-open"/>
              <input id="email" name="email" type="text" class="form-control rounded-0" v-model="userSignInData.email">
            </div>
          </div>
          <div class="form-group">
            <label for="">mot de passe*</label>
            <div class="input-group">
              <font-awesome-icon class="icon" icon="lock"/>
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

    <popupauth>

    </popupauth>

    <popup ref="popupSuccessRegister">
      <div slot="body">
        <div class="headline-blue">
          <img src="/assets/checked.svg" width="48px" height="48px" />
          <div class="h-aligner" slot="header" style="font-size: 18px; font-weight: bold; margin-top: 20px;">Félicitation ton inscritpion est fini</div>
          <div style="margin-top: 20px; padding-bottom: 5px; font-size: 14px;">
            Tu sera redirigé en cliquant sur le petit bouton :-)
          </div>
        </div>
      </div>
      <div slot="footer" class="h-centred">
        <div class="modal-button noselect" style="width: 200px; margin: 8px; font-size: 12pt; border: none" v-on:click="goToProfile($event)">
          <span class="v-aligned-child" style="vertical-align: -30px; text-align: center; color: white;">OK</span>
        </div>
      </div>
    </popup>
    <popup ref="success_login"></popup>

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

  data () {
    return {
      userLoginData: {},
      userSignInData: {},
      countries: []
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
    // console.log(Service.instance.fetchMusics())
  },

  mounted: function () {
    // EventBus.$on('pressLoginButton', () => {
    //   this.$refs.popupLogin.show = true
    // })
    // let doc = document.getElementById('image-background')
    // console.log(doc.classList)
    // doc.classList.add('abcd')
    // let i = 0
    // setInterval(() => {
    //   i++
    //   if (i <= 4) {
    //     console.log(i)
    //
    //     doc.classList.remove('bg1', 'bg2', 'bg3', 'bg4')
    //     doc.classList.add('bg' + i)
    //     console.log(doc.classList);
    //   } else {
    //     i = 0
    //   }
    // }, 5000)
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
        console.log(response.body.token)
        Service.instance.storeSessionId(response.body.token)
        EventBus.$emit('isAuthenticate')
        console.log('login')
        this.$router.push('home')
        // this.$router.push('home?access_token=' + window.localStorage.getItem('spotify_access_token') + '&refresh_token=' + window.localStorage.getItem('spotify_refresh_token'))
      })
    },

    signIn (userData) {
      console.log(userData)
      Service.instance.register(userData).then((response) => {
        this.$refs.popupRegister.close()
        this.$refs.popupSuccessRegister.show = true
        Service.instance.storeSessionId(response.body.token)
      })
    },

    goToProfile () {
      this.$refs.popupSuccessRegister.close()
      EventBus.$emit('isAuthenticate')
      this.$router.push('home')
      // this.$router.push('home?access_token=' + window.localStorage.getItem('spotify_access_token') + '&refresh_token=' + window.localStorage.getItem('spotify_refresh_token'))
    }
  }

}
</script>

<style scoped>

.bg1 {
  background-image: url('../../assets/music-background.jpg')
}
.bg2 {
  background-image: url('../../assets/music-background2.jpg')
}
.bg3 {
  background-image: url('../../assets/music-background.jpg')
}
.bg4 {
  background-image: url('../../assets/music-background.jpg')
}

.landing-page-content {
width: 100%;
height: 600px;
display: flex;
flex-direction: column;
margin: 0vh auto 2vh auto;
background-color: #0e1111;
opacity: 0.8;
/* border-radius:20px; */
color: white;
text-align: center;
padding: 10vh 5vh;
font-size: 1.8em;
}

.large-logo {
font-size: 2em;
margin-bottom: 5vh;
}

.landing-description {
opacity: 0.5;
font-size: 1.1em;
/* padding: 5vh 0; */
text-align: center;
width: 100%;
height: 150px;
display: flex;
background: lightgrey;
margin-bottom: 20px;
}

.text-info {
  width: 35%;
  margin: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.icon-info {
  background: none !important;
  color: inherit !important;
  margin: auto;
  min-width: 50px;
  min-height: 50px;
}

.landing-registration-link, .landing-logIn-link {
cursor: pointer;
font-weight: bold;
color: blue;
}

.btn-auth {
margin-bottom: 5vh;
display: flex;
justify-content: space-around;
}

.form-control:focus {
  border: 2px solid dodgerblue;
  /* background: blue; */
  outline: none;
  box-shadow: none;
}

.icon {
    padding: 10px;
    background: #FFA500;
    color: white;
    min-width: 50px;
    height: 40px;
    text-align: center;
}

.btn-login {
  margin: 10px 0 10px 0;
  background: #FFA500;
  border: none;
}

.btn-primary {
  background: #FFA500;
  border: none;
}

.btn-success {
  background: red;
  border: none;
}
</style>
