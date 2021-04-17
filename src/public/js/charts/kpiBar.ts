import BaseChart from "./baseChart.js";

class KPIBar extends BaseChart {

    svg;
    barHeight;

    constructor(canvasID:string, baseData = {}) {
        super(canvasID, baseData);
        // Set default margins
        this.setMargins({bottom: 25, top: 5, right:100});
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
            .attr("x", margin.left)
            .attr("y", 0)
            .attr("width", this.xScale(data[0]))
            .attr("height", this.barHeight)
            .attr("data-value", data[0])
            .attr("fill", "grey")
            .attr("stroke", "grey")
            .attr("stroke-width", 1);

        // Budget/Target (BUD)
        this.svg.append("rect")
            .attr("x", margin.left + 1)
            .attr("y", this.barHeight)
            .attr("width", this.xScale(data[2]))
            .attr("height", this.barHeight)
            .attr("data-value", data[2])
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 2);

        // Current value (ACT)
        this.svg.append("rect")
            .attr("x", margin.left)
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
                .attr("x", this.xScale(data[1]) + margin.left)
                .attr("y", 0.5 * this.barHeight)
                .attr("width", this.xScale(data[3]) - this.xScale(data[1]))
                .attr("height", this.barHeight)
                .attr("data-value", data[3])
                .attr("fill", "url(#diagonal-stripe-1) none")
                .attr("stroke", "black")
                .attr("stroke-width", 1);
        }

        this.drawLabels();
        this.drawAxes();
    }

    drawLabels() {
        const data = this.chartData.data;
        const margin = this.baseData.margin;

        const py = data[0];
        const act = data[1];
        const bud = data[2];

        let labelData = [];
        labelData[0] = (act/py) - 1
        labelData[1] = act
        labelData[2] = (act/bud) - 1

        // Remove any existing labels (e.g. after resize)
        // $('.numeric-label').each((index, label) => label.remove());
        d3.selectAll("#" + this.canvasID + " svg text.numeric-label").remove();

        const textPos = (val:number, pos = 0) => {
            if (pos == 0) {
                return this.baseData.width * 0.99;
            } else {
                return this.baseData.width * 0.90;
            }
        }

        this.svg.append("text")
            .attr("x", textPos(data[0], 1))
            .attr("y", margin.top + 5)
            .attr("class", "numeric-label")
            .text(d3.format(".1%")(labelData[0]))
            .attr("fill", "grey")
            .attr("style", "font-size: small; text-anchor: end");

        this.svg.append("text")
            .attr("x", textPos(data[1]))
            .attr("y", this.barHeight + margin.top)
            .attr("class", "numeric-label")
            .text(d3.format(".2s")(labelData[1]))
            .attr("fill", "black")
            .attr("style","text-anchor: end");

        this.svg.append("text")
            .attr("x", textPos(data[2], 1))
            .attr("y", this.baseData.height - margin.y)
            .attr("class", "numeric-label")
            .text(d3.format(".1%")(labelData[2]))
            .attr("fill", "grey")
            .attr("style", "font-size: small; text-anchor: end;");
    }

    /**
     * Configure scales
     */
    setScales() {
        const margin = this.baseData.margin;

        this.xScale = d3.scaleLinear()
            .domain([0, d3.max(this.chartData.data, (d:number) => d)]).nice()
            .range([0, this.baseData.width - margin.x]);

        this.yScale = d3.scaleLinear()
            .domain([0, 3])
            .range([0, this.baseData.height - margin.y]);
    }

    drawAxes() {
        const margin = this.baseData.margin
        const xAxis = g => g
            .attr("transform", "translate(" + margin.left + "," + (this.baseData.height - margin.bottom - 3) + ")")
            .call(d3.axisBottom(this.xScale).ticks(2, "~s"))
            .call(g => g.select(".domain").remove());


        d3.selectAll("#" + this.canvasID + " svg g.x-axis").remove();
        this.svg.append("g").call(xAxis).attr("class", "x-axis");
    }


}

export default KPIBar;
