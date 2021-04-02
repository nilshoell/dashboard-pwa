import BaseChart from "./baseChart.js";

class BarChart extends BaseChart {

    svg;

    constructor(canvasID:string, baseData = {}) {
        super(canvasID, baseData);
    }

    drawChart(chartData) {
        console.log("Drawing BarChart with data: ");
        console.log(chartData.data);

        let self = this;

        let data = chartData.data;

        const width = 300;
        console.log("Width: " + width);

        let barWidth = 0.75 * (width / data.length)
        let barSpace = 0.25 * (width / data.length)

        this.svg = d3.select('#' + this.canvasID + ' svg');

        const bars = this.svg
            .selectAll("rect")
            .data(data);

        bars.join("rect")
            .attr("x", (d, i) => i * (barSpace + barWidth))
            .attr("y", (d:number, i) => 300 - 10 * d)
            .attr("width", barWidth)
            .attr("height", (d:number, i) => d * 10)
            .attr("data-value", (d:number) => d)
            .attr("data-label", "false")
            .attr("fill", "green")
            .on("touchstart", function(e, i:number) {
                self.toggleLabel(e.target);
            });

        // bars.exit().remove();
    }

    toggleLabel(target) {

        const attributes = target.attributes

        const parent = target.parentElement

        const val = +attributes['data-value'].value;
        const x = +attributes['x'].value;
        const y = +attributes['y'].value;
        const barWidth = +attributes['width'].value;
        const barHeight = +attributes['height'].value;

        const labelExists = attributes['data-label'].value;

        if (labelExists == "true") {
            d3.selectAll('text.numeric_label').remove();
            d3.selectAll('rect.numeric_label').remove();
            d3.select(target).attr("data-label", "false");
            return;
        }

        d3.select(target).attr("data-label", "true");

        const height = 20;
        let width = 45;

        if (barWidth > width) {
            width = barWidth;
        }

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
