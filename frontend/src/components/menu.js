

import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faHome from '@fortawesome/fontawesome-free-solid/faHome';
import faDatabase from '@fortawesome/fontawesome-free-solid/faDatabase';
import faDollar from '@fortawesome/fontawesome-free-solid/faDollarSign';
import faTable from '@fortawesome/fontawesome-free-solid/faTable';
import faDesktop from '@fortawesome/fontawesome-free-solid/faDesktop';
import faWrench from '@fortawesome/fontawesome-free-solid/faWrench';
import faClipboard from '@fortawesome/fontawesome-free-solid/faClipboard';
import faToolbox from '@fortawesome/fontawesome-free-solid/faToolbox';
import faMicrochip from '@fortawesome/fontawesome-free-solid/faMicrochip';
import faEye from '@fortawesome/fontawesome-free-solid/faEye';
import faSitemap from '@fortawesome/fontawesome-free-solid/faSitemap';
import faHdd from '@fortawesome/fontawesome-free-solid/faHdd';
import faFile from '@fortawesome/fontawesome-free-solid/faFile';
import faUserSecret from '@fortawesome/fontawesome-free-solid/faUserSecret';
import logo from '../images/CHC_Logo_144x68.jpg';
import axios from 'axios';
import { myConfig } from '../config';
import history from '../history';
import PropTypes from 'prop-types';
import bcrypt from 'bcryptjs';
import jwt from'jsonwebtoken';

import { 
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Button, Modal, ModalFooter, Form, FormGroup, Label, Input, Col,
  Nav, NavItem, Dropdown, DropdownItem, DropdownToggle, DropdownMenu, UncontrolledButtonDropdown
} from 'reactstrap';

