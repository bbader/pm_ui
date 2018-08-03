
import React from 'react';
import { Button } from 'reactstrap';
import { compose } from 'redux';
import { cloneDeep, orderBy } from 'lodash';
import styled from 'styled-components';
import * as Table from 'reactabular-table';
import * as search from 'searchtabular';
import * as sort from 'sortabular';
import * as resizable from 'reactabular-resizable';
import * as resolve from 'table-resolver';
import VisibilityToggles from 'react-visibility-toggles';
import { Paginator, PrimaryControls, paginate } from '../helpers';
import { Column, Row } from 'simple-flexbox';
import { myConfig } from '../config';
import { getDataAPI, postDataAPI } from './api';
import history from '../history';

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
      this.interval = setInterval(() => {
        //autoPlay some for specific period of times or
        // Do some stuff you want
        getDataAPI.all(this.updateResult, myConfig.base_url + '/utilities/onestop/dashboard/fe');
      }, 5000); 
    }
  
    componentWillUnmount() {
      clearInterval(this.interval);
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
      columns: this.getColumns(),
      rows: [],
      selectedrow: {},
      query: {},
      searchColumn: 'all',
      sortingColumns: null, // reference to the sorting columns
      pagination: { // initial pagination settings
        page: 1,
        perPage: 100
      },
      allProcesses: '',
      runningProcesses: '',
      blockedProcesses: '',
      sleepingProcesses: ''
    };
    this.onRow = this.onRow.bind(this);
    this.onRowSelected = this.onRowSelected.bind(this);
    this.onColumnChange = this.onColumnChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onPerPage = this.onPerPage.bind(this);
    this.onToggleColumn = this.onToggleColumn.bind(this);
    this.onButtonSearch = this.onButtonSearch.bind(this);
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      getDataAPI.all(this.updateResult, myConfig.base_url + '/utilities/onestop/getProcesses');
    }, 5000); 
  }

  updateResult = (res) => {
    let rows = this.renderRowData(res.data);
    this.setState({rows});
}

componentWillUnmount() {
  clearInterval(this.interval);
}

formatBytes(a,b){if(0===a)return'0 Bytes';var c=1024,d=b||2,e=['Bytes','KB','MB','GB','TB','PB','EB','ZB','YB'],f=Math.floor(Math.log(a)/Math.log(c));return parseFloat((a/Math.pow(c,f)).toFixed(d))+' ' +e[f];}

renderRowData(data) {
  var rowData = [];
  var rows = {
    id: '',
    PID: '',
    NAME: '',
    COMMAND: '',
    USER: '',
    TTY: '',
    STATE: '',
    STARTED: '',
    MEM_RSS: '',
    MEM_VSZ: '',
    PMEM: '',
    PCPU: ''
  };
  this.setState({allProcesses: data.all});
  this.setState({runningProcesses: data.running});
  this.setState({blockedProcesses: data.blocked});
  this.setState({sleepingProcesses: data.sleeping});

  for (let i = 0; i < data.list.length; i++){
    let row = data.list[i];

    rows = {
      id: i,
      PID: row.pid,
      NAME: row.name,
      COMMAND: row.command,
      USER: row.user,
      TTY: row.tty,
      STATE: row.state,
      STARTED: row.started,
      MEM_RSS: this.formatBytes(row.mem_rss, 2),
      MEM_VSZ: this.formatBytes(row.mem_vsz, 2),
      PMEM: row.pmem,
      PCPU: parseFloat(row.pcpu.toPrecision(4)) 
    };
    rowData.push( rows );
  }
  return rowData;
}

