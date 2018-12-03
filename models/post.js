const mongoose = require('mongoose')

const Schema = mongoose.Schema

const postSchema = new Schema({
  creatorId: String,
  post: String,
  comments: [],
  date: {type: Date, default: Date.now}
})

module.exports = mongoose.model('post', postSchema, 'posts')
