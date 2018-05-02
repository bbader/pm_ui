import React, { Component } from 'react';
import './project.css';

import {
  Route,
  HashRouter
} from 'react-router-dom';

import {MyMenu, Navigation} from './components/menu';
import {Home} from './components/Home';
import {Test} from './components/test';
import {Onestop_Dashboard} from './components/Onestop_Dashboard';

class Main extends Component {
  render() {
    return (
      <HashRouter>
      <div className="Main">
        <Navigation />

        <div>
        <MyMenu/>

          <div className="content">
            <Route exact path="/Home" component={Home}/>
            <Route exact path="/test" component={Test}/>
            <Route exact path="/Onestop_Dashboard" component={Onestop_Dashboard}/>

            {/* <h1> Bob </h1>
            <button type="button" class="btn  btn-outline-danger">Danger</button> */}

          </div>
        </div>
      </div>
      </HashRouter>
    );
  }
}

export default Main;
