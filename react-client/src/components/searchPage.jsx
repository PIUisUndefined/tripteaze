import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';

import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import DatePicker from 'material-ui/DatePicker';
import Toggle from 'material-ui/Toggle';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';

import * as theme from './homePage.jsx';  // * does all named exports from that file
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { cyan50, cyan100, cyan200, cyan300, cyan400, cyan500, cyan600, cyan700, cyan800, cyan900 } from 'material-ui/styles/colors';

import * as actions from '../actions/index.js';
import Activity from './activity.jsx';
import UserPage from './userPage.jsx';
import Events from './events.jsx';
import Signup from './signup.jsx';
import Login from './login.jsx';
import Eatin from './restaurants.jsx';

const styles = {
  activityTitle: {
    backgroundColor: '#f9f9f9',
    color: cyan800,
    fontSize: 20,
    fontWeight: 'bold',
    padding: '1%',
    marginBottom: '1%',
    textAlign: 'left'
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    lineHeight: '0 !important'
  },
  createTripCard: {
    display: 'inline-block',
    marginLeft: '19%',
    marginTop: '1%',
    width: '30%',
  },
  existingTripsCard: {
    display: 'inline-block',
    marginTop: '1%',
    marginLeft: '2%',
    verticalAlign: 'top',
    width: '30%',
  },
  eventContainer: {
    display: 'inline-block',
    verticalAlign: 'top',
    width: '49%'
  },
  foodContainer: {
    display: 'inline-block',
    marginLeft: '2%',
    verticalAlign: 'top',
    width: '49%'
  },
  myTripsButton: {
    marginRight: '1em'
  },
  paper: {
    display: 'flex',
    flexFlow: 'row wrap',
    margin: '10px'
  },
  searchBar: {
    padding: '3%',
    paddingLeft: '5%'
  },
  searchInput: {
    width: '80%'
  },
  searchResults: {
    display: 'flex',
    flexFlow: 'row',
    margin: '10px'
  },
  tripDates: {
    display: 'flex',
    flexFlow: 'column wrap'
  }
}

class SearchPage extends React.Component {
  constructor (props) {
    super(props);

    if (props.state.trips.length !== 0) {
      this.state = {
        open: false,
        activeCity: props.state.trips[props.state.activeTrip.index].city,
        dropdown: 0,
        activeFromDate: props.state.trips[props.state.activeTrip.index].fromDate
      }
    } else {
      this.state = {
        open: false,
        dropdown: 0
      }
    }
  }

  updateCity (event, index, value) {
    if (value && index !== 0) {
      this.setState({dropdown: value, open: true});
      this.setState({activeCity: this.props.state.trips[index - 1].city});
      this.props.actions.updateCity('');
      this.props.actions.activateTrip(index - 1);
    } else if (index === 0) {
      this.setState({ dropdown: value });
      this.props.actions.deactivate();
    } else {
      this.props.actions.updateCity(this.formatCity(event.target.value));
    }
  }

  formatCity (city) {
    const words = city.split(' ');
    let newWords = [];
    for (let word of words) {
      word = word.slice(0,1).toUpperCase().concat(word.slice(1).toLowerCase());
      newWords.push(word);
    }
    return newWords.join(' ');
  } 

  submit (event) {  //makes a new trip
    let state = this.props.state;
    event.preventDefault();
    if (state.city !== '' && state.tripFromDate !== '' && state.tripToDate !== '') {
      this.props.actions.makeNewTrip(state.username, state.city, state.trips.length, state.tripFromDate, state.tripToDate);
      this.setState({ activeCity: state.city, open: true });
    }
  };

/***************************** Event - search **********************************/
  updateEventQuery(event) {
    this.props.actions.updateEventQuery(event.target.value)
  };

  submitEventQuery (event) {
    let state = this.props.state;
    event.preventDefault();
    if (state.activeTrip.status || state.city) {
      let city = state.activeTrip.status ? this.state.activeCity : state.city;
      this.props.actions.searchEvents(this.state.activeCity, state.eventQuery, this.state.activeFromDate)
    } else {
      window.alert('Please select a city for your trip first!');
    }
  };

/***************************** Food - search **********************************/
  updateFoodQuery (event) {
    this.props.actions.updateFoodQuery(event.target.value)
  };

