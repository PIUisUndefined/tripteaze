const initialState = {
  username: '',
  password: '',
  authenticated: false,
  currentError: '',
  city: '',
  eventQuery: '',
  trips: [],
  tripFromDate: '',
  tripToDate: '',
  minToDate: {}, // so users cannot set a "to" date before the "from" date
  eventResults: [],
  eventSnackbar: false,
  foodQuery: '',
  foodResults: [],
  activeTrip: {
      status: false,
      index: 0
    }
}; //will need to be updated as needed

const reducer = function (state = initialState, action) {  //if state is undefined, state becomes inital state

  switch (action.type) {
    case 'SHOW_TRIPS' :
      return Object.assign({}, state, {trips: action.payload})
    case 'ACTIVATE_EVENT_SNACKBAR' :
      return Object.assign({}, state, { eventSnackbar: true });
    case 'DEACTIVATE_EVENT_SNACKBAR' :
      return Object.assign({}, state, { eventSnackbar: false });
    case 'UPDATE_EVENT_RESULTS' :
      return Object.assign({}, state, {eventResults: action.payload})
    case 'UPDATE_FOOD_RESULTS':
      return Object.assign({}, state, {foodResults: action.payload})
    case 'UPDATE_USERNAME':
      return Object.assign({}, state, {username: action.payload})
    case 'UPDATE_PASSWORD':
      return Object.assign({}, state, {password: action.payload})
    case 'AUTHEN' :
      return Object.assign({}, state, { authenticated: true });
    case 'LOGOUT' :
      return initialState;
    case 'UPDATE_EVENT_QUERY':
      return Object.assign({}, state, {eventQuery: action.payload});
    case 'UPDATE_FOOD_QUERY':
      return Object.assign({}, state, {foodQuery: action.payload});
    case 'UPDATE_CITY' :
      return Object.assign({}, state, { city: action.payload })
    case 'UPDATE_TRIP_FROM_DATE':
      return Object.assign({}, state, { tripFromDate: action.payload })
    case 'UPDATE_TRIP_TO_DATE':
      return Object.assign({}, state, { tripToDate: action.payload })
    case 'SET_MIN_TO_DATE':
      return Object.assign({}, state, { minToDate: action.payload })
    case 'ACTIVATE' :
      return Object.assign({}, state, { activeTrip: { status: true, index: action.payload }})
    case 'DEACTIVATE' :
      return Object.assign({}, state, { activeTrip: { status: false, index: 0 } })
    case 'ERROR' :
      return Object.assign({}, state, { currentError: action.payload })
    case 'REFRESH_TRIP_EVENTS' :
      const oldTrip = state.trips[state.activeTrip.index];
      const newTrip = Object.assign({}, oldTrip, { events: action.payload });
      const newTrips = state.trips.slice();
      newTrips.splice(state.activeTrip.index, 1, newTrip);
      return Object.assign({}, state, { trips: newTrips });
    case 'REFRESH_TRIP_EATIN':
      const oldTripEatin = state.trips[state.activeTrip.index];
      const newTripEatin = Object.assign({}, oldTripEatin, { eatin: action.payload });
      const newTripsEatin = state.trips.slice();
      newTripsEatin.splice(state.activeTrip.index, 1, newTripEatin);
      return Object.assign({}, state, { trips: newTripsEatin });
    default:
      console.log('action not recognized!!!!', action.type);
      return state;  //if unrecognized action type nothing happens
  }
}

export default reducer;


/*
EXAMPLE

* action/index.js
*
* exports const newThing = (thing) => ({type: NEW_THING, thing: thing});
*

const initialState = { thing: 0 };

const reducer = function (state = initialState, action) {  //if state is undefined, state becomes inital state
                                                          //action is the object returned by a function in the actions/index.js file

  switch (action.type) {
    // case 'NEW_THING':
    //   return Object.assign(state, {thing : action.thing}) //makes a new state object with thing property overwritten

    default:
      return state;  //if unrecognized action type nothing happens
  }
}
*/
