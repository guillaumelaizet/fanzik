const mongoose = require('mongoose')

const Schema = mongoose.Schema

const eventSchema = new Schema({
  id: String,
  title: String,
  artist: String,
  musicType: [String],
  description: String,
  participantUsers: [Schema.Types.ObjectId],
  comments: [],
  location: {
    street: String,
    zipCode: Number,
    city: String
  },
  link: String,
  date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('event', eventSchema, 'events')
