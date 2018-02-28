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

import * as actions from '../actions/index.js';
import Activity from './activity.jsx';
import Events from './events.jsx';
import Eatin from './restaurants.jsx';

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

/******************************************************************************/

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
  /****************************************************************************/

    const dropdown = () => {
      if(state.authenticated && state.trips.length > 0) {
        return (
          <div>
            <SelectField 
              floatingLabelText="Existing Trips" 
              value={this.state.dropdown} 
              onChange = {this.updateCity.bind(this)}
            > 
              <MenuItem value = ' ' primaryText = 'Make a New Trip' />
              {state.trips.map((trip, index) => 
                <MenuItem key = {index} value = {trip.city} primaryText = {trip.city} 
              />)}
            </SelectField>
            <RaisedButton
              onClick={() => (this.setState({ open: !this.state.open }))}
              label='Show Details'
              disabled={!state.activeTrip.status}
            />
          </div>
        );
      }
    }

    const drawer = () => {
      if (state.activeTrip.status) {
        let activeTrip = state.trips[state.activeTrip.index]; 
        if (activeTrip) {
          return (
            <Drawer width={400} openSecondary={true} open={this.state.open} >
              <AppBar title={this.state.activeCity}
                iconElementLeft={<IconButton onClick={() => (this.setState({ open: false }))} ><NavigationClose /></IconButton>}
              />
              {activeTrip.events.map((event, index) => 
                (<Activity key={index} sidebar = 'true'
                  type='event' activity={event} delete={actions.deleteEvent} />))}
              {activeTrip.eatin.map((eatin, index) => 
                (<Activity key={index} sidebar='true'
                  type='food' activity={eatin} />))}
            </Drawer>
          );
        }
      }
    }
  
    return (
      <div>
        <Link to= 'trips'> UserPage </Link>
        {drawer()}
        <Paper style = {{display: 'flex', flexFlow: 'row wrap', margin: '10px'}}>
          <div style= {{ display: 'flex', flexFlow: 'column wrap' }}>
            <h5> Select Your Trip Dates! </h5>
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
              <TextField id='city' value={this.props.state.city} onChange={this.updateCity.bind(this)} />
              <RaisedButton onClick={this.submit.bind(this)} label='Create Trip' disabled={!this.props.state.authenticated} />
            </div>
          </div>
          {dropdown()}
        </Paper>
        
        <Paper style={{ display: 'flex', flexFlow: 'row wrap', margin: '10px' }}>
          <h4 style = {{width: '100%'}}> {message} </h4>
          <div>
            <TextField id = 'event' onChange = {this.updateEventQuery.bind(this)}/>
            <RaisedButton 
              onClick={this.submitEventQuery.bind(this)} 
              label='Search Events' 
              />
          </div>
          <div>
            <TextField id='food' onChange={this.updateFoodQuery.bind(this)} />
            <RaisedButton 
              onClick={this.submitFoodQuery.bind(this)} 
              label='Search Food'              
              />
          </div>
        </Paper>
        
        <Paper style={{ display: 'flex', flexFlow: 'row', margin: '10px' }}>
          <Events
            events={state.eventResults}
            addEventToTrip={actions.addEventToTrip}
            user={state.username}
            city={this.state.activeCity}
          />
          <Eatin
            restaurants={state.foodResults}
            addFoodToTrip={actions.addFoodToTrip}
            user={state.username}
            city={this.state.activeCity}
          />
        </Paper>
      </div>
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
