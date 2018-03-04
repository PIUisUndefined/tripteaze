import React from 'react';
import Activity from './activity.jsx';
import RaisedButton from 'material-ui/RaisedButton';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { GridList, GridTile } from 'material-ui/GridList';
import moment from 'moment';
import { cyan50, cyan100, cyan200, cyan300, cyan400, cyan500, cyan600, cyan700, cyan800, cyan900 } from 'material-ui/styles/colors';
import * as activityStyles from './homePage.jsx';  // * does all named exports from that file
import Snackbar from 'material-ui/Snackbar';

export const styles = {
  activityHeader: {
    backgroundColor: '#f9f9f9',
    color: cyan600,
    fontSize: 15,
    fontWeight: 'bold',
    padding: '0.2em',
    margin: '0.5em',
    textAlign: 'left'
  },
  cardSubtitle: {
    color: cyan600
  },
  cardTitle: {
    color: cyan900,
    fontWeight: 'bold'
  },
  cityTitle: {
    color: cyan900,
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: '0 !important'
  },
  tripDetails: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  tripCard: {
    display: 'inline-block',
    margin: '1em 0.5em 1em',
    width: '32%',
    verticalAlign: 'top'
  }
}

// User's trips page
const Trip = (props) => {

  // Makes user's trip public
  const makePublic = () => {
    props.toggleStatus(props.user, props.trip);
  }

  // Deletes a trip
  const deleteTrip = () => {
    props.delete(props.user, props.trip);
  }

  const activateAndSearch = () => {
    props.activate(props.index);
    props.toSearchPage();
  }

  // Activity header divs based on if there are events or restaurants on the trip
  const showActivityDiv = (activityType, trip) => {
    // If activity = event and there are events in the current trip
    if (activityType === 'event' && trip.events.length > 0) {
      return (
        <div style={styles.activityHeader}>Events:</div>
      )
    // If activity = eatin and there are restaurants in the current trip
    } else if (activityType === 'eatin' && trip.eatin.length > 0) {
      return (
        <div style={styles.activityHeader}>Food:</div>
      )
    }
  }

  // Renders list of user's current trips
  if (props.editable === true) {
    let fromDate =moment(props.trip.fromDate).add(1, 'days').format('MM/DD/YY');
    let toDate = moment(props.trip.toDate).add(1, 'days').format('MM/DD/YY');
    return (
      <Card
        style={styles.tripCard}
        initiallyExpanded={true}
      > 
        <CardTitle
          title = {props.trip.city}
          subtitle = {fromDate + ' - ' + toDate} // Trip dates
          actAsExpander={true}
          showExpandableButton={true}
          titleStyle = {styles.cardTitle}
          subtitleStyle = {styles.cardSubtitle}
        />
        <CardText
          expandable={true}
        >
          {showActivityDiv('event', props.trip)}
          <div style={styles.tripDetails}>
            {props.trip.events.map((event, index) =>
              <Activity key={index}
                deleteEvent={props.deleteEvent}
                user={props.user}
                city={props.trip.city}
                type='event'
                activity={event}
              />
            )}
          </div>
          
          {showActivityDiv('eatin', props.trip)}
          <div style={styles.tripDetails}>
            {props.trip.eatin.map((food, index) =>
              <Activity key={index}
                deleteFood={props.deleteFood}
                user={props.user}
                city={props.trip.city}
                type='eatin'
                activity={food}
              />
            )}
          </div>
        </CardText>

        <CardActions>
          <FlatButton
            label = 'Make Public'
            onClick = {makePublic}
          />
          <FlatButton
            label= 'Delete'
            onClick = {deleteTrip}
          />
          <FlatButton
            label = 'Add More'
            onClick = {activateAndSearch}
          />
        </CardActions>

        <Snackbar open={props.deleteSnackbar} message={'Your trip has been deleted!'} autoHideDuration={3000} onRequestClose={props.onRequestCloseDelete}/>
        <Snackbar open={props.publicSnackbar} message={'Your trip has been made public!'} autoHideDuration={3000} onRequestClose={props.onRequestClosePublic}/>
      </Card>
    ); 
  } else {
    return (
      <Card
        style={styles.tripCard}
        initiallyExpanded={true}
      >
        <CardTitle
          title={props.trip.city}
          titleStyle={styles.cityTitle}
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText
          expandable={true}
        >
          {showActivityDiv('event', props.trip)}
          <div style={styles.tripDetails}>
            {props.trip.events.map((event, index) =>
              <Activity
                key={index}
                type='event'
                activity={event}
              />
            )}
          </div>
          
          {showActivityDiv('eatin', props.trip)}
          <div style={styles.tripDetails}>
            {props.trip.eatin.map((food, index) =>
              <Activity
                key={index}
                type='eatin'
                activity={food}
              />
            )}
          </div>
        </CardText>
      </Card>
    )
  }
}
 
export default Trip;