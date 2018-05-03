import React from 'react';
import axios from 'axios';

export class JobViewer extends React.Component {
    constructor(props) {
    super(props);
    
    this.state = {
      sqlMetadata: [], 
      sqlResult: []
      };
  }

componentDidMount() {
  axios({
    method:'get',
    url:'http://10.211.55.253:3000/utilities/jobViewer/fe'
  })
    .then(res => {
      this.setState({sqlMetadata: res.data.sqlMetadata});
      this.setState({sqlResult: res.data.sqlResult});
      console.log(res.data);
      })
    .catch(err => console.log(err));
}
  render() {
    const columns = [
      {
        {this.state.sqlMetadata.map( (res) => (
        property: {res.name},
        header: { label: res.name}) )}
      }
    ]
    return (
      <div>
        <h1> Job Viewer </h1>
        {this.state.sqlMetadata.map( (res) => (
        <li key={res.name}> {res.name} </li>))}

        {/* {this.state.currentTime }; */}
      </div>
    );
  }


}