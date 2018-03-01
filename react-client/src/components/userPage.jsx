import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Link} from 'react-router-dom';

import Paper from 'material-ui/Paper';
import { RaisedButton } from 'material-ui';

import Trip from './trip.jsx';
import * as actions from '../actions/index.js';

class UserPage extends React.Component {
  constructor (props) {
    super(props);
  }

  componentWillMount() {
    if (this.props.state.authenticated) {
      this.props.actions.fetchTrips(this.props.state.username);
    }
  }

  generateMessage () {
    if (this.props.state.trips.length === 0) {
      return (<div> <h3> You don't have any trips yet :( </h3>
        <h4> Why not go <Link to='/plan'> plan </Link> one? </h4>
        </div>);
    } else {
      return (<div> Your Trips </div>);
    }
  }


  render() {
    if (this.props.state.authenticated === true) {
      return (
        <Paper style={{ display: 'flex', flexFlow: 'row wrap', margin: '10px' }}>
          <div>
            <h2> {this.generateMessage()} </h2>
            <Link to='/plan'>SearchPage</Link>
            <Link to='/'> 
              <RaisedButton onClick = {this.props.actions.logOut} label = 'Log Out' /> 
            </Link>
            {this.props.state.trips.map((trip, index) => 
              <Trip key = {index}
                user = {this.props.state.username} 
                trip = {trip} 
                editable = {true}
                deleteEvent={this.props.actions.deleteEvent}
                delete = {this.props.actions.deleteTrip}
                toggleStatus = {this.props.actions.toggleTripStatus}
              />)}
          </div>
        </Paper>
      );
    } else {
      return (
        <Paper style={{ display: 'flex', flexFlow: 'row wrap', margin: '10px' }}>
        <h2> Sorry! Please log in to access this content! </h2>
        <Link to='/'> Home </Link>
        </Paper>
      );
    }
  }
}

const mapStateToProps = state => (
  {state: state}
);

const mapDispatchToProps = dispatch =>
  ({
    actions: bindActionCreators(actions, dispatch)
  });

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);

