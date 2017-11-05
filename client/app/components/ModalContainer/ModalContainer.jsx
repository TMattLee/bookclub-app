import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import AddBookModal from './types/AddBookModal.jsx';
import OpenTradesModal from './types/OpenTradesModal.jsx';

import * as styles from './ModalContainer.css';

const ModalContainer = ( props ) => {

  return <div className={ styles.modalContainer } >
    <AddBookModal />
    <OpenTradesModal />
  </div>
}

const mapStateToProps = ( state ) => ({
  modalType:          state.currentState.modalType
});

export default connect( mapStateToProps )( ModalContainer );

