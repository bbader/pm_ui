


import React from 'react';
import axios from 'axios';
import styled from 'styled-components';
import * as Table from 'reactabular-table';
import { Column, Row } from 'simple-flexbox';
import { myConfig } from '../config';
import history from '../history';

const AlignedBodyCell = styled.td`
  text-align: ${props => props.isNumber ? 'right' : 'left'};
`;

export class PMUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: this.getColumns(),
      rows: []
    };

    this.onRow = this.onRow.bind(this);
    this.onRowSelected = this.onRowSelected.bind(this);
  }

  getColumns() {
    return [
      { property: 'LOGONID', header: { label: 'Logon ID' } },
      { property: 'LONGNAME', header: { label: ' Name' } },
      { property: 'OSUSER', header: { label: 'OS User Name' } },
      { property: 'TERMINAL', header: { label: 'Terminal Name' } }
    ];
  }

  componentDidMount() {
    axios({
      method:'get',
      url: myConfig.base_url + '/utilities/pmusers',
      headers: { 'authorization': sessionStorage.getItem('token'), }
    })
    .catch(function (error) {
      if (error.response) {
        // console.log(error.response);
        alert(error.response.data.message);
        history.push( '/logout' );
      }
    })
      .then(res => {
        // console.log(res.data.rows);
        this.renderRowData(res.data.rows);
        })
      .catch(err => console.log(err));
  }

  renderRowData(data) {
    let co = data;
    var rowData = [];
    var row = {
      id: '',
      LOGONID: '',
      LONGNAME: '',
      OSUSER: '',
      TERMINAL: ''
    };
  
    for (let i = 0; i < co.length; i++) {
      let rowd = co[i];
  
      row = {
        id: i,
        LOGONID: rowd.LOGONID,
        LONGNAME: rowd.LONGNAME,
        OSUSER: rowd.OSUSER,
        TERMINAL: rowd.TERMINAL
      };
      rowData.push(row);
    }
    let rows = rowData;
    this.setState({rows});
    }

  render() {
    const { columns, rows } = this.state;

    const stylingRenderers = {
      body: {
        cell: AlignedBodyCell // the one element we are overriding
      }
    };

    return (
      <div>
        <br/>
        <h2> Current Logged on PM Users </h2>

        <Column flexGrow={1}>
          <Row horizontal='center'>
            <Table.Provider
              className="pure-table pure-table-striped"
              columns = { columns }
              renderers={stylingRenderers}
              style={{ width: 700 }}   >

            <Table.Header ></Table.Header>

            <Table.Body onRow={this.onRow} rows={ rows } rowKey="id" />
            </Table.Provider>
            </Row>
        </Column>
      </div>
    );
  }
  
  onRow(row) {
    return {
      onClick: () => this.onRowSelected(row)
    };
  }
  onRowSelected(row) {
    axios({
      method:'post',
      url: myConfig.base_url + '/utilities/customobject',
      headers: { 'authorization': sessionStorage.getItem('token'), },
      data: { name: row.DB_TABLE }
    })
    .catch(function (error) {
      if (error.response) {
        // console.log(error.response);
        alert(error.response.data.message);
      }
    })
      .then(res => {
        // console.log(res);
        alert(res.statusText);
        })
      .catch(err => console.log(err));
  }

}