//Snippet.js

const mongoose = require('mongoose')
const Schema = mongoose.Schema


const SnippetSchema = new Schema({
  id: { type: Number },
  name: { type: String, require: true },
  language: { type: String, require: true },
  body: { type: String, require: true },
  notes: { type: String },
  tags: { type: String }
})

SnippetSchema.statics.findByTitle = function (name, cb) {
    return this.find({ name: name })
  }

const Snippet = mongoose.model('Snippet', SnippetSchema)

module.exports = Snippet
