import React from 'react';

import Activity from './activity.jsx';

import RaisedButton from 'material-ui/RaisedButton';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import moment from 'moment';

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
      <Card style = {{margin: '10px'}}> 
        <CardTitle
          title = {props.trip.city}
          subtitle = {moment(props.trip.fromDate).format('MM/DD/YYYY') + ' - ' + moment(props.trip.toDate).format('MM/DD/YYYY')}
        />
        <CardText>
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
            {props.trip.events.map((event, index) =>
              <Activity key={index}
                type='event' activity={event} />
            )}
          </div>
          <div style={{ display: 'flex', flexFlow: 'row wrap' }}>
            {props.trip.eatin.map((food, index) =>
              <Activity key={index}
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

    // we should eventually add a pic as 'cardMedia'
  } else {
    return (
      <Card>
        <CardTitle title={props.trip.city} />
        <CardText>
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
            {props.trip.events.map((event, index) =>
              <Activity key={index}
                type='event' activity={event} />
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
            {props.trip.eatin.map((food, index) =>
              <Activity key={index}
                type='eatin' activity={food} />
            )}
          </div>
        </CardText>
      </Card>
    )
  }
}
 
export default Trip;