import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

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
  }

  changeUsername (event) {
    this.props.updateUsername(event.target.value);
  }

  changePassword (event) {
    this.props.updatePassword(event.target.value);
  }
  handleOpen() {
    this.setState({ open: true });
  };

  handleClose() {
    this.setState({ open: false });
  };

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose.bind(this)}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onClick={this.submit.bind(this)}
      />,
    ];

    return (
      <div>
        <RaisedButton label="Log In" onClick={this.handleOpen.bind(this)} />
        <Dialog
          title="Log In"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose.bind(this)}>
          <label>Username:</label>
          <TextField id='LUsername' type="text" onChange={this.changeUsername.bind(this)} />
          <br/>
          <label>Password:</label>
          <TextField id='LPassword' type="password" onChange={this.changePassword.bind(this)} />
        </Dialog>
      </div>
    )
  }
}

export default Login;
