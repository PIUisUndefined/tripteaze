import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import * as theme from './homePage.jsx';  // * does all named exports from that file
// import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import getMuiTheme from 'material-ui/styles/getMuiTheme';
// import { cyan50, cyan100, cyan200, cyan300, cyan400, cyan500, cyan600, cyan700, cyan800, cyan900 } from 'material-ui/styles/colors';

export const styles = {
  actionButtons: {
    backgroundColor: '#f9f9f9',
    margin: '1%'
  }
};

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };

    this.submit = this.submit.bind(this);
    this.changeUsername = this.changeUsername.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleEnterKey = this.handleEnterKey.bind(this);
  }

  submit(event) {
    event.preventDefault();
    this.props.login(this.props.username, this.props.password);
    this.setState({ open: false });
    this.props.forward();
  }

  changeUsername(event) {
    this.props.updateUsername(event.target.value);
  }

  changePassword(event) {
    this.props.updatePassword(event.target.value);
  }

  handleOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }

  handleEnterKey(e) {
    if (e.key === 'Enter') {
      this.submit(e);
    }
  }

  render() {
    //these are the buttons on the modal
    const actions = [
      <FlatButton
        label="Login"
        primary={true}
        // keyboardFocused={true}
        onClick={this.submit}
        style={styles.actionButtons}
        key="login"
      />,
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
        style={styles.actionButtons}
        key="cancel"
      />
    ];

    return (
      <MuiThemeProvider muiTheme={theme.muiTheme}>
        <div>
          <RaisedButton
            label="Login"
            onClick={this.handleOpen}
          />
          <Dialog
            title="Login"
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}>

            <label>Username:</label>

            <TextField
              id='LUsername'
              type="text"
              onChange={this.changeUsername}
              onKeyUp={this.handleEnterKey}
            />

            <br />

            <label>Password:</label>
            <TextField
              id='LPassword'
              type="password"
              onChange={this.changePassword}
              onKeyUp={this.handleEnterKey}
            />
          </Dialog>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Login;
