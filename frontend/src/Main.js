

import React from 'react';
import { Router, Route } from 'react-router-dom';
import {MyMenu, Navigation} from './components/menu';
import {Home} from './components/Home';
import {Test} from './components/test';
import {OS_Dashboard, OS_Processes, OS_Network, OS_Logs, 
        OS_oracleTableSpace, OS_oracleParameters, OS_oracleLongRunning, OS_oracleQueryReservation,
        OS_oracleGetAppliedRounds, OS_oraclecheckRounds, OS_oraclecheckMaxProcesses,
        OS_oraclecheckGRStatus, OS_oraclecheckLocks, OS_oraclecheckActivity,
        OS_Admin } from './components/OneStop';
import {JobViewer} from './components/Jobviewer';
import {ShowLog} from './components/showlog';
import {CustomObject} from './components/CustomObject';
import {PMUsers} from './components/PMUsers';
import {Logout} from './components/logout';
import {addUser} from './components/addUser';
import {listUsers} from './components/listUsers';
import {updateUser} from './components/updateUser';


import history from './history';
import PropTypes from 'prop-types';

const Main = () => (
  <Router history={history}>
    <div className='Main'>
    <Navigation />

      <div>
      <MyMenu/>
      <PrivateRoute path="/Home" component={Home} />
      <Route exact path="/test" component={Test}/>
      <PrivateRoute exact path="/JobViewer" component={JobViewer}/>
      <PrivateRoute exact path="/showlog" component={ShowLog}/>
      <PrivateRoute exact path="/CustomObject" component={CustomObject}/>
      <PrivateRoute exact path="/pmusers" component={PMUsers}/>
      <Route exact path ="/logout" component={Logout} />

      <PrivateRoute exact path="/addUser" component={addUser}/>
      <PrivateRoute exact path="/listUsers" component={listUsers}/>
      <PrivateRoute exact path="/updateUser" component={updateUser}/>


      <PrivateRoute exact path="/OS_Dashboard" component={OS_Dashboard}/>
      <PrivateRoute exact path="/OS_Processes" component={OS_Processes}/>
      <PrivateRoute exact path="/OS_Network" component={OS_Network}/>
      <PrivateRoute exact path="/OS_Logs" component={OS_Logs}/>

      <PrivateRoute exact path="/OS_oracleTableSpace" component={OS_oracleTableSpace}/>
      <PrivateRoute exact path="/OS_oracleParameters" component={OS_oracleParameters}/>
      <PrivateRoute exact path="/OS_oracleLongRunning" component={OS_oracleLongRunning}/>
      <PrivateRoute exact path="/OS_oracleQueryReservation" component={OS_oracleQueryReservation}/>
      <PrivateRoute exact path="/OS_oracleGetAppliedRounds" component={OS_oracleGetAppliedRounds}/>
      <PrivateRoute exact path="/OS_oraclecheckMaxProcesses" component={OS_oraclecheckMaxProcesses}/>
      <PrivateRoute exact path="/OS_oraclecheckRounds" component={OS_oraclecheckRounds}/>
      <PrivateRoute exact path="/OS_oraclecheckGRStatus" component={OS_oraclecheckGRStatus}/>
      <PrivateRoute exact path="/OS_oraclecheckLocks" component={OS_oraclecheckLocks}/>
      <PrivateRoute exact path="/OS_oraclecheckActivity" component={OS_oraclecheckActivity}/>

      <PrivateRoute exact path="/OS_Admin" component={OS_Admin}/>

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