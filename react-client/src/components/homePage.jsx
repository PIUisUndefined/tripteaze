import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/index.js';  // * does all named exports from that file
import { bindActionCreators } from 'redux';
import Signup from './signup.jsx';
import Login from './login.jsx';
import Trip from './trip.jsx';
import { Link } from 'react-router-dom';

import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { cyan50, cyan100, cyan200, cyan300, cyan400, cyan500, cyan600, cyan700, cyan800, cyan900 } from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

export const muiTheme = getMuiTheme({
  appBar: {
    color: cyan700,
    textColor: cyan50,
    // height: spacing.desktopKeylineIncrement,
    titleFontWeight: 'bold',
    // padding: spacing.desktopGutter,
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
    headerColor: cyan800,
  },
  dialog: {
    titleFontSize: 25,
    bodyFontSize: 15,
    bodyColor: cyan600
  },
  flatButton: {
    fontSize: 17,
    fontWeight: 'bold',
    textColor: cyan800,
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
    padding: '0.5%',
    textAlign: 'center',
  },
  header: {
    background: `linear-gradient(to bottom right, ${cyan50}, ${cyan100})`,
    color: cyan900,
    fontFamily: 'Arial',
    fontSize: 45,
    fontWeight: 'bold',
    paddingTop: '15%',
    marginTop: '3%',
    textAlign: 'center',
    textDecoration: 'none'
  },
  navLinks: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '0.5%',
    marginLeft: '0.5%',
    position: 'absolute',
  },
  tripButton: {
    width: '50%',
    margin: '0 auto',
    marginTop: '2%'
  }
}

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
      <MuiThemeProvider muiTheme={muiTheme}>
        <Paper>
          {/************************** NAVIGATION **************************/}
          <div style={styles.navLinks}>
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
          </div>

          {/************************** HEADER **************************/}
          <div style={styles.header}>
            <Link to="/" style={{textDecoration: 'none', color: cyan900}}>
              TripTeaze
            </Link>
          </div>
          
          {/************************** CREATE TRIP **************************/}
          <div style={styles.body}>
            <RaisedButton
              label="Create a trip"
              onClick={this.toSearchPage.bind(this)}
              style={styles.tripButton}
            />

            <div style={{marginTop: '1em'}}>
              <div style={styles.discoverTrips}>Discover</div>

              {state.trips.map((trip, index) => (
                <Trip key={index} trip={trip} />
              ))}
            </div>
          </div>

        </Paper>
      </MuiThemeProvider>
    )};
}

const mapStateToProps = state => (
  { state: state }
);

const mapDispatchToProps = dispatch => (
  { actions: bindActionCreators(actions, dispatch) }
);

export default connect(mapStateToProps, mapDispatchToProps)(Home);