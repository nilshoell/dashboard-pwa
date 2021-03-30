import BaseChart from "./baseChart.js";

class BarChart extends BaseChart {

    constructor(canvasID:string) {
        super(canvasID);
    }

    drawChart(chartData) {
        console.log("Drawing BarChart with data: ");
        console.log(chartData.data);

        let data = chartData.data;

        const width = 300;
        console.log("Width: " + width);

        let barWidth = 0.75 * (width / data.length)
        let barSpace = 0.25 * (width / data.length)

        const bars = d3.select('#' + this.canvasID + ' svg')
            .selectAll("rect")
            .data(data);

        bars.join("rect")
            .attr("x", (d, i) => i * (barSpace + barWidth))
            .attr("y", (d:number, i) => 300 - 10 * d)
            .attr("width", barWidth)
            .attr("height", (d:number, i) => d * 10)
            .attr("fill", "green");

        bars.exit().remove();
    }

}

export default BarChart;
