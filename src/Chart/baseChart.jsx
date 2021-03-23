import React, {
    Component
} from 'react';
import * as d3 from "d3";

class BaseChart extends Component {

    svg;
    width;
    height;

    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    componentDidMount() {
        this.prepareChart();

        this.width = this.ref.current.offsetWidth;
        this.height = this.ref.current.offsetHeight;

        this.drawChart();
    }

    componentWillUnmount = () => {
        this.svg.remove();
    }

    prepareChart() {
        this.svg = d3.select('#chartWrapper')
            .append("svg")
            .attr("width", this.props.width ?? "100%")
            .attr("height", this.props.height ?? "100%")
            .style("margin-left", 10);
    }

    drawChart() {
        throw new Exception("Draw Chart not implemented.")
    }

    render(){
        return <div id="chartWrapper" ref={this.ref} style={{height: this.props.height ?? "100%", width: this.props.width ?? "100%"}}></div>;
      }

}

export default BaseChart;
