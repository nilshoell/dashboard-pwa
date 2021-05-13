import BaseChart from "./baseChart.js";

/**
 * A special visualization for displaying KPI deviations
 */
class KPIBar extends BaseChart {

    barHeight:number;

    constructor(canvasID:string, baseData = {}) {
        super(canvasID, baseData);
        // Set default margins
        this.setMargins({bottom: 25, top: 5, right:100});
    }

    /**
     * Draws the bars
     * @param chartData The data to draw, with {data: [py,act,bud,fc]}
     */
    drawChart(chartData) {
        // Base setup
        this.chartData = chartData;
        BaseChart.prototype.drawChart(this);

        // Don't draw on invisible SVGs
        if (this.baseData.width === 0) {
            return;
        }

        const data = chartData.data;
        const margin = this.baseData.margin;

        this.setScales();

        this.barHeight = 0.5 * (this.baseData.height - margin.y);

        const bars = this.svg
            .selectAll("rect")
            .data(data);

        bars.remove();

        const drawBar = (x:number, y:number, val:number, attrs:any) => {

            // Check if negative bar might be drawn
            let barWidth = Number(this.xScale(val));
            if (barWidth <= 0) {
                barWidth = 0;
            }
            
            const bar = this.svg.append("rect")
                .attr("x", x)
                .attr("y", y)
                .attr("width", barWidth)
                .attr("height", this.barHeight)
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .attr("data-value", val);

                attrs.forEach(attr => {
                    bar.attr(attr[0], attr[1]);
                });
        };

        // Previous year (PY)
        drawBar(margin.left, 0, data[0], [["fill", "grey"], ["stroke", "grey"]]);

        // Budget/Target (BUD)
        drawBar(margin.left + .5, this.barHeight, data[2], [["fill", "none"], ["stroke-width", 2]]);

        // Current value (ACT)
        drawBar(margin.left, this.barHeight/2, data[1], [["fill", "black"]]);

        // Forecast if Available
        if (!isNaN(data[3]) && data[3] > data[1]) {
            let barWidth = Number(this.xScale(data[3]) - this.xScale(data[1]));
            if (barWidth <= 0) {
                barWidth = 0;
            }
            console.log(barWidth);
            drawBar(
                this.xScale(data[1]) + margin.left,
                this.barHeight/2, data[3],
                [
                    ["fill", "url(#diagonal-stripe-1) none"],
                    ["width", barWidth]
                ]
            );
        }

        this.drawLabels();
        this.drawAxes();
    }

    /**
     * Draws text labels for the three main bars
     */
    drawLabels() {
        const data = this.chartData.data;
        const margin = this.baseData.margin;

        const py = data[0];
        const act = data[1];
        const bud = data[2];

        const labelData = [];
        labelData[0] = (act - py) / py;
        labelData[1] = act;
        labelData[2] = (act - bud) / bud;

        // Remove any existing labels (e.g. after resize)
        // $('.numeric-label').each((index, label) => label.remove());
        d3.selectAll("#" + this.canvasID + " svg text.numeric-label").remove();

        // Returns a shade of red for negative and a shade of green for positive numbers
        const textColor = (value:number) => {
            let color = "#055b0a ";
            let invertColors = false;
            if (this.chartData.masterdata.direction === "-") {
                invertColors = true;
            }
            if ((value < 0 && !invertColors) || (value >= 0 && invertColors)) {
                color = "#750c0c ";
            }
            return color;
        };

        // Wrapper to draw labels
        const textLabel = (x:number, y:number, val:number, color = "black", format = ".2s", attrs=[]) => {
            const text = this.svg.append("text")
                .attr("x", x)
                .attr("y", y)
                .text(d3.format(format)(val))
                .attr("class", "numeric-label")
                .attr("fill", color)
                .style("text-anchor", "end");

            attrs.forEach(attr => {
                text.attr(attr[0], attr[1]);
            });
        };

        const unit = this.chartData.masterdata.unit;
        let format = ".2s";
        if (unit === "%") {
            format = ".1%";
        }

        // PY deviation in %
        textLabel(this.baseData.width * 0.9, margin.top + 5, labelData[0], textColor(labelData[0]), "+.1%", [["font-size", "small"]]);
        // Actual value
        textLabel(this.baseData.width * 0.99, this.barHeight + margin.top, labelData[1], "black", format);
        // BUD deviation in %
        textLabel(this.baseData.width * 0.9, this.baseData.height - margin.y, labelData[2], textColor(labelData[2]), "+.1%", [["font-size", "small"]]);

    }

    /**
     * Configure scales
     */
    setScales() {
        const margin = this.baseData.margin;

        this.xScale = d3.scaleLinear()
            .domain([0, d3.max(this.chartData.data, (d:number) => d)]).nice()
            .range([0, this.baseData.width - margin.x]);

        this.yScale = d3.scaleLinear()
            .domain([0, 3])
            .range([0, this.baseData.height - margin.y]);
    }

    /**
     * Draws a simple x-axis
     */
    drawAxes() {
        const margin = this.baseData.margin;
        const unit = this.chartData.masterdata.unit;
        let format = "~s";
        if (unit === "%") {
            format = "%";
        }
        const xAxis = g => g
            .attr("transform", "translate(" + margin.left + "," + (this.baseData.height - margin.bottom - 3) + ")")
            .call(d3.axisBottom(this.xScale).ticks(2, format))
            .call(g => g.select(".domain").remove());


        d3.selectAll("#" + this.canvasID + " svg g.x-axis").remove();
        this.svg.append("g").call(xAxis).attr("class", "x-axis");
    }


}

export default KPIBar;
