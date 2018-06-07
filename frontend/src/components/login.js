import React, { Component } from 'react';
import './login.css';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createHashHistory } from 'history';
import { myConfig } from '../config';

export const history = createHashHistory();

class Login extends Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  render() {

    return ( 
      < div className = "center" >
        <div className = "card" >
          <h1 > Login </h1> 
          <form >
            <input 
              className = "form-item"
              placeholder = "Username goes here..."
              name = "username"
              type = "text"
              onChange = { this.handleChange }
            /> 
            <input 
              className = "form-item"
              placeholder = "Password goes here..."
              name = "password"
              type = "password"
              onChange = { this.handleChange }
            /> 
            <input 
              className = "form-submit"
              value = "SUBMIT"
              type = "submit"
              onClick = {this.handleSubmit }
            />
            </form> 
          </div> 
        </div>
    );
  }

  handleSubmit(e) {
    e.preventDefault();

    var user = {
      name: this.state.username,
      pass: this.state.password,
      token: []
    };

    axios({
      method:'post',
      url: myConfig.base_url + '/api/logins',
      data: {name: user.name }
    })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response);
          alert(error.response.data.message);
        }
      })
      .then(res => {
        // console.log("PW:", res.data.user.password);
        // console.log("UserPW:", user.pass);
          bcrypt.compare(user.pass, res.data.user.password, function (err, pwMatch) {
            var payload;

            if (err) {
              alert('Error while authenticating user');
              return;
            }

            if (!pwMatch) {
              alert('Invalid name or password.');
              return;
            }

            payload = {
              sub: user.name
            };

            user.token = jwt.sign(payload, myConfig.jwtSecretKey, {
              expiresIn: 60 * 60
            });
            // console.log("Token:", user.token);
            sessionStorage.setItem('token', user.token);
            sessionStorage.setItem('loggedin', true);
            history.push( {
              pathname: 'Home',
              });
          });

        })
      .catch(err => console.log(err)
    );
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
}

export default Login;