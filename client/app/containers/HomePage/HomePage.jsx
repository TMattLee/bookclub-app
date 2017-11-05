import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import ReactLoading from 'react-loading';

import styles from './HomePage.css';

import BookDisplayContainer from '../../components/BookDisplayContainer/BookDisplayContainer.jsx';

import * as actions from '../../actions/index.js';

class HomePage extends Component {

  componentDidMount(){
    this.props.actions.setNotDone();
    this.props.actions.checkAuth();
    this.props.actions.getBookList();
    this.props.actions.getUserBookList();
  }

  render(){
    const { props } = this;
    return ( <div className={ styles.pageContainer } >
      <div className={ styles.itemContainer } >
        <div className={ styles.itemTitle } >
          <div className={ styles.containerHeader }  >
            Book List
          </div>
        </div>
        <div>
          <BookDisplayContainer isHomePage = { true } />
        </div>
      </div>
    </div>
    );
  }
}

const mapStateToProps = ( state ) => ({
  isAuthorized:       state.currentState.isAuthorized,
  done:               state.currentState.done,
  message:            state.currentState.message,
  showLoadingModal:   state.currentState.showLoadingModal,
  bookList:           state.currentState.bookList,
});

const mapDispatchToProps = ( dispatch ) => ({
  actions: bindActionCreators( actions, dispatch ),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )( HomePage )
);