const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
  pseudo: String,
  email: String,
  password: String,
  status: String,
  firstname: String,
  surname: String,
  gender: String,
  age: Number,
  about: String,
  avatar: Object,
  preferences: [String],
  friends: [],
  id_flag: Number,
  connected: Boolean,
  deleted: Boolean,
  date: { type: Date, default: Date.now },
})

module.exports = mongoose.model('user', userSchema, 'users')
