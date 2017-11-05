const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const books = new Schema({
  id:                 String,
  title:              String,
  author:             String,
  publisher:          String,
  publishDate:        String,
  cover:              String,
  isbn10:             String,
  ownedBy:            [],
});

var Books = mongoose.model( 'bookclubappbooks', books );

module.exports = Books;