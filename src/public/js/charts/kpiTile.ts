import BaseChart from "./baseChart.js";
import Sparkline from "./sparkline.js"

class KPITile extends BaseChart {

    svg;
    barHeight;

    constructor(canvasID:string, baseData = {}) {
        super(canvasID, baseData);
        // Set default margins
        this.setMargins({bottom: 10, top: (this.baseData.height / 2) + 40, right: 10, left: 10});
    }

    drawChart(chartData) {
        let self = this;
        this.chartData = chartData;
        const data = chartData.data;
        const margin = this.baseData.margin;
        console.log("Drawing KPITile with data: ", chartData.name, data);

        // Setup Scales
        this.setScales();

        this.drawAggregates();
        this.setBackground();
        this.drawSparkline();
        this.drawAnnotations();

    }

    drawAggregates() {
        const data = this.chartData.data.barData

        const d = {
            act: data[1],
            py: data[0],
            py_dev: (data[1] - data[0]) / data[0],
            bud: data[2],
            bud_dev: (data[1] - data[2]) / data[2],
            fc: data[3] ?? 0
        }

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

        const textFormat = (value:number|string, format:string = ".2s") => {
            if (typeof(value) == "number") {
                return d3.format(format)(value);
            } else {
                return value;
            }
        }

        const textSmall = (x:number, y:number, value:number, format:string=".2s", anchor:string="start") => {
            this.svg.append("text")
                .attr("x", x)
                .attr("y", y)
                .text(textFormat(value,format))
                .attr("fill", "grey")
                .style("font-size", "large")
                .style("text-anchor", anchor);
        }

        const textLarge = (x:number, y:number, value:number|string, format:string=".3s") => {
            this.svg.append("text")
                .attr("x", x)
                .attr("y", y)
                .text(textFormat(value,format))
                .attr("fill", "black")
                .style("font-size", "xx-large")
                .style("text-anchor", "middle");
        }

        const textTitle = (x:number, y:number, value:string) => {
            this.svg.append("text")
                .attr("x", x)
                .attr("y", y)
                .text(value)
                .attr("fill", "dimgrey")
                .style("font-size", "x-large")
                .style("text-anchor", "middle");
        }

        // Title on Top
        textTitle(this.baseData.width / 2, 20,this.chartData.name);

        // PY top left; deviation below
        textSmall(10,45,d.py);
        textSmall(10,65,d.py_dev,"+.1%");

        // BUD top right; deviation below
        textSmall(this.baseData.width - 10,45,d.bud,".2s","end");
        textSmall(this.baseData.width - 10,65,d.bud_dev,"+.1%","end");

        // ACT in center
        textLarge(this.baseData.width / 2, (this.baseData.height / 2) + 5, d.act);
    }

    drawSparkline() {

        const data = this.chartData.data.sparkData

        this.svg.selectAll("path").remove();

        // Create line generator
        let line = d3.line()
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

    setBackground() {

        const margin = this.baseData.margin;
        const backgrounds= d3.selectAll("#" + this.canvasID + " svg rect.sparkline-bg")
        const backgroundExists = Boolean(backgrounds.size());

        if (backgroundExists) {
            backgrounds
                .attr("width", this.baseData.width - margin.y + 4)
                .attr("height", this.baseData.height - margin.x + 4)

        } else {
            this.svg.append("rect")
                .attr("x", margin.left - 2)
                .attr("y", margin.top - 2)
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
            x: this.xScale(data.findIndex(d => d == d3.max(data))),
            y: this.yScale(d3.max(data))
        };
        const min = {
            x: this.xScale(data.findIndex(d => d == d3.min(data))),
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
        }

        // Draw max marker
        drawCircle(max, "green");

        // Draw min marker
        drawCircle(min, "#e10000");

        // Draw current marker
        drawCircle(current, "steelblue");
    }

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
