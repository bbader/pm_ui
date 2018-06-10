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
import axios from 'axios';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { myConfig } from '../config';
import { createHashHistory } from 'history';

import { 
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Button, Modal, ModalFooter, Form, FormGroup, Label, Input, Col 
} from 'reactstrap';

import {
  NavLink,
} from 'react-router-dom';

export const history = createHashHistory();

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
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      username: '',
      password: ''
    };

    this.toggle = this.toggle.bind(this);
    this.doAuth = this.doAuth.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  logout() {
    sessionStorage.setItem('token', '');
    sessionStorage.setItem('isAuthenticated', false);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  
  doAuth(e) {
    this.toggle();

    e.preventDefault();

    var user = {
      username: this.state.username,
      password: this.state.password,
      token: []
    };

    axios({
      method:'post',
      url: myConfig.base_url + '/api/logins',
      data: {name: user.username }
    })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response);
          alert(error.response.data.message);
        }
      })
      .then(res => {
          //console.log("PW:", res.data.user.password);
          //console.log("UserPW:", user.pass);
          bcrypt.compare(user.password, res.data.user.password, function (err, pwMatch) {
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
              sub: user.username
            };

            user.token = jwt.sign(payload, myConfig.jwtSecretKey, {
              expiresIn: 60 * 60
            });
            //console.log("Token:", user.token);
            sessionStorage.setItem('token', user.token);
            sessionStorage.setItem('isAuthenticated', true);
            history.push({
              pathname: '/'
            });
          });
        })
        .catch(err => console.log(err)
    );
  }

    render() {
      return (
        <Navbar style={{ backgroundColor: '#0F0F59' }} >
          <NavbarBrand href="/">  
            <img src={logo} width="144" height="68" className="d-inline-block align-left" alt="" />
            <span className="navbar-text" >Performance Manager</span>
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />

          <div>
            <Button size="sm" color="link" onClick={this.toggle}>Login</Button>
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
            <Form>
            <FormGroup row>
              <Label for="username" sm={2}>Username</Label>
              <Col sm={10}>
                <Input type="text" name="username"  placeholder="Username" onChange={this.handleChange} />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="password" sm={2}>Password</Label>
              <Col sm={10}>
                <Input type="password" name="password" placeholder="Password" onChange={this.handleChange} />
              </Col>
            </FormGroup>                
            <ModalFooter>
              <Button color="link" onClick={this.toggle}>Cancel</Button>
              <Button color="link" onClick={this.doAuth}>Login</Button>
            </ModalFooter>
            </Form> 
            </Modal>
      
            <Button size="sm" color="link" onClick={this.logout}>Logout</Button>
          </div>
        </Navbar>
      );
    }
  }
  

export class MyMenu extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      menuOpen: false
    };
  }

    showSettings (event) {
      event.preventDefault();
    }

    handleStateChange (state) {
      this.setState({menuOpen: state.isOpen});  
    }

    closeMenu () {
      this.setState({menuOpen: false});
    }

    toggleMenu () {
      this.setState({menuOpen: !this.state.menuOpen});
    }
  
    render () {
      return (
        <Menu styles={ styles } isOpen={this.state.menuOpen} onStateChange={(state) => this.handleStateChange(state)}>

            {/* NOTE:  When adding to menus if you have a dropdown in the list then you need to group all dropdowns towards
              the bottom of the list.  Single items should come first.  This has to do with the way the menu opens and 
              closes on hover.  */}
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">

              <li className="nav-item ">
                <NavLink onClick={() => this.closeMenu()} className="nav-link dropdown-item" to="/Home">  <FontAwesomeIcon icon={faHome}/> Home  </NavLink> 
              </li>

              {/* Data Integration */}
              <li className="nav-item dropdown">
                  <button className="dropdown-toggle"> <FontAwesomeIcon icon={faDatabase}/> Data Integration  </button>

                  <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                      <NavLink onClick={() => this.closeMenu()} className="nav-link dropdown-item" to="/test"> Test  </NavLink> 

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

                      <NavLink onClick={() => this.closeMenu()} className="nav-link dropdown-item" to="/Jobviewer">  Job Viewer  </NavLink> 


                      <li className="nav-item dropdown">
                        <button className="dropdown-toggle nav-link">  OneStop  </button>
                          <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                            <NavLink onClick={() => this.closeMenu()} className="nav-link dropdown-item" to="/Onestop_Dashboard">  Dashboard  </NavLink> 
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
