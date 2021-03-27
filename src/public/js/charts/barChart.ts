import BaseChart from "./baseChart.js";

class BarChart extends BaseChart {

    drawChart() {
        const width = 300;
        console.log("Draw BarChart");
        console.log("Width: " + width);
        const data = [12, 5, 6, 6, 9, 10, 12, 15, 17, 23];

        let barWidth = 0.75 * (width / data.length)
        let barSpace = 0.25 * (width / data.length)

        d3.select('#chartWrapper svg').selectAll("rect")
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
