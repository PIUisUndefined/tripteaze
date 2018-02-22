import React from 'react';

const Login = (props) => {

  let submit = (event) => {
    event.preventDefault();
    props.login(props.username, props.password);
  }

  let changeUsername = () => {
    props.updateUsername(props.username);
  }

  let changePassword = () => {
    props.updatePassword(props.password);
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit = {submit}>
        <div>
          <label>Username:</label>
          <input type="text" onChange={changeUsername}/>
        </div>
        <div>
          <label>Password:</label>
          <input type="password" onChange={changeUsername}/>
        </div>
        <div>
          <input type='submit' value='Login' />
        </div>
      </form>
    </div>
  )
}

export default Login;