getColumns() {
  const sortable = sort.sort({
    getSortingColumns: () => this.state.sortingColumns || [],
    onSort: selectedColumn => {
      this.setState({
        sortingColumns: sort.byColumns({ 
          sortingColumns: this.state.sortingColumns,
          selectedColumn
        })
      });
    }
  });
  const sortableHeader = sortHeader(sortable, () => this.state.sortingColumns);
  const resize = resizable.column({
    getWidth: column => column.header.props.style.width,
    onDrag: (width, { columnIndex }) => {
      const columns = this.state.columns;
      const column = columns[columnIndex];

      column.header.props.style = {
        ...column.header.props.style,
        width
      };

      this.setState({ columns });
    }
  });
  return [
    {
      property: 'PID',
      header: { label: 'PID',formatters: [ (v, extra) => resize(sortableHeader(v, extra), extra)],
        props: { style: { width: 100 } } },
      cell: { formatters: [ search.highlightCell ] },
      visible: true
    },
    {
    property: 'NAME',
    header: { label: 'Name', formatters: [ (v, extra) => resize(sortableHeader(v, extra), extra) ],
      props: { style: { width: 100 } } },
    cell: { formatters: [ search.highlightCell ] },
    visible: true
  },
  {
    property: 'COMMAND',
    header: { label: 'Command', formatters: [ (v, extra) => resize(sortableHeader(v, extra), extra) ],
      props: { style: { width: 100 } } },
    cell: { formatters: [ search.highlightCell ] },
    visible: false
  },
  {
    property: 'USER',
    header: { label: 'User', formatters: [ (v, extra) => resize(sortableHeader(v, extra), extra) ],
      props: { style: { width: 100 } } },
    cell: { formatters: [ search.highlightCell ] },
    visible: true
  },
  {
    property: 'TTY',
    header: { label: 'TTY', formatters: [ (v, extra) => resize(sortableHeader(v, extra), extra) ],
      props: { style: { width: 100 } } },
    cell: { formatters: [ search.highlightCell ] },
    visible: true
  },
  {
    property: 'STATE',
    header: { label: 'State', formatters: [ (v, extra) => resize(sortableHeader(v, extra), extra) ],
      props: { style: { width: 100 } } },
    cell: { formatters: [ search.highlightCell ] },
    visible: true
  },
  {
    property: 'STARTED',
    header: { label: 'Started', formatters: [ (v, extra) => resize(sortableHeader(v, extra), extra) ],
      props: { style: { width: 100 } } },
    cell: { formatters: [ search.highlightCell ] },
    visible: true
  },
  {
    property: 'MEM_RSS',
    header: { label: 'RSS', formatters: [ (v, extra) => resize(sortableHeader(v, extra), extra) ],
      props: { style: { width: 100 } } },
    cell: { formatters: [ search.highlightCell ] },
    visible: true
  },
  {
    property: 'MEM_VSZ',
    header: { label: 'VMS', formatters: [ (v, extra) => resize(sortableHeader(v, extra), extra) ],
      props: { style: { width: 100 } } },
    cell: { formatters: [ search.highlightCell ] },
    visible: true
  },
  {
    property: 'PMEM',
    header: { label: '%Memory', formatters: [ (v, extra) => resize(sortableHeader(v, extra), extra) ],
      props: { style: { width: 100 } } },
    cell: { formatters: [ search.highlightCell ] },
    visible: true
  },
  {
    property: 'PCPU',
    header: { label: '%CPU', formatters: [ (v, extra) => resize(sortableHeader(v, extra), extra) ],
      props: { style: { width: 100 } } },
    cell: { formatters: [ search.highlightCell ] },
    visible: true
  }  
  ];
}
  render() {
    const {
      columns, rows, pagination, sortingColumns, searchColumn, query
    } = this.state;
    const cols = columns.filter(column => column.visible);
    const paginated = compose(
      paginate(pagination),
      sort.sorter({ columns: cols, sortingColumns, sort: orderBy }),
      search.highlighter({ columns: cols, matches: search.matches, query }),
      search.multipleColumns({ columns: cols, query }),
      resolve.resolve({
        columns: cols,
        method: (extra) => compose(
          resolve.byFunction('cell.resolve')(extra),
          resolve.nested(extra)
        )
      })
    )(rows);

    return(
      <div>
        <VisibilityToggles
          columns={columns}
          onToggleColumn={this.onToggleColumn}
        />

        {(
          <div>
          <Button onClick= {() => {this.onButtonSearch(''); }} outline color='primary' size='sm' >All:{this.state.allProcesses} </Button>
          <Button onClick= {() => {this.onButtonSearch('running'); }} outline color='primary' size='sm' >Running:{this.state.runningProcesses} </Button>
          <Button onClick= {() => {this.onButtonSearch('blocked'); }} outline color='primary' size='sm' >Blocked:{this.state.blockedProcesses} </Button>
          <Button onClick= {() => {this.onButtonSearch('sleeping'); }} outline color='primary' size='sm' >Sleeping:{this.state.sleepingProcesses} </Button>
          </div>       
        )}

        <PrimaryControls
          className="controls"
          perPage={pagination.perPage}
          column={searchColumn}
          query={query}
          columns={cols}
          rows={rows}
          onPerPage={this.onPerPage}
          onColumnChange={this.onColumnChange}
          onSearch={this.onSearch}
        />

        <Table.Provider
          className="pure-table pure-table-striped"
          columns={cols}
          style={{ overflowX: 'auto' }}
        >
          <Table.Header>
            <search.Columns query={query} columns={cols} onChange={this.onSearch} />
          </Table.Header>

          <Table.Body onRow={this.onRow} rows={paginated.rows} rowKey="id" />

        </Table.Provider>

        <div className="controls">
          <Paginator
            pagination={pagination}
            pages={paginated.amount}
            onSelect={this.onSelect}
          />
        </div>

      </div>
    );
  }
  onToggleColumn({ columnIndex }) {
    const columns = cloneDeep(this.state.columns);
    const column = columns[columnIndex];

    column.visible = !column.visible;

    const query = cloneDeep(this.state.query);
    delete query[column.property];

    this.setState({ columns, query });
  }

  onButtonSearch(sort) {
    const columns = cloneDeep(this.state.columns);
    const column = columns[5];  // column 5 is the STATE column

    const query = cloneDeep(this.state.query);
    query[column.property] = sort;
    this.setState({ query });

    this.setState({ columns, query });
  }

  onRow(row) {
    return {
      onClick: () => this.onRowSelected(row)
    };
  }
  onRowSelected(row) {
    this.setState({ selectedrow: row});
  }
  onColumnChange(searchColumn) {
    this.setState({
      searchColumn
    });
  }
  onSearch(query) {
    this.setState({
      query
    });
  }
  onSelect(page) {
    const pages = Math.ceil(
      this.state.rows.length / this.state.pagination.perPage
    );

    this.setState({
      pagination: {
        ...this.state.pagination,
        page: Math.min(Math.max(page, 1), pages)
      }
    });
  }
  onPerPage(value) {
    this.setState({
      pagination: {
        ...this.state.pagination,
        perPage: parseInt(value, 10)
      }
    });
  }

}

