import BaseChart from "./baseChart.js";

class BarChart extends BaseChart {

    barWidth;
    barSpace;

    constructor(canvasID:string, baseData = {}) {
        super(canvasID, baseData);
        this.setMargins({left: 30, right:5});
    }

    drawChart(chartData) {
        let self = this;
        this.chartData = chartData;
        const data = chartData.data;
        console.log("Drawing BarChart with data: ", data);

        const margin = this.baseData.margin;

        this.barWidth = 0.75 * (this.baseData.width - margin.x) / data.length;
        this.barSpace = 0.25 * (this.baseData.width - margin.x) / data.length;

        this.setScales();

        console.log(this.xScale);
        
        const bars = this.svg
            .selectAll("rect")
            .data(data);

        bars.join("rect")
            .attr("x", (d:number, i:number) => this.xScale(i))
            .attr("y", (d:number) => this.yScale(d))
            .attr("width", this.xScale.bandwidth())
            .attr("height", (d:number) => this.yScale(0) - this.yScale(d))
            .attr("data-value", (d:number) => d)
            .attr("fill", "green")
            .on("touchstart", function(e:Event) {
                self.toggleLabel(e.target);
            });

        // bars.exit().remove();
        this.drawAxes();
    }

    /**
     * Configure scales
     */
    setScales() {
        const margin = this.baseData.margin;
        const width = this.baseData.width;
        const height = this.baseData.height;
        const data = this.chartData.data;

        // this.xScale = d3.scaleBand()
        //     .domain(d3.range(data.length).map((x) => String(x)))
        //     .range([margin.left, width - margin.x]);

        this.xScale = (i) => {return (i * (this.barWidth + this.barSpace)) + margin.left};
        this.xScale.bandwidth = () => {return this.barWidth}

        this.yScale = d3.scaleLinear()
            .domain([0, d3.max(this.chartData.data, (d:number) => d)]).nice()
            .range([height - margin.bottom, margin.top]);
    }

    /**
     * Draw axes (only y-axis now)
     */
    drawAxes() {
        const margin = this.baseData.margin;
        const yAxis = g => g
            .attr("transform", "translate(" + (margin.left - 2) + ",0)")
            .call(d3.axisLeft(this.yScale).ticks(4, "~s"))
            .call(g => g.select(".domain").remove());

        d3.selectAll("#" + this.canvasID + " svg g.y-axis").remove();
        this.svg.append("g").call(yAxis).attr("class", "y-axis");
    }

    /**
     * Draws a label with the value of the target on top of it
     * @param target The SVG rect element (bar) to render the label for
     */
    toggleLabel(target) {

        // Set constants
        const attributes = target.attributes
        const val = +attributes['data-value'].value;
        const x = +attributes['x'].value;
        const y = +attributes['y'].value;
        const barWidth = +attributes['width'].value;

        // Remove all present labels
        d3.selectAll('text.numeric-label').remove();
        d3.selectAll('rect.numeric-label').remove();

        // Configure label size
        const height = 20;
        let width = 45;
        if (barWidth > width) {
            width = barWidth;
        }

        // Append label & text
        this.svg.append('rect')
            .attr("x", x - (width - barWidth) / 2)
            .attr("y", y - 25)
            .attr("width", width)
            .attr("height", height)
            .attr("rx", 3)
            .attr("class", "numeric-label")
            .attr("fill", "#40bf91");
        this.svg.append('text')
            .attr("x", x - (width - barWidth) / 2 + width / 2)
            .attr("y", y - height / 2)
            .attr("class", "numeric-label")
            .text(val)
            .attr("fill", "DimGrey");
    }

}

export default BarChart;
