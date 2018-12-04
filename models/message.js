const mongoose = require('mongoose')

const Schema = mongoose.Schema

const messageSchema = new Schema({
  eventCreator: Object,
  eventReceivers: [],
  title: String,
  description: String,
  comments: [],
  deleted: Boolean,
  date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('message', messageSchema, 'messages')
