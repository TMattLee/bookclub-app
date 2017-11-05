import React, { Component } from 'react';
import { connect } from 'react-redux';
import { showTradeModal } from '../../actions/index.js';
import { bindActionCreators } from 'redux';

import * as styles from './BookDisplay.css';
import * as actions from '../../actions/index.js';

import BookInfoModal from '../BookInfoModal/BookInfoModal.jsx';

class BookDisplay extends Component {

  handleClick( event, key ){
    event.preventDefault();
    this.props.actions.resetTradeProcess();
    this.props.actions.showBookInfoModal( true, key );
  }
  
  render(){
    const { props } = this;
    const { key, bookToDisplay } = props;
    return <span  className={ styles.bookContainer } ><img 
        className={ styles.bookCover } 
        src={ bookToDisplay ? bookToDisplay.cover : null } 
        key={ key } 
        alt={ bookToDisplay ? bookToDisplay.title : null }
        onClick = { event => this.handleClick( event, props.bookDisplayElement ) }
      />
      <BookInfoModal bookDisplayElement={ props.bookDisplayElement } bookData={ bookToDisplay || null }  />
    </span>
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
});

const mapDispatchToProps = ( dispatch ) => ({
  actions: bindActionCreators( actions, dispatch )
})

export default connect( mapStateToProps, mapDispatchToProps )( BookDisplay );