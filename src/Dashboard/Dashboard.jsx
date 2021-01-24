import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
//import { Test } from './Dashboard.styles';

class Dashboard extends PureComponent { 
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  componentWillMount = () => {
    console.log('Dashboard will mount');
  }

  componentDidMount = () => {
    console.log('Dashboard mounted');
  }

  componentWillReceiveProps = (nextProps) => {
    console.log('Dashboard will receive props', nextProps);
  }

  componentWillUpdate = (nextProps, nextState) => {
    console.log('Dashboard will update', nextProps, nextState);
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
        Test content
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
