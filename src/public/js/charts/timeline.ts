import BaseChart from "./baseChart.js";
import {
    toISO
} from "../components/helperFunctions.js";

/**
 * A standard line graph with a time-based x-axis
 */
class Timeline extends BaseChart {

    constructor(canvasID: string, baseData = {}) {
        super(canvasID, baseData);
        const margin = {
            top: 5,
            bottom: 30,
            left: 10,
            right: 30
        };
        this.setMargins(margin);
    }

    /**
     * Draws the line chart
     * @param chartData The data to draw
     */
    drawChart(chartData) {
        // Base setup
        const today = toISO(new Date());
        chartData.data = d3.filter(chartData.data, (d: any) => d.date <= today);
        this.chartData = chartData;
        BaseChart.prototype.drawChart(this);

        const data = chartData.data;

        // Create scales with default function
        this.setScales();

        // Add background bounding box
        this.setBackground();

        // Create line generator
        const line = d3.line()
            .x((d: any) => this.xScale(new Date(d.date)))
            .y((d: any) => this.yScale(d.val))
            .curve(d3.curveCardinal);

        // Setup path object
        const path = this.svg
            .selectAll("path")
            .data(data);

        path.exit().remove();

        // Update data
        path.join("path")
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("d", line(data));

        // Draw annotations
        this.drawAnnotations();

        // Draw axes
        this.drawAxes();

    }


    /**
     * Overrides the default scales
     */
    setScales() {
        const margin = this.baseData.margin;
        const width = this.baseData.width;
        const height = this.baseData.height;
        const data = this.chartData.data;
        const minDate = new Date(d3.min(data, (d: any) => d.date));
        const maxDate = new Date(d3.max(data, (d: any) => d.date));
        const maxVal = Number(d3.max(data, (d: any) => d.val));
        const minVal = d3.min([0, Number(d3.min(data, (d: any) => d.val))]);

        this.xScale = d3.scaleTime()
            .domain([minDate, maxDate])
            .range([margin.left, width - margin.right]);

        this.yScale = d3.scaleLinear()
            .domain([minVal, maxVal]).nice()
            .range([height - margin.bottom, margin.top]);
    }


    /**
     * Draw axes and labels
     */
    drawAxes() {
        const margin = this.baseData.margin;
        const unit = this.chartData.masterdata.unit;
        let format = "~s";
        if (unit === "%") {
            format = "%";
        }

        let timeFormat = "%b %d";
        if (this.chartData.data.length > 120) {
            timeFormat = "%b %Y";
        }

        const xAxis = g => g
            .attr("transform", "translate(0," + (this.baseData.height - margin.bottom - 3) + ")")
            .call(d3.axisBottom(this.xScale).ticks(4, timeFormat).tickSizeOuter(0))
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick text").style("text-anchor", "middle"));

        const yAxis = g => g
            .attr("transform", "translate(" + (this.baseData.width - margin.right - 3) + ", 0)")
            .call(d3.axisRight(this.yScale).ticks(5, format))
            .call(g => g.select(".domain").remove());

        d3.selectAll("#" + this.canvasID + " svg g.x-axis").remove();
        d3.selectAll("#" + this.canvasID + " svg g.y-axis").remove();
        this.svg.append("g").call(xAxis).attr("class", "x-axis");
        this.svg.append("g").call(yAxis).attr("class", "y-axis");
    }


    /**
     * Draws three additional annotations for min, max and current value
     */
    drawAnnotations() {
        const data = this.chartData.data;
        const maxVal = d3.max(data, (d: any) => d.val);
        const minVal = d3.min(data, (d: any) => d.val);

        const max = {
            x: this.xScale(new Date(data[data.findIndex(d => d.val == maxVal)].date)),
            y: this.yScale(maxVal),
            val: maxVal
        };
        const min = {
            x: this.xScale(new Date(data[data.findIndex(d => d.val == minVal)].date)),
            y: this.yScale(minVal),
            val: minVal
        };
        const current = {
            x: this.xScale(new Date(data[data.length - 1].date)),
            y: this.yScale(data[data.length - 1].val),
            val: data[data.length - 1].val
        };

        d3.selectAll("#" + this.canvasID + " svg circle.sparkline-annotation").remove();

        const drawCircle = (coords: any, color: string) => {
            this.svg.append("circle")
                .attr("cx", coords.x)
                .attr("cy", coords.y)
                .attr("r", 3)
                .attr("fill", color)
                .attr("class", "sparkline-annotation");
        };

        const drawLabel = (coords: any, format = ".2s") => {
            const height = this.baseData.height;
            const width = this.baseData.width;
            let anchor = "middle";
            const offset = {
                x: 0,
                y: 20
            };

            if (coords.y > (height / 2)) {
                offset.y = -20;
            }

            if (coords.x < (width * 0.1)) {
                offset.x = 5;
                anchor = "start";
            } else if (coords.x > (width * 0.9)) {
                offset.x = -5;
                anchor = "end";
            }

            this.svg.append("text")
                .attr("x", coords.x + offset.x)
                .attr("y", coords.y + offset.y)
                .attr("text-anchor", anchor)
                .attr("fill", "black")
                .text(d3.format(format)(coords.val))
                .attr("class", "sparkline-annotation");
        };

        let format = ".2s";
        if (this.chartData.masterdata.unit == "%") {
            format = ".1%";
        }

        // Draw max marker
        drawCircle(max, "green");
        // drawLabel(max, format);

        // Draw min marker
        drawCircle(min, "#e10000");
        // drawLabel(min, format);

        // Draw current marker
        drawCircle(current, "steelblue");
        // drawLabel(current, format);
    }


    /**
     * Draw or resize the bounding box
     */
    setBackground(draw = true) {

        if (!draw) {
            return;
        }

        const margin = this.baseData.margin;
        const backgrounds = d3.selectAll("#" + this.canvasID + " svg rect.sparkline-bg");
        const backgroundExists = Boolean(backgrounds.size());

        if (backgroundExists) {
            backgrounds
                .attr("width", this.baseData.width - margin.x)
                .attr("height", this.baseData.height - margin.y);

        } else {
            this.svg.append("rect")
                .attr("x", margin.left)
                .attr("y", margin.top)
                .attr("rx", 2)
                .attr("width", this.baseData.width - margin.x)
                .attr("height", this.baseData.height - margin.y)
                .attr("fill", "#b0b0b0")
                .attr("class", "sparkline-bg");
        }
    }

}

export default Timeline;