// getNetwork
export class OS_Network extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      networkData: [],
      networkStats: [],
      networkConnection: [],
      netcols: this.getNetworkCols(),
      netrows: [],
      netConncols: this.getNetworkConnCols(),
      netConnrows: []
    };
  }

  getNetworkCols() {
    return [
      { property: 'INT', header: { label: 'Interface' } },
      { property: 'STATE', header: { label: 'State' } },
      { property: 'IP4', header: { label: 'IP4' } },
      { property: 'IP6', header: { label: 'IP6' } },
      { property: 'SENT', header: { label: 'Bytes Sent' } },
      { property: 'RCV', header: { label: 'Bytes Recv' } },
      { property: 'RX', header: { label: 'RX/s' } },
      { property: 'TX', header: { label: 'TX/s' } },
      { property: 'MAC', header: { label: 'MAC' } }
    ];
  }

  getNetworkConnCols() {
    return [
      { property: 'LOCADDR', header: { label: 'Local Address' } },
      { property: 'LOCPORT', header: { label: 'Local Port' } },
      { property: 'PEERADDR', header: { label: 'Peer Address' } },
      { property: 'PEERPORT', header: { label: 'Peer Port' } },
      { property: 'PROTOCOL', header: { label: 'Protocol' } },
      { property: 'STATE', header: { label: 'State' } }
    ];
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      //autoPlay some for specific period of times or
      // Do some stuff you want
      getDataAPI.all(this.updateResult, myConfig.base_url + '/utilities/onestop/getNetwork');
    }, 5000); 
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  updateResult = (res) => {
    this.setState({networkData: res.data.network_data});
    this.setState({networkStats: res.data.network_stats});
    this.setState({networkConnection: res.data.network_connection});
    this.renderRowData(res.data);
}

