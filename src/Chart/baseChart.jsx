import React, {
    Component
} from 'react';
import * as d3 from "d3";

class BaseChart extends Component {

    svg;

    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    componentDidMount() {
        this.prepareChart();
        this.drawChart();

        const self = this;
        window.addEventListener("resize", () => this.resize(self));
    }

    componentWillUnmount = () => {
        window.removeEventListener("resize", this.resize);
        this.svg.remove();
    }

    resize(self) {
        console.log("Resize Detected");
        self.drawChart();
        self.forceUpdate();
    }

    shouldComponentUpdate() {
        const res = super.shouldComponentUpdate();
        console.log("Should update: " + res);
        return res;
    }

    prepareChart() {
        this.svg = d3.select('#chartWrapper')
            .append("svg")
            .attr("width", this.props.width ?? "100%")
            .attr("height", this.props.height ?? "100%")
            .style("margin-left", 10);
    }

    drawChart() {
        throw "Draw Chart not implemented.";
    }

    render() {
        console.log("Render");
        return <div id="chartWrapper" ref={this.ref} style={{height: this.props.height ?? "100%", width: this.props.width ?? "100%"}}></div>;
      }

}

export default BaseChart;
