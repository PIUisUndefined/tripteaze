import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/index.js';  // * does all named exports from that file
import { bindActionCreators } from 'redux';
import Signup from './signup.jsx';
import Login from './login.jsx';
import Trip from './trip.jsx';
import { Link } from 'react-router-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { cyan50, cyan100, cyan200, cyan500, cyan600, cyan700, cyan800, cyan900 } from 'material-ui/styles/colors';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

export const muiTheme = getMuiTheme({
  appBar: {
    color: cyan700,
    textColor: cyan50,
    titleFontWeight: 'bold'
  },
  card: {
    fontWeight: 'bold',
    titleColor: cyan700,
    subtitleColor: cyan200
  },
  cardText: {
    textColor: cyan800
  },
  datePicker: {
    calendarTextColor: cyan700,
    calendarYearBackgroundColor: cyan50,
    headerColor: cyan800
  },
  dialog: {
    titleFontSize: 25,
    bodyFontSize: 15,
    bodyColor: cyan600
  },
  flatButton: {
    color: '#f9f9f9',
    fontSize: 14,
    fontWeight: 'bold',
    textColor: cyan800
  },
  palette: {
    textColor: cyan900
  },
  raisedButton: {
    color: cyan700,
    fontSize: 17,
    margin: 12,
    textColor: cyan50
  },
  textField: {
    textColor: cyan800
  }
});

export const styles = {
  body: {
    textAlign: 'center',
    width: '100%'
  },
  discoverTrips: {
    background: `linear-gradient(to bottom right, #f9f9f9, ${cyan50})`,
    color: cyan800,
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: '1%',
    padding: '0.5%',
    textAlign: 'center'
  },
  header: {
    background: `linear-gradient(to bottom right, ${cyan50}, ${cyan100})`,
    color: cyan900,
    fontFamily: 'Arial',
    fontSize: 45,
    fontWeight: 'bold',
    paddingTop: '5%',
    textAlign: 'center',
    textDecoration: 'none',
    maxHeight: 150
  },
  navLinks: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '0.5%',
    marginLeft: '0.5%',
    position: 'absolute',
  },
  getStarted: {
    background: 'linear-gradient(to bottom right, white, #f9f9f9)',
    color: cyan600,
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: '2%',
    paddingTop: '1%'
  },
  tripButton: {
    width: '50%',
    margin: '0 auto',
    marginTop: '1%'
  },
  tripTeazeText: {
    textDecoration: 'none',
    color: cyan900
  }
};

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.toSearchPage = this.toSearchPage.bind(this);
    this.toUserPage = this.toUserPage.bind(this);
  }

  componentWillMount() {
    this.props.actions.deactivate();
    this.props.actions.fetchTrips('public');
  }

  toUserPage() {
    this.props.history.push('/trips');
  }

  toSearchPage() {
    this.props.history.push('/plan');
  }

  navBar() {
    let actions = this.props.actions; //access shortcuts

    if (this.props.store.authenticated) {
      return (
        <div style={styles.navLinks}>
          <RaisedButton
            style={{marginRight: '15px'}}
            onClick={this.toUserPage}
            label='My Trips'
          />
          <RaisedButton
            style={{ marginRight: '15px' }}
            onClick={this.toSearchPage}
            label='Build'
          />
          <RaisedButton
            style={{ marginRight: '15px' }}
            onClick={actions.logOut}
            label='Log Out'
          />
        </div>
      );
    }
  }

  getStarted() {
    let actions = this.props.actions;
    let store = this.props.store;

    if (store.authenticated) {
      return (
        <div>
          <div style={styles.discoverTrips}>Hello, {store.username}!</div>

          <RaisedButton
            label="Create new trip"
            onClick={this.toSearchPage}
            style={styles.tripButton}
          />
        </div>
      );
    } else {
      return (
        <div>
          <div style={styles.discoverTrips}>
            Get Started
            <br />
            <div style={
              {
                color: cyan500,
                fontSize: 12,
                fontStyle: 'italic',
                fontWeight: 'normal'
              }
            }>
              Don&apos;t wait! Plan your next trip today!
            </div>
          </div>

          <div style={{display: 'inline-block', marginTop: '1%'}}>
            <Login login={actions.login}
              username={store.username}
              password={store.password}
              updateUsername={actions.updateUsername}
              updatePassword={actions.updatePassword}
              forward={this.toUserPage}
            />
          </div>
          <div style={{display: 'inline-block', marginTop: '1%'}}>
            <Signup signup={actions.signup}
              username={store.username}
              password={store.password}
              updateUsername={actions.updateUsername}
              updatePassword={actions.updatePassword}
              forward={this.toUserPage}
            />
          </div>
        </div>
      );
    }
  }

  render() {
    // let actions = this.props.actions; //access shortcuts
    let store = this.props.store;
    //store is redux store
    //and props.actions with all the action creating functions

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <Paper>
          {/************************** NAVIGATION **************************/}
          {this.navBar()}

          {/************************** HEADER **************************/}
          <div style={styles.header}>
            <Link to="/" style={styles.tripTeazeText}>
              TripTeaze
            </Link>
          </div>

          {/************************** CREATE TRIP **************************/}
          <div style={styles.body}>
            {this.getStarted()}

            <div style={{marginTop: '1%'}}>
              <div style={styles.discoverTrips}>Discover</div>

              {store.publicTrips.map((trip, index) => (
                <Trip key={index} trip={trip} />
              ))}
            </div>
          </div>

        </Paper>
      </MuiThemeProvider>
    );}
}

const mapStateToProps = state => (
  { store: state } // eslint-disable-line
);

const mapDispatchToProps = dispatch => (
  { actions: bindActionCreators(actions, dispatch) }
);

export default connect(mapStateToProps, mapDispatchToProps)(Home);
