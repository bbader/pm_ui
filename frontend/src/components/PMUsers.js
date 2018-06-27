


import React from 'react';
import styled from 'styled-components';
import * as Table from 'reactabular-table';
import { Column, Row } from 'simple-flexbox';
import { myConfig } from '../config';
import { getDataAPI } from './api';

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
    getDataAPI.all(this.updateResult, myConfig.base_url + '/utilities/pmusers');
  }

  updateResult = (res) => {
    this.renderRowData(res.data.rows);
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
}