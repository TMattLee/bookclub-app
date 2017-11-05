'use strict';

require('dotenv').config()
const fs = require('fs');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const open = require('open');
const jwt = require('jsonwebtoken');
const passport = require("passport");
const passportJWT = require("passport-jwt");
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const dummyData = require('./dummyData.js');
const dummyUsers = require('./dummyUsers.js');

const app = express();


// -------------------- Database Schemas -----------------------------
mongoose.connect( process.env.MONGOLAB_URI );

const Books = require('./models/books.js');
const User = require('./models/user.js');
const OpenTrade = require('./models/openTrades');
const verifyUserHasBook = require('./lib/verifyUserHasBook.js');
const verifyUserDoesNotHaveBook = require('./lib/verifyUserDoesNotHaveBook.js');
const addBookToUser = require('./lib/addBookToUser.js');
const removeBookFromUser = require('./lib/removeBookFromUser.js');
const tradeBooks = require('./lib/tradeBooks.js');
const removeTrade = require('./lib/removeTrade.js');

Books.find({},
  (error, docs) => {
    if( error ) console.log( error );
    if( !docs || docs.length === 0 ){
      Books.findOneAndUpdate(
        {
          isbn10: dummyData.isbn10
        },
        {
          id:                 dummyData.isbn10,
          title:              dummyData.title,
          author:             dummyData.author,
          publisher:          dummyData.publisher,
          publishDate:        dummyData.publishDate,
          cover:              dummyData.cover,
          isbn10:             dummyData.isbn10,
          isbn13:             dummyData.isbn13,
          ownedBy:            dummyData.ownedBy,
        },
        {
          upsert: true,
        },
        ( error, docs ) =>{
          if( error ) console.log( error );
        }
      );
    }
    else {
    }
  }
);

User.find({},
  ( error, users ) => {
    if( error ) console.log( error );
    if( !users || users.length === 0 ){
      let newUser = new User();
      for ( let i = 0; i < 4; i++){
        User.findOneAndUpdate(
          {
            userId:             dummyUsers[i].isbn10
          },
          {
            userId:             dummyUsers[i].userId,
            bookList:           dummyUsers[i].bookList,
            isDummy:            dummyUsers[i].isDummy,
            fullName:           dummyUsers[i].fullName,
            city:               dummyUsers[i].city,
            state:              dummyUsers[i].state,
            requestsBySelf:     [],
            requestsFromOthers: []
          },
          {
            upsert: true,
          },
          ( error, docs ) =>{
            if( error ) console.log( error );
          }
        );
      }
    }
  }
);


// ------------------------ JWT Strategy -----------------------------
const sessionExtractor = ( req ) => {
  let token = null;
  if (req && req.session) {
    token = req.session[ 'jwt' ];
  }
  return token;
};

var jwtOptions = {};
jwtOptions.jwtFromRequest = sessionExtractor;
jwtOptions.secretOrKey = process.env.JWT_SECRET;
jwtOptions.jsonWebTokenOptions = {
  expiresIn: 20*60,
  httpOnly: true,
  secure: true
};

const strategy = new JwtStrategy( jwtOptions, ( jwt_payload, next ) => {
  next( null, { 
    userId:           jwt_payload.userId,
  });
});


//----------------------- Page Rendering ------------------------------
app.set( "view engine", "pug" );
app.set( "views", path.join( __dirname, "views" ) );
app.set( 'trust proxy', 1 )


//----------------------- Express Options ----------------------------
app.use( express.static( __dirname + '/../client' ) );
app.use( bodyParser.json() ); // support json encoded bodies
app.use( bodyParser.urlencoded( { extended: true } ) ); // support encoded bodies
app.use(
  session({ 
    jwt:null,
    secret: process.env.SESSION_SECRET,
    cookie: { 
      maxAge: 1000*60*5,
      httpOnly: true,
      secure: true,
      path: '/',
    },
    resave: true, 
    rolling: true,
  })
);

passport.use(strategy);

passport.serializeUser( ( user, done ) => {
  done( null, user );
});

passport.deserializeUser( ( user, done ) => {
  done( null, user );
});

app.use( passport.initialize() );
app.use( passport.session() );

//-------------------- Routes ----------------------------------

app.get( "/", ( req, res ) => {
  res.render( "homepage" );
});

app.get( "/login", ( req, res ) => {
  res.render( "homepage" );
});

app.get('/dashboard', passport.authenticate('jwt', { session: false, failureRedirect: '/bookclub-app/login' } ), ( req, res ) => {
  res.render( "homepage" );
});

app.get( "/opentrades", ( req, res ) => {
  res.render( "homepage" );
});

app.get( "/profile", ( req, res ) => {
  res.render( "homepage" );
});


/*app.get( '/logintest', ( req, res ) => {
  const payload = { id: 'newId' };
  const token = jwt.sign( payload, jwtOptions.secretOrKey );
  req.session['jwt']  = token;
  res.json( { message: "ok", token: token, sesh: req.session } );
});*/

