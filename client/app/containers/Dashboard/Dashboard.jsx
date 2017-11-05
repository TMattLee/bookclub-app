import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Modal from 'react-modal';

import BookDisplayContainer from '../../components/BookDisplayContainer/BookDisplayContainer.jsx';
import * as actions from '../../actions/index.js';
import * as styles from './Dashboard.css';

class DashBoard extends Component {
  constructor( props ){
    super();
    this.showModal = this.showModal.bind( this );
    this.hideModal = this.hideModal.bind( this );
    this.handleClick = this.handleClick.bind( this );
    this.handleSubmit = this.handleSubmit.bind( this );
    this.showOpenTradesModal = this.showOpenTradesModal.bind( this );
  }
  
  componentDidMount(){
    this.props.actions.checkAuth();
    this.props.actions.getBookList();
    this.props.actions.getUserBookList();
    this.props.actions.getAllOpenTrades();
  }
  
  handleClick( event ){
    event.preventDefault();
    this.props.actions.showAddBookModal( true );
  }
  
  handleSubmit( event ){
    event.preventDefault();
    let isbn10 = event.target.isbn10.value;
    this.props.actions.addBookToDatabase( isbn10, this.props.userId );
  }
  
  showModal( modalType ){
    this.props.actions.showModal( true, modalType );
    this.props.actions.setNotDone();
    this.props.actions.getBookList();
  }
  
  hideModal(){
    this.props.actions.hideAllModals();
    this.props.actions.getBookList();
  }
  
  showOpenTradesModal( event ){
    this.props.actions.showOpenTradesModal( true );
    this.props.actions.getAllOpenTrades();
  }
  
  render(){
    const { props } = this;
    const { isAuthorized, bookList, userId } = props
    
    if( ! ( isAuthorized && bookList && bookList.length > 0 )  ){
      return <div> Checking... </div>
    }
    
    const booksYouOwn = bookList.filter( ( value ) => {
      let owned = value.ownedBy.indexOf( userId );
      return owned !== -1;
    });
    
    return <div className={ styles.pageContainer } >
      <div className={ styles.itemContainer } >
        <div className={ styles.buttonContainer } >
          <div className={ styles.addABookButton } onClick = { this.handleClick } >
            Add a Book
          </div>
          <div className={ styles.openTradesButton } onClick = { this.showOpenTradesModal } >
            Show Open Trades
          </div>
        </div>
        <div>
          <BookDisplayContainer userBookList={ booksYouOwn } />
        </div>
      </div>
    </div>
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

export default withRouter( 
  connect(
    mapStateToProps,
    mapDispatchToProps
  )( DashBoard )
);