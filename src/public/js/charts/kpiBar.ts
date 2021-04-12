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

        let barHeight = 0.5 * this.baseData.height;

        const bars = this.svg
            .selectAll("rect")
            .data(data);

        // Previous year (PY)
        this.svg.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", this.xScale(data[0]))
            .attr("height", barHeight)
            .attr("data-value", data[0])
            .attr("fill", "grey");

        // Budget/Target (BUD)
        this.svg.append("rect")
            .attr("x", 0)
            .attr("y", barHeight)
            .attr("width", this.xScale(data[2]))
            .attr("height", barHeight)
            .attr("data-value", data[2])
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 3);

        // Current value (ACT)
        this.svg.append("rect")
            .attr("x", 0)
            .attr("y", 0.5 * barHeight)
            .attr("width", this.xScale(data[1]))
            .attr("height", barHeight)
            .attr("data-value", data[1])
            .attr("fill", "black");

        // Forecast if Available
        if (!isNaN(data[3])) {
            this.svg.append("rect")
                .attr("x", this.xScale(data[1]))
                .attr("y", 0.5 * barHeight)
                .attr("width", this.xScale(data[3]) - this.xScale(data[1]))
                .attr("height", barHeight)
                .attr("data-value", data[3])
                .attr("fill", "url(#diagonal-stripe-1) none")
                .attr("stroke", "black")
                .attr("stroke-width", 1);
        }

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
