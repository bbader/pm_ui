import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter,
  HashRouter
} from "react-router-dom";

import {MyMenu, Navigation} from './components/menu';
import {Home} from './components/Home';

import { createHashHistory } from 'history';
import { myConfig } from './config';
import './components/login.css';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const history = createHashHistory();

const Main = () => (
  <Router>
    <div className="Main">
    <Navigation />

        <div>
        <MyMenu/>

      <AuthButton />

      <Route path="/login" component={Login} />
      <PrivateRoute path="/Home" component={Home} />
      </div>
    </div>
  </Router>
);

const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
//    this.handleSubmit();

//console.log("HERE");
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
        console.log("PW:", res.data.user.password);
        console.log("UserPW:", user.pass);
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
            console.log("Token:", user.token);
            sessionStorage.setItem('token', user.token);
            sessionStorage.setItem('loggedin', true);
          });

        })
      .catch(err => console.log(err)
    );


  },
  signout(cb) {
    this.isAuthenticated = false;
    setTimeout(cb, 100);
  }
};

const AuthButton = withRouter(
  ({ history }) =>
    fakeAuth.isAuthenticated ? (
      <p>
        Welcome!{" "}
        <button
          onClick={() => {
            fakeAuth.signout(() => history.push("/"));
          }}
        >
          Sign out
        </button>
      </p>
    ) : (
      <div>
      <p>You are not logged in.</p>
      </div>

    )
);

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      fakeAuth.isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);


class Login extends Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  state = {
    redirectToReferrer: false
  };

  login = () => {
    fakeAuth.authenticate(() => {
      this.setState({ redirectToReferrer: true });
    });
  };

  render() {
    const {from} = this.props.location.state || { from: { pathname: "/" } } ;
    const {redirectToReferrer} = this.state;
    console.log( from );
console.log( redirectToReferrer );
// for (var x = 1; x <1000000000; x++) {
//   var b = x;
// }
    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

    return ( 


    //   <div>
    //   <p>You must log in to view the page at {from.pathname}</p>
    //   <button onClick={this.login}>Log in</button>
    // </div>



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
              onClick = {this.login }
            />
            </form> 
          </div> 
        </div>
    );
  }

  handleSubmit(e) {
    e.preventDefault();

    isAuthenticated: false;

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
        console.log("PW:", res.data.user.password);
        console.log("UserPW:", user.pass);
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
            console.log("Token:", user.token);
            sessionStorage.setItem('token', user.token);
            sessionStorage.setItem('loggedin', true);

            this.isAuthenticated = true;

            // const { from } = this.props.location.state || { from: { pathname: "/" } };
            // console.log("Pathname: ", { from });

            // return <Redirect to={from} />;
            
            // history.push( {
            //   pathname: 'Home',
            //   });
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


// class Login extends React.Component {
//   state = {
//     redirectToReferrer: false
//   };

//   login = () => {
//     fakeAuth.authenticate(() => {
//       this.setState({ redirectToReferrer: true });
//     });
//   };

//   render() {
//     const { from } = this.props.location.state || { from: { pathname: "/" } };
//     const { redirectToReferrer } = this.state;

//     if (redirectToReferrer) {
//       return <Redirect to={from} />;
//     }

//     return (
//       <div>
//         <p>You must log in to view the page at {from.pathname}</p>
//         <button onClick={this.login}>Log in</button>
//       </div>
//     );
//   }
// }

export default Main;