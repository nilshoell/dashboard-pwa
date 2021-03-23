import * as d3 from "d3";
import BaseChart from "./baseChart";

class BarChart extends BaseChart {

    drawChart() {
        const data = [12, 5, 6, 6, 9, 10, 12, 15, 17, 23];

        let barWidth = 0.75 * (this.width / data.length)
        let barSpace = 0.25 * (this.width / data.length)

        this.svg.selectAll("rect")
            .data(data).enter()
            .append("rect")
            .attr("x", (d, i) => i * (barSpace + barWidth))
            .attr("y", (d, i) => 300 - 10 * d)
            .attr("width", barWidth)
            .attr("height", (d, i) => d * 10)
            .attr("fill", "green");
    }
}

export default BarChart;
