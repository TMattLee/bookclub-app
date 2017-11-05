const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const openTrade = new Schema({
  tradeId:  String,
  userId1:  String,
  userId2:  String,
  isbn1:    String,
  isbn2:    String,
});

var OpenTrade = mongoose.model( 'bookclubapptrades', openTrade );

module.exports = OpenTrade;