import BaseChart from "./baseChart.js";

class BarChart extends BaseChart {

    constructor() {
        super();
        // const data = [12, 5, 6, 6, 9, 10, 12, 15, 17, 23];
        // this.drawChart(data);
    }

    drawChart(data) {
        console.log("Draw BarChart");
        
        const width = 300;
        console.log("Width: " + width);

        let barWidth = 0.75 * (width / data.length)
        let barSpace = 0.25 * (width / data.length)

        d3.select('#chartCanvas svg').selectAll("rect")
            .data(data).enter()
            .append("rect")
            .attr("x", (d, i) => i * (barSpace + barWidth))
            .attr("y", (d:number, i) => 300 - 10 * d)
            .attr("width", barWidth)
            .attr("height", (d:number, i) => d * 10)
            .attr("fill", "green");
    }
}

export default BarChart;
