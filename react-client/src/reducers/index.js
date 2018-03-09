const initialState = {
  loading: false,
  username: '',
  password: '',
  authenticated: false,
  currentError: '', //is never actually used rn
  publicTrips: [],
  userTrips: [],
  city: '',
  tripFromDate: '',
  tripToDate: '',
  isPublic: false,
  minToDate: {}, // so users cannot set a "to" date before the "from" date
  deleteSnackbar: false,
  publicSnackbar: false,
  privateSnackbar: false,
  eventQuery: '',
  eventResults: [],
  hotelQuery: '',
  hotelResults: [],
  foodQuery: '',
  foodResults: [],
  eventSnackbar: false,
  hotelSnackbar: false,
  foodSnackbar: false,
  activeTrip: {
    status: false,
    index: 0 //location of trip in 'userTrips'
  },
};
//you should probably look up combine reducers to make this easier to look at
const reducer = function(state = initialState, action) {  //if state is undefined, state becomes inital state

  switch (action.type) {
  case 'TOGGLE_LOADING' :
    return Object.assign({}, state, {loading: !state.loading});
  case 'SHOW_USER_TRIPS' :
    return Object.assign({}, state, {userTrips: action.payload});
  case 'SHOW_PUBLIC_TRIPS' :
    return Object.assign({}, state, {publicTrips: action.payload});
  case 'RESET_USER_TRIPS' :
    return Object.assign({}, state, {userTrips: []});
  case 'ACTIVATE_EVENT_SNACKBAR' :
    return Object.assign({}, state, { eventSnackbar: true });
  case 'DEACTIVATE_EVENT_SNACKBAR' :
    return Object.assign({}, state, { eventSnackbar: false });
  case 'ACTIVATE_FOOD_SNACKBAR' :
    return Object.assign({}, state, { foodSnackbar: true });
  case 'DEACTIVATE_FOOD_SNACKBAR' :
    return Object.assign({}, state, { foodSnackbar: false });
  case 'ACTIVATE_DELETE_SNACKBAR' :
    return Object.assign({}, state, { deleteSnackbar: true });
  case 'DEACTIVATE_DELETE_SNACKBAR' :
    return Object.assign({}, state, { deleteSnackbar: false });
  case 'ACTIVATE_PUBLIC_SNACKBAR' :
    return Object.assign({}, state, { publicSnackbar: true });
  case 'DEACTIVATE_PUBLIC_SNACKBAR' :
    return Object.assign({}, state, { publicSnackbar: false });
  case 'ACTIVATE_PRIVATE_SNACKBAR' :
    return Object.assign({}, state, { privateSnackbar: true });
  case 'DEACTIVATE_PRIVATE_SNACKBAR' :
    return Object.assign({}, state, { privateSnackbar: false });
  case 'UPDATE_EVENT_RESULTS' :
    return Object.assign({}, state, {eventResults: action.payload});
  case 'UPDATE_FOOD_RESULTS':
    return Object.assign({}, state, {foodResults: action.payload});
  case 'UPDATE_USERNAME':
    return Object.assign({}, state, { username: action.payload });
  case 'UPDATE_PASSWORD':
    return Object.assign({}, state, { password: action.payload });
  case 'AUTHEN':
    return Object.assign({}, state, { authenticated: true, password: '' });
  case 'LOGOUT':
    return initialState;
  case 'UPDATE_EVENT_QUERY':
    return Object.assign({}, state, {eventQuery: action.payload});
  case 'UPDATE_FOOD_QUERY':
    return Object.assign({}, state, {foodQuery: action.payload});
  case 'UPDATE_CITY' :
    return Object.assign({}, state, { city: action.payload });
  case 'UPDATE_TO_PUBLIC' :
    return Object.assign({}, state, { isPublic: true });
  case 'UPDATE_TO_PRIVATE' :
    return Object.assign({}, state, { isPublic: false });
  case 'UPDATE_TRIP_FROM_DATE':
    return Object.assign({}, state, { tripFromDate: action.payload });
  case 'UPDATE_TRIP_TO_DATE':
    return Object.assign({}, state, { tripToDate: action.payload });
  case 'SET_MIN_TO_DATE':
    return Object.assign({}, state, { minToDate: action.payload });
  case 'ACTIVATE' :
    return Object.assign({}, state, { activeTrip: { status: true, index: action.payload }});
  case 'DEACTIVATE' :
    return Object.assign({}, state, { activeTrip: { status: false, index: 0 } });
  case 'ERROR' :
    return Object.assign({}, state, { currentError: action.payload });
  case 'REFRESH_TRIP_EVENTS':
    const oldTrip = state.userTrips[state.activeTrip.index];
    const newTrip = Object.assign({}, oldTrip, { events: action.payload });
    const newTrips = state.userTrips.slice();
    newTrips.splice(state.activeTrip.index, 1, newTrip);
    return Object.assign({}, state, { userTrips: newTrips });
  case 'REFRESH_TRIP_EATIN':
    const oldTripEatin = state.userTrips[state.activeTrip.index];
    const newTripEatin = Object.assign({}, oldTripEatin, { eatin: action.payload });
    const newTripsEatin = state.userTrips.slice();
    newTripsEatin.splice(state.activeTrip.index, 1, newTripEatin);
    return Object.assign({}, state, { userTrips: newTripsEatin });
  case 'UPDATE_HOTEL_RESULTS' :
    return Object.assign({}, state, {hotelResults: action.payload});
  case 'ACTIVATE_HOTEL_SNACKBAR' :
    return Object.assign({}, state, { hotelSnackbar: true });
  case 'DEACTIVATE_HOTEL_SNACKBAR' :
    return Object.assign({}, state, { hotelSnackbar: false });
  case 'UPDATE_HOTEL_QUERY':
    return Object.assign({}, state, {hotelQuery: action.payload});
  case 'REFRESH_TRIP_HOTELS':
    const oldTripHotel = state.userTrips[state.activeTrip.index];
    const newTripHotel = Object.assign({}, oldTripHotel, { hotels: action.payload });
    const newTripsHotel = state.userTrips.slice();
    newTripsHotel.splice(state.activeTrip.index, 1, newTripHotel);
    return Object.assign({}, state, { userTrips: newTripsHotel });
  default:
    return state;  //if unrecognized action type nothing happens
  }
};

export default reducer;
