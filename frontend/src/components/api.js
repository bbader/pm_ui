

import axios from 'axios';
import history from '../history';


export const getDataAPI = {
  posts: [],
  all: function(cb, url) {
    axios({
      method:'get',
      url: url,
      headers: { 'authorization': sessionStorage.getItem('token') }
    })
    .catch(function (error) {
      if (error.response) {
        alert(error.response.data.message);
        history.push( '/logout' );
      }
    })
      .then(res => {
        cb(res);
      })
      .catch(err => console.log(err));
  }
};

export const postDataAPI = {
  posts: [],
  all: function(cb, url, data) {
    axios({
      method:'post',
      url: url,
      headers: { 'authorization': sessionStorage.getItem('token') },
      data: data 
    })
    .catch(function (error) {
      if (error.response) {
        alert(error.response.data.message);
      }
    })
      .then(res => { cb(res); })
        // alert(res.statusText); })
      .catch(err => console.log(err));
  }
};

