

import React from 'react';
import styled from 'styled-components';
import * as Table from 'reactabular-table';
import { Column, Row } from 'simple-flexbox';
import { myConfig } from '../config';
import { getDataAPI, postDataAPI } from './api';

const AlignedBodyCell = styled.td`
  text-align: ${props => props.isNumber ? 'right' : 'left'};
`;

export class CustomObject extends React.Component {
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
      { property: 'CLASS_NAME', header: { label: 'Class Name' } },
      { property: 'DB_TABLE', header: { label: 'Table Name' } }
    ];
  }

  componentDidMount() {
    getDataAPI.all(this.updateResult, myConfig.base_url + '/utilities/customobject');
  }

  updateResult = (res) => {
    this.renderRowData(res.data.rows);
  }

  renderRowData(data) {
    let co = data;
    var rowData = [];
    var row = {
      id: '',
      CLASS_NAME: '',
      DB_TABLE: ''
    };
  
    for (let i = 0; i < co.length; i++) {
      let rowd = co[i];
  
      row = {
        id: i,
        CLASS_NAME: rowd.CLASS_NAME,
        DB_TABLE: rowd.DB_TABLE
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
        <h2> Custom Object Class Names </h2>

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
        <br/>
        <h6>Click the row you want to truncate the data from.</h6>
      </div>
    );
  }
  
  onRow(row) {
    return {
      onClick: () => this.onRowSelected(row)
    };
  }

  updateResultCO = (res) => {
    alert(res.statusText);
  }

  onRowSelected(row) {
    var data = { name: row.DB_TABLE };
    postDataAPI.all(this.updateResultCO, myConfig.base_url + '/utilities/customobject', data);  
  }

}  // end of class