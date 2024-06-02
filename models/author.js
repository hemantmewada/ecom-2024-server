const mongoose = require("mongoose");

const AuthorSchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  name: { type: String, required: true },
  birth_year: { type: Number, required: true },
});

const Author = mongoose.model("Author", AuthorSchema);

module.exports = Author;
