import React from 'react';
import moment from 'moment';

import { GridList, GridTile } from 'material-ui/GridList';
// import Subheader from 'material-ui/Subheader';
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
//these are search results for hotels
const Hotels = (props) => {

  if (props.hotels.length !== 0) {
    return (
      <div style={styles.root}>
        <GridList
          cellHeight={180}
          style={styles.gridList}
        >
          {props.hotels.map((hotel) => {
            if (hotel.icon) {
              return (
                <GridTile
                  key={hotel.id}
                  title={<a style={styles.anchor} href={hotel.url} target='_blank'>{hotel.name}</a>}
                  // subtitle={`${moment(hotel.start.local).format('MM/DD/YY hh:mm A')} - ${moment(hotel.end.local).format('MM/DD/YY hh:mm A')}`}
                  actionIcon={
                    <IconButton
                      onClick={
                        () => props.addHotelToTrip(hotel, props.store.userTrips[props.store.activeTrip.index].id)
                      }>
                      <AddBorder color="white" />
                    </IconButton>}
                >
                  <Snackbar
                    open={props.hotelSnackbar}
                    message={'Hotel has been added to your trip!'}
                    autoHideDuration={3000}
                    onRequestClose={props.onRequestClose}
                  />
                  <img src={hotel.icon} alt='' />
                </GridTile>
              );
            } else {
              return (
                <GridTile
                  key={hotel.id}
                  title={hotel.name}
                  subtitle='date range'
                  actionIcon={
                    <IconButton
                      onClick={() => props.addHotelToTrip(hotel, props.store.userTrips[props.store.activeTrip.index].id)}
                    >
                      <AddBorder color="white" />
                    </IconButton>
                  }
                >
                  <Snackbar
                    open={props.hotelSnackbar}
                    message={'Hotel has been added to your trip!'}
                    autoHideDuration={3000}
                    onRequestClose={props.onRequestClose}
                  />
                  <img src='' />
                </GridTile>
              );
            }
          })}
        </GridList>
      </div>
    );
  } else {
    return null;
  }
};

export default Hotels;