import {
  NavLink,
} from 'react-router-dom';

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
    this.logout = this.logout.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  logout() {
    history.push( '/logout' );
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

    var tmpthis = this;
    axios({
      method:'post',
      url: myConfig.base_url + '/api/logins',
      data: {name: user.username, password: user.password }
    })
      .catch(function (error) {
        if (error.response) {
          // console.log(error.response);
          alert('ERROR: ' + error.response.data.message);
          return;
        }
      })
      .then(res => {
          // console.log("PW:", res.data.user.password);
          // console.log("UserPW:", user.pass);
          // console.log("Token:", res.data.token);

          bcrypt.compare(user.password, res.data.user.password, function (err, pwMatch) {
            var payload;

            if (err) {
              alert('ERROR: Something wong!');
              return;
            }

            if (!pwMatch) {
              alert('ERROR: Invalid username or password!');
              return;
            }

            payload = {
              sub: user.name
            };

            user.token = jwt.sign(payload, myConfig.jwtSecretKey, {
              expiresIn: 60 * 60
            });

            sessionStorage.setItem('token', user.token);
            sessionStorage.setItem('isAuthenticated', true);
            tmpthis.setState({isLoggedIn: true});
            history.push( '/Home' );

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
            <Button size="sm" color="link" onClick={this.toggle}>  {JSON.parse(sessionStorage.getItem('isAuthenticated'))  ? ' ' : 'Login'}   </Button>
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
              <Button color="link" type='submit' onClick={this.doAuth}>Login</Button>
            </ModalFooter>
            </Form> 
            </Modal>
      
            <Button size="sm" color="link" onClick={this.logout}>Logout</Button>
            {/* <NavLink className="btn btn-sm" to="/logout"> Logout </NavLink> */}
          </div>
        </Navbar>
      );
    }
  }
  
  Navigation.propTypes = {
  className: PropTypes.object.isRequired,
};


export class MyMenu extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      menuOpen: false,
      dropdownOpen: false,
      osdropdownOpen: false
    };

    this.toggle = this.toggle.bind(this);
    this.toggleos = this.toggleos.bind(this);
  }

  toggleos() {
    this.setState({
      osdropdownOpen: !this.state.osdropdownOpen
    });
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  closeMenu () {
    this.setState({dropdownOpen: false});
  }

  render () {
    return (
      <div>
        <Nav pills>
          <NavItem>
            <NavLink className="nav-link" to="/Home">  <FontAwesomeIcon icon={faHome}/> Home  </NavLink> 
          </NavItem>

          <UncontrolledButtonDropdown>
            <DropdownToggle nav caret >
              <FontAwesomeIcon icon={faDatabase}/> Data Integration
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>Header</DropdownItem>
              <DropdownItem disabled>Action</DropdownItem>
              <DropdownItem>Another Action</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Another Action</DropdownItem>
            </DropdownMenu>
          </UncontrolledButtonDropdown>

          <UncontrolledButtonDropdown>
            <DropdownToggle nav caret>
              <FontAwesomeIcon icon={faDollar}/> Business Logic
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>Header</DropdownItem>
              <DropdownItem disabled>Action</DropdownItem>
              <DropdownItem>Another Action</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Another Action</DropdownItem>
            </DropdownMenu>
          </UncontrolledButtonDropdown>

          <UncontrolledButtonDropdown>
            <DropdownToggle nav caret>
              <FontAwesomeIcon icon={faTable}/> Presentation
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>Header</DropdownItem>
              <DropdownItem disabled>Action</DropdownItem>
              <DropdownItem>Another Action</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Another Action</DropdownItem>
            </DropdownMenu>
          </UncontrolledButtonDropdown>

          <UncontrolledButtonDropdown>
            <DropdownToggle nav caret>
              <FontAwesomeIcon icon={faDesktop}/> System Administration
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem header>Header</DropdownItem>
              <DropdownItem disabled>Action</DropdownItem>
              <DropdownItem>Another Action</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Another Action</DropdownItem>
            </DropdownMenu>
          </UncontrolledButtonDropdown>

          <Dropdown nav isOpen={this.state.dropdownOpen} toggle={this.toggle}>
            <DropdownToggle nav caret>
              <FontAwesomeIcon icon={faWrench}/> Utilities
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem><NavLink  className="nav-link dropdown-item" to="/Jobviewer"> <FontAwesomeIcon icon={faEye}/> Job Viewer  </NavLink> </DropdownItem>
              <DropdownItem divider />

              <Dropdown nav isOpen={this.state.osdropdownOpen} toggle={this.toggleos} >
                <DropdownToggle nav caret>
                  <FontAwesomeIcon icon={faToolbox}/> OneStop
                </DropdownToggle>

                  <DropdownMenu>
                    <DropdownItem><NavLink onClick={() => this.closeMenu()} className="nav-link dropdown-item" to="/OS_Dashboard" > <FontAwesomeIcon icon={faClipboard}/> Dashboard  </NavLink> </DropdownItem>
                    <DropdownItem><NavLink onClick={() => this.closeMenu()} className="nav-link dropdown-item" to="/OS_Processes" > <FontAwesomeIcon icon={faMicrochip}/> Processes  </NavLink> </DropdownItem>
                    <DropdownItem><NavLink onClick={() => this.closeMenu()} className="nav-link dropdown-item" to="/OS_Network" > <FontAwesomeIcon icon={faSitemap}/> Network  </NavLink> </DropdownItem>
                    <DropdownItem><NavLink onClick={() => this.closeMenu()} className="nav-link dropdown-item" to="/OS_Disks" > <FontAwesomeIcon icon={faHdd}/> Disks  </NavLink> </DropdownItem>
                    <DropdownItem><NavLink onClick={() => this.closeMenu()} className="nav-link dropdown-item" to="/OS_Logs" > <FontAwesomeIcon icon={faFile}/> Logs  </NavLink> </DropdownItem>
                    <DropdownItem><NavLink onClick={() => this.closeMenu()} className="nav-link dropdown-item" to="/OS_Oracle" > <FontAwesomeIcon icon={faDatabase}/> Oracle  </NavLink> </DropdownItem>
                    <DropdownItem><NavLink onClick={() => this.closeMenu()} className="nav-link dropdown-item" to="/OS_Admin" > <FontAwesomeIcon icon={faUserSecret}/> Admin  </NavLink> </DropdownItem>
                  </DropdownMenu>
              </Dropdown>

              <DropdownItem divider />
              <DropdownItem><NavLink  className="nav-link dropdown-item" to="/CustomObject"> <FontAwesomeIcon icon={faWrench}/> Custom Object  </NavLink> </DropdownItem>
              <DropdownItem><NavLink  className="nav-link dropdown-item" to="/pmusers"> <FontAwesomeIcon icon={faWrench}/> Show PM Users  </NavLink> </DropdownItem>

            </DropdownMenu>
          </Dropdown>
        
          <NavItem>
          <NavLink  className="nav-link " to="/test"> Test  </NavLink> 
          </NavItem>
        </Nav>
      </div>
      );
    }  
  }


