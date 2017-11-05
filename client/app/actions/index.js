import React from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

export const SET_LOGGED_OUT = 'SET_LOGGED_OUT';
export const SET_NOT_DONE = 'SET_NOT_DONE';
export const SET_DONE = 'SET_DONE'

export const CHECK_AUTH = 'CHECK_AUTH';
export const SIGN_OUT = 'SIGN_OUT';

export const RESET_RESULTS = 'RESET_RESULTS';
export const INITIALIZE_STATE = 'INITIALIZE_STATE';
export const UPDATE_DATA = 'UPDATE_DATA';
export const CHANGE_DISPLAY = 'CHANGE_DISPLAY';
export const SHOW_MODAL = 'SHOW_MODAL';
export const GET_BOOK_LIST = 'GET_BOOK_LIST';
export const GET_USER_BOOK_LIST = 'GET_USER_BOOK_LIST';
export const GET_OTHER_USER_BOOK_LIST = 'GET_OTHER_USER_BOOK_LIST';

export const ADD_BOOK = 'ADD_BOOK';
export const UPDATE_MESSAGE = 'UPDATE_MESSAGE';
export const SHOW_TRADE_MODAL = 'SHOW_TRADE_MODAL';
export const SHOW_FINALIZE_TRADE_MODAL = 'SHOW_FINALIZE_TRADE_MODAL';
export const SHOW_USER_BOOKS_MODAL = 'SHOW_USER_BOOKS_MODAL';
export const SHOW_CONFIRMATION_DIALOG = 'SHOW_CONFIRMATION_DIALOG';
export const HIDE_ALL_MODALS = 'HIDE_ALL_MODALS';
export const SHOW_BOOK_TRADE_USER_MODAL = 'SHOW_BOOK_TRADE_USER_MODAL';
export const SHOW_BOOK_INFO_MODAL = 'SHOW_BOOK_INFO_MODAL';
export const SHOW_ADD_BOOK_MODAL = 'SHOW_ADD_BOOK_MODAL';
export const SHOW_OPEN_TRADES_MODAL = 'SHOW_OPEN_TRADES_MODAL';

export const GET_ALL_OPEN_TRADES = 'GET_ALL_OPEN_TRADES';
export const ADD_OPEN_TRADE = 'ADD_OPEN_TRADE';
export const REMOVE_OPEN_TRADE = 'REMOVE_OPEN_TRADE';


export const GET_PROFILE = 'GET_PROFILE';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';
export const SET_BOOK_ADDED = 'SET_BOOK_ADDED';
export const SET_BOOK_NOT_ADDED = 'SET_BOOK_NOT_ADDED';
export const UPDATE_USER_BOOK_LIST_LENGTH = 'UPDATE_USER_BOOK_LIST_LENGTH';
export const UPDATE_BOOK = 'UPDATE_BOOK';
export const TRADED_BOOK = 'TRADED_BOOK';

export const SET_USER_TO_TRADE_WITH = 'SET_USER_TO_TRADE_WITH';
export const SET_CHOSEN_BOOK = 'SET_CHOSEN_BOOK';
export const SET_YOUR_BOOK = 'SET_YOUR_BOOK';
export const RESET_TRADE_PROCESS = 'RESET_TRADE_PROCESS';

export const checkAuth = () => {
  return ( dispatch ) => {
    axios({
      method: 'GET',
      url:    '/bookclub-app/auth'
    })
    .then( response => {
      if( response.data.message === 'VALIDATED' ){
        dispatch({ 
          type:         CHECK_AUTH,
          isAuthorized: true,
          userId:       response.data.userId,
          message:      '',
          done:         true,
        })
      }
      else{
        dispatch({ 
          type:         CHECK_AUTH,
          isAuthorized: false,
          message:      '',
          done:         true,
        })
      }
    })
  }
}

