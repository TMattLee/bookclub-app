'use strict';

const express = require('../server.js').express;
const app = require('../server.js').app;
const Books = require('../models/books.js');
const User = require('../models/user.js');

const addBookToUser = ( userId, isbn ) => {
  return new Promise( ( resolve, reject ) => {
    Books.findOneAndUpdate(
      {
        isbn10: isbn
      },
      {
        $push:{
          ownedBy: userId
        }
      },
      {
        upsert: true,
        new: true
      },
      ( error, book ) => {
        if( error ) reject( error );
        User.findOneAndUpdate(
          {
            userId:   userId
          },
          {
            $push:{
              bookList: {
                isbn:     book.id,
                title:    book.title || null,
                cover:    book.cover || null,
              }
            }
          },
          {
            upsert: true,
            new: true
          },
          ( error, user ) => {
            if( error ) reject( error );
            resolve( user );
          }
        );
      });
  });
}

module.exports = addBookToUser;