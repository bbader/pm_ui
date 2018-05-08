
import React from 'react';
import PropTypes from 'prop-types';

export default class PopMenu extends React.Component {
  static propTypes = {
    items: PropTypes.object
  };
  render() {
    return (
      <ul >
        <a style={{display: 'table-cell'}} href={`http://10.211.55.253:3000/utilities/readlogfile/fe?log=${this.props.items.LOG_FILE_URL1}`} target='_blank'>text</a>

        <li><a href={`http://10.211.55.253:3000/utilities/readlogfile/fe?log=${this.props.items.LOG_FILE_URL1}`}>{this.props.items.LOG_FILE_DESC1} </a></li>
        <li><a href={`/utilities/readlogfile?log=${this.props.items.LOG_FILE_URL2}`}>{this.props.items.LOG_FILE_DESC2} </a></li>
        <li><a href={`/utilities/readlogfile?log=${this.props.items.LOG_FILE_URL3}`}>{this.props.items.LOG_FILE_DESC3} </a></li>
        <li><a href={`/utilities/readlogfile?log=${this.props.items.LOG_FILE_URL4}`}>{this.props.items.LOG_FILE_DESC4} </a></li>
        <li><a href={`/utilities/readlogfile?log=${this.props.items.LOG_FILE_URL5}`}>{this.props.items.LOG_FILE_DESC5} </a></li>
      </ul>
    );
  }
}


