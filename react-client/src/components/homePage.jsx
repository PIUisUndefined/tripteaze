import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/index.js';  // * does all named exports from that file
import { bindActionCreators } from 'redux';
import Signup from './signup.jsx';
import Login from './login.jsx';
import Trip from './trip.jsx';
import { Link } from 'react-router-dom';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';


class Home extends React.Component {
  constructor (props) {
    super(props);
  }

  componentWillMount() {
    this.props.actions.fetchTrips('public');
  }

  componentDidUpdate() {
    if (this.props.state.authenticated) {
      this.props.history.push('/trips');
    }
  }

  toUserPage () {
    this.props.history.push('/trips');
  }

  toSearchPage () {
    this.props.history.push('/plan')
  }

  render () {
    let actions = this.props.actions; //access shortcuts
    let state = this.props.state;
  //has props.state with all the state things
  //and props.actions with all the action creating functions

    return (
      <Paper>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Login login={actions.login}
            username={state.username}
            password={state.password}
            updateUsername={actions.updateUsername}
            updatePassword={actions.updatePassword}
          />
          <Signup signup={actions.signup}
            username={state.username}
            password={state.password}
            updateUsername={actions.updateUsername}
            updatePassword={actions.updatePassword}
          />
          <RaisedButton label="User Page" onClick={this.toUserPage.bind(this)} />
          <RaisedButton label="Search Page" onClick={this.toSearchPage.bind(this)} />
        </div>

        <div style = {{display: 'flex', flexDirection: 'column', textAlign: 'center'}}>
          <h1> TripTeaze </h1>
          <h3> ~Discover~ </h3>
          {state.trips.map((trip, index) => (<Trip key={index} trip={trip} />))}
        </div>
      </Paper>
    )};
}

const mapStateToProps = state => (
  { state: state }
);

const mapDispatchToProps = dispatch => (
  { actions: bindActionCreators(actions, dispatch) }
);

export default connect(mapStateToProps, mapDispatchToProps)(Home);
