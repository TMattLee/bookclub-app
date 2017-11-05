import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { Link, Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import * as actions from '../../actions/index.js';

import * as styles from './LoginPage.css';


class LoginPage extends Component {
  
  handleSubmit( event ) {
    event.preventDefault();
    const userId = event.target[0].value;
    const utoken = event.target[1].value;
    this.props.actions.logIn( userId, utoken );
  }

  
  render(){
    if ( this.props.isAuthorized ) {
      return <Redirect to="/bookclub-app/dashboard" />
    }
    return <div className = { styles.pageContainer }>
      <form className = { styles.form } encType ="x-www-urlencoded" onSubmit = { this.handleSubmit.bind( this ) }  >
        
        <div>
          <input className = { styles.input } name="userId" placeholder="Username" />
          <input className = { styles.input } name="utoken" type="password" placeholder="Password" />
        </div>
        <div className = { styles.message } > { this.props.message } </div>
        <button className = { styles.submitButton } type="submit"> Submit</button>
      </form>
      <div className = { styles.textContainer } >
        <div className = { styles.text } >
          Username: user1, user2, user3, or user4<br />
          <br />
          Password: dummy<br />
        </div>
      </div>
      
    </div>;
  }
}


const mapStateToProps = ( state ) => ({
  isAuthorized:       state.currentState.isAuthorized,
  done:               state.currentState.done,
  message:            state.currentState.message,
  showLoadingModal:   state.currentState.showLoadingModal,
  bookList:           state.currentState.bookList,
});

const mapDispatchToProps = ( dispatch ) => ({
  actions: bindActionCreators( actions, dispatch ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( LoginPage );