export const logIn = ( userId, utoken ) => {
  return ( dispatch ) => {
    axios({
      method: 'POST',
      url:    '/bookclub-app/login',
      data:{
        userId:    userId,
        utoken:    utoken
      }
    })
    .then( response => {
      if ( response.data.message === 'VALIDATED' ){
        dispatch({
          type:           CHECK_AUTH,
          isAuthorized:   true,
          userId:         response.data.userId,
          message:        '',
          done:           true,
        })
      }
      else{
        dispatch({
          type:           UPDATE_MESSAGE,
          message:        response.data.message + ' (0_o)',
          done:           true,
        })
      }
    })
    .catch( error => console.log( error ) );
  }
}

export const logOut = () => {
  return ( dispatch ) => {
    axios({
      method: 'GET',
      url:    '/bookclub-app/logout',
    })
    .then( response => {
      dispatch({
        type:           INITIALIZE_STATE,
      }) 
    })
    .catch( error => {
      console.log( error )
    })
  }
}

export const getBookList = () => {
  return ( dispatch ) => {
    axios({ 
      method: 'GET',
      url:    '/bookclub-app/getallbooks'
    })
    .then( response => {
      const { data } = response;
      dispatch({
        type:       GET_BOOK_LIST,
        bookList:   data,
        done:       true,
      })
    })
    .catch( error => {
      console.log( 'error getting data' );
    });
  }
}

export const getUserBookList = () => {
  return ( dispatch ) => {
    axios({ 
      method: 'GET',
      url:    '/bookclub-app/getuserbooklist'
    })
    .then( response => {
      const { data } = response;
      dispatch({
        type:         GET_USER_BOOK_LIST,
        userBookList: data.userBookList,
        done:         true,
      });
    })
    .catch( error => {
      console.log( 'error getting data' );
    });
  }
}

export const getOtherUserBookList = ( userId ) => {
  return ( dispatch ) => {
    axios({ 
      method: 'GET',
      url:    '/bookclub-app/getotheruserbooklist'
    })
    .then( response => {
      const { data } = response;
      dispatch({
        type:         GET_OTHER_USER_BOOK_LIST,
        userBookList: data.userBookList,
        done:         true,
      });
    })
    .catch( error => {
      console.log( 'error getting data' );
    });
  }
}

export const addBookToDatabase = ( isbn10 ) =>{
  return ( dispatch ) => {
    axios({ 
      method: 'POST',
      url: '/bookclub-app/addbook',
      data: {
        isbn10:     isbn10,
      }
    })
    .then( response => {
      const data = response.data;
      console.log( 'le data',data )
      dispatch({
        type:                 ADD_BOOK,
        bookList:             data.bookList,
        book:                 data.newBook, 
        userBookList:         data.userBookList,
        showAddBookModal:     false
      })
    })
    .catch( error => {
      bookAdded( false );
      console.log( 'error getting data' );
    });
  }
}

export const tradeBook = ( tradeData )=> {
  return dispatch => {
    axios({
      method: 'POST',
      url:    '/bookclub-app/tradebook',
      data:{
        tradeData:    tradeData,
      }
    })
    .then( response => {
      const { data } = response;
      dispatch({
        type:         TRADED_BOOK,
        bookList:     data.bookList,
        userBookList: data.userBookList,
        openTrades:   data.openTrades,
      })
    })
    .catch( error => console.log( error ) )
  }
}

export const getProfile = () => {
  return ( dispatch ) => {
    axios({ 
      method: 'GET',
      url: '/bookclub-app/getprofile',
    })
    .then( response => {
      const { data } = response;
      dispatch({
        type:       GET_PROFILE,
        profile:    data.profile,
        done:       true,
      })
    })
    .catch( error => {
      console.log( 'error getting data' );
    });
  }
}

export const updateProfile = ( fullName, city, state ) => {
  return ( dispatch ) => {
    axios({ 
      method: 'POST',
      url: '/bookclub-app/updateprofile',
      data:{
        fullName: fullName,
        city:     city,
        state:    state,
      }
     
    })
    .then( response => {
      const { data } = response;
      dispatch({
        type:       UPDATE_PROFILE,
        profile:{
          fullName: fullName,
          city:     city,
          state:    state,
        },
        confirm:    "Done!"
      });
    })
    .catch( error => {
      console.log( 'error getting data' );
    });
  }
}

export const updateBook = ( book ) => ({
  type:       UPDATE_BOOK,
  book:       book,
});

