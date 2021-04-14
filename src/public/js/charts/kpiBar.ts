import BaseChart from "./baseChart.js";

class KPIBar extends BaseChart {

    svg;
    barHeight;

    constructor(canvasID:string, baseData = {}) {
        super(canvasID, baseData);
    }

    drawChart(chartData) {
        let self = this;
        this.chartData = chartData;
        const data = chartData.data;
        const margin = this.baseData.margin;
        console.log("Drawing KPIBar with data: ", data);

        this.setScales();

        this.barHeight = 0.5 * (this.baseData.height - margin.y);

        const bars = this.svg
            .selectAll("rect")
            .data(data);
        bars.remove();

        // Previous year (PY)
        this.svg.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", this.xScale(data[0]))
            .attr("height", this.barHeight)
            .attr("data-value", data[0])
            .attr("fill", "grey");

        // Budget/Target (BUD)
        this.svg.append("rect")
            .attr("x", 0)
            .attr("y", this.barHeight)
            .attr("width", this.xScale(data[2]))
            .attr("height", this.barHeight)
            .attr("data-value", data[2])
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 3);

        // Current value (ACT)
        this.svg.append("rect")
            .attr("x", 0)
            .attr("y", 0.5 * this.barHeight)
            .attr("width", this.xScale(data[1]))
            .attr("height", this.barHeight)
            .attr("data-value", data[1])
            .attr("fill", "black")
            .attr("stroke", "black")
            .attr("stroke-width", 1);

        // Forecast if Available
        if (!isNaN(data[3])) {
            this.svg.append("rect")
                .attr("x", this.xScale(data[1]))
                .attr("y", 0.5 * this.barHeight)
                .attr("width", this.xScale(data[3]) - this.xScale(data[1]))
                .attr("height", this.barHeight)
                .attr("data-value", data[3])
                .attr("fill", "url(#diagonal-stripe-1) none")
                .attr("stroke", "black")
                .attr("stroke-width", 1);
        }

        this.drawLabels();
    }

    drawLabels() {
        const data = this.chartData.data;
        const margin = this.baseData.margin;

        const labelData = data;

        // Remove any existing labels (e.g. after resize)
        // $('.numeric-label').each((index, label) => label.remove());
        d3.selectAll("#" + this.canvasID + " svg text.numeric-label").remove();

        const textPos = (val:number) => {
            // const xVal = this.xScale(val);
            // if (xVal < 30) {
            //     return 15;
            // } else {
            //     return xVal - 20;
            // }
            return this.baseData.width - 50;
        }

        this.svg.append("text")
            .attr("x", textPos(data[0]))
            .attr("y", margin.y)
            .attr("class", "numeric-label")
            .text(d3.format(".2s")(labelData[0]))
            .attr("fill", "black")
            .attr("style", "font-size: small");

        this.svg.append("text")
            .attr("x", textPos(data[1]))
            .attr("y", this.barHeight + margin.top)
            .attr("class", "numeric-label")
            .text(d3.format(".2s")(labelData[1]))
            .attr("fill", "black");

        this.svg.append("text")
            .attr("x", textPos(data[2]))
            .attr("y", this.baseData.height - margin.y)
            .attr("class", "numeric-label")
            .text(d3.format(".2s")(labelData[2]))
            .attr("fill", "black")
            .attr("style", "font-size: small");
    }

    /**
     * Configure scales
     */
    setScales() {
        const margin = this.baseData.margin;

        this.xScale = d3.scaleLinear()
            .domain([0, d3.max(this.chartData.data, (d:number) => d)]).nice()
            .range([0, this.baseData.width - margin.right]);

        this.yScale = d3.scaleLinear()
            .domain([0, 3])
            .range([0, this.baseData.height - margin.y]);
    }


}

export default KPIBar;
