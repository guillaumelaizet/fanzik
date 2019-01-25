import Vue from 'vue'
import Service from './serviceReal.js'
import EventBus from '../event-bus.js'


class AuthService extends Service {

  static create () {
    console.log('authService Created')
    let authService = new AuthService()
    return authService
  }

  constructor() {
    super()
  }

  register (userData) {
    const url = this.path + 'api/register'
    let params = {
      pseudo: userData.pseudo,
      email: userData.email,
      password: userData.password,
      country: userData.country
    }

    return new Promise((resolve, reject) => {
      return Vue.http.post(url, params).then((response) => {
        resolve(response)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  login (userData) {
    const url = this.path +  'api/login'
    let params = {
      pseudo: userData.pseudo,
      password: userData.password
    }

    return new Promise((resolve, reject) => {
      return Vue.http.post(url, params).then((response) => {
        resolve(response)
      },
      (error) => {
        console.log(error)
      })
    })
  }

  logout () {
    this.removeSessionId(this.sessionId)
    this.removeId()
    EventBus.$emit('isLogout')
  }


  verifyifduplicate (pseudo, email) {
    const url = `${path}api/verifyifduplicate/${pseudo}/${email}`
    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
        let user = response.data
        resolve(user)
      },
      (error) => {
        console.log(error)
        resolve(error)
      })
    })

  }
}

export default AuthService
