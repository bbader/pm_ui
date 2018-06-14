import React from 'react';
import axios from 'axios';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';


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
      upTime: [],
      hostname: [],

      products: [
        {
          id: 1,
          name: 'TV',
          'price': 1000
        },
        {
          id: 2,
          name: 'Mobile',
          'price': 500
        },
        {
          id: 3,
          name: 'Book',
          'price': 20
        },
      ],
      columns: [{
        dataField: 'id',
        text: 'Product ID'
      },
      {
        dataField: 'name',
        text: 'Product Name'
      }, {
        dataField: 'price',
        text: 'Product Price',
        sort: true
      }],

      sysinfo: [
        {
          host: [],
          time: []
        },
      ],
      columns2: [{
        dataField: 'host',
        text: 'Host'
      }, {
        dataField: 'time',
        text: 'Current Time'
    }]
  };
  }

componentDidMount() {
  axios({
    method:'get',
    url:'http://10.211.55.253:3000/utilities/onestop/dashboard/fe',
    headers: { 'authorization': sessionStorage.getItem('token'),
   }
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
      this.setState({hostname: res.data.osInfo.hostname});
      this.setState({sysinfo.host: res.data.osInfo.hostname});

      console.log( this.state.sysinfo );
      console.log(res.data);
      })
    .catch(err => console.log(err));
}
  render() {
    return (
      <div>
        <h1> Onestop Dashboard </h1>

             <div className="container" style={{ marginTop: 50 }}>
        <BootstrapTable 
        striped
        hover
        keyField='id' 
        data={ this.state.products } 
        columns={ this.state.columns } />

        <BootstrapTable 
        striped
        hover
        keyField='id' 
        data={ this.state.sysinfo } 
        columns={ this.state.columns2 } />

      </div>

        {this.state.currentTime }
        {this.state.osInfo.hostname}
        {this.state.fileSystem.map(res => <li>{res.fs} </li>)}
      </div>
    );
  }
}