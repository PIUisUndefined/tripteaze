import React from 'react';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';


class Signup extends React.Component {
	constructor (props) {
		super(props);

		this.state = {
			open: false
		}
	}

	submit (event) {
		event.preventDefault();
		this.props.signup(this.props.username, this.props.password);
	}

	changeUsername (event) {
		this.props.updateUsername(event.target.value);
	}

	changePassword (event) {
		this.props.updatePassword(event.target.value);
	}

	handleOpen () {
		this.setState({ open: true });
	};

	handleClose () {
		this.setState({ open: false });
	};
	
	render () {
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
				<RaisedButton label="Join" onClick={this.handleOpen.bind(this)} />
				<Dialog 
					title="Sign Up"
					actions={actions}
					modal={false}
					open={this.state.open}
					onRequestClose={this.handleClose.bind(this)}>
					<label>Username:</label>
					<TextField id = "SUUsername" onChange = {this.changeUsername.bind(this)} />
					<br/>
					<label>Password:</label>
					<TextField id = 'SUPassword' type="password" onChange = {this.changePassword.bind(this)} />
				</Dialog>
			</div>
		)
	}
}

export default Signup;