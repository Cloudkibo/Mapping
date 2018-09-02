let mongoose = require('mongoose')
let Schema = mongoose.Schema

let mediaSchema = new Schema({
  mediaId: String,
  mediaType: String,
  url: String
})

module.exports = mongoose.model('media', mediaSchema)
