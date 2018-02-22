import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';  //replace with axios
// import Login from './components/login.jsx';
// import SignUp from './components/signup.jsx';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducers/index.js';
  //thunk is a middleware package for redux that allows your 
  //actions to return functions that return objects for the reducer
  //these functions are usually asynchronous and that is why they are good

// import reducer from './reducers/index.js';
import Home from './components/homePage.jsx';
import User from './components/userPage.jsx';
import Search from './components/searchPage.jsx';

import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

const Root = ({ store }) => (
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path = "/trips" component={User} />
        <Route path="/plan" component={Search} />
      </Switch>
    </Router>
  </Provider>
)

let store = createStore(reducer, applyMiddleware(thunk))

// render(
//   <Root store={store} />,
//   document.getElementById('root')
// )

ReactDOM.render( <Root store={store} />
  , document.getElementById('app'));

// ..<Login />

//   <SignUp />

// These functions will never actually make sense, basically just maps state and actions onto properties
// bindActionCreators wraps actions into functions that can be called normally and will automatically dispatch

// const mapStateToProps = (state) => (
//   state
// );
//state is an object
//or you can only pull certain parts of the state into your component like { videos: state.videos }
//the props of this component becomes whatever object is return from the function

// const mapDispatchToProps = dispatch =>
//   ({
//     actions: bindActionCreators(actions, dispatch)
//   });

//this gives you access to all actions by way of props.actions.actionName

// export default connect(mapStateToProps, mapDispatchToProps)(App);
// pulls it all together



