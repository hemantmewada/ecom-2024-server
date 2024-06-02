const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  title: { type: String, required: true },
  author_id: { type: Number, required: true, ref: "Author" },
  genre: { type: String, required: true },
});

const Book = mongoose.model("Book", BookSchema);

module.exports = Book;
