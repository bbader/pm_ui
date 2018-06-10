import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from 'react-router-dom';

import {MyMenu, Navigation} from './components/menu';
import {Home} from './components/Home';
import {Test} from './components/test';
import {Onestop_Dashboard} from './components/Onestop_Dashboard';
import {JobViewer} from './components/Jobviewer';
import {ShowLog} from './components/showlog';

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

      <PrivateRoute path="/Home" component={Home} />
      <Route exact path="/test" component={Test}/>
      <PrivateRoute exact path="/Onestop_Dashboard" component={Onestop_Dashboard}/>
      <PrivateRoute exact path="/JobViewer" component={JobViewer}/>
      <PrivateRoute exact path="/showlog" component={ShowLog}/>

      </div>
    </div>
  </Router>
);

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      sessionStorage.getItem('isAuthenticated') === 'true' ? (
        <Component {...props} />
      ) : (

        <h1>You need to <b>Login</b> first</h1>

        // <Redirect
        //   to={{
        //     pathname: '/login',
        //     state: { from: props.location }
        //   }}
        // />
      )
    }
  />
);


// class Login extends Component {

//   constructor(props) {
//     super(props);

//     this.handleChange = this.handleChange.bind(this);
//     this.handleSubmit = this.handleSubmit.bind(this);
//   }

//   handleChange(e) {
//     this.setState({
//       [e.target.name]: e.target.value
//     });
//   }

//   handleSubmit(e) {
//     e.preventDefault();
//     const {from} = this.props.location.state || { from: { pathname: '/' } } ;

//      var user = {
//        name: this.state.username,
//        pass: this.state.password,
//        from: from,
//        token: []
//      };

//      axios({
//        method:'post',
//        url: myConfig.base_url + '/api/logins',
//        data: {name: user.name }
//      })
//        .catch(function (error) {
//          if (error.response) {
//            console.log(error.response);
//            alert(error.response.data.message);
//          }
//        })
//        .then(res => {
//            //console.log("PW:", res.data.user.password);
//            //console.log("UserPW:", user.pass);
//            bcrypt.compare(user.pass, res.data.user.password, function (err, pwMatch) {
//              var payload;

//              if (err) {
//                alert('Error while authenticating user');
//                return;
//              }

//              if (!pwMatch) {
//                alert('Invalid name or password.');
//                return;
//              }

//              payload = {
//                sub: user.name
//              };

//              user.token = jwt.sign(payload, myConfig.jwtSecretKey, {
//                expiresIn: 60 * 60
//              });
//              //console.log("Token:", user.token);
//              sessionStorage.setItem('token', user.token);
//              sessionStorage.setItem('loggedin', true);
//              sessionStorage.setItem('isAuthenticated', true);
//              sessionStorage.setItem('redirectToReferrer', true);
//              sessionStorage.setItem('whereto', user.from.pathname);
//              history.push({
//                pathname: user.from.pathname,
//              });
//            });
//          })
//          .catch(err => console.log(err)
//      );
//    };

//   render() {
//     //const {from} = this.props.location.state || { from: { pathname: '/' } } ;
//     var redirectToReferrer  = sessionStorage.getItem('redirectToReferrer');

//     if (redirectToReferrer === 'true') {
//       var whereto = sessionStorage.getItem('whereto');
//       return <Redirect to={whereto} />;
//     }

//     return ( 

//       < div className = "center" >
//         <div className = "card" >
//           <h1 > Login </h1> 
//           <form >
//             <input 
//               className = "form-item"
//               placeholder = "Username goes here..."
//               name = "username"
//               type = "text"
//               onChange = { this.handleChange }
//             /> 
//             <input 
//               className = "form-item"
//               placeholder = "Password goes here..."
//               name = "password"
//               type = "password"
//               onChange = { this.handleChange }
//             /> 
//             <input 
//               className = "form-submit"
//               value = "SUBMIT"
//               type = "submit"
//               onClick = {this.handleSubmit}
//             />
//             </form> 
//           </div> 
//         </div>
//     );
//   }
// }

export default Main;