import React, {
    Component
} from 'react';
import * as d3 from "d3";

class BarChart extends Component {
    componentDidMount() {
        this.drawChart();
    }

    drawChart() {
        const data = [12, 5, 6, 6, 9, 10];
        const svg = d3.select("div.DashboardWrapper")
            .append("svg")
            .attr("width", 500)
            .attr("height", 500)
            .style("margin-left", 100);
        
        svg.selectAll("rect")
            .data(data).enter()
            .append("rect")
            .attr("x", (d, i) => i * 70)
            .attr("y", (d, i) => 500 - 10 * d)
            .attr("width", 65)
            .attr("height", (d, i) => d * 10)
            .attr("fill", "green");
    }

    render(){
        return <div id={"#chartWrapper"}></div>
      }

}

export default BarChart;