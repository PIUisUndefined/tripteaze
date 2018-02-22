import React from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';
import * as actions from '../actions/index.js';
import { bindActionCreators } from 'redux';

const UserPage = (props, actions) => {

    return (
    <div>
      PUT TRIPS HERE
    </div>
  )
}

const mapStateToProps = state => (
  {state: state}
);

const mapDispatchToProps = dispatch =>
  ({
    actions: bindActionCreators(actions, dispatch)
  });

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);

