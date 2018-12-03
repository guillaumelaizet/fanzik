import EventEmitter from 'events'

const util = new EventEmitter()
export default util


util.showSpinner = () => {
  document.getElementById('spinner').style.display = 'initial'
},

util.hideSpinner = () => {
  document.getElementById('spinner').style.display = 'none'
}
