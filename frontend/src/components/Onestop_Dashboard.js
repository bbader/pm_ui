import React from 'react';
import axios from 'axios';


export class Onestop_Dashboard extends React.Component {

componentDidMount() {
  axios
    .get(`'http://10.211.55.253:3000/utilities/onestop/dashboard'`)
    .then(res => console.log(res) )
    .catch(err => console.log(err))
}
  // axios.get('http://10.211.55.253:3000/utilities/onestop/dashboard')
  //         .then(response => console.log(response) )

  render() {
    return (
      <div>
        <h1> Onestop_Dashboard </h1>
      </div>
    );
  }
}