export const showModal = ( bool, modalType ) => ({
  type:       SHOW_MODAL,
  bool:       bool,
  modalType:  modalType
});

export const setDone = () => ({
  type: SET_NOT_DONE,
  done: true,
});

export const setNotDone = () => ({
  type: SET_NOT_DONE,
  done: false,
});

export const updateData = ( data ) => ({
  type: UPDATE_DATA,
  data: data
});

export const bookAdded = () => ({
  type:     SET_BOOK_ADDED,
  bool:     true,
  message:  "Error"
});

export const bookNotAdded = () => ({
  type:     SET_BOOK_ADDED,
  bool:     false,
  message:  "Error"
});

export const changeDisplay = ( displayValue ) => ({
  type: CHANGE_DISPLAY,
  displayValue: displayValue
});

export const showTradeModal = ( bool ) => ({
  type:             SHOW_TRADE_MODAL,
  bool:             bool
});

export const hideTradeModal = () => ({
  type:             SHOW_TRADE_MODAL,
  showTradeModal:   false
});

export const showUserBooksModal = ( bool ) => ({
  type:             SHOW_USER_BOOKS_MODAL,
  bool:             bool
});

export const hideAllModals = () => ({
  type:             HIDE_ALL_MODALS,
});

export const showAddBookModal = ( bool ) => ({
  type:             SHOW_ADD_BOOK_MODAL,
  bool:             bool
});

export const showOpenTradesModal = ( bool ) => ({
  type:             SHOW_OPEN_TRADES_MODAL,
  bool:             bool
});

export const showBookTradeUserModal = ( bool ) => ({
  type:             SHOW_BOOK_TRADE_USER_MODAL,
  bool:             bool
});

export const showBookInfoModal = ( bool, key ) => ({
  type:             SHOW_BOOK_INFO_MODAL,
  bool:             bool,
  bookInfoModalKey: key
});

export const showConfirmationDialog = ( bool ) => ({
  type:             SHOW_CONFIRMATION_DIALOG,
  bool:             bool
});

export const showFinalizeTradeModal = () => ({
  type:             SHOW_FINALIZE_TRADE_MODAL,
  showTradeModal:   true
});

export const hideFinalizeTradeModal = () => ({
  type:             SHOW_FINALIZE_TRADE_MODAL,
  showTradeModal:   false
});

export const updateUserBooklistLength = ( value ) => ({
  type:               UPDATE_USER_BOOK_LIST_LENGTH,
  userBookListLength: value
});

export const setUserToTradeWith = ( userId ) => ({
  type:             SET_USER_TO_TRADE_WITH,
  userToTradeWith:  userId
});

export const setChosenBook = ( book ) => ({
  type:             SET_USER_TO_TRADE_WITH,
  chosenBook:       book
});

export const setYourBook = ( book ) => ({
  type:         SET_YOUR_BOOK,
  yourBook:     book
});

export const resetTradeProcess = () => ({
  type:   RESET_TRADE_PROCESS
});

export const getAllOpenTrades = () => {
  return dispatch => {
    axios({
      method: 'GET',
      url:    '/bookclub-app/getallopentrades'
    })
    .then( response => {
      dispatch({
        type:       GET_ALL_OPEN_TRADES,
        openTrades: response.data.openTrades
      })
    })
  }
}

export const addOpenTrade = ( tradeData ) => {
  return dispatch => {
    axios({
      method: 'POST',
      url:    '/bookclub-app/addopentrade',
      data:{
        tradeData:  tradeData
      }
    })
    .then( response => {
      response.data
      dispatch({
        type:       ADD_OPEN_TRADE,
        openTrades: response.data.openTrades
      });
    });
  }
};

export const removeOpenTrade = ( tradeId ) => {
  return dispatch => {
    axios({
      method: 'POST',
      url:    '/bookclub-app/removeopentrade',
      data:{
        tradeId:  tradeId
      }
    })
    .then( response => {
      response.data
      dispatch({
        type:       REMOVE_OPEN_TRADE,
        openTrades: response.data.openTrades
      });
    });
  }
};