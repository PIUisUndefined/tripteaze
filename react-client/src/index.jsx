import React from 'react';
import ReactDOM from 'react-dom';
// import $ from 'jquery';  //replace with axios
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import reducer from './reducers/index.js';
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
    <MuiThemeProvider theme={getMuiTheme(lightBaseTheme)}>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path = "/trips" component={User} />
          <Route path="/plan" component={Search} />
        </Switch>
      </Router>
    </MuiThemeProvider>
  </Provider>
);

let store = createStore(reducer, applyMiddleware(thunk));

ReactDOM.render( <Root store={store} />
  , document.getElementById('app'));



