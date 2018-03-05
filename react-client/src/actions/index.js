import axios from 'axios';

////////////////////////////////HOME PAGE STUFF\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
const loading = () => ({type: 'TOGGLE_LOADING'});

const setUserTrips = (trips) => ({ type: 'SHOW_USER_TRIPS', payload: trips});

const setPublicTrips = (trips) => ({ type: 'SHOW_PUBLIC_TRIPS', payload: trips});

export const updateUsername = (username) => ({ type: 'UPDATE_USERNAME', payload: username });

export const updatePassword = (password) => ({ type: 'UPDATE_PASSWORD', payload: password });

export const login = (username, password) => {
  return (dispatch) => {
    return axios({
      method: 'get',
      url: '/login',
      params: {
        username: username,
        password: password
      }
    }).then(
      results => {
        if (results.data.error) {
          alert(results.data.message);
        } else {
          dispatch(authenticate())
          dispatch(fetchTrips(username));
        }
      },
      error => { console.log('error', error); dispatch(badStuff(error)) }
    );
  }
};

export const signup = (username, password) => {
  return (dispatch) => {
    return axios({
      method: 'post',
      url: '/signup',
      data: {
        username: username,
        password: password
      }
    }).then(
      results => {
        if (results.data.error) {
          alert(results.data.message);
        } else {
          dispatch(authenticate());
        }
      },
      error => dispatch(badStuff(error))
    );
  };
}

export const authenticate = () => ({ type: 'AUTHEN' });

export const logOut = () => {
  return (dispatch) => {
    return axios({
      method: 'get',
      url: 'logout',
    }).then(
      results => {
        dispatch(deauthenticate());
      }
    )
  }
}

export const deauthenticate = () => ({ type: 'LOGOUT' });

export const badStuff = (error) => ({type: 'ERROR', payload: error});

/////////////////////////////SEARCH PAGE STUFF \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

/*****************************MAKE A TRIP *************************************/
export const fetchTrips = (param) => {
  return (dispatch) => {
    dispatch(loading());
    return axios({
      method: 'get',
      url: '/trips',
      params: {
        search: param
      }
    }).then(
      results => {
        if (param === 'public') {
          dispatch(setPublicTrips(results.data.trips));
          dispatch(loading());
        } else {
          dispatch(setUserTrips(results.data.trips));
          dispatch(loading());
        }
      },
      error => dispatch(badStuff(error))
    );
  }
};

export const updateTripDates = (user, city, fromDate, toDate) => {
  return dispatch => {
    return axios({
      method: 'patch',
      url: '/plan',
      data: {
        user: user,
        tripCity: city,
        tripFromDate: fromDate,
        tripToDate: toDate
      }
    }).then(
      results => {
        dispatch(updateFromDate(''));
        dispatch(updateToDate(''));
        dispatch(setMinToDate({}));
      },
      error => dispatch(badStuff(error))
    )
  }
}

export const updateFromDate = (date) => ({ type: 'UPDATE_TRIP_FROM_DATE', payload: date });

export const updateToDate = (date) => ({ type: 'UPDATE_TRIP_TO_DATE', payload: date });

export const setMinToDate = (date) => ({ type: 'SET_MIN_TO_DATE', payload: date });

export const updateCity = (city) => ({ type: 'UPDATE_CITY', payload: city });

export const makeNewTrip = (username, city, index, fromDate, toDate) => {
  return (dispatch) => {

    return axios({
      method: 'post',
      url: '/trips',
      data: {
        tripUser: username,
        tripCity: city,
        tripFromDate: fromDate,
        tripToDate: toDate
      }
    }).then(
      results => {
        dispatch(activateTrip(index));
        dispatch(fetchTrips(username));
        dispatch(makePrivate());
        dispatch(updateCity(''));
        dispatch(updateToDate(''));
        dispatch(setMinToDate({}));
        dispatch(updateFromDate(''));
      },
        error => dispatch(badStuff(error))
    );
  };
}


