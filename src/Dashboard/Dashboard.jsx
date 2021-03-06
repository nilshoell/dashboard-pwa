import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import rd3 from 'react-d3-library';
import node from './d3test';
const RD3Component = rd3.Component;
//import { Test } from './Dashboard.styles';

class ReactD3Test extends React.Component {

  constructor(props) {
    super(props);
    this.state = {d3: ''}
  }

  componentDidMount() {
    this.setState({d3: node});
  }

  render() {
    return (
      <div>
        <RD3Component data={this.state.d3} />
      </div>
    )
  }
};

class Dashboard extends PureComponent { 
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  componentDidMount = () => {
    console.log('Dashboard mounted');
  }

  componentDidUpdate = () => {
    console.log('Dashboard did update');
  }

  componentWillUnmount = () => {
    console.log('Dashboard will unmount');
  }

  render () {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return (
      <div className="DashboardWrapper">
        Dashboard:
        <ReactD3Test />
      </div>
    );
  }
}

Dashboard.propTypes = {
  // bla: PropTypes.string,
};

Dashboard.defaultProps = {
  // bla: 'test',
};

export default Dashboard;
