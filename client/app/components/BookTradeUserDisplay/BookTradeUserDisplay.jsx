import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Modal from 'react-modal';

import * as styles from './BookTradeUserDisplay.css';
import * as actions from '../../actions/index.js';

import UserBooksModal from '../UserBooksModal/UserBooksModal.jsx';

class BookTradeUserDisplay extends Component {
  constructor( props){
    super( props );
    this.handleClick = this.handleClick.bind( this );
    this.hideBookTradeUserModal = this.hideBookTradeUserModal.bind( this );
  }

  handleClick( event, userId ){
    event.preventDefault();
    this.props.actions.setUserToTradeWith( userId );
    this.props.actions.showUserBooksModal( true );
  }
  
  hideBookTradeUserModal(){
    if ( event ) event.preventDefault();
    this.props.actions.hideAllModals();
  }
  
  render(){
    const { state, props } = this;
    const { key, bookData } = props;
    const userList = bookData.ownedBy.map( ( userId, key ) => {
      if( userId !== "ADMIN"){
        return <div key={ key } 
          onClick={ event => this.handleClick( event, userId ) }
          className={ styles.user }>
          { userId }
        </div>
      }
    });
    if( props.bookDisplayElement ===  props.bookInfoModalKey){
      return <Modal
        isOpen={ props.showBookTradeUserModal } 
        contentLabel="Users Modal"
        onRequestClose={ this.hideBookTradeUserModal } 
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
        <UserBooksModal
          bookData={ bookData }
        />
        <div className={ styles.bookTradeUsersContainer } >

          <div className={ styles.closeButton } onClick={ event => this.hideBookTradeUserModal( event ) }>[x]</div>
          <div className={ styles.userList } >
            <div> Select a user </div>
            <div> { userList } </div>
          </div>
        </div>
        
      </Modal>
    }
    else {
      return <span></span>
    }
  }
};

const mapStateToProps = ( state ) => ({
  isAuthorized:           state.currentState.isAuthorized,
  done:                   state.currentState.done,
  message:                state.currentState.message,
  userBookList:           state.currentState.userBookList,
  userId:                 state.currentState.userId,
  showBookTradeUserModal: state.currentState.showBookTradeUserModal,
  bookInfoModalKey:       state.currentState.bookInfoModalKey,
  userToTradeWith:        state.currentState.userToTradeWith
});

const mapDispatchToProps = ( dispatch ) => ({
  actions: bindActionCreators( actions, dispatch )
})

export default connect( mapStateToProps, mapDispatchToProps )( BookTradeUserDisplay );