import { combineReducers } from 'redux';
import * as actions from '../actions/index.js';

var cloneDeep = require('clone-deep');

const initialState ={
  isAuthorized:             false,
  done:                     false,
  redirect:                 false,
  message:                  "",
  confirm:                  "",
  userDisplayName:          null,
  userId:                   null,  
  showLoadingModal:         false,
  bookList:                 [],
  dataLength:               0,
  showAddBookModal:         false,
  showTradeModal:           false,
  showDisplayModal:         false,
  showFinalizedTradeModal:  false,
  showConfirmationDialog:   false,
  showUserBooksModal:       false,
  showBookTradeUserModal:   false,
  showBookInfoModal:        false,
  bookInfoModalKey:         null,
  userToTradeWith:          null,
  chosenBook:               null,
  yourBook:                 null,
  
  profile:                  null,
  showModal:                false,
  bookAdded:                false,
  userBookList:             null,
  userBookListLength:       null,
  modalType:                null,
  book:                     null,
  otherUserBookList:        null,
  openTrades:               null,
  
};

function currentState( state = initialState, actions ){
  let newData = [];
  switch( actions.type ){
    
    case 'INITIALIZE_STATE':
      return Object.assign( {}, state, initialState);
    
    case 'GET_BOOK_LIST':                                   // Gets a list of all books in database
      return Object.assign( [], state, {
        bookList:           actions.bookList,
        done:               actions.done,
      });
      
    case 'GET_USER_BOOK_LIST':                              //Gets list of book owned by current in user
      return Object.assign( [], state, {
        userBookList:       actions.userBookList,
        done:               actions.done,
      });
    
    case 'CHECK_AUTH':
      return Object.assign( {}, state, {
        isAuthorized:       actions.isAuthorized,
        userId:             actions.userId,
        message:            actions.message,
        done:               actions.done
      });
      
    case 'UPDATE_MESSAGE':
      return Object.assign( {}, state, {
        message:            actions.message,
        done:               actions.done
      })
      
    case 'SHOW_MODAL':
      return Object.assign( {}, state, {
        showModal:          actions.bool,
        modalType:          actions.modalType,
      });
      
    case 'SHOW_TRADE_MODAL':
      return Object.assign( {}, state, {
        showTradeModal:     actions.bool
      });
      
    case 'SHOW_ADD_BOOK_MODAL':
      return Object.assign( {}, state, {
        showAddBookModal:     actions.bool
      });
      
    case 'SHOW_OPEN_TRADES_MODAL':
      return Object.assign( {}, state, {
        showOpenTradesModal:     actions.bool
      });
      
    case 'SHOW_USER_BOOKS_MODAL':
      return Object.assign( {}, state, {
        showUserBooksModal:          actions.bool,
        
      });
      
    case 'SHOW_BOOK_TRADE_USER_MODAL':
      return Object.assign( {}, state, {
        showBookTradeUserModal:     actions.bool,
      });
    
    case 'SHOW_BOOK_INFO_MODAL':
      return Object.assign( {}, state, {
        showBookInfoModal:      actions.bool,
        bookInfoModalKey:       actions.bookInfoModalKey
      });
      
    case 'SHOW_CONFIRMATION_DIALOG':
      return Object.assign( {}, state, {
        showConfirmationDialog:     actions.bool,
        
      });
      
    case 'HIDE_ALL_MODALS':
      return Object.assign( {}, state, {
        showTradeModal:           false,
        showDisplayModal:         false,
        showFinalizedTradeModal:  false,
        showConfirmationDialog:   false,
        showUserBooksModal:       false,
        showBookTradeUserModal:   false,
        showBookInfoModal:        false,
        showAddBookModal:         false,
        showOpenTradesModal:      false,
      });
      
    case 'GET_OPEN_TRADES':
      return Object.assign( {}, state, {
        openTrades:       actions.openTrades
      });
      
    case 'UPDATE_OPEN_TRADES':
      return Object.assign( {}, state, {
        openTrades:       actions.openTrades
      });
      
    case 'SET_USER_TO_TRADE_WITH':
      return Object.assign( {}, state, {
        userToTradeWith:        actions.userToTradeWith
      });
      
    case 'SET_CHOSEN_BOOK':
      return Object.assign( {}, state, {
        chosenBook:        actions.chosenBook
      });
      
    case 'SET_YOUR_BOOK':
      return Object.assign( {}, state, {
        yourBook:        actions.yourBook
      });
      
    case 'RESET_TRADE_PROCESS':
      return Object.assign( {}, state, {
        bookInfoModalKey:         null,
        userToTradeWith:          null,
        chosenBook:               null,
        yourBook:                 null,
      });
      
    case 'SIGN_OUT':
      return Object.assign( {}, state, initialState );
    
    case 'SET_DONE':
      return Object.assign( {}, state, {
        done:               actions.done,
      });
      
    case 'SET_NOT_DONE':
      return Object.assign( {}, state, {
        done:               actions.done,
        message:            "",
        confirm:            "",
      });
  
      
    case 'GET_PROFILE':
      return Object.assign( {}, state, {
        profile:            actions.profile,
        done:               actions.done
      });
      
    case 'UPDATE_PROFILE':
      return Object.assign( {}, state, {
        profile:            actions.profile,
        confirm:            actions.confirm
      });
      
    case 'UPDATE_USER_BOOK_LIST_LENGTH':
      return Object.assign( {}, state, {
        userBookListLength:   actions.userBookListLength
      });
      
    case 'ADD_BOOK':
      return Object.assign( {}, state, {
        bookList:             actions.bookList,
        book:                 actions.book, 
        userBookList:         actions.userBookList,
        userBookListLength:   actions.userbookListlength,
        showAddBookModal:     actions.showModal
      });
      
    case 'UPDATE_BOOK':
      return Object.assign( {}, state, {
        book:                 actions.book
      });
    
    case 'TRADED_BOOK':
      return Object.assign( {}, state, {
        bookList:                 actions.bookList,
        userBookList:             actions.userBookList,
        openTrades:               actions.openTrades,
      });
    
    case 'GET_ALL_OPEN_TRADES':
      return Object.assign( {}, state, {
        openTrades:     actions.openTrades
      });
      
    case 'ADD_OPEN_TRADE':
      return Object.assign( {}, state, {
        openTrades:     actions.openTrades
      });
      
    case 'REMOVE_OPEN_TRADE':
      return Object.assign( {}, state, {
        openTrades:     actions.openTrades
      });
   
    default:
      return state;
  }
} 

const reducers = combineReducers({
 currentState
});

export default reducers;