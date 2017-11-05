import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../actions/index.js';


const LogoutPage = ( props ) => {
  props.actions.logOut();
  if( props.isAuthorized ) {
    return <div> Logging out </div>
  }
  return <Redirect to="/bookclub-app/" />
}

const mapStateToProps = ( state ) => ({
  isAuthorized:         state.currentState.isAuthorized
})
const mapDispatchToProps = ( dispatch ) => ({
  actions: bindActionCreators( actions, dispatch ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( LogoutPage );