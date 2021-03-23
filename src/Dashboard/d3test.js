import React, {
    Component
} from 'react';
import * as d3 from "d3";

class BarChart extends Component {

    svg;

    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    componentWillMount() {
        // this.prepareChart();
    }

    componentDidMount() {
        this.prepareChart();
        this.drawChart();
    }

    componentWillUnmount = () => {
        console.log('Chart will unmount');
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
        console.log('Draw chart');
        const data = [12, 5, 6, 6, 9, 10, 12, 15, 17, 23];

        const width = this.ref.current.offsetWidth
        const height = this.ref.current.offsetHeight

        let barWidth = 0.75 * (width / data.length)
        let barSpace = 0.25 * (width / data.length)

        console.log(this.svg);

        this.svg.selectAll("rect")
            .data(data).enter()
            .append("rect")
            .attr("x", (d, i) => i * (barSpace + barWidth))
            .attr("y", (d, i) => 300 - 10 * d)
            .attr("width", barWidth)
            .attr("height", (d, i) => d * 10)
            .attr("fill", "green");
    }

    render(){
        console.log('Creating chart wrapper');
        return <div id="chartWrapper" ref={this.ref} style={{height: this.props.height ?? "100%", width: this.props.width ?? "100%"}}></div>;
      }

}

export default BarChart;
