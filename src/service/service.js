import Vue from 'vue'
import EventBus from '../event-bus.js'

let singleInstance

class Service {
  constructor () {
    singleInstance = this
  }

  static get instance () {
    if (!this.singleInstance) {
      this.singleInstance = new Service()
    }
    return singleInstance
  }

  getToken () {
    // console.log(localStorage.getItem('token'))
    return localStorage.getItem('token')
  }

  register (userData) {
    const url = 'http://localhost:3000/api/register'
    let params = {
      pseudo: userData.pseudo,
      email: userData.email,
      password: userData.password
    }

    console.log(JSON.stringify(params) + 'from service')
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
    const url = 'http://localhost:3000/api/login'
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
    localStorage.removeItem('token')
    EventBus.$emit('isAuthenticate')
  }

  fetchMe () {
    const url = 'http://localhost:3000/api/user/me'
    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
        let user = response.data
        console.log(response.data)
        resolve(user)
      })
    })
  }

  fetchUsers () {
    const url = 'http://localhost:3000/api/users'
    console.log('ok from Service')
    return new Promise((resolve, reject) => {
      return Vue.http.get(url).then((response) => {
        let users = JSON.stringify(response.data)
        console.log(users)
        resolve(users)
      },
      (error) => {
        console.log(error)
      })
    })
  }
}

export default Service
