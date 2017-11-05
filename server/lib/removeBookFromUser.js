'use strict';

const express = require('../server.js').express;
const app = require('../server.js').app;
const Books = require('../models/books.js');
const User = require('../models/user.js');

const removeBookFromUser = ( userId, isbn ) => {
  return new Promise( ( resolve, reject ) => {
    Books.findOne(
      {
        isbn10: isbn
      },
      ( error, book ) => {
        if ( error ) reject( error );
        
        // If book is not in database then add it to user's booklist
        if ( !book || book.length <= 0 ){
          reject( `BOOK_DOES_NOT_EXIST: ${ userId }` );
        }
        else{
          
          // if book is in database then check if user owns it or not.
          let ownedByUser = false;
          for ( let i = 0; i < book.ownedBy.length; i++){
            if( book.ownedBy[i] === userId ) {
              ownedByUser = true;
              break;
            }
          }
          if ( ownedByUser ){
            Books.findOneAndUpdate(
              {
                isbn10: isbn
              },
              {
                $pull:{
                  ownedBy: userId
                }
              },
              {
                new: true
              },
              ( error, book ) => {
                  if( error ) reject( error );
                  User.findOneAndUpdate(
                    {
                      userId:   userId
                    },
                    {
                      $pull:{
                        bookList: {
                          isbn:     isbn,
                          title:    book.title,
                          cover:    book.cover
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
               }
            );
          }
          else{
            reject( `BOOK_NOT_OWNED_BY_USER: ${ userId }` );
          }
        }
      });
  });
}

module.exports = removeBookFromUser;