import React from 'react';
import { connect } from 'react-redux';
import * as styles from './WantsToTradeModal.css';

import Modal from 'react-modal';

const WantsToTradeModal = ( props ) => {
  const hideWantsToTradeModal = ( props) => {
    props.hideWantsToTradeModal();
  }
  return <Modal 
    isOpen={ props.showWantsToTradeModal } 
    contentLabel="Modal"
    onRequestClose={ hideWantsToTradeModal } 
    shouldCloseOnOverlayClick={ false } 
    className={{
      base: styles.modalClass,
      afterOpen: styles.modalClassAfterOpen,
      beforeClose: styles.modalClassBeforeClose
    }}
    overlayClassName={{
      base: styles.modalOverlayClass,
      afterOpen: styles.modalOverlayClassAfterOpen,
      beforeClose: styles.modalOverlayClassBeforeClose,
    }}>
    
    <div>
      
    </div>
  
  </Modal>
}

const mapStateToProps = ( state ) => ({
  isAuthorized:           state.currentState.isAuthorized,
  done:                   state.currentState.done,
  showWantsToTradeModal:  state.currentState.showWantsToTradeModal,
  bookList:               state.currentState.bookList,
});

export default connect( mapStateToProps )( WantsToTradeModal)