import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom'; 
import { renderRoutes } from 'react-router-config';

import thunkMiddleware from 'redux-thunk';
import {createLogger} from 'redux-logger';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux'; 
import reducers from './reducers/index';

import routes from './routes.js';

const io = require('socket.io-client');

export const socket = io( '/',{
  path: '/bookclub-app/socket.io'
});

const loggerMiddleware = createLogger();

const store = createStore(
  reducers,
  applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware // neat middleware that logs actions
));


export default class TestApp extends React.Component{
  render(){
    return(
      <Provider store = { store } >
        <Router>
          {renderRoutes(routes)}
        </Router>
      </Provider>
    );
  }
}

const styles = {
  appContainer:{
    display:          'flex',
    flexDirection:    'column',
    alignItems:       'center',
    backgroundColor:  'white',
    margin:           '0px',
  }
}

render(<TestApp />, document.getElementById('app'));