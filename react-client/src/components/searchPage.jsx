import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';

import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Drawer from 'material-ui/Drawer';
import Dialog from 'material-ui/Dialog';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import DatePicker from 'material-ui/DatePicker';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { cyan800, cyan900 } from 'material-ui/styles/colors';
import * as theme from './homePage.jsx';  // * does all named exports from that file
import * as tripStyle from './trip.jsx';

import * as actions from '../actions/index.js';
import Activity from './activity.jsx';
import Events from './events.jsx';
import Signup from './signup.jsx';
import Login from './login.jsx';
import Eatin from './restaurants.jsx';
import Hotels from './hotels.jsx';

export const styles = {
  activityContainer: {
    display: 'inline-block',
    marginBottom: '1%',
    marginLeft: '2%',
    marginTop: '1%',
    verticalAlign: 'top',
    width: '47%'
  },
  activityTitle: {
    backgroundColor: '#f9f9f9',
    color: cyan800,
    fontSize: 20,
    fontWeight: 'bold',
    padding: '1%',
    margin: '2%',
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
  navButtons: {
    marginRight: '1em',
    marginLeft: '1em'
  },
  searchBar: {
    paddingLeft: '5%',
    paddingRight: '5%'
  },
  searchInput: {
    width: '80%'
  },
  searchResults: {
    margin: '2%'
  },
  tripDatesCard: {
    display: 'flex',
    flexFlow: 'column wrap'
  },
  tripDatesHeaders: {
    backgroundColor: '#f9f9f9',
    color: cyan900,
    fontSize: 15,
    fontWeight: 'bold',
    padding: '1%'
  },
  welcomeUser: {
    marginTop: '1%'
  }
};

//this is a terrible nightmare component that should be overhauled
class SearchPage extends React.Component {
  constructor(props) {
    super(props);

    console.log('props.store.userTrips[props.store.activeTrip.index]', props.store.userTrips[props.store.activeTrip.index]);
    if (props.store.userTrips.length !== 0  && props.store.activeTrip.status) {
      this.state = {
        open: true,
        activeCity: props.store.userTrips[props.store.activeTrip.index].city,
        dropdown: props.store.userTrips[props.store.activeTrip.index].city,
        activeFromDate: props.store.userTrips[props.store.activeTrip.index].fromDate,
        activeToDate: props.store.userTrips[props.store.activeTrip.index].toDate,
        editDatesOpen: false,
        tempFromDate: props.store.userTrips[props.store.activeTrip.index].fromDate,
        tempToDate: props.store.userTrips[props.store.activeTrip.index].toDate
      };
    } else if (props.store.userTrips.length !== 0) {
      this.state = {
        open: false,
        activeCity: props.store.userTrips[props.store.activeTrip.index].city,
        dropdown: 0,
        activeFromDate: props.store.userTrips[props.store.activeTrip.index].fromDate,
        activeToDate: props.store.userTrips[props.store.activeTrip.index].toDate,
        editDatesOpen: false,
        tempFromDate: props.store.userTrips[props.store.activeTrip.index].fromDate,
        tempToDate: props.store.userTrips[props.store.activeTrip.index].toDate
      };
    } else {
      this.state = {
        open: false,
        dropdown: 0,
        editDatesOpen: false
      };
    }

    this.submit = this.submit.bind(this);
    this.updateCity = this.updateCity.bind(this);
    this.updateEventQuery = this.updateEventQuery.bind(this);
    this.submitEventQuery = this.submitEventQuery.bind(this);
    this.updateHotelQuery = this.updateHotelQuery.bind(this);
    this.submitHotelQuery = this.submitHotelQuery.bind(this);
    this.updateFoodQuery = this.updateFoodQuery.bind(this);
    this.submitFoodQuery = this.submitFoodQuery.bind(this);
    this.handleEnterKey = this.handleEnterKey.bind(this);
  }

  handleEnterKey(e) {
    let store = this.props.store;
    if (store.authenticated && e.key === 'Enter') {
      if (e.target.id === 'city') {
        this.submit(e);
      } else if (e.target.id === 'event') {
        this.submitEventQuery(e);
      } else if (e.target.id === 'food') {
        this.submitFoodQuery(e);
      } else if (e.target.id === 'hotel') {
        this.submitHotelQuery(e);
      }
    }
  }

  //works for input box and dropdown menu
  updateCity(event, index, value) {
    let store = this.props.store;
    let actions = this.props.actions;
    if (value && index !== 0) { //is dropdown
      this.setState({dropdown: value, open: true});
      this.setState({activeCity: store.userTrips[index - 1].city});
      this.setState({activeFromDate: store.userTrips[index - 1].fromDate, activeToDate: store.userTrips[index - 1].toDate});
      actions.updateCity('');
      actions.activateTrip(index - 1);
    } else if (index === 0) { //top option of dropdown
      this.setState({ dropdown: value });
      actions.deactivate();
    } else { //is textbox
      actions.updateCity(this.formatCity(event.target.value));
    }
  }

  //makes cities always only have a capital letter as the first char of each word
  formatCity(city) {
    const words = city.split(' ');
    let newWords = [];
    for (let word of words) {
      word = word.slice(0,1).toUpperCase().concat(word.slice(1).toLowerCase());
      newWords.push(word);
    }
    return newWords.join(' ');
  }

  //creates a new trip from the input box
  submit(event) {
    let store = this.props.store;
    let actions = this.props.actions;
    event.preventDefault();
    if (store.authenticated) {
      if (store.city !== '' && store.tripFromDate !== '' && store.tripToDate !== '') { //checks for required entries
        actions.makeNewTrip(store.username, store.city, store.userTrips.length, store.tripFromDate, store.tripToDate);
        this.setState({
          activeCity: store.city,
          open: true,
          activeFromDate: store.tripFromDate,
          activeToDate: store.tripToDate
        });
      } else {
        window.alert('Please make sure to fill in the dates and city name!');
      }
    }
  }

  /***************************** Event - search **********************************/
  updateEventQuery(event) {
    this.props.actions.updateEventQuery(event.target.value);
  }

  submitEventQuery(event) {
    let store = this.props.store;
    let actions = this.props.actions;

    event.preventDefault();  //prevent refresh, might not need this anymore
    if ((store.activeTrip.status || store.city) && store.eventQuery) {
      // let city = store.activeTrip.status ? this.state.activeCity : store.city; //lets you maybe search on a city without creating a trip
      actions.searchEvents(this.state.activeCity, store.eventQuery, this.state.activeFromDate, this.state.activeToDate);
    } else {
      window.alert('Please select a city and search terms first!');
    }
  }

  /***************************** Food - search **********************************/
  updateFoodQuery(event) {
    this.props.actions.updateFoodQuery(event.target.value);
  }

  submitFoodQuery(event) {
    let store = this.props.store;
    event.preventDefault();

    if ((store.activeTrip.status || store.city) && store.foodQuery) {
      // let city = store.activeTrip.status ? this.state.activeCity : store.city;
      this.props.actions.searchForFood(this.state.activeCity, store.foodQuery);
    } else {
      window.alert('Please select a city and search terms first!');
    }
  }
  /***************************** Hotel - search **********************************/
  updateHotelQuery(event) {
    this.props.actions.updateHotelQuery(event.target.value);
  }

  submitHotelQuery(event) {
    let store = this.props.store;
    let actions = this.props.actions;

    event.preventDefault();  //prevent refresh, might not need this anymore
    if ((store.activeTrip.status || store.city)) {
      // let city = store.activeTrip.status ? this.state.activeCity : store.city; //lets you maybe search on a city without creating a trip
      actions.searchHotels(this.state.activeCity, store.hotelQuery, this.state.activeFromDate, this.state.activeToDate);
    } else {
      window.alert('Please select a city and search terms first!');
    }
  }


  /***************************** MESSAGE *****************************/
  render() {
    let message =  '';
    let messageEvents = ''; // eslint-disable-line
    let messageFood = ''; // eslint-disable-line
    let messageHotels = ''; // eslint-disable-line
    let activeCity = this.state.activeCity;
    let store = this.props.store; //the redux store
    let actions = this.props.actions;

    if (!store.activeTrip.status) {
      message = 'Pick a city for your trip!';
      messageEvents = 'First pick a city before searching events!';
      messageFood = '';
    } else {
      message = `You're going to ${activeCity}! \n Or plan a different trip: `;
      messageEvents = `Type a keyword to find events in ${activeCity}!`; // eslint-disable-line
      messageHotels = 'Now add a hotel for your stay!'; // eslint-disable-line
      messageFood= `Or search for food in ${activeCity}!`; // eslint-disable-line
    }

    /*************************** DATE SELECTION STUFF ***************************/
    // all this probably shouldn't be in the render method but oh well
    let today = new Date();

    let formatDate = (date) => {
      // Dates need to be in YYYY-MM-DD format
      return moment(date).format('YYYY-MM-DDT00:00:00.000Z'); //<-- moment is cool library
    };

    let updateFromDate = (event, date) => { //pulls from material date pickker
      let fromDate;
      if (date !== '') {
        fromDate = formatDate(date);
      } else {
        fromDate = '';
      }

      actions.updateFromDate(fromDate); //update store

      // This sets minimum "To" date based on the current "From" date in the correct date format
      if (date !== '') {
        actions.setMinToDate(date);
      } else {
        actions.setMinToDate({});
      }

      this.setState({
        activeFromDate: fromDate
      });
    };

    const updateToDate = (event, date) => {
      let toDate;
      if (date !== '') {
        toDate = formatDate(date);
      } else {
        toDate = '';
      }
      actions.updateToDate(toDate);

      this.setState({
        activeToDate: toDate
      });
    };
    //some of this is just trying to keep this component's state and the redux store in sync which is
    //kind of bad form for redux for this component to have so much stuff
    const submitEditDates = () => {
      let city = this.state.activeCity;
      let newFromDate = store.tripFromDate;
      let newToDate = store.tripToDate;

      // updates trip dates in the db
      actions.updateTripDates(store.username, city, newFromDate, newToDate);

      store.userTrips[store.activeTrip.index].fromDate = store.tripFromDate;
      store.userTrips[store.activeTrip.index].toDate = store.tripToDate;

      this.setState({
        activeFromDate: newFromDate,
        activeToDate: newToDate,
        tempFromDate: newFromDate,
        tempToDate: newToDate,
        editDatesOpen: false
      });
    };

    /*************************** EXISTING TRIPS DROPDOWN ***************************/
    const dropdown = () => {
      if (store.authenticated) {  //logged in
        return (
          <div>
            <SelectField
              value={this.state.dropdown}
              onChange = {this.updateCity}
            >
              <MenuItem primaryText = 'Make a New Trip' />
              {store.userTrips.map((trip, index) =>
                <MenuItem
                  key = {index}
                  value = {trip.city}
                  primaryText = {trip.city}
                />
              )}
            </SelectField>
            <br />
            <RaisedButton
              onClick={() => (this.setState({ open: !this.state.open }))}
              label='Show Details'
              disabled={!store.activeTrip.status}
            />
          </div>
        );
      } else {
        return (
          <div>Please login to view your current trips!</div>
        );
      }
    };

    /*************************** TRIP DETAILS SIDEBAR ***************************/
    //edit a trip's dates modal buttons
    const editDateActions = [
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onClick={submitEditDates}
        key="submit"
      />,
      <FlatButton
        label="Cancel"
        primary={true}
        style={{marginLeft: '2%'}}
        key="cancel"
        onClick={() => {
          updateFromDate(null, '');
          updateToDate(null, '');
          this.setState({
            editDatesOpen: false,
          });
        }}
      />
    ];

    const drawer = () => {
      console.log('searchpage store', store);
      if (store.activeTrip.status) {
        let activeTrip = store.userTrips[store.activeTrip.index];
        if (activeTrip) {
          let fromDate = moment(activeTrip.fromDate).format('MM/DD/YY');
          let toDate = moment(activeTrip.toDate).format('MM/DD/YY');
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
              <div style={{
                margin: '2%',
                fontSize: 25,
                fontWeight: 'bold',
                textAlign: 'center'
              }}>
                {fromDate} - {toDate}
                <div style={{display: 'inline-block', marginLeft: '1%'}}>
                  <FlatButton
                    label="Edit"
                    onClick={() => this.setState({editDatesOpen: true})}
                    backgroundColor='transparent'
                    hoverColor='#f9f9f9'
                  />
                  <Dialog
                    title="Modify Trip Dates"
                    actions={editDateActions}
                    modal={false}
                    open={this.state.editDatesOpen}
                    onRequestClose={() => this.setState({editDatesOpen: false})}
                  >
                    <div
                      style={{color: cyan800}}
                    >Trip Dates for {this.state.activeCity}:
                    </div>

                    <div style={{
                      color: cyan900,
                      fontWeight: 'bold'
                    }}>{fromDate} - {toDate}</div>

                    <br /><br />

                    Edit your trip dates below:
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
                      minDate={store.minToDate}
                    />
                  </Dialog>
                </div>
              </div>

              {showActivityDiv('event', activeTrip)}
              <div style={tripStyle.styles.tripDetails}>
                {activeTrip.events.map((event, index) =>
                  (<Activity
                    store={store}
                    key={index}
                    sidebar = 'true'
                    type='event'
                    activity={event}
                    user={store.username}
                    city={this.state.activeCity}
                    deleteEvent={actions.deleteEvent}
                  />))}
              </div>

              {showActivityDiv('hotel', activeTrip)}
              <div style={tripStyle.styles.tripDetails}>
                {activeTrip.hotels.map((hotel, index) =>
                  (
                    <Activity
                      store={store}
                      key={index}
                      sidebar = 'true'
                      type='hotel'
                      activity={hotel}
                      user={store.username}
                      city={this.state.activeCity}
                      deleteHotel={actions.deleteHotel}
                    />))}
              </div>

              {showActivityDiv('eatin', activeTrip)}
              <div style={tripStyle.styles.tripDetails}>
                {activeTrip.eatin.map((eatin, index) =>
                  (<Activity
                    store={store}
                    key={index}
                    sidebar='true'
                    type='food'
                    user={store.username}
                    city={this.state.activeCity}
                    deleteFood={actions.deleteFood}
                    activity={eatin}
                  />))}
              </div>
            </Drawer>
          );
        }
      }
    };
    //differ for logged in and out users
    const navLinks = () => {
      if (store.authenticated) {
        return (
          <div style={theme.styles.navLinks}>
            <Link to='/'>
              <RaisedButton
                label="Home"
              />
            </Link>
            <Link to='trips'>
              <RaisedButton
                label="My Trips"
                disabled={!store.authenticated}
                style={styles.navButtons}
              />
            </Link>
            <Link to='/'>
              <RaisedButton
                disabled={!store.authenticated}
                onClick={actions.logOut}
                label='Log Out'
              />
            </Link>
          </div>
        );
      } else {
        return (
          <div style={theme.styles.navLinks}>
            <Link to= '/'>
              <RaisedButton
                style = {{marginRight: '15px'}}
                label="Home"
              />
            </Link>
            <Login
              login={actions.login}
              username={store.username}
              password={store.password}
              updateUsername={actions.updateUsername}
              updatePassword={actions.updatePassword}
            />
            <Signup
              signup={actions.signup}
              username={store.username}
              password={store.password}
              updateUsername={actions.updateUsername}
              updatePassword={actions.updatePassword}
            />
          </div>
        );
      }
    };

    /************************* ACTIVITY HEADER DIVS ******************************/
    const showActivityDiv = (activityType, trip) => {
      // If activity = event and there are events in the current trip
      if (activityType === 'event' && trip.events.length > 0) {
        return (
          <div style={tripStyle.styles.activityHeader}>Events:</div>
        );
      // If activity = eatin and there are restaurants in the current trip
      } else if (activityType === 'hotel' && trip.hotels.length > 0) {
        return (
          <div style={tripStyle.styles.activityHeader}>Hotel:</div>
        );
      } else if (activityType === 'eatin' && trip.eatin.length > 0) {
        return (
          <div style={tripStyle.styles.activityHeader}>Food:</div>
        );
      }
    };

    /*************************** WELCOME USER TEXT ***************************/
    const welcomeUser = () => {
      if (store.authenticated) {
        return (
          <div style={theme.styles.discoverTrips}>Welcome back, {store.username}!</div>
        );
      } else {
        return (
          <div style={theme.styles.discoverTrips}>Welcome!</div>
        );
      }
    };

    /************************ CREATE TRIP SEARCH BUTTON ************************/
    const searchButton = () => {
      return (
        <RaisedButton
          onClick={this.submit}
          label='Create Trip'
          disabled={!store.authenticated}
        />
      );
    };

    /*************************** STUFF ON PAGE ***************************/
    return (
      <MuiThemeProvider muiTheme={theme.muiTheme}>
        <Paper style={this.state.open === true ? {marginRight: '400px'} : {}}>
          {/************************** NAVIGATION **************************/}
          {navLinks()}
          {/******************************* HEADER *******************************/}
          <div style={theme.styles.header}>
            <Link to="/" style={{textDecoration: 'none', color: cyan900}}>
              TripTeaze
            </Link>
          </div>

          <div style={styles.welcomeUser}>{welcomeUser()}</div>

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
                <div style={styles.tripDatesCard}>
                  <div style={styles.tripDatesHeaders}>Trip Dates:</div>
                  <div>
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
                      // defaultDate={} // set default "to" date as the "from" date?
                      minDate={store.minToDate}
                    />
                  </div>
                  <br />
                  <div>
                    <div style={styles.tripDatesHeaders}> {message} </div>
                    <TextField
                      id='city'
                      value={store.city}
                      onChange={this.updateCity}
                      onKeyUp={this.handleEnterKey}
                    />
                    <br />
                    {searchButton()}
                  </div>
                </div>
              </CardText>
            </Card>
          </div>

          {/************************** EXISTING TRIPS CARD **************************/}
          <div style={styles.existingTripsCard}>
            <Card
              initiallyExpanded={true}
            >
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

          {/************************** EXPLORE SECTION **************************/}
          <div style={{marginTop: '3%'}}>
            <div style={theme.styles.discoverTrips}>Explore</div>
            {/************************** SEARCH EVENTS **************************/}
            <Paper style={styles.activityContainer}>
              <div style={styles.activityTitle}>Events</div>
              <div style={styles.searchBar}>
                <TextField
                  id = 'event'
                  onChange = {this.updateEventQuery}
                  inputStyle={{ width: '100%' }}
                  style={styles.searchInput}
                  onKeyUp={this.handleEnterKey}
                />
                <RaisedButton
                  onClick={this.submitEventQuery}
                  label='Search'
                />
              </div>

              {/************************** EVENT RESULTS **************************/}
              <div style={styles.searchResults}>
                <Events
                  store={store}
                  events={store.eventResults}
                  addEventToTrip={actions.addEventToTrip}
                  user={store.username}
                  city={this.state.activeCity}
                  eventSnackbar={store.eventSnackbar}
                  onRequestClose={actions.deactivateEventSnackbar}
                />
              </div>
            </Paper>

            {/************************** SEARCH HotelS **************************/}
            <Paper style={styles.activityContainer}>
              <div style={styles.activityTitle}>Hotels</div>
              <div style={styles.searchBar}>
                <TextField
                  id = 'hotel'
                  onChange = {this.updateHotelQuery}
                  inputStyle={{ width: '100%' }}
                  style={styles.searchInput}
                  onKeyUp={this.handleEnterKey}
                />
                <RaisedButton
                  onClick={this.submitHotelQuery}
                  label='Search'
                />
              </div>

              {/************************** Hotel RESULTS **************************/}
              <div style={styles.searchResults}>
                <Hotels
                  store={store}
                  hotels={store.hotelResults}
                  addHotelToTrip={actions.addHotelToTrip}
                  user={store.username}
                  city={this.state.activeCity}
                  hotelSnackbar={store.hotelSnackbar}
                  onRequestClose={actions.deactivateHotelSnackbar}
                />
              </div>
            </Paper>
            {/************************** SEARCH EATIN **************************/}
            <Paper style={styles.activityContainer}>
              <div style={styles.activityTitle}>Restaurants</div>
              <div style={styles.searchBar}>
                <TextField
                  id='food'
                  onChange={this.updateFoodQuery}
                  inputStyle={{ width: '100%' }}
                  style={styles.searchInput}
                  onKeyUp={this.handleEnterKey}
                />
                <RaisedButton
                  onClick={this.submitFoodQuery}
                  label='Search'
                />
              </div>

              {/************************** EATIN RESULTS **************************/}
              <div style={styles.searchResults}>
                <Eatin
                  store={store}
                  restaurants={store.foodResults}
                  addFoodToTrip={actions.addFoodToTrip}
                  user={store.username}
                  city={this.state.activeCity}
                  foodSnackbar={store.foodSnackbar}
                  onRequestClose={actions.deactivateFoodSnackbar}
                />
              </div>
            </Paper>
          </div>
        </Paper>
      </MuiThemeProvider>
    );
  }
}
//react-redux stuff

//state is the redux store
const mapStateToProps = state => (
  { store: state }
);

//dispatch is the movement of actions to the reducer
const mapDispatchToProps = dispatch => (
  { actions: bindActionCreators(actions, dispatch) }
);

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
