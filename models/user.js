const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
  pseudo: String,
  email: String,
  description: String,
  password: String,
  status: String,
  country: String,
  firstname: String,
  surname: String,
  gender: String,
  age: Number,
  about: String,
  avatar: String,
  preferences: [String],
  friends: [],
  id_flag: Number,
  connected: Boolean,
  deleted: Boolean,
  access_token: String,
  refresh_token: String,
  access_token_validate_time: Date,
  date: { type: Date, default: Date.now },
})

module.exports = mongoose.model('user', userSchema, 'users')
