import axios from 'axios';

//SIMPLE ACTION
//export const actionName = (neededParams) => ({type: 'ACTION_NAME', param: neededParams});

////////////////////////////////HOME PAGE STUFF\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
export const fetchTrips = (param) => {
  //dispatch({ type: 'LOADING' });
  return (dispatch) => {
    return axios({
      method: 'get',
      url: '/trips',
      params: {
        search: param
      }
    }).then(
      results => dispatch(setTrips(results.data.trips)),
      error => dispatch(badStuff(error))
    );
  }
};

const setTrips = (trips) => ({ type: 'SHOW_TRIPS', payload: trips});

export const updateUsername = (username) => ({ type: 'UPDATE_USERNAME', payload: username });

export const updatePassword = (password) => ({ type: 'UPDATE_PASSWORD', payload: password });

export const login = (username, password) => {
  //dispatch({ type: 'LOADING' });
  return (dispatch) => {
    return axios({
      method: 'get',
      url: '/login',
      params: {
        username: username,
        password: password
      }
    }).then (
      results => dispatch(authenticate()),
      error => dispatch(badStuff(error))
    );
  }
};

export const signup = (username, password) => {
  //dispatch({ type: 'LOADING' });
  return (dispatch) => {
    return axios({
      method: 'post',
      url: '/signup',
      data: {
        username: username,
        password: password
      }
    }).then (
      results => dispatch(authenticate()),
      error => dispatch(badStuff(error))
    );
  };
}

export const authenticate = () => ({ type: 'AUTHEN' });

export const badStuff = (error) => ({type: 'ERROR', payload: error});

/////////////////////////////SEARCH PAGE STUFF \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

// Updates the "from" date for the trip
export const updateFromDate = (date) => ({ type: 'UPDATE_TRIP_FROM_DATE', payload: date });

// Updates the "to" date for the trip
export const updateToDate = (date) => ({ type: 'UPDATE_TRIP_TO_DATE', payload: date });

export const setMinToDate = (date) => ({ type: 'SET_MIN_TO_DATE', payload: date });

export const updateCity = (city) => ({ type: 'UPDATE_CITY', payload: city });

export const updateEventQuery = (query) => ({ type: 'UPDATE_EVENTQUERY', payload: query });

export const updateFoodQuery = (query) => ({ type: 'UPDATE_FOODQUERY', payload: query})

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
        dispatch(fetchTrips(username))},
        error => dispatch(badStuff(error))
    );
  };
}

export const searchEvents = (city, query, fromDate) => {
  return (dispatch) => {
    return axios({
      method: 'post',
      url: '/events',
      data: {
        tripCity: city,
        eventQuery: query,
        tripFromDate: fromDate
      }
    }).then(
      results => (dispatch(updateEventResults(results.data))),
      error => dispatch(badStuff(error))
    );
  };
}

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
      results => (dispatch(updateFoodResults(results.data))),
      error => dispatch(badStuff(error))
    )
  }
}

const updateFoodResults = (searchResults) => ({ type: 'UPDATE_FOODRESULTS', payload: searchResults})

const updateEventResults = (searchResults) => ({ type: 'UPDATE_EVENTRESULTS', payload: searchResults});

export const activateTrip = (city) => ({ type: 'SET_TRIP', payload: city});

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
      results => (dispatch(fetchTrips(user))),
      error => dispatch(badStuff(error))
    )
  }
}

export const toggleTripStatus = (user, trip) => {
  console.log(user, trip);
  return dispatch => {
    return axios ({
      method: 'patch',
      url: '/trips',
      data: {
        user: user,
        tripCity: trip.city,
        public : !trip.public
      }
    }).then (
      results => (dispatch(fetchTrips(user))),
      error => dispatch(badStuff(error))
    )
  }
}

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
