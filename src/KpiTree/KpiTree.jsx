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

  componentWillMount = () => {
    console.log('KpiTree will mount');
  }

  componentDidMount = () => {
    console.log('KpiTree mounted');
  }

  componentWillReceiveProps = (nextProps) => {
    console.log('KpiTree will receive props', nextProps);
  }

  componentWillUpdate = (nextProps, nextState) => {
    console.log('KpiTree will update', nextProps, nextState);
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
