import React from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton/';

//onClick={() => props.deleteEvent(event,props.user,props.city)}

let Activity = (props) => {
  let cardStyle = {};
  if (props.sidebar) {
    cardStyle = { textAlign: 'left', margin: '5px'};
  } else {
    cardStyle = { textAlign: 'left', margin: '5px', width: '300px' };
  }


  
  if (props.type === 'event') {
    return (
      <Card style={cardStyle}> 
        <CardHeader title = {props.activity.name} subtitle = 'Event' />
        <CardMedia src = {props.activity.logo} alt =''>
        </CardMedia>
        <CardText>
          We don't save much detail rn
          {props.activity.date}?
          {props.activity.details}?
        </CardText>
        <CardActions>
          <FlatButton onClick={() => props.deleteEvent(event, props.user, props.city)} label='Remove' />
        </CardActions>
      </Card>
    );

  } else {  //is eatin
    return (
      <Card style={cardStyle}>
        <CardHeader title={props.activity.name} subtitle='Food' />
        <CardMedia src={props.activity.featured_image} alt=''>
        </CardMedia>
        <CardText>
          We don't save much detail rn
          {props.activity.address}?
          {props.activity.details}?
        </CardText>
        <CardActions>
          <FlatButton onClick= {() => props.deleteEvent(event,props.user,props.city)} label = 'Remove' />
        </CardActions>
      </Card>
    );
  }
}

export default Activity;