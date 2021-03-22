import React, {
    Component
} from 'react';
import * as d3 from "d3";

class BarChart extends Component {
    componentDidMount() {
        this.drawChart();
    }

    drawChart() {
        console.log('Draw chart');
        let width = document.getElementById(this.props.parentID).offsetWidth
        let height = document.getElementById(this.props.parentID).offsetHeight
        const data = [12, 5, 6, 6, 9, 10, 12, 15, 17, 23];

        let barWidth = 0.75 * (width / data.length)
        let barSpace = 0.25 * (width / data.length)

        // const svg = d3.select("#" + this.props.parentID)
        const svg = d3.select("#" + this.props.parentID)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .style("margin-left", 10);
        
        svg.selectAll("rect")
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
        return <div className={"chartWrapper"}></div>
      }

}

export default BarChart;