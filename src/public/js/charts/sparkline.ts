import BaseChart from "./baseChart.js";

class Sparkline extends BaseChart {

    svg;

    constructor(canvasID:string, baseData = {}) {
        super(canvasID, baseData);
    }

    drawChart(chartData) {
        console.log("Drawing Sparkline with data: ", chartData.data);
        let self = this;
        let data = chartData.data;

        const width = 300;
        const height = 50;

        const xScale = d3.scaleLinear()
            .domain(d3.extent(data, (d:number, i:number) => i))
            .range([0, width]);

        const yScale = d3.scaleLinear()
            // .domain(d3.extent(data, (d:number) => d))
            .domain([0, d3.max(data, (d:number) => d)]).nice()
            .range([height, 0]);

        const color = d3.scaleSequential()
            .domain([0, 2])
            .interpolator(d3.interpolateRdYlGn);

        const xAxis = g => g
            .attr("transform", "translate(0," + (height) + ")")
            .call(d3.axisBottom(xScale).ticks(4));

        const yAxis = g => g
            .attr("transform", "translate(" + (width) + ", 0)")
            .call(d3.axisRight(yScale).ticks(0));

        this.svg = d3.select('#' + this.canvasID + ' svg');

        // this.svg.append("g").call(xAxis);
        // this.svg.append("g").call(yAxis);

        let line = d3.line()
            .x((d:any, i:any) => xScale(i))
            .y((d:any) => yScale(d))
            .curve(d3.curveCardinal);

        const path = this.svg
            .selectAll("path")
            .data(data);

        path.join("path")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("d", line(data));

        path.exit().remove();

    }

}

export default Sparkline;
