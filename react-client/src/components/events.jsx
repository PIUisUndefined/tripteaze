import React from 'react';
import moment from 'moment';

import { GridList, GridTile } from 'material-ui/GridList';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import AddBorder from 'material-ui/svg-icons/content/add-circle-outline';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '50%'
  },
  gridList: {
    width: '100%',
    height: 600,
    overflowY: 'auto',
  },
  anchor: {
    color: 'white'
  }
};
//{moment(event.start.local).format('MM/DD/YY hh:mm A')} - { moment(event.end.local).format('MM/DD/YY hh:mm A')}
const Events = (props) => {
  if (props.events.length !== 0) {
    return (
      <div style={styles.root}>
        <GridList
          cellHeight={180}
          style={styles.gridList}
        >
          <Subheader>Events</Subheader>
          {props.events.map((event) => {
            if (event.logo) {
              return (
                <GridTile
                  key={event.id}
                  title= {<a style = {styles.anchor} href = {event.url} target = '_blank'>{event.name.text}</a>}
                  subtitle= 'date range'
                  actionIcon={<IconButton onClick= {() => props.addEventToTrip(event, props.user, props.city)}><AddBorder color="white" /></IconButton>}
                >
                  <img src={event.logo.url} alt = '' />
                </GridTile>
              );
            } else {
              return (
                <GridTile
                  key={event.id}
                  title={event.name.text}
                  subtitle='date range'
                  actionIcon={<IconButton onClick={() => props.addEventToTrip(event, props.user, props.city)}><AddBorder color="white" /></IconButton>}
                >
                  <img src='' />
                </GridTile>
              )
            }
          })}
        </GridList>
      </div>
    );
  } else {
    return null;
  }
}

export default Events;