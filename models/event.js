const mongoose = require('mongoose')

const Schema = mongoose.Schema

const eventSchema = new Schema({
  eventCreator: Object,
  eventReceiver: Object,
  title: String,
  musicType: [String],
  description: String,
  participantUsers: [Schema.Types.ObjectId],
  comments: [],
  // location: {
  //   street: String,
  //   zipCode: Number,
  //   city: String
  // }
  deleted: Boolean,
  date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('event', eventSchema, 'events')
