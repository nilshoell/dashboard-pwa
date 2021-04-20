import BaseChart from "./baseChart.js";

/**
 * A simple and clean column chart
 */
class ColumnChart extends BaseChart {

    barHeight;
    barSpace;

    constructor(canvasID:string, baseData = {}) {
        super(canvasID, baseData);
        this.setMargins({left: 30, right:5, top: 20});
    }

    /**
     * Draws the column chart and axes
     * @param chartData The data to draw
     */
    drawChart(chartData) {
        let self = this;
        this.chartData = chartData;
        const data = chartData.data;
        console.log("Drawing ColumnChart with data: ", data);

        const margin = this.baseData.margin;

        this.barHeight = 0.75 * (this.baseData.height - margin.y) / data.length;
        this.barSpace = 0.25 * (this.baseData.height - margin.y) / data.length;

        this.setScales();

        const bars = this.svg
            .selectAll("rect")
            .data(data);

        bars.join("rect")
            .attr("x", margin.left)
            .attr("y", (d:number, i:number) => this.yScale(i))
            .attr("width", (d:number) => this.xScale(d))
            .attr("height", this.yScale.bandwidth())
            .attr("data-value", (d:number) => d)
            .attr("fill", "green");

        // bars.exit().remove();
        this.drawAxes();
        this.drawLabels();
    }

    /**
     * Configure scales
     */
    setScales() {
        const margin = this.baseData.margin;
        const width = this.baseData.width;
        const height = this.baseData.height;
        const data = this.chartData.data;

        this.yScale = (i) => {return (i * (this.barHeight + this.barSpace)) + margin.top};
        this.yScale.bandwidth = () => {return this.barHeight}

        this.xScale = d3.scaleLinear()
            .domain([0, d3.max(this.chartData.data, (d:number) => d)]).nice()
            .range([margin.left, width - margin.right]);
    }

    /**
     * Draw axes (only x-axis now)
     */
    drawAxes() {
        const margin = this.baseData.margin;
        const xAxis = g => g
            .attr("transform", "translate(0," + (margin.top - 2) + ")")
            .call(d3.axisTop(this.xScale).ticks(6, "~s"))
            .call(g => g.select(".domain").remove());

        d3.selectAll("#" + this.canvasID + " svg g.x-axis").remove();
        this.svg.append("g").call(xAxis).attr("class", "x-axis");
    }

    /**
     * Add labels to the end of bars
     */
    drawLabels() {
        const data = this.chartData.data;
        const margin= this.baseData.margin;

        const labelFilter = (d:number) => this.xScale(d) - this.xScale(0) < 20

        this.svg.append("g")
            .attr("fill", "white")
            .attr("text-anchor", "end")
            .selectAll("text")
            .data(data)
            .join("text")
              .attr("x", (d:number) => this.xScale(d) + margin.left)
              .attr("y", (d:number, i:number) => this.yScale(i) + this.yScale.bandwidth() / 2)
              .attr("dy", "0.35em")
              .attr("dx", -4)
              .text((d:number) => d3.format(".2s")(d))
            .call(text => text.filter(labelFilter) // Change style for short bars
              .attr("dx", +4)
              .attr("fill", "black")
              .attr("text-anchor", "start"));
    }
}

export default ColumnChart;
