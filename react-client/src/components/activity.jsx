import React from 'react';

import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton/';
import { cyan50, cyan100, cyan200, cyan300, cyan400, cyan500, cyan600, cyan700, cyan800, cyan900 } from 'material-ui/styles/colors';
import moment from 'moment';

//onClick={() => props.deleteEvent(event,props.user,props.city)}

export const styles = {
  anchor: {
    color: cyan700,
    textDecoration: 'none'
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: '0 !important'
  },
  cardSubtitle: {
    color: cyan500,
    fontSize: 12
  }
}

let Activity = (props) => {
  let cardStyle = {};
  if (props.sidebar) {
    cardStyle = { textAlign: 'left', margin: '5px'};
  } else {
    cardStyle = {
      textAlign: 'left',
      width: '45%',
      margin: '0 2% 3% 2%',
    };
  }
  
  if (props.type === 'event') {
    return (
      <Card style={cardStyle}> 
        <CardMedia>
          <img src={props.activity.logo} alt =''/>
        </CardMedia>

        <CardTitle
          title = {
            <a
              href={props.activity.url}
              target='_blank'
              style={styles.anchor}
            >{props.activity.name}</a>
          }
          subtitle = {moment(props.activity.start_time).format('MM/DD/YYYY')}
          titleStyle = {styles.cardTitle}
          subtitleStyle = {styles.cardSubtitle}
        />

        <CardText>
          {props.activity.details}
        </CardText>

        <CardActions>
          <FlatButton onClick={() => props.delete(props.activity, props.user, props.city)} label='Remove' />
        </CardActions>
      </Card>
    );

  } else {  //is eatin
    return (
      <Card style={cardStyle}>
        <CardMedia>
          <img src={props.activity.logo} alt =''/>
        </CardMedia>

        <CardTitle
          title = {
            <a
              href={props.activity.url}
              target='_blank'
              style={styles.anchor}
            >{props.activity.name}</a>
          }
          // subtitle='Food'
          titleStyle = {styles.cardTitle}
          subtitleStyle = {styles.cardSubtitle}
        />

        <CardText>
          {props.activity.address}
          {props.activity.details}
        </CardText>

        <CardActions>
          <FlatButton onClick= {() => props.delete(props.activity,props.user,props.city)} label = 'Remove' />
        </CardActions>
      </Card>
    );
  }
}

export default Activity;