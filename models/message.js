const mongoose = require('mongoose')

const Schema = mongoose.Schema

const eventSchema = new Schema({
  id: String,
  eventCreator: Object,
  eventReceiver: Object,
  title: String,
  musicType: [String],
  description: String,
  participantUsers: [Schema.Types.ObjectId],
  comments: [],
  deleted: Boolean,
  date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('event', eventSchema, 'events')
