

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
import faFile from '@fortawesome/fontawesome-free-solid/faFile';
import faUserSecret from '@fortawesome/fontawesome-free-solid/faUserSecret';
import logo from '../images/CHC_Logo_144x68.jpg';
import { myConfig } from '../config';
import history from '../history';
import PropTypes from 'prop-types';
import bcrypt from 'bcryptjs';
import jwt from'jsonwebtoken';
import { postDataAPI } from './api';

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
      role: '',
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
  
  updateResultAuth = (res) => {
    var user = {
      username: this.state.username,
      role:     this.state.role,
      password: this.state.password,      
      token: []
    };

    var tmpthis = this;
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
        sub: user.username
      };

      user.role = res.data.user.role;

      user.token = jwt.sign(payload, myConfig.jwtSecretKey, {
        expiresIn: 60 * 60
      });

      sessionStorage.setItem('token', user.token);
      sessionStorage.setItem('uname', user.username);
      sessionStorage.setItem('role', user.role);
      sessionStorage.setItem('isAuthenticated', true);
      tmpthis.setState({isLoggedIn: true});
      history.push( '/Home' );
    }
  );
}

  doAuth(e) {
    this.toggle();

    e.preventDefault();

    var user = {
      username: this.state.username,
      role:     this.state.role,
      password: this.state.password,
      token: []
    };

    var data = { name: user.username, password: user.password }
    postDataAPI.all(this.updateResultAuth, myConfig.base_url + '/api/logins', data);  
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
            <Button size="sm" color="link" onClick={this.toggle}>  {JSON.parse(sessionStorage.getItem('isAuthenticated'))  ? sessionStorage.getItem('uname') : 'Login'}   </Button>
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
      osdropdownOpen: false,
      osoracledropdownOpen: false
    };

    this.toggle = this.toggle.bind(this);
    this.toggleos = this.toggleos.bind(this);
    this.toggleosoracle = this.toggleosoracle.bind(this);
  }

  toggleos() {
    this.setState({
      osdropdownOpen: !this.state.osdropdownOpen
    });
  }

  toggleosoracle() {
    this.setState({
      osoracledropdownOpen: !this.state.osoracledropdownOpen
    });
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  closeMenu () {
    this.setState({dropdownOpen: false});
    this.setState({osdropdownOpen: false});
    this.setState({osoracledropdownOpen: false});
  }

  render () {
    const isLoggedIn = sessionStorage.getItem('isAuthenticated'),
          userRole   = sessionStorage.getItem('role');
    let addUserButton, listUserButton;
    // console.log (isLoggedIn + '     ' + userRole);
    if (isLoggedIn && userRole === 'ADMIN') {
      addUserButton = <DropdownItem><NavLink  className="nav-link dropdown-item" to="/addUser"> <FontAwesomeIcon icon={faEye}/> Add User  </NavLink> </DropdownItem>
      listUserButton = <DropdownItem><NavLink  className="nav-link dropdown-item" to="/listUsers"> <FontAwesomeIcon icon={faEye}/> List Users  </NavLink> </DropdownItem>
    }

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
              {addUserButton}
              {listUserButton}
              <DropdownItem divider />
            </DropdownMenu>
          </UncontrolledButtonDropdown>

          <Dropdown nav isOpen={this.state.dropdownOpen} toggle={this.toggle}>
            <DropdownToggle nav caret>
              <FontAwesomeIcon icon={faWrench}/> Utilities
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem><NavLink  className="nav-link dropdown-item" to="/Jobviewer"> <FontAwesomeIcon icon={faEye}/> Job Viewer  </NavLink> </DropdownItem>
              <DropdownItem><NavLink  className="nav-link dropdown-item" to="/CustomObject"> <FontAwesomeIcon icon={faWrench}/> Custom Object  </NavLink> </DropdownItem>
              <DropdownItem><NavLink  className="nav-link dropdown-item" to="/pmusers"> <FontAwesomeIcon icon={faWrench}/> Show PM Users  </NavLink> </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        
          <Dropdown nav isOpen={this.state.osdropdownOpen} toggle={this.toggleos}>
            <DropdownToggle nav caret> <FontAwesomeIcon icon={faToolbox}/> OneStop </DropdownToggle>
              <DropdownMenu>
                <DropdownItem><NavLink onClick={() => this.closeMenu()} className="nav-link dropdown-item" to="/OS_Dashboard" > <FontAwesomeIcon icon={faClipboard}/> Dashboard  </NavLink> </DropdownItem>
                <DropdownItem><NavLink onClick={() => this.closeMenu()} className="nav-link dropdown-item" to="/OS_Processes" > <FontAwesomeIcon icon={faMicrochip}/> Processes  </NavLink> </DropdownItem>
                <DropdownItem><NavLink onClick={() => this.closeMenu()} className="nav-link dropdown-item" to="/OS_Network" > <FontAwesomeIcon icon={faSitemap}/> Network  </NavLink> </DropdownItem>
                <DropdownItem><NavLink onClick={() => this.closeMenu()} className="nav-link dropdown-item" to="/OS_Logs" > <FontAwesomeIcon icon={faFile}/> Logs  </NavLink> </DropdownItem>
                <Dropdown nav isOpen={this.state.osoracledropdownOpen} toggle={this.toggleosoracle}>
                  <DropdownToggle nav caret> <FontAwesomeIcon icon={faDatabase}/> Oracle </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem><NavLink onClick={() => this.closeMenu()} className="nav-link dropdown-item" to="/OS_oracleTableSpace" > <FontAwesomeIcon icon={faDatabase}/> Check Table Space  </NavLink> </DropdownItem>
                    <DropdownItem><NavLink onClick={() => this.closeMenu()} className="nav-link dropdown-item" to="/OS_oracleParameters" > <FontAwesomeIcon icon={faDatabase}/> Check Oracle Parameters  </NavLink> </DropdownItem>
                    <DropdownItem><NavLink onClick={() => this.closeMenu()} className="nav-link dropdown-item" to="/OS_oracleLongRunning" > <FontAwesomeIcon icon={faDatabase}/> Check for Long Running Queries  </NavLink> </DropdownItem>
                    <DropdownItem><NavLink onClick={() => this.closeMenu()} className="nav-link dropdown-item" to="/OS_oracleQueryReservation" > <FontAwesomeIcon icon={faDatabase}/> Query Reservation Table  </NavLink> </DropdownItem>
                    <DropdownItem><NavLink onClick={() => this.closeMenu()} className="nav-link dropdown-item" to="/OS_oracleGetAppliedRounds" > <FontAwesomeIcon icon={faDatabase}/> Check Applied Rounds  </NavLink> </DropdownItem>
                    <DropdownItem><NavLink onClick={() => this.closeMenu()} className="nav-link dropdown-item" to="/OS_oraclecheckRounds" > <FontAwesomeIcon icon={faDatabase}/> Check Rounds  </NavLink> </DropdownItem>
                    <DropdownItem><NavLink onClick={() => this.closeMenu()} className="nav-link dropdown-item" to="/OS_oraclecheckMaxProcesses" > <FontAwesomeIcon icon={faDatabase}/> Check Max Processes  </NavLink> </DropdownItem>
                    <DropdownItem><NavLink onClick={() => this.closeMenu()} className="nav-link dropdown-item" to="/OS_oraclecheckGRStatus" > <FontAwesomeIcon icon={faDatabase}/> Check Grouping and Reimbursement Status  </NavLink> </DropdownItem>
                    <DropdownItem><NavLink onClick={() => this.closeMenu()} className="nav-link dropdown-item" to="/OS_oraclecheckLocks" > <FontAwesomeIcon icon={faDatabase}/> Check Oracle Locks  </NavLink> </DropdownItem>
                    <DropdownItem><NavLink onClick={() => this.closeMenu()} className="nav-link dropdown-item" to="/OS_oraclecheckActivity" > <FontAwesomeIcon icon={faDatabase}/> Check Oracle Activity  </NavLink> </DropdownItem>
                  </DropdownMenu>
                </Dropdown>

                <DropdownItem><NavLink onClick={() => this.closeMenu()} className="nav-link dropdown-item" to="/OS_Admin" > <FontAwesomeIcon icon={faUserSecret}/> Admin  </NavLink> </DropdownItem>
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


