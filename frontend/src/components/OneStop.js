import React from 'react';
import styled from 'styled-components';
import * as Table from 'reactabular-table';
import { Column, Row } from 'simple-flexbox';
import { myConfig } from '../config';
import { getDataAPI } from './api';

const AlignedBodyCell = styled.td`
  text-align: ${props => props.isNumber ? 'right' : 'left'};
`;

export class OS_Dashboard extends React.Component {
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
      getDataAPI.all(this.updateResult, myConfig.base_url + '/utilities/onestop/dashboard/fe');
    }
  
    updateResult = (res) => {
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

export class OS_Processes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: [],
      rows: []
    };
  }

  render() {
    return(
      <div>

      </div>
    );
  }
}

export class OS_Network extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: [],
      rows: []
    };
  }

  render() {
    return(
      <div></div>
    );
  }
}

export class OS_Disks extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: [],
      rows: []
    };
  }

  render() {
    return(
      <div></div>
    );
  }
}

export class OS_Logs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: [],
      rows: []
    };
  }

  render() {
    return(
      <div></div>
    );
  }
}

export class OS_oracleTableSpace extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: this.getColumns(),
      rows: []
    };
  }

  getColumns() {
    return [
      { property: 'Tablespace', header: { label: 'Tablespace' } },
      { property: 'Size (MB)', header: { label: 'Size (MB)' } },
      { property: 'Free (MB)', header: { label: 'Free (MB)' } },
      { property: '% Free', header: { label: '% Free' } },
      { property: '% Used', header: { label: '% Used' } }
    ];
  }

  componentDidMount() {
    getDataAPI.all(this.updateResult, myConfig.base_url + '/utilities/onestop/oracleTableSpace');
  }

  updateResult = (res) => {
    this.renderRowData(res.data.rows)
}
  
  renderRowData(data) {
    var userrowData = [];
    var userrow = {
      id: '',
      Tablespace: '',
      'Size (MB)': '',
      'Free (MB)': '',
      '% Free': '',
      '% Used': ''
    };
  
    for (let i = 0; i < data.length; i++){
      let row = data[i];
  
      userrow = {
        id: i,
        Tablespace: row.Tablespace,
        'Size (MB)': row['Size (MB)'],
        'Free (MB)': row['Free (MB)'],
        '% Free': row['% Free'],
        '% Used': row['% Used']
      };
      userrowData.push(userrow);
    }
    let rows = userrowData;
    this.setState({rows});  
  }

  render() {
    const { columns, rows } = this.state;

    const stylingRenderers = {
      body: {
        cell: AlignedBodyCell // the one element we are overriding
      }
    };

    return(
      <div>
        <br/>
          <Column flexGrow={1}>
          <Row horizontal='center'>
            <Table.Provider
              className="pure-table pure-table-striped"
              columns = {columns }
              renderers={stylingRenderers}
              style={{ width: 700 }}   >

            <Table.Header ></Table.Header>
          
            <Table.Body rows={ rows} rowKey="id" />
            </Table.Provider>
            </Row>
          </Column>
      </div>
    );
  }
}



export class OS_oracleParameters extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: this.getColumns(),
      rows: [], 
      data: null
    };
  }

  getColumns() {
    return [
      { property: 'NAME', header: { label: 'Name' } },
      { property: 'TYPE', header: { label: 'Type' } },
      { property: 'VALUE', header: { label: 'Value' } }
    ];
  }

  componentDidMount() {
    getDataAPI.all(this.updateResult, myConfig.base_url + '/utilities/onestop/oracleParameters');
  }

  updateResult = (res) => {
    this.renderRowData(res.data.rows)
}
  
  renderRowData(data) {
    var userrowData = [];
    var userrow = {
      id: '',
      NAME: '',
      TYPE: '',
      VALUE: ''
    };

    for (let i = 0; i < data.length; i++){
      let row = data[i];
  
      userrow = {
        id: i,
        NAME: row.NAME,
        TYPE: row.TYPE,
        VALUE: row.VALUE
      };
      userrowData.push(userrow);
    }
    let rows = userrowData;
    this.setState({rows});  
  }

  render() {
    const { columns, rows } = this.state;

    const stylingRenderers = {
      body: {
        cell: AlignedBodyCell // the one element we are overriding
      }
    };

    return(
      <div>
        <br/>
        <Column flexGrow={1}>
        <Row horizontal='center'>
        <Table.Provider
          className="pure-table pure-table-striped"
          columns = {columns }
          renderers={stylingRenderers}
          style={{ width: 700 }}   >

          <Table.Header ></Table.Header>
          
          <Table.Body rows={ rows} rowKey="id" />
          </Table.Provider>
          </Row>
        </Column>
      </div>
    );
  }
}

