import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Modal from 'react-modal';

import * as styles from '../ModalContainer.css';
import * as actions from '../../../actions/index.js';

const OpenTradeModal = ( props ) => {
  
  const hideOpenTradesModal = () => {
    props.actions.hideAllModals();
  }
  
  const confirmTrade = ( event, tradeData )  => {
    event.preventDefault();
    props.actions.tradeBook( tradeData );
    props.actions.removeOpenTrade( tradeData.tradeId );
    hideOpenTradesModal();
  }
  
  const cancelTrade = ( event, tradeId ) => {
    event.preventDefault();
    props.actions.removeOpenTrade( tradeId );
  }
  
  let tradesToConfirm = null;
  let tradesToCancel = null;
  if( !props.openTrades ){
    return <div className={ styles.emtpy } >
    </div>;
  }
    
  tradesToConfirm = props.openTrades.map( ( trade, key ) => {
    if( trade.userId2 === props.userId ){
      return <div key={ key } className={ styles.trades } >
        <div onClick={ event => confirmTrade( event, trade ) } >Confirm Trade with { trade.userId1 } </div>
      </div>
    }
  });
  
  tradesToCancel = props.openTrades.map( ( trade, key ) => {
    if( trade.userId1 === props.userId ){
      return <div key={ key } className={ styles.trades } >
        <div onClick={ event => cancelTrade( event, trade.tradeId ) } >Cancel Trade with { trade.userId2 } </div>
      </div>
    }
  });

  return <Modal
    isOpen={ props.showOpenTradesModal } 
    contentLabel="Open Trades Modal"
    onRequestClose={ () => hideOpenTradesModal() } 
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
    <div className={ styles.openTradeModalContainer } >
      <div> Trades </div>
      <div className={ styles.tradeWindow } >
       
        {
          tradesToConfirm ?
            <div className={ styles.column } > { tradesToConfirm }  </div>
          :
            <div></div>
        }
        
        {
          tradesToCancel ?
            <div className={ styles.column } > { tradesToCancel } </div>
          :
            <div></div>
        }
      </div>
    </div>
  </Modal>
  
}

const mapStateToProps = ( state ) => ({
  isAuthorized:         state.currentState.isAuthorized,
  done:                 state.currentState.done,
  message:              state.currentState.message,
  showLoadingModal:     state.currentState.showLoadingModal,
  bookList:             state.currentState.bookList,
  openTrades:           state.currentState.openTrades,
  showOpenTradesModal:  state.currentState.showOpenTradesModal,
  userId:               state.currentState.userId
});

const mapDispatchToProps = ( dispatch ) => ({
  actions: bindActionCreators( actions, dispatch ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( OpenTradeModal );