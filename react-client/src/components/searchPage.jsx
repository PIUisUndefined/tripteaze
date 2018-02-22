import React from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';
import * as actions from '../actions/index.js';
import { bindActionCreators } from 'redux';

const StatePage = (state, actions) => {

  return (
    <div>
      PUT SEARCH FIELDS HERE
    </div>
  )
}


const mapStateToProps = state => (
  { state: state }
);

const mapDispatchToProps = dispatch =>
  ({
    actions: bindActionCreators(actions, dispatch)
  });

export default connect(mapStateToProps, mapDispatchToProps)(StatePage);