export class OS_oracleLongRunning extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: this.getColumns(),
      rows: [], 
      data: null
    };
  }

  getColumns() {
    return [
      { property: 'SID', header: { label: 'SID' } },
      { property: 'STIME', header: { label: 'Time' } },
      { property: 'MESSAGE', header: { label: 'Message' } },
      { property: 'PERCENT', header: { label: 'Percent' } }
    ];
  }

  componentDidMount() {
    getDataAPI.all(this.updateResult, myConfig.base_url + '/utilities/onestop/oracleLongRunning');
  }

  updateResult = (res) => {
    this.renderRowData(res.data.rows)
}
  
  renderRowData(data) {
    var userrowData = [];
    var userrow = {
      id: '',
      SID: '',
      STIME: '',
      MESSAGE: '',
      PERCENT: ''
    };

    for (let i = 0; i < data.length; i++){
      let row = data[i];
  
      userrow = {
        id: i,
        SID: row.SID,
        STIME: row.STIME,
        MESSAGE: row.MESSAGE,
        PERCENT: row.PERCENT
      };
      userrowData.push(userrow);
    }
    let rows = userrowData;
    this.setState({rows});  
  }

  render() {
    const { columns, rows } = this.state;

    const stylingRenderers = {
      body: {
        cell: AlignedBodyCell // the one element we are overriding
      }
    };

    return(
      <div>
        <br/>
        <Column flexGrow={1}>
        <Row horizontal='center'>
        <Table.Provider
          className="pure-table pure-table-striped"
          columns = {columns }
          renderers={stylingRenderers}
          style={{ width: 700 }}   >

          <Table.Header ></Table.Header>
          
          <Table.Body rows={ rows} rowKey="id" />
          </Table.Provider>
          </Row>
        </Column>
      </div>
    );
  }
}

export class OS_oracleQueryReservation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: this.getColumns(),
      rows: [], 
      data: null
    };
  }

  getColumns() {
    return [
      { property: 'OWNER_NAME', header: { label: 'Owner' } },
      { property: 'CONTROLLER_IP', header: { label: 'IP' } },
      { property: 'CONTROLLER_PORT', header: { label: 'Port' } },
      { property: 'RESERVATION_TYPE', header: { label: 'Reservation Type' } },
      { property: 'TARGET_ID', header: { label: 'Target' } },
      { property: 'TIME_EXPIRES', header: { label: 'Expires' } },
      { property: 'TIME_RESERVED HEADING', header: { label: 'Time Reserved' } },
      { property: 'UNIQUE_ID', header: { label: 'UID' } }
    ];
  }

  componentDidMount() {
    getDataAPI.all(this.updateResult, myConfig.base_url + '/utilities/onestop/oracleQueryReservation');
  }

  updateResult = (res) => {
    this.renderRowData(res.data.rows)
}
  
  renderRowData(data) {
    var userrowData = [];
    var userrow = {
      id: '',
      OWNER_NAME: '',
      CONTROLLER_IP: '',
      CONTROLLER_PORT: '',
      RESERVATION_TYPE: '',
      TARGET_ID: '',
      TIME_EXPIRES: '',
      'TIME_RESERVED HEADING': '',
      UNIQUE_ID: ''
    };

    for (let i = 0; i < data.length; i++){
      let row = data[i];
  
      userrow = {
        id: i,
        OWNER_NAME: row.OWNER_NAME,
        CONTROLLER_IP: row.CONTROLLER_IP,
        CONTROLLER_PORT: row.CONTROLLER_PORT,
        RESERVATION_TYPE: row.RESERVATION_TYPE,
        TARGET_ID: row.TARGET_ID,
        TIME_EXPIRES: row.TIME_EXPIRES,
        'TIME_RESERVED HEADING': row['TIME_RESERVED HEADING'],
        UNIQUE_ID: row.UNIQUE_ID
      };
      userrowData.push(userrow);
    }
    let rows = userrowData;
    this.setState({rows});  
  }

  render() {
    const { columns, rows } = this.state;

    const stylingRenderers = {
      body: {
        cell: AlignedBodyCell // the one element we are overriding
      }
    };

    return(
      <div>
        <br/>
        <Column flexGrow={1}>
        <Row horizontal='center'>
        <Table.Provider
          className="pure-table pure-table-striped"
          columns = {columns }
          renderers={stylingRenderers}
          style={{ width: 700 }}   >

          <Table.Header ></Table.Header>
          
          <Table.Body rows={ rows} rowKey="id" />
          </Table.Provider>
          </Row>
        </Column>
      </div>
    );
  }
}