formatBytes(a,b){if(0===a)return'0 Bytes';var c=1024,d=b||2,e=['Bytes','KB','MB','GB','TB','PB','EB','ZB','YB'],f=Math.floor(Math.log(a)/Math.log(c));return parseFloat((a/Math.pow(c,f)).toFixed(d))+' ' +e[f];}

renderRowData(data) {
    // Network
    let net = data.network_data;
    var netrowData = [];
    var netrow = {
      id: '',
      INT: '',
      STATE: '',
      IP4: '',
      IP6: '',
      SENT: '',
      RCV: '',
      RX: '',
      TX: '',
      MAC: ''
    };

    var count = 0;
    for (let i = 0; i < net.length; i++){
      let row = net[i];
  
      netrow = {
        id: i,
        INT: row.iface,
        IP4: row.ip4,
        IP6: row.ip6,
        MAC: row.mac,
        STATE: data.network_stats[count].operstate,
        SENT: this.formatBytes(data.network_stats[count].tx, 2),
        RCV: this.formatBytes(data.network_stats[count].rx, 2),
        RX: parseFloat(data.network_stats[count].rx_sec).toPrecision(6),
        TX: parseFloat(data.network_stats[count].tx_sec).toPrecision(6)
      };
      count++;
      netrowData.push(netrow);
    }
    let netrows = netrowData;
    this.setState({netrows});
  
    let netConn = data.network_connection;
    var netrowConnData = [];
    var netConnrow = {
      id: '',
      LOCADDR: '',
      LOCPORT: '',
      PEERADDR: '',
      PEERPORT: '',
      PROTOCOL: '',
      STATE: ''
    };

    count = 0;
    for (let i = 0; i < netConn.length; i++){
      let row = netConn[i];
  
      netConnrow = {
        id: i,
        LOCADDR: row.localaddress,
        LOCPORT: row.localport,
        PEERADDR: row.peeraddress,
        PEERPORT: row.peerport,
        PROTOCOL: row.protocol,
        STATE: row.state
      };
      count++;
      netrowConnData.push(netConnrow);
    }
    let netConnrows = netrowConnData;
    this.setState({netConnrows});
}

  render() {
    const {  netcols, netrows, netConncols, netConnrows
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
        <h6>Network Information</h6>
        <Column flexGrow={1}>
          <Row horizontal='center'>
            <Table.Provider
              className="pure-table pure-table-striped"
              columns = {netcols }
              renderers={stylingRenderers}
              style={{ width: 1000 }}   >

            <Table.Header ></Table.Header>
          
            <Table.Body rows={ netrows} rowKey="id" />
            </Table.Provider>
            </Row>
        </Column>
        <br/>
        <h6>Network Connections</h6>
        <Column flexGrow={1}>
          <Row horizontal='center'>
            <Table.Provider
              className="pure-table pure-table-striped"
              columns = {netConncols }
              renderers={stylingRenderers}
              style={{ width: 1000 }}   >

            <Table.Header ></Table.Header>
          
            <Table.Body rows={ netConnrows} rowKey="id" />
            </Table.Provider>
            </Row>
        </Column>

      </div>
    );
  }
}

