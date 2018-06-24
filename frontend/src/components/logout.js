

import React from 'react';
import history from '../history';

export class Logout extends React.Component {

  componentDidMount() {
    sessionStorage.removeItem('token');
    sessionStorage.setItem('isAuthenticated', false);
    history.push( '/' );
  }

  render() {
    return (
      <div></div>
    );
  }
}