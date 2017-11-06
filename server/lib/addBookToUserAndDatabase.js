'use strict';

const express = require('../server.js').express;
const app = require('../server.js').app;
const Books = require('../models/books.js');
const User = require('../models/user.js');
const axios = require('axios');
const addBookToUser = require('./addBookToUser.js');
const addBookToUserAndDatabase = ( userId, isbn10 ) => {
  return new Promise( ( resolve, reject )  => {
    Books.findOne(
      {
        isbn10: isbn10
      },
      ( error, book ) =>{
        if( error ) console.log( error );
        
        // If book is not in database then add it to user's booklist
        if( !book || book.length <= 0 ){
          axios({
            method: 'GET',
            url: `http://openlibrary.org/api/books?format=json&jscmd=data&bibkeys=ISBN:${ isbn10 }`
          })
          .then( response => {
            
            let data = response.data[ `ISBN:${ isbn10 }`]
            if( !data ){
              console.log( 'data is ', data )
            }
            
            Books.create({
              id:                 isbn10,
              title:              ( data.title + ( data.subtitle ? ": " + data.subtitle : '' ) ) || null ,
              author:             data.authors ? data.authors[0].name || null : null,
              publisher:          data.publishers ? data.publishers[0].name || null  : null,
              publishDate:        data.publish_date || null,
              cover:              data.cover ? data.cover.medium || null : null,
              isbn10:             data.identifiers.isbn_10[0] || null,
              ownedBy:            ['ADMIN']
            },
            ( error, newBook ) => {
              if( error ) {
                console.log( error );
                reject( error );
              }
              
              addBookToUser( userId, isbn10)
              .then( ( user ) => {
                Books.find( {},
                  ( error, docs ) =>{
                    if( error ) {
                      console.log( error );
                      reject( error );
                    }
                    if( docs && docs.length > 0 ){
                      resolve( {
                        bookList:             docs,
                        message:              'ADDED', 
                        book:                 newBook, 
                        userBookList:         user.bookList,
                      } );
                      return;
                    }
                    else{
                      reject('error adding book');
                    }
                  }
                );
              })
              .catch( error => {
                console.log( error );
                reject( error );
              });
            })
          })
          .catch( error => {
            console.log( error );
            reject( error );
          });
        }
        else{
          
          // if book is in database then check if user owns it or not.
          let notOwnedByUser = true;
          for( let i = 0; i < book.ownedBy.length; i++){
            if( book.ownedBy[i] === userId ) notOwnedByUser = false;
          }
          if( notOwnedByUser ){
            addBookToUser( userId, isbn10)
            .then( ( user ) => {
              Books.find( {},
                ( error, docs ) =>{
                  if( error ) {
                    console.log( error );
                    reject( error );
                  }
                  if( docs && docs.length > 0 ){
                    resolve({
                      bookList:             docs,
                      message:              'ADDED', 
                      book:                 null, 
                      userBookList:         user.bookList
                    });
                    return;
                  }
                  else{
                    reject('error adding book');
                  }
                }
              );
            })
            .catch( error => {
              console.log( error );
              reject( error ); 
            });
          }
          else{
            resolve({
              message:  'ALREADY_OWNED'
            });
            return;
          }
        }
      }
    );
  });
}

module.exports = addBookToUserAndDatabase;