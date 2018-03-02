import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import * as theme from './homePage.jsx';  // * does all named exports from that file
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { cyan50, cyan100, cyan200, cyan300, cyan400, cyan500, cyan600, cyan700, cyan800, cyan900 } from 'material-ui/styles/colors';

export const styles = {
  actionButtons: {
    backgroundColor: '#f9f9f9',
    margin: '1%'
  },
  button: {
    marginRight: '1em'
  }
}

class Login extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      open: false
    }
  }

  submit (event) {
    event.preventDefault();
    this.props.login(this.props.username, this.props.password);
    this.setState({ open: false });
  }

  changeUsername (event) {
    this.props.updateUsername(event.target.value);
  }

  changePassword (event) {
    this.props.updatePassword(event.target.value);
  }

  handleOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }

  render() {
    const actions = [
      <FlatButton
        label="Login"
        primary={true}
        // keyboardFocused={true}
        onClick={this.submit.bind(this)}
        style={styles.actionButtons}
      />,
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose.bind(this)}
        style={styles.actionButtons}
      />
    ];

    return (
      <MuiThemeProvider muiTheme={theme.muiTheme}>
        <div>
          <RaisedButton
            label="Login"
            onClick={this.handleOpen.bind(this)}
            style={styles.button}
          />
          <Dialog
            title="Login"
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose.bind(this)}>

            <label>Username:</label>

            <TextField
              id='LUsername'
              type="text"
              onChange={this.changeUsername.bind(this)}
            />

            <br/>

            <label>Password:</label>
            <TextField
              id='LPassword'
              type="password"
              onChange={this.changePassword.bind(this)}
            />
          </Dialog>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default Login;