import React from 'react';
import '../project.css';
import { slide as Menu } from 'react-burger-menu';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faHome from '@fortawesome/fontawesome-free-solid/faHome';
import faDatabase from '@fortawesome/fontawesome-free-solid/faDatabase';
import faDollar from '@fortawesome/fontawesome-free-solid/faDollarSign';
import faTable from '@fortawesome/fontawesome-free-solid/faTable';
import faDesktop from '@fortawesome/fontawesome-free-solid/faDesktop';
import faWrench from '@fortawesome/fontawesome-free-solid/faWrench';
import logo from '../images/CHC_Logo_144x68.jpg';

import { 
  Navbar,
  NavbarToggler,
  NavbarBrand,
} from 'reactstrap';

import {
  NavLink,
} from 'react-router-dom';

var styles = {
    bmBurgerButton: {
      position: 'fixed',
      width: '36px',
      height: '30px',
      left: '36px',
      top: '100px'
    },
    bmBurgerBars: {
      background: 'green'
    },
    bmCrossButton: {
      height: '24px',
      width: '24px'
    },
    bmCross: {
      background: '#bdc3c7'
    },
    bmMenu: {
      background: '#373a47',
      paddingTop: 30,
      fontSize: '1.0em',
      textAlign: 'left'
    },
    bmMorphShape: {
      fill: '#373a47'
    },
    bmItemList: {
      color: '#b8b7ad',
      padding: '0.8em'
    },
    bmOverlay: {
      background: 'rgba(0, 0, 0, 0.3)'
    }
  };

export class Navigation extends React.Component {
    render() {
      return (
        <Navbar style={{ backgroundColor: '#0F0F59' }} >
          <NavbarBrand href="/">  
            <img src={logo} width="144" height="68" className="d-inline-block align-left" alt="" />
            <span className="navbar-text" >Performance Manager</span>
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
        </Navbar>
      );
    }
  }
  
export class MyMenu extends React.Component {
    showSettings (event) {
      event.preventDefault();
    }

    render () {
      return (
        <Menu styles={ styles } >
            {/* NOTE:  When adding to menus if you have a dropdown in the list then you need to group all dropdowns towards
              the bottom of the list.  Single items should come first.  This has to do with the way the menu opens and 
              closes on hover.  */}
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">

              <li className="nav-item ">
                <NavLink className="nav-link dropdown-item" to="/Home"> <FontAwesomeIcon icon={faHome}/> Home  </NavLink> 
              </li>

              {/* Data Integration */}
              <li className="nav-item dropdown">
                  <button className="dropdown-toggle"> <FontAwesomeIcon icon={faDatabase}/> Data Integration  </button>

                  <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                      <NavLink className="nav-link dropdown-item" to="/test"> Test  </NavLink> 

                    <li className="nav-item dropdown">
                      <button className="dropdown-toggle"> Button </button>
                        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                          <a className="dropdown-item" href="/">Action2</a>
                          <a className="dropdown-item" href="/">Action3</a>
                          <a className="dropdown-item" href="/">Action4</a>
                        </div>
                    </li>
                        {/* Example of divider and another link */}
                        {/* <div className="dropdown-divider"></div>*/}

                        {/* <a className="dropdown-item" href="/">Something else here</a> */}

                    <li className="nav-item dropdown">
                      <button className="dropdown-toggle"> Button </button>
                        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                          <a className="dropdown-item" href="/">Action2</a>
                          <a className="dropdown-item" href="/">Action3</a>
                          <a className="dropdown-item" href="/">Action4</a>
                        </div>
                    </li>

                  </div>
              </li>

              {/* Business Logic */}
              <li className="nav-item dropdown">
                <button className="dropdown-toggle"> <FontAwesomeIcon icon={faDollar}/> Business Logic  </button>
                  <div className="dropdown-menu" aria-labelledby="navbarDropdown">

                  </div>
              </li>

              {/* <!-- Presentation -->  */}
              <li className="nav-item dropdown">
                <button className="dropdown-toggle"> <FontAwesomeIcon icon={faTable}/> Presentation  </button>
                  <div className="dropdown-menu" aria-labelledby="navbarDropdown">

                  </div>
              </li>

              {/* System Administration */}
              <li className="nav-item dropdown">
                <button className="dropdown-toggle"> <FontAwesomeIcon icon={faDesktop}/> System Administration  </button>
                  <div className="dropdown-menu" aria-labelledby="navbarDropdown">

                  </div>
              </li>

              {/* Utilities Menu */}
                <li className="nav-item dropdown">
                  <button className="dropdown-toggle"> <FontAwesomeIcon icon={faWrench}/> Utilities  </button>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">

                      <NavLink className="nav-link dropdown-item" to="/Jobviewer">  Job Viewer  </NavLink> 


                      <li className="nav-item dropdown">
                        <button className="dropdown-toggle">  OneStop  </button>
                          <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                            <NavLink className="nav-link dropdown-item" to="/Onestop_Dashboard">  Dashboard  </NavLink> 
                            <a className="dropdown-item" href="/">Processes</a>
                            <a className="dropdown-item" href="/">Network</a>
                            <a className="dropdown-item" href="/">Disks</a>
                            <a className="dropdown-item" href="/">Logs</a>
                            <a className="dropdown-item" href="/">Oracle</a>
                            <a className="dropdown-item" href="/">Admin</a>
                          </div>
                      </li>
                    </div>
                  </li>

              {/* Example of disabled */}
              {/* <li className="nav-item">
                <a className="nav-link disabled" href="/">Disabled</a>
              </li> */}

            </ul>
          </div>      
        </Menu>
      );
    }
  }