  submitFoodQuery (event) {
    event.preventDefault();
    if(this.props.state.activeTrip.status) {
      this.props.actions.searchForFood(this.state.activeCity, this.props.state.foodQuery)
    } else {
      window.alert('Please select a city for your trip first!')
    }
  };

/***************************** MESSAGE *****************************/
  render () {
    let message =  '';
    let messageEvents = '';
    let messageFood = '';
    let activeCity = this.state.activeCity;
    let state = this.props.state;
    let actions = this.props.actions;

    if (!state.activeTrip.status) {
      message = 'Pick a city for your trip!';
      messageEvents = 'First pick a city before searching events!';
      messageFood = '';
    } else {
      message = `You\'re going to ${activeCity}! \n Or plan a different trip: `;
      messageEvents = `Type a keyword to find events in ${activeCity}!`;
      messageFood= `Or search for food in ${activeCity}!`;
    }
  
  /*************************** DATE SELECTION STUFF ***************************/
    let today = new Date();

    let updateFromDate = (event, date) => {
      // Dates need to be in YYYY-MM-DD format
      let fromDate = moment(date).format('YYYY-MM-DD');
      actions.updateFromDate(fromDate);

      // This sets minimum "To" date based on the current "From" date in the correct date format
      actions.setMinToDate(date);
    }

    const updateToDate = (event, date) => {
      // Dates need to be in YYYY-MM-DD format
      let toDate = moment(date).format('YYYY-MM-DD');
      actions.updateToDate(toDate);
    };

    /*************************** EXISTING TRIPS DROPDOWN ***************************/
    const dropdown = () => {
      if (state.authenticated && state.trips.length > 0) {
        return (
          <div>
            <SelectField 
              // floatingLabelText="Existing Trips" 
              value={this.state.dropdown} 
              onChange = {this.updateCity.bind(this)}
            > 
              <MenuItem value = ' ' primaryText = 'Make a New Trip' />
                {state.trips.map((trip, index) => 
                  <MenuItem
                    key = {index}
                    value = {trip.city}
                    primaryText = {trip.city} 
                  />)
                }
            </SelectField>
            <br/>
            <RaisedButton
              onClick={() => (this.setState({ open: !this.state.open }))}
              label='Show Details'
              disabled={!state.activeTrip.status}
            />
          </div>
        );
      }
    }

    /*************************** TRIP DETAILS SIDEBAR ***************************/
    const drawer = () => {
      if (state.activeTrip.status) {
        let activeTrip = state.trips[state.activeTrip.index]; 
        if (activeTrip) {
          return (
            <Drawer
              width={400}
              openSecondary={true}
              open={this.state.open}
            >
              <AppBar
                title={this.state.activeCity}
                iconElementLeft={
                  <IconButton
                    onClick={() => (this.setState({ open: false }))}
                  >
                    <NavigationClose />
                  </IconButton>}
              />
              {activeTrip.events.map((event, index) => 
                (<Activity
                  key={index}
                  sidebar = 'true'
                  type='event'
                  activity={event}
                  user={state.username}
                  city={this.state.activeCity}
                  delete={actions.deleteEvent}
                />))}

              {activeTrip.eatin.map((eatin, index) => 
                (<Activity
                  key={index}
                  sidebar='true'
                  type='food'
                  user={state.username}
                  city={this.state.activeCity}
                  activity={eatin}
                />))}
            </Drawer>
          );
        }
      }
    }
  
    return (
      <MuiThemeProvider muiTheme={theme.muiTheme}>
        <Paper>
          {/************************** NAVIGATION **************************/}
          <div style={theme.styles.navLinks}>
            <Link to= '/'>
              <RaisedButton
                label="Home"
                style={styles.myTripsButton}
              />
            </Link>

            <Link to= 'trips'>
              <RaisedButton
                label="My Trips"
                disabled={!this.props.state.authenticated}
                style={styles.myTripsButton}
              />
            </Link>
            <Login
              login={actions.login}
              username={state.username}
              password={state.password}
              updateUsername={actions.updateUsername}
              updatePassword={actions.updatePassword}
            />
            <Signup
              signup={actions.signup}
              username={state.username}
              password={state.password}
              updateUsername={actions.updateUsername}
              updatePassword={actions.updatePassword}
            />
            <Link to='/'>
              <RaisedButton
                onClick={this.props.actions.logOut}
                label='Log Out'
                style={{marginLeft: '1em'}}
              />
            </Link>
          </div>

          {/******************************* HEADER *******************************/}
          <div style={theme.styles.header}>
            <Link to="/" style={{textDecoration: 'none', color: cyan900}}>
              TripTeaze
            </Link>
          </div>
          
          {/************************** CREATE TRIP CARD **************************/}
          <div style={styles.createTripCard}>
            {drawer()}
            <Card>
              <CardTitle
                title="Create New Trip"
                titleStyle={styles.cardTitle}
                actAsExpander={true}
                showExpandableButton={true}
              />
              <CardText
                expandable={true}
              >
                <div style = {styles.tripDates}>
                  <h4>Trip Dates:</h4>
                  <DatePicker
                      floatingLabelText="From"
                      autoOk={true}
                      onChange={updateFromDate}
                      minDate={today}
                    />
                  <DatePicker
                    floatingLabelText="To"
                    autoOk={true}
                    onChange={updateToDate}
                    // defaultDate={} TODO: set default "to" date as the "from" date
                    minDate={this.props.state.minToDate}
                  />
                  <div>
                    <h4 style = {{width: '100%'}}> {message} </h4>
                    <TextField
                      id='city'
                      value={this.props.state.city}
                      onChange={this.updateCity.bind(this)}
                    />
                    <br/>
                    <RaisedButton
                      onClick={this.submit.bind(this)}
                      label='Create Trip'
                      disabled={!this.props.state.authenticated}
                    />
                  </div>
                </div>
              </CardText>
            </Card>
          </div>

          {/************************** EXISTING TRIPS CARD **************************/}
          <div style={styles.existingTripsCard}>
            <Card>
              <CardTitle
                title="Current Trips"
                titleStyle={styles.cardTitle}
                actAsExpander={true}
                showExpandableButton={true}
              />
              <CardText
                expandable={true}
              >
                {dropdown()}
              </CardText>
            </Card>
          </div>
          
          <div style={{marginTop: '3%'}}>
            {/************************** SEARCH EVENTS **************************/}
            <Paper style={styles.eventContainer}>
              <div style={styles.searchBar}>
                <div style={styles.activityTitle}>Events</div>
                <TextField
                  id = 'event'
                  onChange = {this.updateEventQuery.bind(this)}
                  inputStyle={{ width: '100%' }}
                  style={styles.searchInput}
                />
                <RaisedButton 
                  onClick={this.submitEventQuery.bind(this)} 
                  label='Search' 
                />
              </div>

              <div style={styles.searchResults}>
                <Events
                  events={state.eventResults}
                  addEventToTrip={actions.addEventToTrip}
                  user={state.username}
                  city={this.state.activeCity}
                  eventSnackbar={state.eventSnackbar}
                  onRequestClose={actions.deactivateEventSnackbar}
                />
              </div>
            </Paper>

            {/************************** SEARCH EATIN **************************/}
            <Paper style={styles.foodContainer}>
              <div style={styles.searchBar}>
                <div style={styles.activityTitle}>Restaurants</div>
                <TextField
                  id='food'
                  onChange={this.updateFoodQuery.bind(this)}
                  inputStyle={{ width: '100%' }}
                  style={styles.searchInput}
                />
                <RaisedButton 
                  onClick={this.submitFoodQuery.bind(this)} 
                  label='Search'              
                />
              </div>

              <div style={styles.searchResults}>
                <Eatin
                  restaurants={state.foodResults}
                  addFoodToTrip={actions.addFoodToTrip}
                  user={state.username}
                  city={this.state.activeCity}
                />
              </div>
            </Paper>
          </div>
        </Paper>
      </MuiThemeProvider>
    );
  }  
}

const mapStateToProps = state => (
  { state: state }
);

const mapDispatchToProps = dispatch => (
  { actions: bindActionCreators(actions, dispatch) }
);

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
