import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
//import { Test } from './KpiTree.styles';

class KpiTree extends PureComponent { 
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  componentDidMount = () => {
    console.log('KpiTree mounted');
  }

  componentDidUpdate = () => {
    console.log('KpiTree did update');
  }

  componentWillUnmount = () => {
    console.log('KpiTree will unmount');
  }

  render () {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return (
      <div className="KpiTreeWrapper">
        KPITree
      </div>
    );
  }
}

KpiTree.propTypes = {
  // bla: PropTypes.string,
};

KpiTree.defaultProps = {
  // bla: 'test',
};

export default KpiTree;
