import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Modal from 'react-modal';

import * as styles from '../ModalContainer.css';
import * as actions from '../../../actions/index.js';

class BookInfoModal extends Component {
  constructor(){
    super();
    this.hideAddBookModal = this.hideAddBookModal.bind( this );
    this.handleSubmit = this.handleSubmit.bind( this );
    this.state = {
      message:  '',
    }
    this.exp = /^[0-9]{10}$/;

  }
  
  hideAddBookModal(){
    this.props.actions.hideAllModals();
  }
  
  handleSubmit( event ){
    event.preventDefault()
    let isbn10 = event.target[ 0 ].value;
    if( this.exp.test( isbn10 ) ){
      this.props.actions.addBookToDatabase( isbn10 );
    }
    else{
      this.setState({
        message: 'Please Enter a 10 digit number'
      })
    }
  }
  
  render(){
    const { props } = this;
    return <Modal
      isOpen={ props.showAddBookModal } 
      contentLabel="Book Info Modal"
      onRequestClose={ this.hideAddBookModal } 
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
      <form onSubmit={ this.handleSubmit } encType="x-www-urlencode">
        <div>
          Enter ISBN10 { ':  ' }
          <input name="isnb10" maxLength="10" />
          <button type="submit"> Submit </button>
        </div>
        <div style={{ color: 'red', height: '10px', marginTop: '5px'}}> { this.state.message } </div>
      </form>
    </Modal>
  }
};

const mapStateToProps = ( state ) => ({
  isAuthorized:       state.currentState.isAuthorized,
  done:               state.currentState.done,
  message:            state.currentState.message,
  showLoadingModal:   state.currentState.showLoadingModal,
  bookList:           state.currentState.bookList,
  userId:             state.currentState.userId,
  book:               state.currentState.book,
  userBookList:       state.currentState.userBookList,
  showAddBookModal:   state.currentState.showAddBookModal,
});

const mapDispatchToProps = ( dispatch ) => ({
  actions: bindActionCreators( actions, dispatch )
})

export default connect( mapStateToProps, mapDispatchToProps )( BookInfoModal );