export const activateTrip = (tripIndex) => {
  //return { type: 'ACTIVATE', payload: tripIndex }
  return (dispatch) => {
    dispatch(updateFoodResults([]));
    dispatch(updateEventResults([]));
    dispatch(actuallyActivate(tripIndex));
  }
};

const actuallyActivate = (tripIndex) => ({ type: 'ACTIVATE', payload: tripIndex });

export const deactivate = () => {
  return (dispatch) => {
    dispatch(updateFoodResults([]));
    dispatch(updateEventResults([]));
    dispatch(actuallyDeactivate());
  }
};

const actuallyDeactivate = () => ({ type: 'DEACTIVATE' });

/***************************** EVENTS *************************************/

export const updateEventQuery = (query) => ({ type: 'UPDATE_EVENT_QUERY', payload: query });

export const searchEvents = (city, query, fromDate, toDate) => {
  return (dispatch) => {
    return axios({
      method: 'post',
      url: '/events',
      data: {
        tripCity: city,
        eventQuery: query,
        tripFromDate: fromDate,
        tripToDate: toDate
      }
    }).then(
      results => (dispatch(updateEventResults(results.data))),
      error => dispatch(badStuff(error))
    );
  };
}

const updateEventResults = (searchResults) => ({ type: 'UPDATE_EVENT_RESULTS', payload: searchResults });

export const addEventToTrip = (event, username, city) => {
  return (dispatch) => {
    return axios({
      method: 'post',
      url: '/events/add',
      data: {
        tripEvent: event,
        tripUser: username,
        tripCity: city
      }
    }).then(
      results => { 
        dispatch(fetchEventsFromTrip(username, city));
        dispatch(activateEventSnackbar());
      },
      error => dispatch(badStuff(error))
    );
  };
}

export const fetchEventsFromTrip = (username, city) => {
  //dispatch({ type: 'LOADING' });	
  return (dispatch) => {
    return axios({	
      method: 'get',
        url: '/events',
        params: {	
          tripUser: username,
          tripCity: city	
        }
      }).then(
        results => {dispatch(setTripEvents(results.data.events))},
        error => {dispatch(badStuff(err))}
      )
  }
}

const setTripEvents = (events) => ({ type: 'REFRESH_TRIP_EVENTS', payload: events });

export const activateEventSnackbar = () => ({type: 'ACTIVATE_EVENT_SNACKBAR'});

export const deactivateEventSnackbar = () => ({type: 'DEACTIVATE_EVENT_SNACKBAR'});

/***************************** FOOD *************************************/

export const updateFoodQuery = (query) => ({ type: 'UPDATE_FOOD_QUERY', payload: query });

export const searchForFood = (city, query) => {
  return (dispatch) => {
    return axios({
      method: 'post',
      url: '/foods',
      data: {
        tripCity: city,
        foodQuery: query
      }
    }).then(
      results => {
        dispatch(updateFoodResults(results.data.foods))},
      error => dispatch(badStuff(error))
    )
  }
}
  
const updateFoodResults = (searchResults) => ({ type: 'UPDATE_FOOD_RESULTS', payload: searchResults})

export const addFoodToTrip = (food, username, city) => {
  return (dispatch) => {
    return axios({
      method: 'post',
      url: '/foods/add',
      data: {
        tripFood: food,
        tripUser: username,
        tripCity: city
      }
    }).then(
      results => { 
        dispatch(fetchFoodFromTrip(username, city));
        dispatch(activateFoodSnackbar());
      },
      error => dispatch(badStuff(error))
    );
  };
}

export const fetchFoodFromTrip = (username, city) => {
  //dispatch({ type: 'LOADING' });	
  return (dispatch) => {
    return axios({
      method: 'get',
      url: '/foods',
      params: {
        tripUser: username,
        tripCity: city
      }
    }).then(
      results => { 
        dispatch(setTripEatin(results.data.foods)) },
      error => { dispatch(badStuff(err)) }
    )
  }
}

