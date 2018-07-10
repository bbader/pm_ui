
import React from 'react';
import { postDataAPI } from './api';
import { myConfig } from '../config';
import history from '../history';

export class addUser extends React.Component {
  render() {
      return (
        <div>
          <br/>
          <LoginForm>
          </LoginForm>
        </div>
      );
  }
}

class LoginForm extends React.Component {
  constructor(props) {
      super(props);
      
      this.state = {
        fullName: '',
        username: '',
        password: '',
        role: '',
        email: '',
        department: ''
      };

      this.handleChange = this.handleChange.bind(this);
  }
  
  updateResultAuth = (res) => {

    history.push( '/listUsers' );
  }

  // Actions
  handleSubmit(ev) {
      ev.preventDefault();

      var user = {
        fullName: this.state.fullName ,
        username: this.state.username ,
        password: this.state.password ,
        role: this.state.role.toUpperCase() ,
        email: this.state.email ,
        department: this.state.department 
      };

      var data = {
        fullname: user.fullName,
        name: user.username,
        password: user.password ,
        role: user.role,
        email: user.email, 
        department: user.department
      };
      postDataAPI.all(this.updateResultAuth, myConfig.base_url + '/api/users', data);  
  
  }
  
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }


  // Render
  getStyles() {
      return {
          formContainer: {
              width: "100%",
              height: "100%",
              position: "top",
              background: "whitesmoke",
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
          },
          form: {
              background: "#fff",
              padding: 20,
              width: "50%",
              height: "50%",
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
              boxShadow: "0px 0px 2px rgba(0,0,0,0.3)"
          },
          input: {
              width: "100%",
              margin: "10px 0px",
              padding: "10px 0px",
              border: "none",
              borderBottom: "solid 1px #1d84c3"
          },
          button: {
              background: "#1d84c3",
              color: "#fff",
              border: "none",
              outline: "none",
              padding: 7
          }
      };
  }
  
  renderForm() {
      return (
          <form style={this.getStyles().form} onSubmit={this.handleSubmit.bind(this)}>
              <input style={this.getStyles().input} placeholder="Full Name" type="text" name="fullName" onChange={this.handleChange}></input>
              <input style={this.getStyles().input} placeholder="Username" type="text" name="username" onChange={this.handleChange}></input>
              <input style={this.getStyles().input} placeholder="Password" type="password" name="password" onChange={this.handleChange}></input>
              <input style={this.getStyles().input} placeholder="Role" type="text" name="role" onChange={this.handleChange}></input>
              <input style={this.getStyles().input} placeholder="email" type="text" name="email" onChange={this.handleChange}></input>
              <input style={this.getStyles().input} placeholder="Department" type="text" name="department" onChange={this.handleChange}></input>

              <button style={this.getStyles().button} type="submit">Submit</button>
          </form>
      );
  }
  
  render() {
      return (
          <div style={this.getStyles().formContainer}>
              { this.renderForm()}
          </div>
      );
  }
}
