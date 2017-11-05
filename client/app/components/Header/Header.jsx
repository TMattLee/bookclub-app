import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import styles from './Header.css';

import * as actions from '../../actions/index.js';

class Header extends Component {
  componentDidMount(){
    this.props.actions.checkAuth();
  }
  render(){
    return(
      <div className={ styles.headerContainer } >
        <div className={ styles.headerContent } >
          <div className={ styles.headerContentLeft } > 
            
            <div className={ styles.tabStyle } >
              Book Trader
            </div>
            
          </div>
          <div className={ styles.headerContentRight }>
            
              <NavLink exact to="/bookclub-app/" 
                activeStyle={ activeStyle } 
                style={ inactiveStyle } >HOME</NavLink> 
                
              <span style={ inactiveStyle } > | </span>
              
              { 
                this.props.isAuthorized ? 
                  <div>
                    <NavLink exact to="/bookclub-app/dashboard" 
                      activeStyle={ activeStyle } 
                      style={ inactiveStyle } >DASHBOARD</NavLink>
                      
                    <span style={ inactiveStyle } > | </span>
                      
                    <NavLink exact to="/bookclub-app/profile" 
                      activeStyle={ activeStyle } 
                      style={ inactiveStyle } >profile</NavLink>
                      
                    <span style={ inactiveStyle } > | </span>
                    
                    <NavLink exact to="/bookclub-app/logout"  
                      activeStyle={ activeStyle } 
                      style={ inactiveStyle } >LOG OUT</NavLink>
                  </div>
                  :
                  <NavLink exact to="/bookclub-app/login" 
                    activeStyle={ activeStyle } 
                    style={ inactiveStyle } >Log In</NavLink> 
              }
          </div>
        </div>
      </div>
    );
  }
};



const activeStyle ={
  color:              '#222',
  textDecoration:     'none',
  textTransform:      'uppercase',
  margin:             '0px 2px',
  borderBottom:       '2px solid #222',
};

const inactiveStyle ={
  color:              '#222',
  textDecoration:     'none',
  textTransform:      'uppercase',
  margin:             '0px 2px',
};


const mapStateToProps = ( state ) => ({
  done:               state.currentState.done,
  isAuthorized:       state.currentState.isAuthorized,
  message:            state.currentState.message,
});

const mapDispatchToProps = ( dispatch ) => ({
  actions: bindActionCreators( actions, dispatch )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( Header );