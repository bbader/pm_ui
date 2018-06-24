

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
    axios({
      method:'get',
      url: myConfig.base_url + '/utilities/customobject',
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