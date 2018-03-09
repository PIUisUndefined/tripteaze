import React from 'react';

import moment from 'moment';

import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton/';
// import { cyan50, cyan100, cyan200, cyan300, cyan400, cyan500, cyan600, cyan700, cyan800, cyan900 } from 'material-ui/styles/colors';
import { cyan500, cyan700, cyan800, cyan900 } from 'material-ui/styles/colors';

export const styles = {
  anchor: {
    color: cyan700,
    textDecoration: 'none'
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    lineHeight: '0 !important'
  },
  cardSubtitle: {
    color: cyan500,
    fontSize: 13
  }
};

let Activity = (props) => {
  let cardStyle = {};
  console.log('props.key', props.key);
  // console.log('activity props.store', props.store);
  if (props.sidebar) {
    cardStyle = { textAlign: 'left', margin: '5px'};
  } else {
    cardStyle = {
      textAlign: 'left',
      width: '45%',
      margin: '0 2% 3% 2%',
    };
  }

  // Remove buttons should only appear on a user's trips page
  let showRemoveButton = (activity) => {
    if (props.user) {
      if (activity === 'event') {
        return (
          <CardActions>
            <FlatButton
              onClick={() => props.deleteEvent(props.activity,props.store.userTrips[props.store.activeTrip.index].id)}
              label='Remove'
            />
          </CardActions>
        );
      } else if (activity === 'eatin') {
        return (
          <CardActions>
            <FlatButton
              onClick= {() => props.deleteFood(props.activity,props.store.userTrips[props.store.activeTrip.index].id)}
              label = 'Remove'
            />
          </CardActions>
        );
      } else if (activity === 'hotel') {
        return (
          <CardActions>
            <FlatButton
              onClick= {() => props.deleteHotel(props.activity, props.store.userTrips[props.store.activeTrip.index].id)}
              label = 'Remove'
            />
          </CardActions>
        );
      }
    }
  };

  // Converts price to dollar signs for restaurants
  let calcDollarSigns = (price) => {
    let dollarSigns = '';
    for (let i = 0; i < price; i++) {
      dollarSigns += '$';
    }
    return dollarSigns;
  };

  // Renders activities shown on page
  if (props.type === 'event') {
    let fromDate = moment(props.activity.start_time).format('MM/DD/YY');
    let startTime = moment(props.activity.start_time).format('h:mm A');

    let toDate = moment(props.activity.end_time).format('MM/DD/YY');
    let endTime = moment(props.activity.start_time).format('h:mm A');

    let cardSubtitle = `${fromDate} ${startTime} - ${toDate} ${endTime}`;

    // If start/end dates are the same
    if (fromDate === toDate) {
      // And if start/end times are the same
      if (startTime === endTime) {
        // Show only the start date/time
        cardSubtitle = `${fromDate} @ ${startTime}`;
      } else {
        // Else show the start/end time
        cardSubtitle = `${fromDate} from ${startTime} - ${endTime}`;
      }
    }

    return (
      <Card style={cardStyle}>
        <CardMedia>
          <img src={props.activity.logo} alt ='' />
        </CardMedia>

        <CardTitle
          title = {
            <a
              href={props.activity.url}
              target='_blank'
              style={styles.anchor}
            >{props.activity.name}</a>
          }
          subtitle = {cardSubtitle}
          titleStyle = {styles.cardTitle}
          subtitleStyle = {styles.cardSubtitle}
        />

        <CardHeader
          showExpandableButton={true}
          actAsExpander={true}
          title="More..."
          titleStyle={{
            color: cyan700,
            fontSize: 12,
            fontWeight: 'bold',
            lineHeight: '0 !important',
          }}
          style={{
            fontSize: 12,
            lineHeight: '0 !important'
          }}
        />

        <CardText
          style={{
            color: cyan800,
            fontSize: 12
          }}
          expandable={true}
        >
          <div style={{
            backgroundColor: '#f9f9f9',
            color: cyan900,
            fontWeight: 'bold',
            padding: '1%'
          }}>About:</div>
          <div style={{
            color: cyan800,
            fontSize: 11,
            maxHeight: '250px',
            overflow: 'auto',
            padding: '1%'
          }}>{props.activity.description}</div>
        </CardText>

        {/*********** Renders the remove button if user is logged in ***********/}
        {showRemoveButton('event')}
      </Card>
    );

  } else if (props.type === 'hotel') {
    let fromDate = moment(props.activity.start_time).format('MM/DD/YY');
    let startTime = moment(props.activity.start_time).format('h:mm A');

    let toDate = moment(props.activity.end_time).format('MM/DD/YY');
    let endTime = moment(props.activity.start_time).format('h:mm A');

    let cardSubtitle = `${fromDate} ${startTime} - ${toDate} ${endTime}`;

    // If start/end dates are the same
    if (fromDate === toDate) {
      // And if start/end times are the same
      if (startTime === endTime) {
        // Show only the start date/time
        cardSubtitle = `${fromDate} @ ${startTime}`;
      } else {
        // Else show the start/end time
        cardSubtitle = `${fromDate} from ${startTime} - ${endTime}`;
      }
    }

    return (
      <Card style={cardStyle}>
        <CardMedia>
          <img src={props.activity.logo} alt ='' />
        </CardMedia>

        <CardTitle
          title = {
            <a
              href={props.activity.url}
              target='_blank'
              style={styles.anchor}
            >{props.activity.name}</a>
          }
          subtitle = {cardSubtitle}
          titleStyle = {styles.cardTitle}
          subtitleStyle = {styles.cardSubtitle}
        />

        <CardHeader
          showExpandableButton={true}
          actAsExpander={true}
          title="More..."
          titleStyle={{
            color: cyan700,
            fontSize: 12,
            fontWeight: 'bold',
            lineHeight: '0 !important',
          }}
          style={{
            fontSize: 12,
            lineHeight: '0 !important'
          }}
        />

        <CardText
          style={{
            color: cyan800,
            fontSize: 12
          }}
          expandable={true}
        >
          <div style={{
            backgroundColor: '#f9f9f9',
            color: cyan900,
            fontWeight: 'bold',
            padding: '1%'
          }}>About:</div>
          <div style={{
            color: cyan800,
            fontSize: 11,
            maxHeight: '250px',
            overflow: 'auto',
            padding: '1%'
          }}>{props.activity.description}</div>
        </CardText>

        {/*********** Renders the remove button if user is logged in ***********/}
        {showRemoveButton('hotel')}
      </Card>
    );

  } else {  //is eatin
    return (
      <Card style={cardStyle}>
        <CardMedia>
          <img src={props.activity.logo} alt ='' />
        </CardMedia>

        <CardTitle
          title = {
            <a
              href={props.activity.url}
              target='_blank'
              style={styles.anchor}
            >{props.activity.name}</a>
          }

          subtitle={calcDollarSigns(props.activity.price)}
          titleStyle = {styles.cardTitle}
          subtitleStyle = {styles.cardSubtitle}
        />

        <CardText>
          <div style={{ color: cyan800, fontSize: 11 }}>
            {props.activity.address}
          </div>
        </CardText>

        {/*********** Renders the remove button if user is logged in ***********/}
        {showRemoveButton('eatin')}
      </Card>
    );
  }
};

export default Activity;
