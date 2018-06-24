

import React from 'react';
import { Router, Route } from 'react-router-dom';
import {MyMenu, Navigation} from './components/menu';
import {Home} from './components/Home';
import {Test} from './components/test';
import {OS_Dashboard} from './components/OneStop';
import {JobViewer} from './components/Jobviewer';
import {ShowLog} from './components/showlog';
import {CustomObject} from './components/CustomObject';
import {PMUsers} from './components/PMUsers';
import {Logout} from './components/logout';
import history from './history';
import PropTypes from 'prop-types';

const Main = () => (
  <Router history={history}>
    <div className="Main">
    <Navigation />

      <div>
      <MyMenu/>
      <PrivateRoute path="/Home" component={Home} />
      <Route exact path="/test" component={Test}/>
      <PrivateRoute exact path="/OS_Dashboard" component={OS_Dashboard}/>
      <PrivateRoute exact path="/JobViewer" component={JobViewer}/>
      <PrivateRoute exact path="/showlog" component={ShowLog}/>
      <PrivateRoute exact path="/CustomObject" component={CustomObject}/>
      <PrivateRoute exact path="/pmusers" component={PMUsers}/>
      <Route exact path ="/logout" component={Logout} />

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
      )
    }
  />
);

PrivateRoute.propTypes = {
  component: PropTypes.object.isRequired
};

export default Main;