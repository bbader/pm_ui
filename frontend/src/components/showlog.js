import React from 'react';
import axios from 'axios';

export class ShowLog extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      link: [],
      log: []
    };

    // let {location} = this.props;
    // this.state.link = location.link;

    this.readlog = this.readlog.bind(this);
  }

  readlog(link) {
    axios({
      method:'get',
      url: link
    })
      .then(res => {
        let log = res.data;
        this.setState({log});
        console.log('log: ', log);
        });
      //.catch(err => console.log(err));
  }

  render() {
    // this.setState( {log: this.props } ) ;
    // console.log( {this.props.children} );
    let { location } = this.props;
    console.log({location});
    let link = location.state;
    console.log(link);

    this.readlog(link);

    // let linklink = link.link;
    // console.log(linklink);
    // this.setState({link: link } );

    // let log  =  (location.state);
    // console.log({log});
    // console.log( this.state.link );
    return (
      <div>
        <h1>SHOW LOG</h1>
        {/* <h2> {log} </h2> */}
        <pre>
        {this.state.log}

        </pre>
      </div>
      
    );
  }

}