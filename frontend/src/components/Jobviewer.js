
import React from 'react';
import axios from 'axios';
import { compose } from 'redux';
import {
  cloneDeep, findIndex, orderBy
} from 'lodash';
import * as Table from 'reactabular-table';
import * as search from 'searchtabular';
import * as sort from 'sortabular';
import * as resizable from 'reactabular-resizable';
import * as resolve from 'table-resolver';
import VisibilityToggles from 'react-visibility-toggles';
import * as tree from 'treetabular';
import ReactModal from 'react-modal';

import {
  Paginator, PrimaryControls, paginate
} from '../helpers';

const customStyles = {
  content : {
    top                   : '25%',
    left                  : '25%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    width                 : '500px'
  }
};

ReactModal.setAppElement('body')

export class JobViewer extends React.Component {
    constructor(props) {
    super(props);
    
    this.state = {
      showModal: false,
      selectedrow: {},
      query: {},
      columns: this.getColumns(),
      rows: [],
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
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

componentDidMount() {
  axios({
    method:'get',
    url:'http://10.211.55.253:3000/utilities/jobViewer/fe'
  })
    .then(res => {
      let rows = this.renderRowData(res.data.sqlResult);
      this.setState({rows});
      })
    .catch(err => console.log(err));
}

renderRowData(data) {
  var rowData = [];
  var rows = {
      id: '',
      FINISH_DATE: '',
      FINISH_STATUS: '',
      JOB_DEFINITION_ID: '',
      JOB_MGR_PID: '',
      JOB_NAME: '',
      JOB_NUMBER: '',
      JOB_STEP_ID: '',
      JOB_TYPE_ID: '',
      LOG_FILES: '',
      OWNER_ID: '',
      PDS_FUNCTION_ID: '',
      PERCENT_COMPLETE: '',
      SCHEDULED_DATE: '',
      SECONDARY_USER_ID: '',
      START_DATE: '',
      STATUS: '',
      STATUS_MESSAGE: '',
      UNIQUE_ID: '',
      LOG_FILE_DESC1: '',
      LOG_FILE_DESC2: '',
      LOG_FILE_DESC3: '',
      LOG_FILE_DESC4: '',
      LOG_FILE_DESC5: '',
      LOG_FILE_URL1: '',
      LOG_FILE_URL2: '',
      LOG_FILE_URL3: '',
      LOG_FILE_URL4: '',
      LOG_FILE_URL5: ''
    };

    for (let i = 0; i < data.length; i++){
      let row = data[i];

      rows = {
        id: i,
        JOB_NUMBER: row.JOB_NUMBER,
        START_DATE: row.START_DATE,
        FINISH_DATE: row.FINISH_DATE,
        STATUS: row.STATUS,
        FINISH_STATUS: row.FINISH_STATUS,
        STATUS_MESSAGE: row.STATUS_MESSAGE,
        JOB_NAME: row.JOB_NAME,
        PERCENT_COMPLETE: row.PERCENT_COMPLETE,
        JOB_TYPE_ID: row.JOB_TYPE_ID,
        OWNER_ID: row.OWNER_ID,
        PDS_FUNCTION_ID: row.PDS_FUNCTION_ID,
        LOG_FILES: row.LOG_FILES,
        JOB_DEFINITION_ID: row.JOB_DEFINITION_ID,
        JOB_MGR_PID: row.JOB_MGR_PID,
        JOB_STEP_ID: row.JOB_STEP_ID,
        SCHEDULED_DATE: row.SCHEDULED_DATE,
        SECONDARY_USER_ID: row.SECONDARY_USER_ID,
        UNIQUE_ID: row.UNIQUE_ID,
        LOG_FILE_DESC1: row.LOG_FILE_DESC1,
        LOG_FILE_DESC2: row.LOG_FILE_DESC2,
        LOG_FILE_DESC3: row.LOG_FILE_DESC3,
        LOG_FILE_DESC4: row.LOG_FILE_DESC4,
        LOG_FILE_DESC5: row.LOG_FILE_DESC5,
        LOG_FILE_URL1: row.LOG_FILE_URL1,
        LOG_FILE_URL2: row.LOG_FILE_URL2,
        LOG_FILE_URL3: row.LOG_FILE_URL3,
        LOG_FILE_URL4: row.LOG_FILE_URL4,
        LOG_FILE_URL5: row.LOG_FILE_URL5  
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
    property: 'JOB_NUMBER',
    header: {
      label: 'JOB_NUMBER',
      formatters: [
        (v, extra) => resize(sortableHeader(v, extra), extra)
      ],
      props: {
        style: {
          width: 100
        }
      }
    },
    cell: {
      formatters: [
        search.highlightCell
      ]
    },
    visible: true
  },
  {
    property: 'START_DATE',
    header: {
      label: 'START_DATE',
      formatters: [
        (v, extra) => resize(sortableHeader(v, extra), extra)
      ],
      props: {
        style: {
          width: 100
        }
      }
    },
    cell: {
      formatters: [
        search.highlightCell
      ]
    },
    visible: true
  },
  {
    property: 'FINISH_DATE',
    header: {
      label: 'FINISH_DATE',
      formatters: [
        (v, extra) => resize(sortableHeader(v, extra), extra)
      ],
      props: {
        style: {
          width: 100
        }
      }
    },
    cell: {
      formatters: [
        search.highlightCell
      ]
    },
    visible: true
  },  
  {
    property: 'STATUS',
    header: {
      label: 'STATUS',
      formatters: [
        (v, extra) => resize(sortableHeader(v, extra), extra)
      ],
      props: {
        style: {
          width: 100
        }
      }
    },
    cell: {
      formatters: [
        search.highlightCell
      ]
    },
    visible: true
  },
  {
    property: 'FINISH_STATUS',
    header: {
      label: 'FINISH_STATUS',
      formatters: [
        (v, extra) => resize(sortableHeader(v, extra), extra)
      ],
      props: {
        style: {
          width: 100
        }
      }
    },
    cell: {
      formatters: [
        search.highlightCell
      ]
    },
    visible: true
  },
  {
    property: 'STATUS_MESSAGE',
    header: {
      label: 'STATUS_MESSAGE',
      formatters: [
        (v, extra) => resize(sortableHeader(v, extra), extra)
      ],
      props: {
        style: {
          width: 100
        }
      }
    },
    cell: {
      formatters: [
        search.highlightCell
      ]
    },
    visible: true
  },
  {
    property: 'JOB_NAME',
    header: {
      label: 'JOB_NAME',
      formatters: [
        (v, extra) => resize(sortableHeader(v, extra), extra)
      ],
      props: {
        style: {
          width: 100
        }
      }
    },
    cell: {
      formatters: [
        search.highlightCell
      ]
    },
    visible: true
  },
  {
    property: 'PERCENT_COMPLETE',
    header: {
      label: 'PERCENT_COMPLETE',
      formatters: [
        (v, extra) => resize(sortableHeader(v, extra), extra)
      ],
      props: {
        style: {
          width: 100
        }
      }
    },
    cell: {
      formatters: [
        search.highlightCell
      ]
    },
    visible: true
  },
  {
    property: 'JOB_TYPE_ID',
    header: {
      label: 'JOB_TYPE_ID',
      formatters: [
        (v, extra) => resize(sortableHeader(v, extra), extra)
      ],
      props: {
        style: {
          width: 100
        }
      }
    },
    cell: {
      formatters: [
        search.highlightCell
      ]
    },
    visible: true
  },
  {
    property: 'OWNER_ID',
    header: {
      label: 'OWNER_ID',
      formatters: [
        (v, extra) => resize(sortableHeader(v, extra), extra)
      ],
      props: {
        style: {
          width: 100
        }
      }
    },
    cell: {
      formatters: [
        search.highlightCell
      ]
    },
    visible: true
  },
  {
    property: 'PDS_FUNCTION_ID',
    header: {
      label: 'PDS_FUNCTION_ID',
      formatters: [
        (v, extra) => resize(sortableHeader(v, extra), extra)
      ],
      props: {
        style: {
          width: 100
        }
      }
    },
    cell: {
      formatters: [
        search.highlightCell
      ]
    },
    visible: true
  },
  {
    property: 'LOG_FILES',
    header: {
      label: 'LOG_FILES',
      formatters: [
        (v, extra) => resize(sortableHeader(v, extra), extra)
      ],
      props: {
        style: {
          width: 100
        }
      }
    },
    cell: {
      formatters: [
        search.highlightCell,
        tree.toggleChildren({
          getRows: () => this.state.rows,
          getShowingChildren: ({ rowData }) => rowData.showingChildren,
          toggleShowingChildren: rowIndex => {
            const rows = cloneDeep(this.state.rows);

            rows[rowIndex].showingChildren = !rows[rowIndex].showingChildren;

            this.setState({ rows });
          }
        })
      ]
    },
    visible: true
  },
  {
    property: 'JOB_DEFINITION_ID',
    header: {
      label: 'JOB_DEFINITION_ID',
      formatters: [
        (v, extra) => resize(sortableHeader(v, extra), extra)
      ],
      props: {
        style: {
          width: 100
        }
      }
    },
    cell: {
      formatters: [
        search.highlightCell
      ]
    },
    visible: false
  },
  {
    property: 'JOB_MGR_PID',
    header: {
      label: 'JOB_MGR_PID',
      formatters: [
        (v, extra) => resize(sortableHeader(v, extra), extra)
      ],
      props: {
        style: {
          width: 100
        }
      }
    },
    cell: {
      formatters: [
        search.highlightCell
      ]
    },
    visible: false
  },
  {
    property: 'JOB_STEP_ID',
    header: {
      label: 'JOB_STEP_ID',
      formatters: [
        (v, extra) => resize(sortableHeader(v, extra), extra)
      ],
      props: {
        style: {
          width: 100
        }
      }
    },
    cell: {
      formatters: [
        search.highlightCell
      ]
    },
    visible: false
  },
  {
    property: 'SCHEDULED_DATE',
    header: {
      label: 'SCHEDULED_DATE',
      formatters: [
        (v, extra) => resize(sortableHeader(v, extra), extra)
      ],
      props: {
        style: {
          width: 100
        }
      }
    },
    cell: {
      formatters: [
        search.highlightCell
      ]
    },
    visible: false
  },
  {
    property: 'SECONDARY_USER_ID',
    header: {
      label: 'SECONDARY_USER_ID',
      formatters: [
        (v, extra) => resize(sortableHeader(v, extra), extra)
      ],
      props: {
        style: {
          width: 100
        }
      }
    },
    cell: {
      formatters: [
        search.highlightCell
      ]
    },
    visible: false
  },
  {
    property: 'UNIQUE_ID',
    header: {
      label: 'UNIQUE_ID',
      formatters: [
        (v, extra) => resize(sortableHeader(v, extra), extra)
      ],
      props: {
        style: {
          width: 100
        }
      }
    },
    cell: {
      formatters: [
        search.highlightCell
      ]
    },
    visible: false
  }
];
}

  handleCloseModal () {
    this.setState({ showModal: false });
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

  const popMenu = (
    <li href={this.state.selectedrow.LOG_FILE_URL1}> {this.state.selectedColumn.LOG_FILE_DESC1} </li>
  )

    return (
      <div>
        <h1> Job Viewer </h1>

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

        <ReactModal
          style={customStyles}
          isOpen={this.state.showModal}
          contentLabel="Minimal Modal Example"
        >
        <div> {popMenu} </div>
        <button onClick={this.handleCloseModal}>Close Modal</button>
        </ReactModal>

        </Table.Provider>

        <div className="controls">
          <Paginator
            pagination={pagination}
            pages={paginated.amount}
            onSelect={this.onSelect}
          />
        </div>




        {/* <VisibilityToggles
          columns={columns}
          onToggleColumn={this.onToggleColumn}
        />

        <Table.Provider
          className="pure-table pure-table-striped"
          columns = { resolvedColumns }   >

          <Table.Header headerRows={resolve.headerRows({ columns })} >
            <search.Columns
              query={query}
              columns={ resolvedColumns }
              onChange={query => this.setState({ query })} />
          </Table.Header>

          <Table.Body rows={searchedRows} rowKey="id" />
        </Table.Provider> */}

        {/* {this.state.sqlMetadata.map( (res) => (
        <li key={res.name}> {res.name} </li>))} */}

        {/* {this.state.currentTime }; */}
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

  onRow(row, { rowIndex }) {
    return {
      onClick: () => this.onRowSelected(row)
    };
  }
  onRowSelected(row) {
    console.log('clicked row', row);
    this.setState({ showModal: true });
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
  onRemove(id) {
    const rows = cloneDeep(this.state.rows);
    const idx = findIndex(rows, { id });

    // this could go through flux etc.
    rows.splice(idx, 1);

    this.setState({ rows });
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

