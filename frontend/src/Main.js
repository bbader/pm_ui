import React from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import {MyMenu, Navigation} from './components/menu';
import {Home} from './components/Home';
import {Test} from './components/test';
import {Onestop_Dashboard} from './components/Onestop_Dashboard';
import {JobViewer} from './components/Jobviewer';
import {ShowLog} from './components/showlog';

import { createHashHistory } from 'history';

import PropTypes from 'prop-types';

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
      )
    }
  />
);

PrivateRoute.propTypes = {
  component: PropTypes.object.isRequired
};

export default Main;