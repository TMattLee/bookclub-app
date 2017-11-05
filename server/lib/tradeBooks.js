'use strict';

const express = require('../server.js').express;
const app = require('../server.js').app;
const Books = require('../models/books.js');
const User = require('../models/user.js');
const verifyUserHasBook = require('./verifyUserHasBook.js');
const verifyUserDoesNotHaveBook = require('./verifyUserDoesNotHaveBook.js');
const addBookToUser = require('./addBookToUser.js');
const removeBookFromUser = require('./removeBookFromUser.js');

const tradeBooks = ( userId1, userId2, isbn1, isbn2 ) => {
  return new Promise( ( resolve, reject ) => {
    verifyUserHasBook( userId1, isbn1 )
      .then( () => {
        return verifyUserDoesNotHaveBook( userId1, isbn2 )
      })
      .then(  () => {
        return verifyUserHasBook( userId2, isbn2 )
      })
      .then(  () => {
        return verifyUserDoesNotHaveBook( userId2, isbn1 )
      })
      .then(  () => {
        return addBookToUser( userId1, isbn2 )
      })
      .then( () => {
        return removeBookFromUser( userId1, isbn1 )
      })
      .then( () => {
        return addBookToUser( userId2, isbn1 )
      })
      .then(() => {
        return removeBookFromUser( userId2, isbn2 )
      })
      .then( () => {
        return resolve( "TRADE_SUCCESSFUL")
      })
      .catch( error => reject( error ) )
  })               
}

module.exports = tradeBooks;