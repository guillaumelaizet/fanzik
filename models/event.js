const mongoose = require('mongoose')

const Schema = mongoose.Schema

const eventSchema = new Schema({
  idEvent: String,
  title: String,
  artists: [
    {
      name: String
    }
  ],
  musicType: [String],
  description: String,
  participantUsers: [
    {
      id: Schema.Types.ObjectId,
      date: {type: Date, default: Date.now}
    }
  ],
  comments: [],
  venue_name: String,
  city_name: String,
  country_name: String,
  link: String,
  date: String,
  interestedUsers: [
    {
      id: Schema.Types.ObjectId,
      date: {type: Date, default: Date.now}
    }
  ]
})

module.exports = mongoose.model('event', eventSchema, 'events')
