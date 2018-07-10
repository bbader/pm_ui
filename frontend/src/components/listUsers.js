
import React from 'react';
import { compose } from 'redux';
import { cloneDeep, findIndex, orderBy } from 'lodash';
import * as Table from 'reactabular-table';
import * as search from 'searchtabular';
import * as sort from 'sortabular';
import * as resizable from 'reactabular-resizable';
import * as resolve from 'table-resolver';
import VisibilityToggles from 'react-visibility-toggles';
import { Paginator, PrimaryControls, paginate } from '../helpers';
import { Column, Row } from 'simple-flexbox';

import { getDataAPI } from './api';
import { postDataAPI } from './api';
import { myConfig } from '../config';


export class listUsers extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      rows: [],
      columns: this.getColumns(),
      selectedrow: {},
      query: {},
      searchColumn: 'all',
      sortingColumns: null, // reference to the sorting columns
      pagination: { // initial pagination settings
        page: 1,
        perPage: 10
      }
    };

    this.onRow = this.onRow.bind(this);
    this.onRowSelected = this.onRowSelected.bind(this);
    this.onColumnChange = this.onColumnChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onPerPage = this.onPerPage.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.onToggleColumn = this.onToggleColumn.bind(this);
  }

  componentDidMount() {
    getDataAPI.all(this.updateResult, myConfig.base_url + '/api/listUsers');
  }

  updateResult = (res) => {
    let rows = this.renderRowData(res.data.results.rows);
    this.setState({rows});
}

renderRowData(data) {
  var rowData = [];
  var rows = {
      id: '',
      ROWID: '',
      FULLNAME: '',
      NAME: '',
      ROLE: '',
      EMAIL: '',
      DEPARTMENT: ''
    };

    for (let i = 0; i < data.length; i++){
      let row = data[i];

      rows = {
        id: i,
        ROWID: row.ID,
        FULLNAME: row.FULLNAME,
        NAME: row.NAME,
        ROLE: row.ROLE,
        EMAIL: row.EMAIL,
        DEPARTMENT: row.DEPARTMENT
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
          sortingColumns: sort.byColumns({ // sort.byColumn would work too
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
      property: 'FULLNAME',
      header: {
        label: 'Fullname',
        formatters: [ (v, extra) => resize(sortableHeader(v, extra), extra) ],
        props: { style: { width: 100 } }
      },
      cell: { formatters: [ search.highlightCell ] },
      visible: true
    },
    {
      property: 'NAME',
      header: {
        label: 'Name',
        formatters: [ (v, extra) => resize(sortableHeader(v, extra), extra) ],
        props: { style: { width: 100 } } },
      cell: { formatters: [ search.highlightCell ] },
      visible: true
    },
    {
      property: 'ROLE',
      header: {
        label: 'Role',
        formatters: [ (v, extra) => resize(sortableHeader(v, extra), extra) ],
        props: { style: { width: 100 } } },
      cell: { formatters: [ search.highlightCell ] },
      visible: true
    },
    {
      property: 'EMAIL',
      header: {
        label: 'e-mail',
        formatters: [ (v, extra) => resize(sortableHeader(v, extra), extra) ],
        props: { style: { width: 100 } } },
      cell: { formatters: [ search.highlightCell ] },
      visible: true
    },
    {
      property: 'DEPARTMENT',
      header: {
        label: 'Department',
        formatters: [ (v, extra) => resize(sortableHeader(v, extra), extra) ],
        props: { style: { width: 100 } } },
      cell: { formatters: [ search.highlightCell ] },
      visible: true
    },
    {
      header: { 
        label: 'Delete User',
        props: { style: { width: 50 } } },
      cell: {
        formatters: [ (value, { rowData }) => (
            <span
              className="remove"
              onClick={() => this.onRemove(rowData)} style={{ cursor: 'pointer' }} >
              &#10007;
            </span> ) ] },
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

      return (
        <div>
        <Column flexGrow={1}>
          <Row horizontal='center'>
          <VisibilityToggles
            columns={columns}
            onToggleColumn={this.onToggleColumn}
          />
          </Row>
        </Column>

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

        <Column flexGrow={1}>
          <Row horizontal='center'>
            <Table.Provider
              className="pure-table pure-table-striped"
              columns={cols}
              style={{ overflowX: 'auto', width: 1000 }}
            >
            <Table.Header>
              <search.Columns query={query} columns={cols} onChange={this.onSearch} />
            </Table.Header>

            <Table.Body onRow={this.onRow} rows={paginated.rows} rowKey="id" />

            </Table.Provider>
          </Row>
        </Column>
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

  onRow(row) {
    return {
      onClick: () => this.onRowSelected(row)
    };
  }
  onRowSelected(row) {
    console.log('clicked row', row);
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
  onRemove(row) {
    console.log(row);
    let id = row.id;

    const rows = cloneDeep(this.state.rows);
    const idx = findIndex(rows, { id });

    // this could go through flux etc.
    rows.splice(idx, 1);

    this.setState({ rows });

    var data = { 
      userid: row.ROWID,
      type: 'delete'
     }
    postDataAPI.all(this.updateDeleteResult, myConfig.base_url + '/api/deleteUser', data );
  }

  updateDeleteResult = (res) => {
    alert('User Deleted');
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

