import BaseChart from "./baseChart.js";

class KPIBar extends BaseChart {

    svg;

    constructor(canvasID:string, baseData = {}) {
        super(canvasID, baseData);
    }

    drawChart(chartData) {
        let self = this;
        this.chartData = chartData;
        const data = chartData.data;
        console.log("Drawing KPIBar with data: ", data);

        // Reduce height
        this.baseData.height -= 10;

        this.setScales();

        var color = d3.scaleSequential()
            .domain([0, 2])
            .interpolator(d3.interpolateRdYlGn);

        let barHeight = 0.5 * this.baseData.height;

        const bars = this.svg
            .selectAll("rect")
            .data(data);

        bars.join("rect")
            .attr("x", 0)
            .attr("y", (d:number, i:number) => i * 0.5 * barHeight)
            .attr("width", (d:number, i:number) => this.xScale(d))
            .attr("height", barHeight)
            .attr("data-value", (d:number) => d)
            .attr("data-label", "false")
            .attr("fill", (d:number, i:number) => color(i));

        // Manually redraw the second bar to be on top
        this.svg.append("rect")
            .attr("x", 0)
            .attr("y", 0.5 * barHeight)
            .attr("width", this.xScale(data[1]))
            .attr("height", barHeight)
            .attr("data-value", data[1])
            .attr("fill", color(1));

    }

    /**
     * Configure scales
     */
    setScales() {
        this.xScale = d3.scaleLinear()
            .domain([0, d3.max(this.chartData.data, (d:number) => d)]).nice()
            .range([0, this.baseData.width]);

        this.yScale = d3.scaleLinear()
            .domain([0, 3])
            .range([0, this.baseData.height]);
    }


}

export default KPIBar;
