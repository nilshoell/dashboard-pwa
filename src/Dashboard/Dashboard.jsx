import React, { PureComponent } from 'react';
import BarChart from './../Charts/';
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
      <div id="DashboardWrapper" style={{height: "100%"}}>
        Dashboard:
        <BarChart parentID="DashboardWrapper"/>
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
