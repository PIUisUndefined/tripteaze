import React from 'react';
import Activity from './activity.jsx';
import { Card, CardActions, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import moment from 'moment';
import { cyan600, cyan900 } from 'material-ui/styles/colors';
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
};

// User's trips page
const Trip = (props) => {

  // Makes user's trip public
  const makePublic = () => {
    props.toggleStatus(props.user, props.trip);
  };

  // Deletes a trip
  const deleteTrip = () => {
    props.delete(props.user, props.trip);
  };

  const activateAndSearch = () => {
    props.activate(props.index);
    props.toSearchPage();
  };

  //const message = props.trip.isPublic ? 'Your trip has been made private!' : 'Your trip has been made public!';

  // Activity header divs based on if there are events or restaurants on the trip
  const showActivityDiv = (activityType, trip) => {
    // If activity = event and there are events in the current trip
    if (activityType === 'event' && trip.events.length > 0) {
      return (
        <div style={styles.activityHeader}>Events:</div>
      );
    // If activity = eatin and there are restaurants in the current trip
    } else if (activityType === 'hotel' && trip.events.length > 0) {
      return (
        <div style={styles.activityHeader}>Hotel:</div>
      );
    // If activity = eatin and there are restaurants in the current trip
    } else if (activityType === 'eatin' && trip.eatin.length > 0) {
      return (
        <div style={styles.activityHeader}>Food:</div>
      );
    }
  };

  // Renders list of user's current trips
  if (props.editable === true) {
    let fromDate =moment(props.trip.fromDate).format('MM/DD/YY');
    let toDate = moment(props.trip.toDate).format('MM/DD/YY');
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
                store={props.store}
                deleteEvent={props.deleteEvent}
                user={props.user}
                city={props.trip.city}
                type='event'
                activity={event}
              />
            )}
          </div>

          {showActivityDiv('hotel', props.trip)}
          <div style={styles.tripDetails}>
            {props.trip.hotels.map((hotel, index) =>
              <Activity
                store={props.store}
                key={index}
                deleteHotel={props.deleteHotel}
                user={props.user}
                city={props.trip.city}
                type='hotel'
                activity={hotel}
              />
            )}
          </div>

          {showActivityDiv('eatin', props.trip)}
          <div style={styles.tripDetails}>
            {props.trip.eatin.map((food, index) =>
              <Activity key={index}
                store={props.store}
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
            label = {props.trip.isPublic ? 'Make Private' : 'Make Public'}
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

        {/* HAD TO ADD OR FALSE BECAUSE THEY WERE UNDEFINED */}
        <Snackbar
          open={props.deleteSnackbar || false}
          message={'Your trip has been deleted!'}
          autoHideDuration={3000}
          onRequestClose={props.onRequestCloseDelete}
        />
        <Snackbar
          open={props.publicSnackbar || false}
          message={'Your trip has been made public!'}
          autoHideDuration={3000}
          onRequestClose={props.onRequestClosePublic}
        />
        <Snackbar
          open={props.privateSnackbar || false}
          message={'Your trip has been made private!'}
          autoHideDuration={3000}
          onRequestClose={props.onRequestClosePrivate}
        />
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

          {showActivityDiv('hotel', props.trip)}
          <div style={styles.tripDetails}>
            {props.trip.hotels.map((hotel, index) =>
              <Activity
                key={index}
                type='hotel'
                activity={hotel}
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
    );
  }
};

export default Trip;
