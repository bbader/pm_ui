import React from 'react';
import axios from 'axios';


export class Onestop_Dashboard extends React.Component {
    constructor(props) {
    super(props);
    
    this.state = {
      currentTime: [], 
      cpuData: [],
      currLoad: [],
      fileSystem: [],
      memData: [],
      networkData:[],
      networkStats: [],
      osInfo: [],
      pmVer: [],
      upTime: []
      };
  }

componentDidMount() {
  axios({
    method:'get',
    url:'http://10.211.55.253:3000/utilities/onestop/dashboard/fe'

    // url:'https://jsonplaceholder.typicode.com/users'
  })
    .then(res => {
      this.setState({currentTime: res.data.currentTime});
      this.setState({cpuData: res.data.cpu_data});
      this.setState({currLoad: res.data.curr_load});
      this.setState({fileSystem: res.data.fileSystem});
      this.setState({memData: res.data.mem_data});
      this.setState({networkData: res.data.network_data});
      this.setState({networkStats: res.data.network_stats});
      this.setState({osInfo: res.data.osInfo});
      this.setState({pmVer: res.data.pm_ver});
      this.setState({upTime: res.data.upTime});
      console.log(res.data);
      })
    .catch(err => console.log(err));
}
  render() {
    return (
      <div>
        <h1> Onestop_Dashboard </h1>
        {this.state.currentTime };
        {this.state.osInfo.hostname};
        {this.state.fileSystem.map(res => <li>{res.fs} </li>)};
      </div>
    );
  }
}