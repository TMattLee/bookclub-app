import React from 'react';
import { connect } from 'react-redux';
import { showTradeModal } from '../../actions/index.js';
import { bindActionCreators } from 'redux';

import * as styles from './BookDisplayContainer.css';
import * as actions from '../../actions/index.js';

import BookDisplay from '../BookDisplay/BookDisplay.jsx';

const BookDisplayContainer = ( props ) => {
  
  let books = null;
  
  const { bookList } = props;
  
  if( bookList && bookList.length > 0 ){
    books = props.bookList.map( ( book, key ) => {
      return <BookDisplay bookToDisplay={ book } key={ key } bookDisplayElement={ key } />
    });
  }
  
  if( !props.isHomePage && props.isAuthorized){
    let userBooks = null;
    
    if( props.userBookList ){
      userBooks = props.userBookList.map( ( userBook, key ) => {
        return <BookDisplay bookToDisplay={ userBook } key={ key } isOwnedByUser={ true } bookDisplayElement={ key }/>
      });
    }
    
    return <div className={ styles.books }>
      { userBooks }
    </div>
  }
  
  return <div className={ styles.books }>
    { books }
  </div>
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
  book:               state.currentState.book,
});

const mapDispatchToProps = ( dispatch ) => ({
  actions: bindActionCreators( actions, dispatch )
})

export default connect( mapStateToProps, mapDispatchToProps )( BookDisplayContainer );