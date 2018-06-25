

import axios from 'axios';
import history from '../history';



export function getData(url) {
  // (async () => {

     axios({
      method:'get',
      url: url,
      headers: { 'authorization': sessionStorage.getItem('token'),
      }
      })
      .catch(function (error) {
        if (error.response) {
          // console.log(error.response);
          alert(error.response.data.message);
          history.push( '/logout' );
        }
      })
      .then(  res => {
        console.log(res);

         return  (res.data.rows);
        })
      .catch(err => console.log(err));


  // }
// )();
  }


