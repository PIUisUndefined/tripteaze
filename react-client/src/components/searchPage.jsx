import React from 'react';
import ReactDOM from 'react-dom';
import Events from './events.jsx';
import { connect } from 'react-redux';
import * as actions from '../actions/index.js';
import { bindActionCreators } from 'redux';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import { Link } from 'react-router-dom';
import DatePicker from 'material-ui/DatePicker';
import Toggle from 'material-ui/Toggle';
import moment from 'moment';

const SearchPage = (props) => {

  let activeCity = props.state.trips[props.state.activeTrip.index].city;
  let activeFromDate = props.state.trips[props.state.activeTrip.index].fromDate;

  const updateCity = (event, index, value) => {
    if (value) {
      props.actions.activateTrip(value);
    } else {
      props.actions.updateCity(event.target.value)
    }
  };

  const submit = (event) => {
    event.preventDefault();

    if (props.state.city !== '' && props.state.tripFromDate !== '' && props.state.tripToDate !== '') {
      props.actions.makeNewTrip(props.state.username, props.state.city, props.state.trips.length, props.state.tripFromDate, props.state.tripToDate);

    }
  };

  const updateEventQuery = (event) => {
    props.actions.updateEventQuery(event.target.value)
  };


  const submitEventQuery = (event) => {
    event.preventDefault();
    if (props.state.activeTrip.status) {
      props.actions.searchEvents(activeCity, props.state.eventQuery, activeFromDate)
    } else {
      window.alert('Please select a city for your trip first!');
    }
  };

/***************************** Food - search **********************************/
  const updateFoodQuery = (event) => {
    props.actions.updateFoodQuery(event.target.value)
  };

  const submitFoodQuery = (event) => {
    event.preventDefault();
    if(props.state.activeTrip.status) {
      props.actions.searchForFood(props.state.activeTrip.city, props.state.foodQuery)
    } else {
      window.alert('Please select a city for your trip first!')
    }
  };

/******************************************************************************/
  let message = '';
  let messageEvents = '';
  let messageFood = '';
  if (!props.state.activeTrip.status) {
    message = 'Pick a city for your trip!';
    messageEvents = 'First pick a city before searching events!';
    messageFood = '';
  } else {
    message = `You\'re going to ${props.state.activeTrip.city}! \n Or plan a different trip: `;
    messageEvents = `Type a keyword to find events in ${props.state.activeTrip.city}!`;
    messageFood= `Or search for food in ${props.state.activeTrip.city}!`;
  }
  let showEvents = '';
  if(props.state.eventResults.length !==0) {
    showEvents = <Events events={props.state.eventResults} />
  }

  let tripIndex = 0;

  const dropdown = () => {
    if(props.state.authenticated && props.state.trips.length > 0) {
      return (
        <DropDownMenu value={tripIndex} onChange = {updateCity}>
          <MenuItem value={null} primaryText='' />
          {props.state.trips.map((trip, index) => <MenuItem key = {index} value = {trip.city} primaryText = {trip.city}/>)}
        </DropDownMenu>
      );
    }
  }

  /*************************** DATE SELECTION STUFF ***************************/
  const today = new Date();

  const updateFromDate = (event, date) => {
    // Dates need to be in YYYY-MM-DD format
    let fromDate = moment(date).format('YYYY-MM-DD');
    props.actions.updateFromDate(fromDate);

    // This sets minimum "To" date based on the current "From" date in the correct date format
    props.actions.setMinToDate(date);
  }

  const updateToDate = (event, date) => {
    // Dates need to be in YYYY-MM-DD format
    let toDate = moment(date).format('YYYY-MM-DD');
    props.actions.updateToDate(toDate);
  }
  /****************************************************************************/

  return (
    <div>

      <Paper>

        <div>
          Select Your Trip Dates!
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
            minDate={props.state.minToDate} 
          />
        </div>

        {message}
        <form onSubmit = {submit}>
          <TextField id = 'city' onChange = {updateCity}/>
          <RaisedButton onClick={submit} label='Create Trip'/>
          {dropdown()}
        </form>
        {messageEvents}
        <form onSubmit = {submitEventQuery}>
          <input type='text' onChange = {updateEventQuery}/>
          <input type='submit' value='Search events for your trip!'/>
        </form>
        {messageFood}
        <form onSubmit = {submitFoodQuery}>
          <input type='test' onChange = {updateFoodQuery}/>
          <input type='submit' value='Search for Food for your trip!'/>
        </form>

      </Paper>
      <Paper>
        {showEvents}
      </Paper>
    </div>
  )
}


const mapStateToProps = state => (
  { state: state }
);

const mapDispatchToProps = dispatch => (
  { actions: bindActionCreators(actions, dispatch) }
);

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
