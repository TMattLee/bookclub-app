'use strict';

const express = require('../server.js').express;
const app = require('../server.js').app;
const OpenTrade = require('../models/openTrades.js');


const removeTrade = ( tradeId ) => {
  return new Promise( ( resolve, reject ) => {
     OpenTrade.remove(
      {
        tradeId:  tradeId
      },
      ( error, removed ) => {
        if ( error ) console.log( error );
        let message = 'OK';
        if( removed.result.n <= 0) message ="ERROR_TRADE_DOES_NOT_EXIST";
        OpenTrade.find(
          {},
          ( error, openTrades ) => {
            if ( error ) {
              console.log( error );
              reject( error );
            };
            resolve({
              openTrades: openTrades,
              message:    message
            });
            return;
          }
        );
      });
  });
}

module.exports = removeTrade;