import BaseChart from "./baseChart.js";

/**
 * A simple and clean column chart
 */
class ColumnChart extends BaseChart {

    barHeight;
    barSpace;

    constructor(canvasID:string, baseData = {}) {
        super(canvasID, baseData);
        this.setMargins({left: 5, right:5, top: 20});
    }

    /**
     * Draws the column chart and axes
     * @param chartData The data to draw
     */
    drawChart(chartData) {
        // Base setup
        this.chartData = chartData;
        BaseChart.prototype.drawChart(this);
        
        const data = chartData.data;
        const margin = this.baseData.margin;

        this.barHeight = d3.min([0.75 * (this.baseData.height - margin.y) / data.length, 30]);
        this.barSpace = 0.25 * this.barHeight;

        this.setScales();

        const bars = this.svg
            .selectAll("rect")
            .data(data, d => d.val);

        bars.join("rect")
            .attr("x", margin.left)
            .attr("y", (d:any, i:number) => this.yScale(i))
            .attr("width", (d:any) => this.xScale(d.val))
            .attr("height", this.yScale.bandwidth())
            .attr("data-value", (d:any) => d.val)
            .attr("data-id", (d:any) => d.product ?? d.partner ?? "")
            .attr("fill", chartData.color ?? "black");

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
        const data = this.chartData.data.map(d => d.val);

        this.yScale = (i) => {return (i * (this.barHeight + this.barSpace)) + margin.top;};
        this.yScale.bandwidth = () => {return this.barHeight;};

        this.xScale = d3.scaleLinear()
            .domain([0, d3.max(data, (d:number) => d)]).nice()
            .range([margin.left, width - margin.x]);
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

        const labelFilter = (d:any) => this.xScale(d.val) - this.xScale(0) < 50;

        this.svg.selectAll("g.text-label").remove();

        this.svg.append("g")
            .attr("fill", "white")
            .attr("text-anchor", "end")
            .attr("class", "text-label")
            .selectAll("text")
            .data(data)
            .join("text")
              .attr("x", (d:any) => this.xScale(d.val) + margin.left)
              .attr("y", (d:number, i:number) => this.yScale(i) + this.yScale.bandwidth() / 2)
              .attr("dy", "0.35em")
              .attr("dx", -4)
              .text((d:any) => d3.format(".2s")(d.val))
            .call(text => text.filter(labelFilter) // Change style for short bars
              .attr("dx", +45)
              .attr("fill", "black")
              .attr("text-anchor", "start"));

        this.svg.append("g")
            .attr("fill", "white")
            .attr("text-anchor", "start")
            .attr("class", "text-label")
            .selectAll("text")
            .data(data)
            .join("text")
              .attr("x", 12)
              .attr("y", (d:number, i:number) => this.yScale(i) + this.yScale.bandwidth() / 2)
              .attr("dy", "0.35em")
              .attr("dx", -4)
              .text((d:any) => d.shortname)
            .call(text => text.filter(labelFilter) // Change style for short bars
              .attr("dx", +50)
              .attr("fill", "black")
              .attr("text-anchor", "start"));
    }
}

export default ColumnChart;
