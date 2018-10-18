<template>
  <div class="container">
    <div class="landing-page-content bg1" id="image-background">
      <div class="large-logo">Join the new fan's music community</div>
      <div class="btn-auth">
        <div v-on:click="goToLogin($event)" class="btn btn-primary btn-lg btn-link-login">LOGIN</div>
        <div v-on:click="goToSignin()" class="btn btn-success btn-lg btn-link-signin">SIGNUP</div>
      </div>
    </div>
    <div class="landing-description">
      <div class="container">

      </div>
      <div class="">

      </div>
      <div class="">

      </div>
      Find shows near you.<br>
      Build your community.<br>
      Start your journey.
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

    <popupauth ref="popup-signin">
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
          <button v-on:click="signIn(userSignInData)" type="button" class="btn btn-primary float-right btn-signin">SignIn</button>
        </form>
      </div>
    </popupauth>

    <popup ref="popup-success-signin">
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
import Vue from 'vue'
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
      userSignInData: {}
    }
  },

  mounted: function () {
    let doc = document.getElementById('image-background')
    console.log(doc)
    // setInterval(() => {
    //   let i = 0
    //   doc.removeClass('bg1', 'bg2', 'bg3', 'bg4').addClass('bg' + i)
    //   i++
    // })
  },

  methods: {
    goToLogin () {
      this.$refs.popupLogin.show = true
    },

    goToSignin () {
      // console.log(this.$router)
      // console.log(this.$route)
      // this.$router.push('/wallme')
      this.$refs['popup-signin'].show = true
    },

    login (userData) {
      Service.instance.login(userData).then((response) => {
        this.$refs.popupLogin.close()
        localStorage.setItem('token', response.body.token)
        Vue.http.headers.common['Authorization'] = `Bearer ${response.body.token}`
        EventBus.$emit('isAuthenticate')
        console.log('login')
        this.$router.push('wallme')
      })
    },

    signIn (userData) {
      Service.instance.register(userData).then((response) => {
        console.log(response.body)
        this.$refs['popup-signin'].close()
        this.$refs['popup-success-signin'].show = true
        localStorage.setItem('token', response.body.token)
      })
    },

    goToProfile () {
      this.$refs['popup-success-signin'].close()
      EventBus.$emit('isAuthenticate')
      this.$router.push('wallme')
    }
  }

}
</script>

<style scoped>

.bg1 {
  background-image: url('../../assets/music-background.jpg')
}
.bg2 {
  background-image: url('../../assets/music-background.jpg')
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
margin: 0vh auto 10vh auto;
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
padding-bottom: 5vh;
text-align: center;
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
</style>