const setTripEatin = (foods) => ({ type: 'REFRESH_TRIP_EATIN', payload: foods });

export const activateFoodSnackbar = () => ({type: 'ACTIVATE_FOOD_SNACKBAR'});

export const deactivateFoodSnackbar = () => ({type: 'DEACTIVATE_FOOD_SNACKBAR'});

//////////////////////////////USER PAGE STUFF \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

export const deleteTrip = (user, trip) => {
  return (dispatch) => {
    return axios ({
      method: 'patch',
      url: '/trips',
      data: {
        username: user,
        tripID: trip.id
      }
    }).then (
      results => {
        dispatch(fetchTrips(user));
        dispatch(activateDeleteSnackbar());
      },
      error => dispatch(badStuff(error))
    )
  }
}

export const deleteEvent = (event, username, city) => {
  return (dispatch) => {
    return axios ({
      method: 'post',
      url: '/events/remove',
      data: {
        eventID: event.id
      }
    }).then (
      results => { dispatch(fetchEventsFromTrip(username, city)) },
      error => {dispatch(badStuff(error))}
    );
  };
}

export const deleteFood = (food, username, city) => {
  return (dispatch) => {
    return axios({
      method: 'post',
      url: '/foods/remove',
      data: {
        foodID: food.id
      }
    }).then(
      results => { dispatch(fetchFoodFromTrip(username, city)) },
      error => { dispatch(badStuff(error)) }
    );
  };
}

export const toggleTripStatus = (user, trip) => {
  return dispatch => {
    return axios ({
      method: 'patch',
      url: '/trips',
      data: {
        user: user,
        tripCity: trip.city,
        public : !trip.isPublic
      }
    }).then (
      results => {
        dispatch(fetchTrips(user));
        trip.isPublic === false ? dispatch(activatePublicSnackbar()) : dispatch(activatePrivateSnackbar());
      },
      error => dispatch(badStuff(error))
    )
  }
}

export const makePublic = () => ({type: 'UPDATE_TO_PUBLIC'});

export const makePrivate = () => ({type: 'UPDATE_TO_PRIVATE'});


export const activateDeleteSnackbar = () => ({type: 'ACTIVATE_DELETE_SNACKBAR'});

export const deactivateDeleteSnackbar = () => ({type: 'DEACTIVATE_DELETE_SNACKBAR'});

export const activatePublicSnackbar = () => ({type: 'ACTIVATE_PUBLIC_SNACKBAR'});

export const deactivatePublicSnackbar = () => ({type: 'DEACTIVATE_PUBLIC_SNACKBAR'});

export const activatePrivateSnackbar = () => ({type: 'ACTIVATE_PRIVATE_SNACKBAR'});

export const deactivatePrivateSnackbar = () => ({type: 'DEACTIVATE_PRIVATE_SNACKBAR'});
  
//ACTION_NAME must correspond with reducer switch option

//  complex action example w/ async
// export const search = (searchTerm) => {
//   return (dispatch) => {
//     return makeAnAPIcall(searchTerm).then(
//       searchResults => dispatch(updateResults(searchResults)),
//       error => dispatch(badStuff(error))
//     );
//   };
// }

// const updateResults = (searchResults) => ({type: UPDATE_RESULTS, results: searchResults});
// const badStuff = (error) => ({type: ASYNC_ERROR, error: error});

// NOTES
// -dispatch is a Redux keyword for triggering actions
//   -it's actuallys being used under the hood but react-redux's mapDispatchToProps makes us
//     not have to say dispatch when we usually call action functions
// -actions are dispatched from the front-end (or here because of our middleware to handle asynchronicity)
//   the return statement is automatically passed onto the reducer under the parameter action
// -the capital names are action types, commonly reducers use this key in a switch to decide what to do
//   with the other parameters associated with the action (to modify the state)
