import React from 'react';

import { GridList, GridTile } from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import AddBorder from 'material-ui/svg-icons/content/add-circle-outline';
import Snackbar from 'material-ui/Snackbar';

//these are search results for restaurants
const Eatin = (props) => {
  // console.log('props', props);
  // console.log('store', props.store);
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

  if (props.restaurants.length !== 0) {
    return (
      <div style={styles.root}>
        <GridList
          cellHeight={180}
          style={styles.gridList}
        >
          {props.restaurants.map((food) => {
            if (food.restaurant.featured_image) {
              return (
                <GridTile
                  key={food.restaurant.id}
                  title= {
                    <a
                      style={styles.anchor}
                      href={food.restaurant.url}
                      target="_blank"
                    >{food.restaurant.name}</a>
                  }
                  subtitle= {`Cost for Two $${food.restaurant.average_cost_for_two}`}
                  /*add props.tripId*/
                  actionIcon={
                    <IconButton
                      onClick={
                        () => props.addFoodToTrip(food, props.store.userTrips[props.store.activeTrip.index].id)
                      }><AddBorder color="white" /></IconButton>}
                >
                  <Snackbar
                    open={props.foodSnackbar}
                    message={'Restaurant has been added to your trip!'}
                    autoHideDuration={3000}
                    onRequestClose={props.onRequestClose}
                  />
                  <img src={food.restaurant.featured_image} alt='' />
                </GridTile>
              );
            } else {
              return (
                <GridTile
                  key={food.restaurant.id}
                  title={food.restaurant.name}
                  subtitle={`Cost for Two $${food.restaurant.average_cost_for_two}`}
                  actionIcon={
                    <IconButton
                      onClick={
                        () => props.addFoodToTrip(food, props.store.userTrips[props.store.activeTrip.index].id)
                      }
                    ><AddBorder color="white" /></IconButton>}
                >
                  <Snackbar
                    open={props.foodSnackbar}
                    message={'Restaurant has been added to your trip!'}
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

export default Eatin;
