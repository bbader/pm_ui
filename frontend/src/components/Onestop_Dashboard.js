import React from 'react';
import axios from 'axios';
import styled from 'styled-components';
import * as Table from 'reactabular-table';
import { Column, Row } from 'simple-flexbox';

const AlignedBodyCell = styled.td`
  text-align: ${props => props.isNumber ? 'right' : 'left'};
`;
export class Onestop_Dashboard extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        currentTime: [],
        cpuData: [],
        currLoad: [],
        fileSystem: [],
        memData: [],
        networkData: [],
        networkStats: [],
        osInfo: [],
        pmVer: [],
        upTime: [],
        hostname: [],
        syscolumns: this.getSysColumns(),
        sysrows: [],
        pmvercols: this.getpmVerCols(),
        pmverrows: [],
        cpucols: this.getCpuCols(),
        cpurows: [],
        memcols: this.getMemCols(),
        memrows: [],
        swapcols: this.getSwapCols(),
        swaprows: [],
        netcols: this.getNetworkCols(),
        netrows: [],
        diskcolumns: this.getDiskColumns(),
        diskrows: [],
        usercols: this.getUserCols(),
        userrows: []

      };
    }

    getSysColumns() {
      return [
        { property: 'HOSTNAME', header: { label: 'Host Name' } },
        { property: 'CURRENT_TIME', header: { label: 'Current System Time' } }
      ];
    }

    getpmVerCols() {
      return [
        { property: 'MAJOR', header: { label: 'Major' } },
        { property: 'MINOR', header: { label: 'Minor' } },
        { property: 'SP', header: { label: 'SP' } },
        { property: 'CP', header: { label: 'CP' } }
      ];
    }

    getCpuCols() {
      return [
        { property: 'LOAD', header: { label: 'Load Avg' } },
        { property: 'USER', header: { label: 'User' } },
        { property: 'SYS', header: { label: 'System' } },
        { property: 'IDLE', header: { label: 'Idle' } },
        { property: 'IO', header: { label: 'I/O Wait' } },
        { property: 'CORES', header: { label: 'Cores' } },
      ];
    }

    getMemCols() {
      return [
        { property: 'TOTAL', header: { label: 'Total' } },
        { property: 'FREE', header: { label: 'Free' } },
        { property: 'USED', header: { label: 'Used' } },
        { property: 'ACTIVE', header: { label: 'Active' } },
        { property: 'BUF', header: { label: 'Buffer Cache' } },
        { property: 'AVAIL', header: { label: 'Available' } },
      ];
    }

    getSwapCols() {
      return [
        { property: 'TOTAL', header: { label: 'Total' } },
        { property: 'FREE', header: { label: 'Free' } },
        { property: 'USED', header: { label: 'Used' } },
      ];
    }
    
    getNetworkCols() {
      return [
        { property: 'INT', header: { label: 'Interface' } },
        { property: 'IP', header: { label: 'IP' } },
        { property: 'RX', header: { label: 'RX/s' } },
        { property: 'TX', header: { label: 'TX/s' } },
      ];
    }

    getDiskColumns() {
      return [
        { property: 'DEVICE', header: { label: 'Device' } },
        { property: 'MOUNTED', header: { label: 'Mounted' } },
        { property: 'TOTAL', header: { label: 'Total' } },
        { property: 'USED', header: { label: 'Used' } },
        { property: 'FREE', header: { label: 'Free' } }
      ];
    }

    getUserCols() {
      return [
        { property: 'USER', header: { label: 'User' } },
        { property: 'TTY', header: { label: 'TTY' } },
        { property: 'DATE', header: { label: 'Date Started' } },
        { property: 'REMOTE', header: { label: 'Remote Login IP' } },
        { property: 'LAST', header: { label: 'Last Command' } },      
      ];
    }

