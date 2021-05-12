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

        // Store KPI id with chart
        if (this.chartData.kpi) {
            $("#" + this.canvasID).data("kpi", this.chartData.kpi);
        }

        // Add title if available
        const label = $("#" + this.canvasID + " .chart-label")[0];
        if (label) {
            label.innerText = this.chartData.masterdata.name ?? "";
        }

        // Add background bounding box
        this.setBackground();

        // Convert dates to negative day diffs
        if (!this.chartData.datesConverted) {
            this.convertDates();
            this.chartData.datesConverted = true;
        }

        const data = this.chartData.data;
        const ac_data = d3.filter(data, (d:any) => d.date <= 0);
        const fc_data = d3.filter(data, (d:any) => d.date >= 0);
        this.chartData.ac_data = ac_data;
        this.chartData.fc_data = fc_data;

        // Create scales
        this.setScales();

        // Create line generator
        const line = d3.line()
            .x((d:any) => this.xScale(d.date))
            .y((d:any) => this.yScale(d.val))
            .curve(d3.curveMonotoneX);

        const fc_line = d3.line()
            .x((d:any) => this.xScale(d.date))
            .y((d:any) => this.yScale(d.val));
        
        // Setup path object
        d3.selectAll("#" + this.canvasID + " svg g.path-group").remove();
        const g = this.svg.append("g").attr("class", "path-group");
        const path = g.selectAll("path").data(data);

        path.exit().remove();

        // Update data
        path.join("path")
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("d", line(ac_data));

        path.join("path")
            .attr("fill", "none")
            .attr("stroke", "grey")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", [5, 5])
            .attr("d", fc_line(fc_data));

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
        let maxDate = Number(d3.max(data, (d:any) => d.date));
        const minVal = Number(d3.min(data, (d:any) => d.val));
        const maxVal = Number(d3.max(data, (d:any) => d.val));
        
        // Check how far into the future values are displayed
        if (maxDate > minDate * -0.25) {
            console.log(minDate, 0, minDate * -0.25, maxDate);
            maxDate = minDate * -0.25;
        }

        this.xScale = d3.scaleLinear()
            .domain([minDate, maxDate])
            .range([margin.left, width - margin.right])
            .clamp(true);

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
            .call(d3.axisRight(this.yScale).ticks(2, format))
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
        const data = this.chartData.ac_data;
        const data_total = this.chartData.data;
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
        const forecast = {
            x: this.xScale(data_total[data_total.length - 1].date),
            y: this.yScale(data_total[data_total.length - 1].val)
        };

        d3.selectAll("#" + this.canvasID + " svg g.annotation-group").remove();

        const g = this.svg.append("g").attr("class", "annotation-group");

        const drawCircle = (coords:any, color:string) => {
            g.append("circle")
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

        // Draw forecast if applicable
        if (forecast.x > current.x) {
            drawCircle(forecast, "grey");
        }

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
        let bgWidth = this.baseData.width - margin.x + 4;
        let bgHeight = this.baseData.height - margin.y + 4;

        // No negative width/height
        if (bgWidth <= 0 || bgHeight <= 0) {
            bgWidth = 0;
            bgHeight = 0;
        }

        if (backgroundExists) {
            backgrounds
                .attr("width", bgWidth)
                .attr("height", bgHeight);

        } else {
            this.svg.append("rect")
                .attr("x", margin.left - 2)
                .attr("y", margin.top - 2)
                .attr("rx", 2)
                .attr("width", bgWidth)
                .attr("height", bgHeight)
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
        const today = new Date(now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2,"0") + "-" + String(now.getDate()).padStart(2,"0"));
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
