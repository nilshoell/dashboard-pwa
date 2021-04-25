import BaseChart from "./baseChart.js";

/**
 * A simple, small line graph with minimal labels
 */
class Sparkline extends BaseChart {

    constructor(canvasID:string, baseData = {}) {
        super(canvasID, baseData);
        const margin = {
            top: 5,
            bottom: 15,
            left: 5,
            right: 25
        };
        this.setMargins(margin);
    }

    /**
     * Draws the sparkline and everything else
     * @param chartData Object containing data to draw
     */
    drawChart(chartData) {

        this.chartData = chartData;
        console.log("Drawing Sparkline with data: ", chartData.data);

        // Convert dates to negative day diffs
        if (!this.chartData.datesConverted) {
            this.convertDates();
            this.chartData.datesConverted = true;
        }

        const data = this.chartData.data;

        // Create scales
        this.setScales();

        // Add background bounding box
        this.setBackground();

        // Create line generator
        const line = d3.line()
            .x((d:any) => this.xScale(d.date))
            .y((d:any) => this.yScale(d.val))
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
        const data = this.chartData.data.map(d => {return {date: Number(d.date), val: d.val};});
        const minDate = Number(d3.min(data, (d:any) => d.date));
        const maxDate = Number(d3.max(data, (d:any) => d.date));
        const minVal = Number(d3.min(data, (d:any) => d.val));
        const maxVal = Number(d3.max(data, (d:any) => d.val));

        this.xScale = d3.scaleLinear()
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
        const xAxis = g => g
            .attr("transform", "translate(0," + (this.baseData.height - margin.bottom - 3) + ")")
            .call(d3.axisBottom(this.xScale).ticks(2, ".1"))
            .call(g => g.select(".domain").remove())
            .call(g => g.select(".tick:first-of-type text").clone()
                .attr("x", 7)
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text(this.chartData.suffix));

        const yAxis = g => g
            .attr("transform", "translate(" + (this.baseData.width - margin.right - 5) + ", 0)")
            .call(d3.axisRight(this.yScale).ticks(2, "~s"))
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
        const maxVal = d3.max(data, (d:any) => d.val);
        const minVal = d3.min(data, (d:any) => d.val);

        const max = {
            x: this.xScale(data[data.findIndex(d => d.val == maxVal)].date),
            y: this.yScale(maxVal)
        };
        const min = {
            x: this.xScale(data[data.findIndex(d => d.val == minVal)].date),
            y: this.yScale(minVal)
        };
        const current = {
            x: this.xScale(0),
            y: this.yScale(data[data.length - 1].val)
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
     * Draw or resize the bounding box
     * @param draw Boolean: Whether to draw the background; defaults to yes
     */
    setBackground(draw = true) {

        if (!draw) {
            return;
        }

        const margin = this.baseData.margin;
        const backgrounds= d3.selectAll("#" + this.canvasID + " svg rect.sparkline-bg");
        const backgroundExists = Boolean(backgrounds.size());

        if (backgroundExists) {
            backgrounds
                .attr("width", this.baseData.width - margin.x + 4)
                .attr("height", this.baseData.height - margin.y + 4);

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
     * Converts ISO-Dates into number of days from today
     * i.e. "2021-06-01" becomes "-10" on "2021-06-10"
     * Additionally, a new timescale is set based on the number of days (30D -> 1M; 365D -> 1Y)
     * @return Changes this.chartData.data with new numerical time scale and sets this.chartData.suffix
     */
    convertDates() {
        const data = this.chartData.data;
        const now = new Date();
        const today = new Date(now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate());
        const secondsInDay = 86400000;
        
        // Calculate day differences
        const dayDiffArr = data.map((d:any) => {
            const date = new Date(d.date);
            const dayDiff = (today.getTime() - date.getTime()) / secondsInDay;
            return {date: dayDiff, val: d.val};
        });

        // Convert from days to weeks, months or years
        const maxDays = Number(d3.max(dayDiffArr, (d) => d["date"]));
        let divisor = 365;
        let suffix = "Y";

        switch (true) {
            case maxDays < 14:
                divisor = 1;
                suffix = "D";
                break;
        
            case maxDays < 30:
                divisor = 7;
                suffix = "W";
                break;

            case maxDays < 365:
                divisor = 30;
                suffix = "M";
                break;
        }

        // Set suffix and new time scale
        this.chartData["suffix"] = suffix;
        this.chartData["data"] = dayDiffArr.map(d => {return {date: d["date"]/divisor * -1, val: d["val"]};});
    }

}

export default Sparkline;
