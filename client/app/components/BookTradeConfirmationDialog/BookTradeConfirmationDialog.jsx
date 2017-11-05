import React, { Component } from 'react';
import { connect } from 'react-redux';
import { showTradeModal } from '../../actions/index.js';
import { bindActionCreators } from 'redux';
import Modal from 'react-modal';

import * as styles from './BookTradeConfirmationDialog.css';
import * as actions from '../../actions/index.js';


class BookTradeConfirmationDialog extends Component {
  constructor( props ){
    super( props );
    this.hideConfirmationDialog = this.hideConfirmationDialog.bind( this );
    this.addOpenTrade = this.addOpenTrade.bind( this );
  }

  handleClick( event, userId ){
    event.preventDefault();
    console.log('clicked, user1', userId)
  }
  
  addOpenTrade( event ){
    if( event ) event.preventDefault();
    const { props } = this;
    const tradeData = {
      userId1:    props.userId,
      isbn1:      props.yourBook.isbn,
      userId2:    props.userToTradeWith,
      isbn2:      props.bookData.isbn10,
    }
    props.actions.addOpenTrade( tradeData );
    props.actions.hideAllModals();
  }
  
  hideConfirmationDialog( event ){
    if( event ) event.preventDefault();
    this.props.actions.hideAllModals();
  }

  render(){
    const { state, props } = this;
    if( props.userToTradeWith ){
      return <Modal
        isOpen={ props.showConfirmationDialog } 
        contentLabel="Trade Modal"
        onRequestClose={ this.hideConfirmationDialog } 
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
        <div className={ styles.tradeContainer } >
          <div className={ styles.closeButton } onClick={ event => this.hideConfirmationDialog( event) }>[x]</div>
          <div className={ styles.tradeTitle } > Trade with { props.userToTradeWith }</div> 
          <div> Your copy of: </div>
          <div className={ styles.bookTitle } > { props.yourBook.title } </div>
          <div>   For their copy of: </div>
          <div className={ styles.bookTitle } > { props.bookData.title } </div>
          <div className={ styles.buttonContainer } >
            <div className={ styles.confirmButton } 
              onClick={ event => this.addOpenTrade( event ) }
            > Confirm </div>
            <div> </div>
            <div className={ styles.cancelButton } onClick={ event => { this.hideConfirmationDialog( event ) } } > Cancel </div>
          </div>
        </div>
      </Modal>
    }
    else{
      <span></span>
    }
  }
};

const mapStateToProps = ( state ) => ({
  isAuthorized:           state.currentState.isAuthorized,
  done:                   state.currentState.done,
  message:                state.currentState.message,
  showLoadingModal:       state.currentState.showLoadingModal,
  bookList:               state.currentState.bookList,
  showDisplayModal:       state.currentState.showDisplayModal,
  openTrades:             state.currentState.openTrades,
  userId:                 state.currentState.userId,
  userBookList:           state.currentState.userBookList,
  showConfirmationDialog: state.currentState.showConfirmationDialog,
  userToTradeWith:        state.currentState.userToTradeWith,
  yourBook:               state.currentState.yourBook,
});

const mapDispatchToProps = ( dispatch ) => ({
  actions: bindActionCreators( actions, dispatch )
})

export default connect( mapStateToProps, mapDispatchToProps )( BookTradeConfirmationDialog );