app.get('/logout', ( req, res ) => {
  req.session.destroy();
  res.render( "homepage" );
})

app.get( '/auth', passport.authenticate( 'jwt', { session: false, failureRedirect: '/bookclub-app/login' } ), ( req, res ) => {
  res.send({
    message:        "VALIDATED",
    userId:         req.user.userId,
  });
});

app.get( '/getallbooks', ( req, res ) => {
  Books.find( {},
    ( error, docs ) =>{
      if( error ) console.log( error );
      if( docs && docs.length > 0 ){
        res.send( docs );
        return;
      }
    }
  );
});

app.get( '/getuserbooklist', passport.authenticate( 'jwt', { session: false, failureRedirect: '/bookclub-app/login' } ), ( req, res ) => {
  User.findOne( 
  {
    userId: req.user.userId
  },
    ( error, user ) => {
      if( error ) console.log( error );
      res.send({
        userBookList: user.bookList 
      });
      return;
      
    }
  );
});

app.post( '/addbook', passport.authenticate( 'jwt', { session: false, failureRedirect: '/bookclub-app/login' } ), ( req, res ) => {
  const { isbn10 } = req.body;
  const userId = req.user.userId;
  // First test if book is in the database
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
            if( error ) console.log( error );
            
            addBookToUser( userId, isbn10)
            .then( ( user ) => {
              Books.find( {},
                ( error, docs ) =>{
                  if( error ) console.log( error );
                  if( docs && docs.length > 0 ){
                    res.send( {
                      bookList:             docs,
                      message:              'ADDED', 
                      book:                 newBook, 
                      userBookList:         user.bookList,
                    } );
                    return;
                  }
                }
              );
            })
            .catch( error => console.log( error ) );
          })
        })
        .catch( error => {
          console.log( error );
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
                if( error ) console.log( error );
                if( docs && docs.length > 0 ){
                  res.send({
                    bookList:             docs,
                    message:              'ADDED', 
                    book:                 null, 
                    userBookList:         user.bookList
                  });
                  return;
                }
              }
            );
          })
          .catch( error => console.log( error ) );
        }
        else{
          res.send({
            message:  'ALREADY_OWNED'
          });
          return;
        }
      }
    }
  );
});

app.post( '/removebook', passport.authenticate( 'jwt', { session: false, failureRedirect: '/bookclub-app/login' } ), ( req, res ) => {
  const { isbn, userId } = req.body;
  
  // First test if book is in the database
  removeBookFromUser( userId, isbn )
  .then( ( user ) => {
      Books.find( {},
        ( error, docs ) =>{
          if( error ) console.log( error );
          if( docs && docs.length > 0 ){
            res.send({
              bookList:             docs,
              message:              'ADDED', 
              book:                 null, 
              userBookList:         user.bookList
            });
            return;
          }
        }
      );
    }
  )
  .catch( error => console.log( error ) );
  
});

app.post( '/tradebook', passport.authenticate( 'jwt', { session: false, failureRedirect: '/bookclub-app/login' } ), ( req, res ) => {
  const { isbn1, isbn2, userId1, userId2 } = req.body.tradeData;
  const tradeId = userId1 + isbn1 + userId2  + isbn2;  
  
  tradeBooks( userId1, userId2, isbn1, isbn2 )
  .then( ( message ) => {
    removeTrade( tradeId )
    .then( ({ openTrades, message}) =>{
      User.findOne( 
      {
        userId:   req.user.userId
      },
      ( error, user)=>{
        if ( error ) console.log( error );
        if( user ){
          Books.find( {},
            ( error, docs ) =>{
              if( error ) console.log( error );
              if( docs && docs.length > 0 ){
                res.send( {
                  bookList:             docs,
                  userBookList:         user.bookList,
                  userBookList: user.bookList,
                  message:      'TRADE_SUCCESSFUL'
                } );
                return;
              }
            }
          );
        }
        else {
          res.send({
            openTrades:   null,
            userBookList: null,
            message:      'THERE WAS AN ERROR'
          });
        }
      })
      
    })
    .catch( error => {
      console.log( error ); 
      res.send({
        message: 'ERROR_TRADING_BOOKS'
      });
      return;
    });
  })
  .catch ( error => {
    console.log( error );
    removeTrade( tradeId )
    .then( ({ openTrades, message}) =>{
      res.send({
        openTrades: openTrades,
        message:    'ERROR_TRADING_BOOKS'
      });
      return;
    })
    .catch( error => {
      console.log( error ); 
      res.send({
        message: 'ERROR_TRADING_BOOKS'
      });
      return;
    });
  });
});

