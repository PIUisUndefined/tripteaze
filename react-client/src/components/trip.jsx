import React from 'react';
import Activity from './activity.jsx';
import RaisedButton from 'material-ui/RaisedButton';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { GridList, GridTile } from 'material-ui/GridList';
import moment from 'moment';
import { cyan50, cyan100, cyan200, cyan300, cyan400, cyan500, cyan600, cyan700, cyan800, cyan900 } from 'material-ui/styles/colors';
import * as activityStyles from './homePage.jsx';  // * does all named exports from that file

const styles = {
  activityHeader: {
    backgroundColor: '#f9f9f9',
    color: cyan600,
    fontSize: 15,
    fontWeight: 'bold',
    padding: '0.2em',
    margin: '0.5em',
    textAlign: 'left'
  },
  cityTitle: {
    color: cyan900,
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: '0 !important',
  },
  tripDetails: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tripCard: {
    display: 'inline-block',
    margin: '1em 0.5em 1em',
    width: '32%',
    verticalAlign: 'top'
  }
}

const Trip = (props) => {

  const makePublic = () => {
    props.toggleStatus(props.user, props.trip);
  }

  const deleteTrip = () => {
    console.log('delete');
    props.delete(props.user, props.trip);
  }

  if (props.editable === true) {
    return (
      <Card
        style={styles.tripCard}
        initiallyExpanded={true
      }> 
        <CardTitle
          title = {props.trip.city}
          subtitle = {moment(props.trip.fromDate).format('MM/DD/YYYY') + ' - ' + moment(props.trip.toDate).format('MM/DD/YYYY')} // Trip dates
          actAsExpander={true}
          showExpandableButton={true}
          titleStyle = {activityStyles.styles.cardTitle}
          subtitleStyle = {activityStyles.styles.cardSubtitle}
        />
        <CardText
          expandable={true}
        >
          <div style={styles.activityHeader}>Events:</div>
          <div style={styles.tripDetails}>
            {props.trip.events.map((event, index) =>
              <Activity key={index}
                delete={props.deleteEvent}
                user={props.user}
                city={props.trip.city}
                type='event' activity={event} />
            )}
          </div>

          <div style={styles.activityHeader}>Food:</div>
          <div style={styles.tripDetails}>
            {props.trip.eatin.map((food, index) =>
              <Activity key={index}
                delete={props.deleteFood}
                user={props.user}
                city={props.trip.city}
                type='eatin' activity={food} />
            )}
          </div>
        </CardText>

        <CardActions>
          <FlatButton label = 'Make Public' onClick = {makePublic} />
          <FlatButton label= 'Delete' onClick = {deleteTrip} />
        </CardActions>
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
          <div style={styles.activityHeader}>Events:</div>
          <div style={styles.tripDetails}>
            {props.trip.events.map((event, index) =>
              <Activity
                key={index}
                type='event'
                activity={event}
              />
            )}
          </div>
          
          <div style={styles.activityHeader}>Food:</div>
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