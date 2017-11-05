import React, { Component } from 'react';
import { connect } from 'react-redux';
import { showTradeModal } from '../../actions/index.js';
import { bindActionCreators } from 'redux';
import Modal from 'react-modal';
import * as styles from './UserBooksModal.css';
import * as actions from '../../actions/index.js';

import BookTradeConfirmationDialog from '../BookTradeConfirmationDialog/BookTradeConfirmationDialog.jsx';

class UserBooksModal extends Component {
  constructor(){
    super();
    this.hideUserBooksModal = this.hideUserBooksModal.bind( this );
  }
  
  componentDidMount(){
    this.props.actions.getUserBookList();
  }
  
  handleClick( event, book ){
    event.preventDefault();
    this.props.actions.setYourBook( book );
    this.props.actions.showConfirmationDialog( true );
  }
  
  hideUserBooksModal( event ){
    if ( event ) event.preventDefault();
    this.props.actions.hideAllModals();
  }

  render(){
    const { state, props } = this;
    console.log( 'letere', props)
    if ( !( props.userBookList && props.userToTradeWith ) ) return <div></div>;
    
    const userBooks = props.userBookList.map( ( book, key ) => {
      return <div 
        onClick={ ( event ) => this.handleClick( event, book ) }
        className={ styles.book } >
        { book.title }
      </div>
    });
    
    return <Modal
      isOpen={ props.showUserBooksModal } 
      contentLabel="User Book Modal"
      onRequestClose={ this.hideUserBooksModal } 
      shouldCloseOnOverlayClick={ true } 
      className={{
        base: styles.modalClass,
        afterOpen: styles.modalClassAfterOpen,
        beforeClose: styles.modalClassBeforeClose
      }}
      overlayClassName={{
        base: styles.modalOverlayClass,
        afterOpen: styles.modalOverlayClassAfterOpen,
        beforeClose: styles.modalOverlayClassBeforeClose,
      }}
    > 
      <div className={ styles.userBooksDisplayContainer } >
        <div className={ styles.closeButton } onClick={ event => this.hideUserBooksModal( event ) }>[x]</div>
        <div> Which Book Will You Offer? </div>
        <div>
          <div>{ userBooks }</div>
        </div>
      </div>
      { 
        props.yourBook ? 
          <BookTradeConfirmationDialog 
            bookData={ props.bookData }
          />
          :
          <div></div>
      }
    </Modal>
  }
};

const mapStateToProps = ( state ) => ({
  isAuthorized:       state.currentState.isAuthorized,
  done:               state.currentState.done,
  message:            state.currentState.message,
  showLoadingModal:   state.currentState.showLoadingModal,
  bookList:           state.currentState.bookList,
  showDisplayModal:   state.currentState.showDisplayModal,
  openTrades:         state.currentState.openTrades,
  userId:             state.currentState.userId,
  userBookList:       state.currentState.userBookList,
  showUserBooksModal: state.currentState.showUserBooksModal,
  userToTradeWith:    state.currentState.userToTradeWith,
  yourBook:           state.currentState.yourBook,
});

const mapDispatchToProps = ( dispatch ) => ({
  actions: bindActionCreators( actions, dispatch )
})

export default connect( mapStateToProps, mapDispatchToProps )( UserBooksModal );