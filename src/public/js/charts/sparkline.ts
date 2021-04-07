import BaseChart from "./baseChart.js";

class Sparkline extends BaseChart {

    constructor(canvasID:string, baseData = {}) {
        super(canvasID, baseData);
    }

    drawChart(chartData) {

        let self = this;
        this.chartData = chartData;
        const data = chartData.data;
        console.log("Drawing Sparkline with data: ", data);

        // Create scales with default function
        this.setScales();

        // Draw axes
        // this.drawAxes();

        // Create line generator
        let line = d3.line()
            .x((d:any, i:any) => this.xScale(i))
            .y((d:any) => this.yScale(d))
            .curve(d3.curveCardinal);

        // Setup path object
        const path = this.svg
            .selectAll("path")
            .data(data);

        // Update data
        path.join("path")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("d", line(data));

        path.exit().remove();

    }

    drawAxes(axisData = {}) {
        const xAxis = g => g
            .attr("transform", "translate(0," + (this.baseData.height) + ")")
            .call(d3.axisBottom(this.xScale).ticks(4));

        const yAxis = g => g
            .attr("transform", "translate(" + (this.baseData.width) + ", 0)")
            .call(d3.axisRight(this.yScale).ticks(0));

        this.svg.append("g").call(xAxis);
        this.svg.append("g").call(yAxis);
    }

}

export default Sparkline;
