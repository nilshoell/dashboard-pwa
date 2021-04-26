import BaseChart from "./baseChart.js";

/**
 * A tile containing actual, previous and target values along a sparkline
 */
class KPITile extends BaseChart {

    constructor(canvasID:string, baseData = {}) {
        super(canvasID, baseData);
        // Set margins (only needed for sparkline)
        this.setMargins({bottom: 10, top: (this.baseData.height / 2) + 40, right: 10, left: 10});
    }

    /**
     * Data setup and drawing function calls
     * @param chartData The data to draw, with {data: {sparkData: [], barData:[]}}
     */
    drawChart(chartData) {
        this.chartData = chartData;
        const data = chartData.data;
        console.log("Drawing KPITile with data: ", chartData.name, data);

        // Setup Scales
        this.setScales();

        this.drawAggregates();
        this.setBackground();
        this.drawSparkline();
        this.drawAnnotations();

    }

    /**
     * Draws the text labels for the most important numbers
     */
    drawAggregates() {
        const data = this.chartData.data.barData;

        const d = {
            act: data[1],
            py: data[0],
            py_dev: (data[1] - data[0]) / data[0],
            bud: data[2],
            bud_dev: (data[1] - data[2]) / data[2],
            fc: data[3] ?? 0
        };

        // Remove existing bg/text on redraw
        this.svg.selectAll("rect").remove();
        this.svg.selectAll("text").remove();
        
        // Background
        this.svg.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("rx", 3)
            .attr("width", this.baseData.width)
            .attr("height", this.baseData.height)
            .attr("fill", "white");

        // Format any input value for textLabel
        const textFormat = (value:number|string, format = ".2s") => {
            if (typeof(value) === "number") {
                return d3.format(format)(value);
            } else {
                return value;
            }
        };

        // Returns a shade of red for negative and a shade of green for positive numbers
        const textColor = (value:number) => {
            if (value >= 0) {
                return "#055b0a ";
            } else {
                return "#750c0c";
            }
        };

        // Draws an easily configurable text label
        const textLabel = (x:number, y:number, value:number|string, format = ".2s", attrs:any[] = []) => {
            const text = this.svg.append("text")
                .attr("x", x)
                .attr("y", y)
                .text(textFormat(value,format))
                .attr("fill", "grey")
                .attr("font-size", "large")
                .attr("text-anchor", "start");

            attrs.forEach(attr => {
                text.attr(attr[0], attr[1]);
            });
        };

        const halfHeight = this.baseData.height / 2;

        // Title on Top
        textLabel(this.baseData.width / 2, 20, this.chartData.name, undefined, [["fill", "dimgrey"], ["font-size", "x-large"], ["text-anchor", "middle"]]);

        // ACT in center
        textLabel(this.baseData.width / 2, 60, d.act, ".3s", [["fill", "black"], ["font-size", "xx-large"], ["text-anchor", "middle"]]);

        // PY top left; deviation below
        textLabel(10, halfHeight - 20, "PY", undefined, [["font-size", "small"]]);
        textLabel(10, halfHeight , d.py);
        textLabel(10, halfHeight + 20, d.py_dev, "+.1%",[["fill", textColor(d.py_dev)]]);

        // BUD top right; deviation below
        textLabel(this.baseData.width - 10, halfHeight - 20, "BUD", undefined, [["text-anchor", "end"], ["font-size", "small"]]);
        textLabel(this.baseData.width - 10, halfHeight , d.bud, undefined, [["text-anchor", "end"]]);
        textLabel(this.baseData.width - 10, halfHeight + 20, d.bud_dev, "+.1%", [["fill", textColor(d.bud_dev)], ["text-anchor", "end"]]);

    }

    /**
     * Draws the sparkline below the numbers
     */
    drawSparkline() {

        const data = this.chartData.data.sparkData;

        this.svg.selectAll("path").remove();

        // Create line generator
        const line = d3.line()
            .x((d:any, i:any) => this.xScale(i))
            .y((d:any) => this.yScale(d))
            .curve(d3.curveMonotoneX);

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
    }

    /**
     * Draws the sparkline background
     */
    setBackground() {

        const margin = this.baseData.margin;
        const backgrounds= d3.selectAll("#" + this.canvasID + " svg rect.sparkline-bg");
        const backgroundExists = Boolean(backgrounds.size());

        if (backgroundExists) {
            backgrounds
                .attr("width", this.baseData.width - margin.y + 4)
                .attr("height", this.baseData.height - margin.x + 4);

        } else {
            this.svg.append("rect")
                .attr("x", margin.left - 2)
                .attr("y", margin.top - 2)
                .attr("rx", 2)
                .attr("width", this.baseData.width - margin.x + 4)
                .attr("height", this.baseData.height - margin.y + 4)
                .attr("fill", "#b0b0b0")
                .attr("class", "sparkline-bg");
        }
    }

    /**
     * Draws three additional annotations for min, max and current value
     */
    drawAnnotations() {
        const data = this.chartData.data.sparkData;

        const max = {
            x: this.xScale(data.findIndex(d => d === d3.max(data))),
            y: this.yScale(d3.max(data))
        };
        const min = {
            x: this.xScale(data.findIndex(d => d === d3.min(data))),
            y: this.yScale(d3.min(data))
        };
        const current = {
            x: this.xScale(data.length - 1),
            y: this.yScale(data[data.length - 1])
        };

        d3.selectAll("#" + this.canvasID + " svg circle.sparkline-annotation").remove();

        const drawCircle = (coords:any, color:string) => {
            this.svg.append("circle")
                .attr("cx", coords.x)
                .attr("cy", coords.y)
                .attr("r", 3)
                .attr("fill", color)
                .attr("class", "sparkline-annotation");
        };

        // Draw max marker
        drawCircle(max, "green");

        // Draw min marker
        drawCircle(min, "#e10000");

        // Draw current marker
        drawCircle(current, "steelblue");
    }

    /**
     * Configures the scales for the sparkline
     */
    setScales() {
        const data = this.chartData.data.sparkData;
        const margin = this.baseData.margin;
        this.xScale = d3.scaleLinear()
            .domain(d3.extent(data, (d:number, i:number) => i))
            .range([margin.left, this.baseData.width - margin.right]);

        this.yScale = d3.scaleLinear()
            .domain([d3.min(data, (d:number) => d), d3.max(data, (d:number) => d)]).nice()
            .range([this.baseData.height - margin.bottom, margin.top]);
    }

}

export default KPITile;