export class OS_oracleGetAppliedRounds extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: this.getColumns(),
      rows: [], 
      data: null
    };
  }

  getColumns() {
    return [
      { property: 'NAME', header: { label: 'Name' } },
      { property: 'DATE_SUPPLIED', header: { label: 'Date Supplied' } },
      { property: 'DATE_APPLIED', header: { label: 'Date Applied' } }
    ];
  }

  componentDidMount() {
    getDataAPI.all(this.updateResult, myConfig.base_url + '/utilities/onestop/oracleGetAppliedRounds');
  }

  updateResult = (res) => {
    this.renderRowData(res.data.rows)
}
  
  renderRowData(data) {
    var userrowData = [];
    var userrow = {
      id: '',
      NAME: '',
      DATE_SUPPLIED: '',
      DATE_APPLIED: ''
    };

    for (let i = 0; i < data.length; i++){
      let row = data[i];
  
      userrow = {
        id: i,
        NAME: row.NAME,
        DATE_SUPPLIED: row.DATE_SUPPLIED,
        DATE_APPLIED: row.DATE_APPLIED
      };
      userrowData.push(userrow);
    }
    let rows = userrowData;
    this.setState({rows});  
  }

  render() {
    const { columns, rows } = this.state;

    const stylingRenderers = {
      body: {
        cell: AlignedBodyCell // the one element we are overriding
      }
    };

    return(
      <div>
        <br/>
        <Column flexGrow={1}>
        <Row horizontal='center'>
        <Table.Provider
          className="pure-table pure-table-striped"
          columns = {columns }
          renderers={stylingRenderers}
          style={{ width: 800 }}   >

          <Table.Header ></Table.Header>
          
          <Table.Body rows={ rows} rowKey="id" />
          </Table.Provider>
          </Row>
        </Column>
      </div>
    );
  }
}

export class OS_oraclecheckRounds extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: this.getColumns(),
      rows: [], 
      data: null
    };
  }

  getColumns() {
    return [
      { property: 'COMPLETION_DATE', header: { label: 'Completion Date' } },
      { property: 'VERSION', header: { label: 'Version' } }
    ];
  }

  componentDidMount() {
    getDataAPI.all(this.updateResult, myConfig.base_url + '/utilities/onestop/oraclecheckRounds');
  }

  updateResult = (res) => {
    this.renderRowData(res.data.rows)
}
  
  renderRowData(data) {
    var userrowData = [];
    var userrow = {
      id: '',
      COMPLETION_DATE: '',
      VERSION: ''
    };

    for (let i = 0; i < data.length; i++){
      let row = data[i];
  
      userrow = {
        id: i,
        COMPLETION_DATE: row.COMPLETION_DATE,
        VERSION: row.VERSION
      };
      userrowData.push(userrow);
    }
    let rows = userrowData;
    this.setState({rows});  
  }

  render() {
    const { columns, rows } = this.state;

    const stylingRenderers = {
      body: {
        cell: AlignedBodyCell // the one element we are overriding
      }
    };

    return(
      <div>
        <br/>
        <Column flexGrow={1}>
        <Row horizontal='center'>
        <Table.Provider
          className="pure-table pure-table-striped"
          columns = {columns }
          renderers={stylingRenderers}
          style={{ width: 700 }}   >

          <Table.Header ></Table.Header>
          
          <Table.Body rows={ rows} rowKey="id" />
          </Table.Provider>
          </Row>
        </Column>
      </div>
    );
  }
}

