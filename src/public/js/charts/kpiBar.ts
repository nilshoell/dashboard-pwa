import BaseChart from "./baseChart.js";

class KPIBar extends BaseChart {

    svg;

    constructor(canvasID:string, baseData = {}) {
        super(canvasID, baseData);
    }

    drawChart(chartData) {
        console.log("Drawing KPIBar with data: ", chartData.data);
        let self = this;
        let data = chartData.data;

        const width = 300;
        const height = 50;

        var scale = d3.scaleLinear()
            .domain([0, 10000])
            .range([0, width]);

        var color = d3.scaleSequential()
            .domain([0, 2])
            .interpolator(d3.interpolateRdYlGn);

        let barHeight = 0.5 * height;

        this.svg = d3.select('#' + this.canvasID + ' svg');

        const bars = this.svg
            .selectAll("rect")
            .data(data);

        bars.join("rect")
            .attr("x", 0)
            .attr("y", (d:number, i:number) => i * 0.5 * barHeight)
            .attr("width", (d:number, i:number) => scale(d))
            .attr("height", barHeight)
            .attr("data-value", (d:number) => d)
            .attr("data-label", "false")
            .attr("fill", (d:number, i:number) => color(i));

        this.svg.append("rect")
            .attr("x", 0)
            .attr("y", 0.5 * barHeight)
            .attr("width", scale(data[1]))
            .attr("height", barHeight)
            .attr("data-value", data[1])
            .attr("data-label", "false")
            .attr("fill", color(1));

    }

}

export default KPIBar;
