import BaseChart from "./baseChart.js";

/**
 * A Heatmap-like Representation of multiple Weeks of Data
 */
class BrickWall extends BaseChart {

    squareWidth;
    sqColor;

    constructor(canvasID:string, baseData = {}) {
        super(canvasID, baseData);
        this.setMargins({left: 35, right:5, top: 15, bottom: 45});

    }

    /**
     * Draws the brick wall chart and axes
     * @param chartData The data to draw
     */
    drawChart(chartData):void {
        // Base setup
        this.chartData = chartData;
        BaseChart.prototype.drawChart(this);
        
        const data = chartData.data;
        const margin = this.baseData.margin;

        this.setScales();
        const minVal = Number(d3.min(data, (d:any) => d3.min(d.val)));
        const maxVal = Number(d3.max(data, (d:any) => d3.max(d.val)));

        // Set up colors
        let interpolator;
        if (this.chartData.masterdata.direction === undefined || this.chartData.masterdata.direction === "-") {
            interpolator = d3.interpolateReds;
        } else {
            interpolator = d3.interpolateGreens;
        }

        this.sqColor = d3.scaleSequential()
            .domain([minVal,maxVal])
            .interpolator(interpolator);

        const g = this.svg.selectAll("g")
            .data(data)
            .enter()
            .append("g")
            .attr("transform",(d:any, i:number) => {
                const xTransform = (i:number) => Number(margin.left) + (i * 14);
                return "translate(" + xTransform(i) + "," + margin.top + ")";
            });

        g.selectAll("rect")
            .data((d:any) => d.val)
            .enter().append("rect")
                .attr("width", 12)
                .attr("height", 12)
                .attr("x", 0)
                .attr("y", (d:number, i:number) => margin.top + i * 14)
                .attr("rx", 2)
                .attr("fill", (d:number) => this.sqColor(d));

        this.drawAxes();
        this.drawLegend();
    }


    /**
     * Overrides the default scales
     */
     setScales() {
        const margin = this.baseData.margin;
        const data = this.chartData.data;
        const width = data.length * 14 + margin.left;

        this.xScale = d3.scaleBand()
            .domain(data.map((d:any) => d.week))
            .range([margin.left, width]);

    }


    /**
     * Draw axes
     */
    drawAxes():void {
        const margin = this.baseData.margin;

        const textLabel = (y:number, val:string, color = "dimgrey", attrs=[]) => {
            const text = this.svg.append("text")
                .attr("x", 0)
                .attr("y", margin.top + y * 14 + 2)
                .text(val)
                .attr("class", "text-label")
                .attr("fill", color)
                .style("text-anchor", "start")
                .style("font-size", "small");

            attrs.forEach(attr => {
                text.attr(attr[0], attr[1]);
            });
        };

        // y-Axis (Weekday labels)
        d3.selectAll("#" + this.canvasID + " svg text.text-label").remove();
        textLabel(2, "Mon");
        textLabel(4, "Wed");
        textLabel(6, "Fri");

        // Setup ordinal xAxis for calendar weeks
        const xAxis = g => g
            .attr("transform", "translate(0," + (10 + margin.top) + ")")
            .call(d3.axisTop(this.xScale).tickValues(this.xScale.domain().filter((d:number,i:number) => !(i%3))))
            .call(g => g.select(".domain").remove())
            .call(g => g.select(".tick:first-of-type text").clone()
                .attr("x", -25)
                .attr("text-anchor", "start")
                .text("CW"));

        d3.selectAll("#" + this.canvasID + " svg g.x-axis").remove();
        this.svg.append("g")
            .call(xAxis)
            .attr("class", "x-axis");
    }

    /**
     * Draws 4 reference points below
     */
    drawLegend() {
        const margin = this.baseData.margin;
        const data = this.chartData.data;
        const minVal = Number(d3.min(data, (d:any) => d3.min(d.val)));
        const maxVal = Number(d3.max(data, (d:any) => d3.max(d.val)));
        const range = maxVal - minVal;

        const legend = (x:number, val:number) => {
            const g = this.svg.append("g");

            g.append("text")
                .attr("x", margin.left + x)
                .attr("y", this.baseData.height - margin.bottom - 2)
                .text(val)
                .attr("class", "text-label")
                .style("text-anchor", "start")
                .style("font-size", "small");

            g.append("rect")
                .attr("width", 12)
                .attr("height", 12)
                .attr("x", margin.left + x)
                .attr("y", this.baseData.height - margin.bottom)
                .attr("rx", 2)
                .attr("fill", this.sqColor(val));

        };

        legend(0,Math.floor(minVal));
        legend(20,Math.floor(minVal + range * 0.25));
        legend(40,Math.floor(minVal + range * 0.75));
        legend(60,Math.floor(maxVal));

    }

}

export default BrickWall;
