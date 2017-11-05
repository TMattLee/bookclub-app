import React from 'react';
import * as styles from './ProfilePage.css';
import * as actions from '../../actions/index.js';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';


class ProfilePage extends React.Component {
  
  componentDidMount(){
    this.props.actions.setNotDone();
    this.props.actions.checkAuth();
    this.props.actions.getProfile();
  }
  
  handleSubmit( event ){
    event.preventDefault();
    const { fullName, city, state } = event.target;
    this.props.actions.updateProfile( fullName.value, city.value, state.value );
  }
  

  render(){
    if ( !this.props.done ){
      return <div>
        Loading...
      </div> 
    }
    
    if( !this.props.isAuthorized ){
      return <Redirect to="/bookclub-app/login" />
    }
    
    if ( !this.props.profile ){
      return <div>
        Loading...
      </div> 
    }
    const { profile } = this.props;
    
    return <div className = { styles.pageContainer } >
      <div className ={ styles.pagetitle } > Update Profile </div>
      <form className = { styles.profileContainer } encType="x-www-urlencoded" onSubmit = { this.handleSubmit.bind( this ) } >
        <div className ={ styles.section } > 
          <div className ={ styles.title } > Full Name </div> 
          <input className = { styles.textBox } type="text" defaultValue = { profile.fullName } name="fullName" /> 
        </div> 
        <div className ={ styles.section } > 
          <div className ={ styles.title } > City </div> 
          <input className = { styles.textBox } type="text" defaultValue = { profile.city } name="city" /> 
        </div> 
        <div className ={ styles.section } > 
          <div className ={ styles.title } > State </div> 
          <input className = { styles.textBox } type="text" defaultValue = { profile.state } name="state" /> 
        </div> 
        <div className = { styles.submitButtonGroup } >
          <input type="submit"  className ={ styles.submitButton } value="Save"/> 
          <div className ={ styles.done } > { this.props.confirm } </div>
        </div>
      </form>
      
    </div>
  }
}

const mapStateToProps = ( state ) => ({
  isAuthorized:       state.currentState.isAuthorized,
  done:               state.currentState.done,
  profile:            state.currentState.profile,
  userId:             state.currentState.userId,
  confirm:            state.currentState.confirm,
});

const mapDispatchToProps = ( dispatch ) => ({
  actions: bindActionCreators( actions, dispatch ),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )( ProfilePage )
)