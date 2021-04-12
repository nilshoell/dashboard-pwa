import BaseChart from "./baseChart.js";

class Sparkline extends BaseChart {

    constructor(canvasID:string, baseData = {}) {
        super(canvasID, baseData);
        this.baseData.margin = {
            top: 5,
            bottom: 15,
            left: 5,
            right: 25
        }
    }

    drawChart(chartData) {

        let self = this;
        this.chartData = chartData;
        const data = chartData.data;
        const margin = this.baseData.margin;
        console.log("Drawing Sparkline with data: ", data);

        // Create scales with default function
        this.setScales();

        // Add background bounding box
        this.svg.append("rect")
            .attr("x", margin.left)
            .attr("y", margin.top)
            .attr("width", this.baseData.width - margin.left - margin.right)
            .attr("height", this.baseData.height - margin.top - margin.bottom)
            .attr("fill", "#b0b0b0");

        // Draw axes
        this.drawAxes();

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
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            // .attr("stroke-linejoin", "round")
            // .attr("stroke-linecap", "round")
            .attr("d", line(data));

        path.exit().remove();

    }

    setScales() {
        const margin = this.baseData.margin
        const width = this.baseData.width
        const height = this.baseData.height

        this.xScale = d3.scaleLinear()
            .domain(d3.extent(this.chartData.data, (d:number, i:number) => i))
            .range([margin.left, width - margin.right]);

        this.yScale = d3.scaleLinear()
            .domain([d3.min(this.chartData.data, (d:number) => d) - 5, d3.max(this.chartData.data, (d:number) => d) + 5]).nice()
            .range([height - margin.bottom, margin.top]);
    }

    drawAxes(axisData = {}) {
        const margin = this.baseData.margin
        const xAxis = g => g
            .attr("transform", "translate(0," + (this.baseData.height - margin.bottom - 5) + ")")
            .call(d3.axisBottom(this.xScale).ticks(4))
            .call(g => g.select(".domain").remove());

        const yAxis = g => g
            .attr("transform", "translate(" + (this.baseData.width - margin.right - 5) + ", 0)")
            .call(d3.axisRight(this.yScale).ticks(1, "~s"))
            .call(g => g.select(".domain").remove());

        const xBound = g => g
            .append("line")
            .attr("transform", "translate(0," + (this.baseData.height - 10) + ")")
            .attr("fill", "none")
            .attr("stroke", "green")
            .attr("y2", 10);

        this.svg.append("g").call(xAxis);
        this.svg.append("g").call(yAxis);
    }

}

export default Sparkline;
