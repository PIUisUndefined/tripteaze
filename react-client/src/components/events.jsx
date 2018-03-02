import React from 'react';
import moment from 'moment';

import { GridList, GridTile } from 'material-ui/GridList';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import AddBorder from 'material-ui/svg-icons/content/add-circle-outline';
import Snackbar from 'material-ui/Snackbar';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    // width: '50%'
  },
  gridList: {
    width: '100%',
    height: 800,
    overflowY: 'auto',
  },
  anchor: {
    color: 'white'
  }
};

const Events = (props) => {


  if (props.events.length !== 0) {
    return (
      <div style={styles.root}>
        <GridList
          cellHeight={180}
          style={styles.gridList}
        >
          {props.events.map((event) => {
            if (event.logo) {
              return (
                <GridTile
                  key={event.id}
                  title= {<a style = {styles.anchor} href = {event.url} target = '_blank'>{event.name.text}</a>}
                  subtitle={`${moment(event.start.local).format('MM/DD/YY hh:mm A')} - ${moment(event.end.local).format('MM/DD/YY hh:mm A')}`}
                  actionIcon={<IconButton onClick= {() => props.addEventToTrip(event, props.user, props.city)}><AddBorder color="white" /></IconButton>}
                  
                >
                  <Snackbar open={props.eventSnackbar} message={'Event has been added to your trip!'} autoHideDuration={3000} onRequestClose={props.onRequestClose}/>
                  <img src={event.logo.url} alt = '' />
                </GridTile>
              );
            } else {
              return (
                <GridTile
                  key={event.id}
                  title={event.name.text}
                  subtitle='date range'
                  actionIcon={
                    <IconButton
                      onClick={() => props.addEventToTrip(event, props.user, props.city)}
                    >
                      <AddBorder color="white" />
                    </IconButton>}
                >
                  <Snackbar open={props.eventSnackbar} message={'Event has been added to your trip!'} autoHideDuration={3000} onRequestClose={props.onRequestClose}/>
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