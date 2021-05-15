import BaseChart from "./baseChart.js";

/**
 * A simple, standard bar chart
 */
class BarChart extends BaseChart {

    barWidth;
    barSpace;

    constructor(canvasID:string, baseData = {}) {
        super(canvasID, baseData);
        this.setMargins({left: 35, bottom: 35, right:5});
    }

    /**
     * Draws the bar chart and axes
     * @param chartData The data to draw
     */
    drawChart(chartData):void {
        const self = this;

        // Base setup
        this.chartData = chartData;
        console.log(chartData);
        
        BaseChart.prototype.drawChart(this);

        const data = chartData.data;
        const margin = this.baseData.margin;

        this.barWidth = d3.min([0.75 * (this.baseData.width - margin.x) / data.length, 30]);
        this.barSpace = 0.25 * this.barWidth;

        this.setScales();

        const bars = this.svg
            .selectAll("rect")
            .data(data);

        bars.join("rect")
            .attr("x", (d:any) => this.xScale(d.date))
            .attr("y", (d:any) => this.yScale(d.val))
            .attr("width", this.xScale.bandwidth())
            .attr("height", (d:any) => this.yScale(0) - this.yScale(d.val))
            .attr("data-value", (d:number) => d)
            .attr("fill", "dimgrey")
            .on("touchstart", function(e:Event) {
                self.toggleLabel(e.target);
            });

        // bars.exit().remove();
        this.drawAxes();
    }

    /**
     * Configure scales
     */
    setScales():void {
        const margin = this.baseData.margin;
        const height = this.baseData.height;

        const data:any[] = this.chartData.data;

        // .domain(d3.range(data.length).map(d => String(d)))
        const domain = data.map(d => d.date);
        this.xScale = d3.scaleBand()
            .domain(domain)
            .range([margin.left, this.baseData.width - margin.x])
            .paddingInner(0.1);

        this.yScale = d3.scaleLinear()
            .domain([0, d3.max(this.chartData.data, (d:any) => Number(d.val))]).nice()
            .range([height - margin.bottom, margin.top]);
    }

    /**
     * Draw axes (only y-axis now)
     */
    drawAxes():void {
        const margin = this.baseData.margin;
        const yAxis = g => g
            .attr("transform", "translate(" + (margin.left - 2) + ",0)")
            .call(d3.axisLeft(this.yScale).ticks(4, "~s"))
            .call(g => g.select(".domain").remove());
        
        const xAxis = g => g
            .attr("transform", "translate(0," + (this.baseData.height - margin.bottom) + ")")
            .call(d3.axisBottom(this.xScale).tickValues(this.xScale.domain().filter((d:number,i:number) => !(i%4))))
            .call(g => g.select(".domain").remove());

        d3.selectAll("#" + this.canvasID + " svg g.y-axis").remove();
        d3.selectAll("#" + this.canvasID + " svg g.x-axis").remove();
        this.svg.append("g").call(yAxis).attr("class", "y-axis");
        this.svg.append("g").call(xAxis).attr("class", "x-axis");
    }

    /**
     * Draws a label with the value of the target on top of it
     * @param target The SVG rect element (bar) to render the label for
     */
    toggleLabel(target:EventTarget):void {

        // Set constants
        const attributes = target["attributes"];
        const val = +attributes["data-value"].value;
        const x = +attributes["x"].value;
        const y = +attributes["y"].value;
        const barWidth = +attributes["width"].value;

        // Remove all present labels
        d3.selectAll("text.numeric-label").remove();
        d3.selectAll("rect.numeric-label").remove();

        // Configure label size
        const height = 20;
        let width = 45;
        if (barWidth > width) {
            width = barWidth;
        }

        // Append label & text
        this.svg.append("rect")
            .attr("x", x - (width - barWidth) / 2)
            .attr("y", y - 25)
            .attr("width", width)
            .attr("height", height)
            .attr("rx", 3)
            .attr("class", "numeric-label")
            .attr("fill", "#40bf91");
        this.svg.append("text")
            .attr("x", x - (width - barWidth) / 2 + width / 2)
            .attr("y", y - height / 2)
            .attr("class", "numeric-label")
            .text(val)
            .attr("fill", "DimGrey");
    }

}

export default BarChart;