export class OS_Logs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: this.getColumns(),
      rows: [],
      selectedrow: {},
      query: {},
      searchColumn: '',
      sortingColumns: null, // reference to the sorting columns
      pagination: { // initial pagination settings
        page: 1,
        perPage: 100
      }, 
      currentDir: ''
    };
    this.openLog = this.openLog.bind(this);
    this.onToggleColumn = this.onToggleColumn.bind(this);
    this.onRow = this.onRow.bind(this);
    this.onRowSelected = this.onRowSelected.bind(this);
    this.onColumnChange = this.onColumnChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onPerPage = this.onPerPage.bind(this);

    this.getLogFileList = this.getLogFileList.bind(this);
    this.updateGetListResult = this.updateGetListResult.bind(this);
  }

  getLogFileList (dir) {
    this.setState({currentDir: dir});
    var data = { 
      directory: dir
     };
    postDataAPI.all(this.updateGetListResult, myConfig.base_url + '/utilities/getLogFileList', data );
  }

  updateGetListResult = (res) => {
    let rows = this.renderRowData(res.data);
    this.setState({rows});
  }

  formatBytes(a,b){if(0===a)return'0 Bytes';var c=1024,d=b||2,e=['Bytes','KB','MB','GB','TB','PB','EB','ZB','YB'],f=Math.floor(Math.log(a)/Math.log(c));return parseFloat((a/Math.pow(c,f)).toFixed(d))+' ' +e[f];}

  renderRowData(data) {
    var rowData = [];
    var rows = {
      id: '',
      FILENAME: '',
      NAME: '',
      MTIME: '',
      ATIME: ''
    };

    for (let i = 0; i < data.length; i++){
      let row = data[i];
  
      rows = {
        id: i,
        FILENAME: row.filename,
        NAME: row.stats.name,
        SIZE: row.stats.size,
        MTIME: new Date(row.stats.mtime),
        ATIME: new Date(row.stats.atime)
      };
      rowData.push( rows );
    }
    return rowData;  
  }

  getColumns() {
    const sortable = sort.sort({
      getSortingColumns: () => this.state.sortingColumns || [],
      onSort: selectedColumn => { this.setState({ sortingColumns: sort.byColumns({ 
            sortingColumns: this.state.sortingColumns, selectedColumn }) }); } });
    const sortableHeader = sortHeader(sortable, () => this.state.sortingColumns);
    const resize = resizable.column({ getWidth: column => column.header.props.style.width,
      onDrag: (width, { columnIndex }) => { const columns = this.state.columns;
        const column = columns[columnIndex]; column.header.props.style = { ...column.header.props.style, width };
        this.setState({ columns }); } });
    return [
      {
        property: 'FILENAME',
        header: { label: 'Name',formatters: [ (v, extra) => resize(sortableHeader(v, extra), extra)],
          props: { style: { width: 100 } } },
        cell: { formatters: [ search.highlightCell ] },
        visible: true
      },
      {
      property: 'SIZE',
      header: { label: 'Size',formatters: [ (v, extra) => resize(sortableHeader(v, extra), extra)],
        props: { style: { width: 100 } } },
      cell: { formatters: [ search.highlightCell ] },
      visible: true
    },
    {
      property: 'MTIME',
      header: { label: 'Modify Time',formatters: [ (v, extra) => resize(sortableHeader(v, extra), extra)],
        props: { style: { width: 100 } } },
      cell: { formatters: [ search.highlightCell ] },
      visible: true
    },
    {
      property: 'ATIME',
      header: { label: 'Access Time',formatters: [ (v, extra) => resize(sortableHeader(v, extra), extra)],
        props: { style: { width: 100 } } },
      cell: { formatters: [ search.highlightCell ] },
      visible: true
    }
    ];
  }

  render() {
    const {
      columns, rows, pagination, sortingColumns, searchColumn, query
    } = this.state;
    const cols = columns.filter(column => column.visible);
    const paginated = compose(
      paginate(pagination),
      sort.sorter({ columns: cols, sortingColumns, sort: orderBy }),
      search.highlighter({ columns: cols, matches: search.matches, query }),
      search.multipleColumns({ columns: cols, query }),
      resolve.resolve({
        columns: cols,
        method: (extra) => compose(
          resolve.byFunction('cell.resolve')(extra),
          resolve.nested(extra)
        )
      })
    )(rows);

    return(
      <div>
        <Button onClick= {() => {this.getLogFileList('/apg/' + sessionStorage.getItem('currentVersion') + '/dsw/os/log'); }} outline color='primary' size='sm' >OS Logs </Button>
        <Button onClick= {() => {this.getLogFileList('/apg/admin/log');  }} outline color='primary' size='sm' >Admin Logs </Button>
        <Button onClick= {() => {this.getLogFileList('/apg/3rdParty/3mhis/gps/logs'); }} outline color='primary' size='sm' >3M Logs </Button>
        <Button onClick= {() => {this.getLogFileList('/apg/Healthcheck/log'); }} outline color='primary' size='sm' >Healthcheck Logs </Button>
        <Button onClick= {() => {this.getLogFileList('/apg/pdsdata/support/costing'); }} outline color='primary' size='sm' >Costing Logs </Button>
        <Button onClick= {() => {this.getLogFileList('/apg/pdsdata/support/di'); }} outline color='primary' size='sm' >DI Logs </Button>
        <Button onClick= {() => {this.getLogFileList('/apg/pdsdata/support/enc_analysis'); }} outline color='primary' size='sm' >Encounter Analysis Logs </Button>
        <Button onClick= {() => {this.getLogFileList('/apg/pdsdata/support/group_reimb'); }} outline color='primary' size='sm' >G&R Logs </Button>
        <Button onClick= {() => {this.getLogFileList('/apg/pdsdata/support/util'); }} outline color='primary' size='sm' >Utility Logs </Button>
        <Button onClick= {() => {this.getLogFileList('/apg/pdsdata/support/ws'); }} outline color='primary' size='sm' >WS Logs </Button>

        <VisibilityToggles
          columns={columns}
          onToggleColumn={this.onToggleColumn}
        />
        <PrimaryControls
          className="controls"
          perPage={pagination.perPage}
          column={searchColumn}
          query={query}
          columns={cols}
          rows={rows}
          onPerPage={this.onPerPage}
          onColumnChange={this.onColumnChange}
          onSearch={this.onSearch}
        />

        <Table.Provider
          className="pure-table pure-table-striped"
          columns={cols}
          style={{ overflowX: 'auto' }}
        >
          <Table.Header>
            <search.Columns query={query} columns={cols} onChange={this.onSearch} />
          </Table.Header>

          <Table.Body onRow={this.onRow} rows={paginated.rows} rowKey="id" />

        </Table.Provider>

        <div className="controls">
          <Paginator
            pagination={pagination}
            pages={paginated.amount}
            onSelect={this.onSelect}
          />
        </div>

      </div>
    );
  }

  openLog(link) {
    history.push( {
      pathname: 'showlog',
      link: link
      });
  }

  onToggleColumn({ columnIndex }) {
    const columns = cloneDeep(this.state.columns);
    const column = columns[columnIndex];

    column.visible = !column.visible;

    const query = cloneDeep(this.state.query);
    delete query[column.property];

    this.setState({ columns, query });
  }

  onRow(row) {
    return {
      onClick: () => this.onRowSelected(row)
    };
  }
  onRowSelected(row) {
    this.openLog(myConfig.base_url + myConfig.log_url + this.state.currentDir + '/' + row.FILENAME);
  }
  onColumnChange(searchColumn) {
    this.setState({
      searchColumn
    });
  }
  onSearch(query) {
    this.setState({
      query
    });
  }
  onSelect(page) {
    const pages = Math.ceil(
      this.state.rows.length / this.state.pagination.perPage
    );

    this.setState({
      pagination: {
        ...this.state.pagination,
        page: Math.min(Math.max(page, 1), pages)
      }
    });
  }
  onPerPage(value) {
    this.setState({
      pagination: {
        ...this.state.pagination,
        perPage: parseInt(value, 10)
      }
    });
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
    this.renderRowData(res.data.rows);
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

function sortHeader(sortable, getSortingColumns) {
  return (value, { columnIndex }) => {
    const sortingColumns = getSortingColumns() || [];

    return (
      <div style={{ display: 'inline' }}>
        <span className="value">{value}</span>
        {React.createElement(
          'span',
          sortable(
            value,
            {
              columnIndex
            },
            {
              style: { float: 'right' }
            }
          )
        )}
        {sortingColumns[columnIndex] &&
          <span className="sort-order" style={{ marginLeft: '0.5em', float: 'right' }}>
            {sortingColumns[columnIndex].position + 1}
          </span>
        }
      </div>
    );
  };
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
    this.renderRowData(res.data.rows);
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
    this.renderRowData(res.data.rows);
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
    this.renderRowData(res.data.rows);
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
    this.renderRowData(res.data.rows);
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
    this.renderRowData(res.data.rows);
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
    this.renderRowData(res.data.rows);
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
    this.renderRowData(res.data.rows);
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
    this.renderRowData(res.data.rows);
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
    this.renderRowData(res.data.rows);
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

// Batch Runner Status
// Stop Batch Runner
// Start Batch Runner


/* <a id="batchRunnerStatus" href="http://hpmdb:8090/pm/HPMBatchRunner?cmd=status"><button type="button" class="btn btn-primary">Batch Runner Status</button></a>
<script>
  function myFunction() {
    var result = (window.document.URL.split(/http:\/\//))[1].split(/:[0-9]/, 1);
    return (result);
  }
  document.getElementById("batchRunnerStatus").href = "http://" + myFunction() + ":8090/pm/HPMBatchRunner?cmd=status";
</script>

        </div>
    </div>
    <div class="box">
        <div class="box-header">
<span>Stop Batch Runner</span>
        </div>
        <div class="box-content">
            <a id="batchRunnerStop" href="http://hpmdb:8090/pm/HPMBatchRunner?cmd=status"><button type="button" class="btn btn-primary">Stop Batch Runner</button></a>
            <script>
                    function myFunction() {
                            var result = (window.document.URL.split(/http:\/\//))[1].split(/:[0-9]/, 1);
                            return (result);
                    }
                    document.getElementById("batchRunnerStop").href = "http://" + myFunction() + ":8090/pm/HPMBatchRunner?cmd=stop";
            </script>
        </div>
    </div>
    <div class="box">
        <div class="box-header">
            <span>Start Batch Runner</span>
        </div>
        <div class="box-content">
            <a id="batchRunnerStart" href="http://hpmdb:8090/pm/HPMBatchRunner?cmd=status"><button type="button" class="btn btn-primary">Start Batch Runner</button></a>
            <script>
                    function myFunction() {
                            var result = (window.document.URL.split(/http:\/\//))[1].split(/:[0-9]/, 1);
                            return (result);
                    }
                    document.getElementById("batchRunnerStart").href = "http://" + myFunction() + ":8090/pm/HPMBatchRunner?cmd=start";
            </script>
        </div> */

export class OS_Admin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: ''
    };
    this.updateResult = this.updateResult.bind(this);
  }

  doAdminStuff(cmd) {
    var data = {
      shellCmd: cmd
    };
    postDataAPI.all(this.updateResult, myConfig.base_url + '/utilities/onestop/adminCommands', data);
  }

  updateResult = (res) => {
    this.setState({data: res.data});
}

