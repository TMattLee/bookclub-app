import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Modal from 'react-modal';

import * as styles from './BookInfoModal.css';
import * as actions from '../../actions/index.js';

import BookTradeUserDisplay from '../BookTradeUserDisplay/BookTradeUserDisplay.jsx';

class BookInfoModal extends Component {
  constructor(){
    super();
    this.hideBookInfoModal = this.hideBookInfoModal.bind( this );
  }
  
  handleClick( event ){
    event.preventDefault();
    this.props.actions.showBookTradeUserModal( true );
  }
  
  hideBookInfoModal( event ){
    if ( event ) event.preventDefault();
    this.props.actions.hideAllModals();
  }
  
  render(){
    const { props } = this;
    const { 
      key, 
      bookData, 
      showBookInfo, 
      userBookList, 
      isAuthorized,
      closeInfoOverlay,
    } = props;
    
    let isOwned = false;
    
    if( userBookList ){
      for( let ai = 0; ai < userBookList.length; ai++ ){
        if( bookData.id === userBookList[ ai ].isbn ){
          isOwned = true;
          break;
        }
      }
    }
    
    if( bookData ){
      
      if( props.bookDisplayElement ===  props.bookInfoModalKey){
        
        return <Modal
          isOpen={ props.showBookInfoModal } 
          contentLabel="Book Info Modal"
          onRequestClose={ this.hideBookInfoModal } 
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
          <div className={ styles.bookInfoContainer } >
            
            <div>
              { props.bookData.title }
            </div>
            <div className={ styles.underline }> </div>
            <div className={ styles.closeButton } onClick={ event => this.hideBookInfoModal( event) }>[x]</div>
            <div>
              { props.bookData.publishDate }, { props.bookData.publisher }
            </div>
            { 
              isAuthorized ?
                isOwned ?
                  <div>ALREADY OWNED BY YOU </div>
                :
                  <div>
                    <div className={ styles.tradeButton } onClick={ event =>  this.handleClick( event ) }> Request Trade </div>
                    <BookTradeUserDisplay 
                      bookDisplayElement={ props.bookDisplayElement }
                      bookData={ bookData } 
                    />
                  </div>
              :
                <span></span>
            }
          </div>
         </Modal>
      }
      else{
        return <span></span>
      }
    }
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
  showBookInfoModal:  state.currentState.showBookInfoModal,
  bookInfoModalKey:   state.currentState.bookInfoModalKey,
});

const mapDispatchToProps = ( dispatch ) => ({
  actions: bindActionCreators( actions, dispatch )
})

export default connect( mapStateToProps, mapDispatchToProps )( BookInfoModal );