

import React from 'react';
import PropTypes from 'prop-types';
import { getDataAPI } from './api';

export class ShowLog extends React.Component {
  static propTypes = {
    location: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      log: []
    };
  }

  componentDidMount() {
    getDataAPI.all(this.updateResult, this.props.location.link);
  }

  updateResult = (res) => {
        let log = res.data;
        this.setState({log});
}

  render() {
    return (
      <div >
        <pre style={{textAlign: 'left', whiteSpace: 'pre-line' }}>
          <br/><br/>
        {this.state.log}
        </pre>
      </div>
    );
  }

}