componentDidMount() {
  axios({
    method:'get',
    url:'http://10.211.55.253:3000/utilities/onestop/dashboard/fe',
    headers: { 'authorization': sessionStorage.getItem('token'),
   }
  })
  .catch(function (error) {
    if (error.response) {
      console.log(error.response);
      alert(error.response.data.message);
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

      this.renderRowData(res.data);
      })
    .catch(err => console.log(err));
}

renderRowData(data) {
  // System Info
  var sysrowData = [];
  var sysrow = {
    id: 1,
    HOSTNAME: data.osInfo.hostname,
    CURRENT_TIME: data.currentTime,
  };

  sysrowData.push(sysrow);
  let sysrows = sysrowData;
  this.setState({sysrows});

  // PM Version
  var pmverrowData = [];
  var pmverrow = {
    id: 1,
    MAJOR: data.pm_ver.major,
    MINOR: data.pm_ver.minor,
    SP: data.pm_ver.sp,
    CP: data.pm_ver.cp
  };
  pmverrowData.push(pmverrow);
  let pmverrows = pmverrowData;
  this.setState({pmverrows});

  // CPU Info
  var cpurowData = [];
  var cpurow = {
    id: 1,
    LOAD: data.curr_load.avgload + ' %',
    USER: parseFloat(data.curr_load.currentload_user).toPrecision(4)+ ' %',
    SYS: parseFloat(data.curr_load.currentload_system).toPrecision(4)+ ' %',
    IDLE: parseFloat(data.curr_load.currentload_idle).toPrecision(4)+ ' %', 
    IO: parseFloat(data.curr_load.currentload_irq).toPrecision(4)+ ' %',
    CORES: data.cpu_data.cores
  };
  cpurowData.push(cpurow);
  let cpurows = cpurowData;
  this.setState({cpurows});

  // Memory Info
  var memrowData = [];
  var memrow = {
    id: 1,
    TOTAL: data.mem_data.total + ' GB',
    FREE: data.mem_data.free + ' GB',
    USED: data.mem_data.used + ' GB',
    ACTIVE: data.mem_data.active + ' GB',
    BUF: data.mem_data.buffcache + ' GB',
    AVAIL: data.mem_data.available + ' GB'
  };
  memrowData.push(memrow);
  let memrows = memrowData;
  this.setState({memrows});

  // Swap Space
  var swaprowData = [];
  var swaprow = {
    id: 1,
    TOTAL: data.mem_data.swaptotal + ' GB',
    FREE: data.mem_data.swapfree + ' GB',
    USED: data.mem_data.swapused + ' GB'
  };
  swaprowData.push(swaprow);
  let swaprows = swaprowData;
  this.setState({swaprows});

  // Network
  let net = data.network_data;
  var netrowData = [];
  var netrow = {
    id: '',
    INT: '',
    IP: '',
    RX: '',
    TX: ''
  };

  var count = 0;
  for (let i = 0; i < net.length; i++){
    let row = net[i];

    netrow = {
      id: i,
      INT: row.iface,
      IP: row.ip4,
      RX: parseFloat(data.network_stats[count].rx_sec).toPrecision(6),
      TX: parseFloat(data.network_stats[count].tx_sec).toPrecision(6)
    };
    count++;
    netrowData.push(netrow);
  }
  let netrows = netrowData;
  this.setState({netrows});

  // File System
  let filesys = data.fileSystem;
  var diskrowData = [];
  var diskrow = {
    id: '',
    DEVICE: '',
    MOUNTED: '',
    TOTAL: '', 
    USED: '', 
    FREE: '', 
  };
 
  for (let i = 0; i < filesys.length; i++){
    let row = filesys[i];

    diskrow = {
      id: i,
      DEVICE: row.fs,
      MOUNTED: row.mount,
      TOTAL: row.size + ' GB',
      USED: row.used + ' GB',
      FREE: parseFloat(row.size - row.used).toPrecision(4) + ' GB'
    };
    diskrowData.push(diskrow);
  }
  let diskrows = diskrowData;
  this.setState({diskrows});

  // User Info
  let user = data.userData;
  var userrowData = [];
  var userrow = {
    id: '',
    USER: '',
    TTY: '',
    DATE: '',
    REMOTE: '',
    LAST: ''
  };

  for (let i = 0; i < user.length; i++){
    let row = user[i];

    userrow = {
      id: i,
      USER: row.user,
      TTY: row.tty,
      DATE: row.date,
      REMOTE: row.ip,
      LAST: row.command
    };
    userrowData.push(userrow);
  }
  let userrows = userrowData;
  this.setState({userrows});
}


  render() {
    const { syscolumns, sysrows, pmvercols, pmverrows, diskcolumns, diskrows,
      cpucols, cpurows, memcols, memrows, swapcols, swaprows, netcols, netrows, usercols, userrows 
    } = this.state;


    const stylingRenderers = {
      body: {
        cell: AlignedBodyCell // the one element we are overriding
      }
    };

    return (
      <div>
        <br/>
        <br/>
        <Column flexGrow={1}>
          <Row horizontal='center'>
            <Table.Provider
              className="pure-table pure-table-striped"
              columns = { syscolumns }
              renderers={stylingRenderers}
              style={{ width: 700 }}   >

            <Table.Header ></Table.Header>
          
            <Table.Body rows={ sysrows} rowKey="id" />
            </Table.Provider>
            </Row>
        </Column>
        <h6>PM Version</h6>
        <Column flexGrow={1}>
          <Row horizontal='center'>
            <Table.Provider
              className="pure-table pure-table-striped"
              columns = { pmvercols }
              renderers={stylingRenderers}
              style={{ width: 700 }}   >

            <Table.Header ></Table.Header>
          
            <Table.Body rows={ pmverrows} rowKey="id" />
            </Table.Provider>
            </Row>
        </Column>
        <h6>CPU</h6>
        <Column flexGrow={1}>
          <Row horizontal='center'>
            <Table.Provider
              className="pure-table pure-table-striped"
              columns = {cpucols }
              renderers={stylingRenderers}
              style={{ width: 700 }}   >

            <Table.Header ></Table.Header>
          
            <Table.Body rows={ cpurows} rowKey="id" />
            </Table.Provider>
            </Row>
        </Column>
        <h6>Memory</h6>
        <Column flexGrow={1}>
          <Row horizontal='center'>
            <Table.Provider
              className="pure-table pure-table-striped"
              columns = {memcols }
              renderers={stylingRenderers}
              style={{ width: 700 }}   >

            <Table.Header ></Table.Header>
          
            <Table.Body rows={ memrows} rowKey="id" />
            </Table.Provider>
            </Row>
        </Column>
        <h6>Swap Space</h6>
        <Column flexGrow={1}>
          <Row horizontal='center'>
            <Table.Provider
              className="pure-table pure-table-striped"
              columns = {swapcols }
              renderers={stylingRenderers}
              style={{ width: 700 }}   >

            <Table.Header ></Table.Header>
          
            <Table.Body rows={ swaprows} rowKey="id" />
            </Table.Provider>
            </Row>
        </Column>
        <h6>Network Information</h6>
        <Column flexGrow={1}>
          <Row horizontal='center'>
            <Table.Provider
              className="pure-table pure-table-striped"
              columns = {netcols }
              renderers={stylingRenderers}
              style={{ width: 700 }}   >

            <Table.Header ></Table.Header>
          
            <Table.Body rows={ netrows} rowKey="id" />
            </Table.Provider>
            </Row>
        </Column>
        <h6>Disk Information</h6>
        <Column flexGrow={1}>
          <Row horizontal='center'>
            <Table.Provider
              className="pure-table pure-table-striped"
              columns = { diskcolumns }
              renderers={stylingRenderers}
              style={{ width: 700 }}   >

            <Table.Header ></Table.Header>
          
            <Table.Body rows={ diskrows} rowKey="id" />
            </Table.Provider>
          </Row>
        </Column>
        <h6>User Information</h6>
        <Column flexGrow={1}>
          <Row horizontal='center'>
            <Table.Provider
              className="pure-table pure-table-striped"
              columns = {usercols }
              renderers={stylingRenderers}
              style={{ width: 700 }}   >

            <Table.Header ></Table.Header>
          
            <Table.Body rows={ userrows} rowKey="id" />
            </Table.Provider>
            </Row>
        </Column>
        <br/>


      </div>
    );
  }
}