app.post('/login', ( req, res ) => {
  const { userId, utoken } = req.body;
  User.findOne(
    {
      userId:   userId,
    },
    (error, user) => {
      if( error ) console.log( error );
      if( user && !user.isDummy ){
        res.send({
          message: 'Invalid username or password'
        });
        return;
      }
      else if ( user && user.isDummy ){
        if( utoken !== 'dummy' ){
          res.send({
            message: 'Invalid username or password'
          });
          return;
        }
        else{
          let payload = {
            userId: user.userId
          };
          let token = jwt.sign(payload, jwtOptions.secretOrKey, {
            expiresIn: 60*60*1 // seconds
          });
          req.session['jwt'] = token;
          res.send({ 
            message: 'VALIDATED',
            userId:  userId
          });
          return;
        }
      }
      else{
        res.send({
          message: 'Invalid username or password'
        });
        return;
      }
    });
});

app.get('/getprofile', passport.authenticate('jwt', { session: false, failureRedirect: '/bookclub-app/login' } ), ( req, res ) => {
  User.findOne(
    {
      userId:   req.user.userId
    },
     ( error, user ) => {
       if ( error ) console.log( error );
        const profile = {
          fullName:           user.fullName,
          city:               user.city,
          state:              user.state,
        }
        res.send( { profile } )
    });
});

app.post('/updateprofile', passport.authenticate('jwt', { session: false, failureRedirect: '/bookclub-app/login' } ), ( req, res ) => {
  User.findOneAndUpdate(
    {
      userId:   req.user.userId
    },
    {
      fullName:   req.body.fullName,
      city:       req.body.city,
      state:      req.body.state,
    },
    {
      new: true,
    },
    ( error, user ) => {
      if ( error ) console.log( error );
      const profile = {
        fullName:           user.fullName,
        city:               user.city,
        state:              user.state,
      }
      res.send( { profile } )
    });
});

app.get('/getallopentrades', passport.authenticate('jwt', { session: false, failureRedirect: '/bookclub-app/login' } ), ( req, res ) => {
  OpenTrade.find(
    {},
    (error, openTrades ) => {
      if( error ) console.log( error );
      res.send({
        openTrades: openTrades
      })
    });
});

app.post('/addopentrade', passport.authenticate('jwt', { session: false, failureRedirect: '/bookclub-app/login' } ), ( req, res ) => {
  const { userId1, userId2, isbn1, isbn2 } = req.body.tradeData;
  const tradeIdArr = [ userId1, isbn1, userId2, isbn2 ]   //string concatenation becomes trade ID.
  const tradeId = tradeIdArr.join('-');
  OpenTrade.findOne(
    {
      tradeId:  tradeId
    },
    ( error, openTrade ) => {
      if ( error ) console.log( error );
      if( openTrade !== null ){
        res.send({
          message: 'TRADE_ALREADY_EXISTS'
        });
        return;
      }
      const trade = new OpenTrade({
        tradeId:  tradeId,
        userId1:  userId1,
        userId2:  userId2, 
        isbn1:    isbn1,
        isbn2:    isbn2
      })
      
      trade.save( ( error, openTrade )=>{
        OpenTrade.find({},
        ( error, openTrades ) => {
          if ( error ) console.log( error );
          if( openTrades.length > 0 ){
            res.send({
              openTrades: openTrades
            });
            return;
          }
          else{
            res.send({
              message: 'ERROR'
            });
            return;
          }
          
        });
      });
    });
});

app.post('/removeopentrade', passport.authenticate('jwt', { session: false, failureRedirect: '/bookclub-app/login' } ), ( req, res ) => {
  const { tradeId } = req.body;
  removeTrade( tradeId )
  .then( ({ openTrades, message}) =>{
    res.send({
      openTrades: openTrades,
      message:    message
    });
    return;
  })
  .catch( error => {
    console.log( error ); 
    res.send({
      message: "there was an error"
    });
    return;
  });
});


const port = process.env.PORT;

const server = app.listen( port, (err) => {  
  if (err) {
    console.log(err);
  } else {
    open( `http://localhost:${port}` );
  }
});


/*------------------------------------------------------------------------------
---------------------------------- Socket.io------------------------------------
------------------------------------------------------------------------------*/

const io = require( 'socket.io' )( server, {
  path: '/socket.io'
});

io.on( 'connection', ( socket ) => {  
  //console.log('a user connected');

  socket.on( 'disconnect', () => {
    //console.log('user disconnected');
  });
  
  socket.on( 'GOT_NEW_DATA', ( payload ) => {
    if( payload && payload.data.length > 0 ){
      if( payload.data.length > 10 ) {  // Only ten open trade can exist at once
        payload.data.shift();
      }
      /*TickerList.findByIdAndUpdate(
        {
          _id: "5996582df36d28126e472aef"
        },
        {
          data: payload.data
        },
        {
          new: true,
          upsert: true
        },
        ( error, doc ) => {
          if ( error ) console.log( error );
          io.emit( 'RECEIVE_DATA', { data: doc.data } )
        }
      );*/
    }
  });
});
//------------------------------------------------------------------------------
module.exports = {
  express: express,
  app: app
}