export class OS_oraclecheckMaxProcesses extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: this.getColumns(),
      rows: [], 
      data: null
    };
  }

  getColumns() {
    return [
      { property: 'RESOURCE_NAME', header: { label: 'Resource Name' } },
      { property: 'INITIAL_ALLOCATION', header: { label: 'Initial Allocation' } },
      { property: 'CURRENT_UTILIZATION', header: { label: 'Current Utilization' } },
      { property: 'MAX_UTILIZATION', header: { label: 'Max Utilization' } }
    ];
  }

  componentDidMount() {
    getDataAPI.all(this.updateResult, myConfig.base_url + '/utilities/onestop/oraclecheckMaxProcesses');
  }

  updateResult = (res) => {
    this.renderRowData(res.data.rows)
}
  
  renderRowData(data) {
    var userrowData = [];
    var userrow = {
      id: '',
      RESOURCE_NAME: '',
      INITIAL_ALLOCATION: '',
      CURRENT_UTILIZATION: '',
      MAX_UTILIZATION: ''
    };

    for (let i = 0; i < data.length; i++){
      let row = data[i];
  
      userrow = {
        id: i,
        RESOURCE_NAME: row.RESOURCE_NAME,
        INITIAL_ALLOCATION: row.INITIAL_ALLOCATION,
        CURRENT_UTILIZATION: row.CURRENT_UTILIZATION,
        MAX_UTILIZATION: row.MAX_UTILIZATION
      };
      userrowData.push(userrow);
    }
    let rows = userrowData;
    this.setState({rows});  
  }

  render() {
    const { columns, rows } = this.state;

    const stylingRenderers = {
      body: {
        cell: AlignedBodyCell // the one element we are overriding
      }
    };

    return(
      <div>
        <br/>
        <Column flexGrow={1}>
        <Row horizontal='center'>
        <Table.Provider
          className="pure-table pure-table-striped"
          columns = {columns }
          renderers={stylingRenderers}
          style={{ width: 700 }}   >

          <Table.Header ></Table.Header>
          
          <Table.Body rows={ rows} rowKey="id" />
          </Table.Provider>
          </Row>
        </Column>
      </div>
    );
  }
}

export class OS_oraclecheckGRStatus extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: this.getColumns(),
      rows: [], 
      data: null
    };
  }

  getColumns() {
    return [
      { property: 'JOB_PROCESS_NUM', header: { label: 'Job Number' } },
      { property: 'START_DATE', header: { label: 'Start Date' } },
      { property: 'JOB_STATUS', header: { label: 'Job Status' } },
      { property: 'NAME', header: { label: 'Name' } },
      { property: 'DATA_SET_ID', header: { label: 'Date Set ID' } }
    ];
  }

  componentDidMount() {
    getDataAPI.all(this.updateResult, myConfig.base_url + '/utilities/onestop/oraclecheckGRStatus');
  }

  updateResult = (res) => {
    this.renderRowData(res.data.rows)
}
  
  renderRowData(data) {
    var userrowData = [];
    var userrow = {
      id: '',
      JOB_PROCESS_NUM: '',
      START_DATE: '',
      JOB_STATUS: '',
      NAME: '',
      DATA_SET_ID: ''
    };

    for (let i = 0; i < data.length; i++){
      let row = data[i];
  
      userrow = {
        id: i,
        JOB_PROCESS_NUM: row.JOB_PROCESS_NUM,
        START_DATE: row.START_DATE,
        JOB_STATUS: row.JOB_STATUS,
        NAME: row.NAME,
        DATA_SET_ID: row.DATA_SET_ID
      };
      userrowData.push(userrow);
    }
    let rows = userrowData;
    this.setState({rows});  
  }

  render() {
    const { columns, rows } = this.state;

    const stylingRenderers = {
      body: {
        cell: AlignedBodyCell // the one element we are overriding
      }
    };

    return(
      <div>
        <br/>
        <Column flexGrow={1}>
        <Row horizontal='center'>
        <Table.Provider
          className="pure-table pure-table-striped"
          columns = {columns }
          renderers={stylingRenderers}
          style={{ width: 700 }}   >

          <Table.Header ></Table.Header>
          
          <Table.Body rows={ rows} rowKey="id" />
          </Table.Provider>
          </Row>
        </Column>
      </div>
    );
  }
}

