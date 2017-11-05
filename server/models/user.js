const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
  userId:             String,
  bookList:           [],
  isDummy:            Boolean,
  isTwitterVerified:  Boolean,
  twitterToken:       String,
  twitterHandle:      String,
  fullName:           String,
  city:               String,
  state:              String,
  requestsBySelf:     [],
  requestsFromOthers: [],
});

var User = mongoose.model( 'bookclubappusers', user );

module.exports = User;