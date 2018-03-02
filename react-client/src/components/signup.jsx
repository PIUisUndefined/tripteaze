import React from 'react';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import * as theme from './homePage.jsx';  // * does all named exports from that file
import * as css from './login.jsx';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { cyan50, cyan100, cyan200, cyan300, cyan400, cyan500, cyan600, cyan700, cyan800, cyan900 } from 'material-ui/styles/colors';

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
				label="Join"
				primary={true}
				keyboardFocused={true}
				onClick={this.submit.bind(this)}
				style={css.styles.actionButtons}
			/>,
			<FlatButton
				label="Cancel"
				onClick={this.handleClose.bind(this)}
				style={css.styles.actionButtons}
			/>
		];

		return (
			<MuiThemeProvider muiTheme={theme.muiTheme}>
				<div>
					<RaisedButton
						label="Join"
						onClick={this.handleOpen.bind(this)}
					/>
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
			</MuiThemeProvider>
		)
	}
}

export default Signup;