'use strict';

const express = require('../server.js').express;
const app = require('../server.js').app;
const Books = require('../models/books.js');
const User = require('../models/user.js');

const verifyUserDoesNotHaveBook = ( userId, isbn ) => {
  return new Promise( ( resolve, reject ) => {
    Books.findOne(
      {
        isbn10:   isbn,
        ownedBy:  userId
      },
      ( error, book ) => {
        if( error ) reject( error );
        if( book ) reject( `BOOK_IS_ALREADY_OWNED_BY_USER: ${ userId }`);
        resolve( "OK" );
      });
  });
}

module.exports = verifyUserDoesNotHaveBook;