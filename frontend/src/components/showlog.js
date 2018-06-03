import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types'

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
    axios({
      method:'get',
      url: this.props.location.link
    })
      .then(res => {
        let log = res.data;
        this.setState({log});
        })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div>
        {/* <h1>SHOW LOG</h1> */}
        <pre>
          <br/><br/>
        {this.state.log}
        </pre>
      </div>
      
    );
  }

}