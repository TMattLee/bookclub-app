import React, { Component } from 'react';
import { renderRoutes } from 'react-router-config';
import { Link } from 'react-router-dom';
import Header from '../Header/Header.jsx';
import Footer from '../Footer/Footer.jsx';
import { connect } from 'react-redux';

import ModalContainer from '../ModalContainer/ModalContainer.jsx';

import { bindActionCreators } from 'redux';
import * as actions from '../../actions/index.js';

import styles from './Base.css'

class Base extends Component {
  
  render(){
    const { props } = this;
    return(
      <div className={ styles.pageContainer } >
        <ModalContainer />
        <Header location={ props.history.location } />
              { renderRoutes( props.route.routes ) }
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = ( state ) => ({
  isAuthorized:       state.currentState.isAuthorized,
  done:               state.currentState.done,
  message:            state.currentState.message,
  showModal:          state.currentState.showModal,
  bookList:           state.currentState.bookList,
  userId:             state.currentState.userId,
  modalType:          state.currentState.modalType,
  showTradeModal:     state.currentState.showTradeModal,
  book:               state.currentState.book,
});

const mapDispatchToProps = ( dispatch ) => ({
  actions: bindActionCreators( actions, dispatch ),
});

export default connect(
  mapStateToProps, mapDispatchToProps
)( Base );