restartPM() {
  getDataAPI.all(this.updateResult, myConfig.base_url + '/utilities/onestop/adminRestartPM');
}

  render() {
    const isLoggedIn = sessionStorage.getItem('isAuthenticated'),
    userRole   = sessionStorage.getItem('role');
    let restartPMBtn, stopDbAppBtn, startDbAppBtn, stopAppBtn, startAppBtn, fixRecBtn;
    if (isLoggedIn && userRole === 'ADMIN') {
      restartPMBtn = <Button onClick= {() => {this.restartPM(); }} outline color='primary' size='sm' >Restart PM </Button>;
      stopDbAppBtn = <Button onClick= {() => {this.doAdminStuff('/apg/admin/bin/stop_db_app.sh'); }} outline color='primary' size='sm' >Stop DB and App </Button>;
      startDbAppBtn = <Button onClick= {() => {this.doAdminStuff('/apg/admin/bin/start_db_app.sh'); }} outline color='primary' size='sm' >Start DB and App </Button>;
      stopAppBtn = <Button onClick= {() => {this.doAdminStuff('/apg/admin/bin/stop_app.sh'); }} outline color='primary' size='sm' >Stop App </Button>;
      startAppBtn = <Button onClick= {() => {this.doAdminStuff('/apg/admin/bin/start_app.sh'); }} outline color='primary' size='sm' >Start App </Button>;
      fixRecBtn = <Button onClick= {() => {this.doAdminStuff('/apg/admin/bin/fix_recurring_jobs'); }} outline color='primary' size='sm' >Fix Recurring Jobs </Button>;
    }

    return(
      <div style={{textAlign: 'initial', whiteSpace: 'pre-line' }} >
      <br/>
        {restartPMBtn}
        <Button onClick= {() => {this.doAdminStuff('/apg/admin/bin/check_db_app.sh'); }} outline color='primary' size='sm' >Check DB and App </Button>
        {stopDbAppBtn}
        {startDbAppBtn}
        {stopAppBtn}
        {startAppBtn}
        {fixRecBtn}
      <hr/>
      <h6>Please wait for the commands to print their status, some take time to perform the operation</h6>
      <hr/>
        <br/><br/>
        <pre>
          {this.state.data}
        </pre>
      </div>
    );
  }
}