export class OS_oraclecheckLocks extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: this.getColumns(),
      rows: [], 
      data: null
    };
  }

  getColumns() {
    return [
      { property: 'OBJECT_NAME', header: { label: 'Object Name' } },
      { property: 'OBJECT_TYPE', header: { label: 'Object Type' } },
      { property: 'SESSION_ID', header: { label: 'Session ID' } },
      { property: 'TYPE', header: { label: 'Type' } },
      { property: 'LMODE', header: { label: 'Lmode' } },
      { property: 'REQUEST', header: { label: 'Request' } },
      { property: 'BLOCK', header: { label: 'Block' } },
      { property: 'CTIME', header: { label: 'Time' } }
    ];
  }

  componentDidMount() {
    getDataAPI.all(this.updateResult, myConfig.base_url + '/utilities/onestop/oraclecheckLocks');
  }

  updateResult = (res) => {
    this.renderRowData(res.data.rows)
}
  
  renderRowData(data) {
    var userrowData = [];
    var userrow = {
      id: '',
      OBJECT_NAME: '',
      OBJECT_TYPE: '',
      SESSION_ID: '',
      TYPE: '',
      LMODE: '',
      REQUEST: '',
      BLOCK: '',
      CTIME: ''
    };

    for (let i = 0; i < data.length; i++){
      let row = data[i];
  
      userrow = {
        id: i,
        OBJECT_NAME: row.OBJECT_NAME,
        OBJECT_TYPE: row.OBJECT_TYPE,
        SESSION_ID: row.SESSION_ID,
        TYPE: row.TYPE,
        LMODE: row.LMODE,
        REQUEST: row.REQUEST,
        BLOCK: row.BLOCK,
        CTIME: row.CTIME
      };
      userrowData.push(userrow);
    }
    let rows = userrowData;
    this.setState({rows});  
  }

  render() {
    const { columns, rows } = this.state;

    const stylingRenderers = {
      body: {
        cell: AlignedBodyCell // the one element we are overriding
      }
    };

    return(
      <div>
        <br/>
        <Column flexGrow={1}>
        <Row horizontal='center'>
        <Table.Provider
          className="pure-table pure-table-striped"
          columns = {columns }
          renderers={stylingRenderers}
          style={{ width: 700 }}   >

          <Table.Header ></Table.Header>
          
          <Table.Body rows={ rows} rowKey="id" />
          </Table.Provider>
          </Row>
        </Column>
      </div>
    );
  }
}

export class OS_oraclecheckActivity extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: this.getColumns(),
      rows: [], 
      data: null
    };
  }

  getColumns() {
    return [
      { property: 'USERNAME', header: { label: 'User Name' } },
      { property: 'SID', header: { label: 'SID' } },
      { property: 'OSUSER', header: { label: 'OS User' } },
      { property: 'SQL_ID', header: { label: 'SQL ID' } },
      { property: 'SQL_TEXT', header: { label: 'SQL Text' } }
    ];
  }

  componentDidMount() {
    getDataAPI.all(this.updateResult, myConfig.base_url + '/utilities/onestop/oraclecheckActivity');
  }

  updateResult = (res) => {
    this.renderRowData(res.data.rows)
}
  
  renderRowData(data) {
    var userrowData = [];
    var userrow = {
      id: '',
      USERNAME: '',
      SID: '',
      OSUSER: '',
      SQL_ID: '',
      SQL_TEXT: ''
    };

    for (let i = 0; i < data.length; i++){
      let row = data[i];
  
      userrow = {
        id: i,
        USERNAME: row.USERNAME,
        SID: row.SID,
        OSUSER: row.OSUSER,
        SQL_ID: row.SQL_ID,
        SQL_TEXT: row.SQL_TEXT
      };
      userrowData.push(userrow);
    }
    let rows = userrowData;
    this.setState({rows});  
  }

  render() {
    const { columns, rows } = this.state;

    const stylingRenderers = {
      body: {
        cell: AlignedBodyCell // the one element we are overriding
      }
    };

    return(
      <div>
        <br/>
        <Column flexGrow={1}>
        <Row horizontal='center'>
        <Table.Provider
          className="pure-table pure-table-striped"
          columns = {columns }
          renderers={stylingRenderers}
          style={{ width: 800 }}   >

          <Table.Header ></Table.Header>
          
          <Table.Body rows={ rows} rowKey="id" />
          </Table.Provider>
          </Row>
        </Column>
      </div>
    );
  }
}

export class OS_Admin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: [],
      rows: []
    };
  }

  render() {
    return(
      <div></div>
    );
  }
}

