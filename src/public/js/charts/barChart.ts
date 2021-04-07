import BaseChart from "./baseChart.js";

class BarChart extends BaseChart {

    constructor(canvasID:string, baseData = {}) {
        super(canvasID, baseData);
    }

    drawChart(chartData) {
        let self = this;
        this.chartData = chartData;
        const data = chartData.data;
        console.log("Drawing BarChart with data: ", data);

        this.setScales();

        let barWidth = 0.75 * (this.baseData.width / data.length)
        let barSpace = 0.25 * (this.baseData.width / data.length)

        const bars = this.svg
            .selectAll("rect")
            .data(data);

        bars.join("rect")
            .attr("x", (d:number, i:number) => i * (barSpace + barWidth))
            .attr("y", (d:number) => this.baseData.height - this.yScale(d))
            .attr("width", barWidth)
            .attr("height", (d:number) => this.yScale(d))
            .attr("data-value", (d:number) => d)
            .attr("fill", "green")
            .on("touchstart", function(e:Event, i:number) {
                self.toggleLabel(e.target);
            });

        // bars.exit().remove();
    }

    /**
     * Configure scales
     */
    setScales() {
        this.xScale = d3.scaleLinear()
            .domain(d3.extent(this.chartData.data, (d:number, i:number) => i))
            .range([0, this.baseData.width]);

        this.yScale = d3.scaleLinear()
            .domain([0, d3.max(this.chartData.data, (d:number) => d)]).nice()
            .range([0, this.baseData.height]);
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
        d3.selectAll('text.numeric_label').remove();
        d3.selectAll('rect.numeric_label').remove();

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
            .attr("class", "numeric_label")
            .attr("fill", "#40bf91");
        this.svg.append('text')
            .attr("x", x - (width - barWidth) / 2 + width / 2)
            .attr("y", y - height / 2)
            .attr("class", "numeric_label")
            .text(val)
            .attr("fill", "DimGrey");
    }

}

export default BarChart;
