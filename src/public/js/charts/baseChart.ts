import * as Helper from "./../components/helperFunctions.js";

/**
 * Abstract base class for all charts
 */
class BaseChart {

    // D3 selection of the base SVG
    svg:any;

    // HTML ID of the wrapping element
    canvasID: string;

    // Object containing base information like sizes and margins
    baseData:any;

    // Object containing chart information like name and data
    chartData:any;

    // Scales
    xScale:any;
    yScale:any;

    /**
     * Initialise a new chart
     * @param canvasID The ID of the HTML element to draw in
     * @param baseData Additional parameters to control the base SVG
     */
    constructor(canvasID: string, baseData = {}) {
        this.canvasID = canvasID;
        this.baseData = baseData;

        // Update margins
        this.setMargins();

        // Create base SVG element
        this.prepareChart();
    }

    /**
     * Creates a D3 SVG element as specified
     */
    prepareChart() {
        this.svg = d3.select("#" + this.canvasID)
            .append("svg")
            .attr("width", this.baseData.width ?? "100%")
            .attr("height", this.baseData.height ?? "100%");

        this.setSizes();
    }

    /**
     * Create default scales using the data
     */
    setScales() {
        this.xScale = d3.scaleLinear()
            .domain(d3.extent(this.chartData.data, (d:number, i:number) => i))
            .range([0, this.baseData.width]);

        this.yScale = d3.scaleLinear()
            .domain([0, d3.max(this.chartData.data, (d:number) => d)]).nice()
            .range([this.baseData.height, 0]);
    }

    /**
     * Stores the chart data with the object
     * @param data JS-Object with data, labels and more
     */
    drawChart(data) {
        // Store KPI id and filters with chart
        if (data.chartData.kpi) {
            $("#" + data.canvasID).data("kpi", data.chartData.kpi);
        }
        if (data.chartData.filter) {
            const filter = data.chartData.filter;
            $("#" + data.canvasID).data("filter", filter);
            if ($("#" + data.canvasID + " .badge-period")[0] !== undefined) {
                $("#" + data.canvasID + " .badge-period")[0].innerText = filter.period;
                $("#" + data.canvasID + " .badge-aggregate")[0].innerText = filter.aggregate.toUpperCase();
                if (filter.scenario !== "AC") {
                    $("#" + data.canvasID + " .badge-scenario")[0].innerText = filter.scenario;
                }
            }
        }

        // Add title if available
        const label = $("#" + data.canvasID + " .chart-label")[0];
        if (label && data.chartData.masterdata) {
            label.innerText = data.chartData.masterdata.name;
        }
    }

    /**
     * Handles display resizes, e.g. orientation changes
     */
    resizeChart() {
        this.setSizes();
        this.drawChart(this.chartData);
    }

    /**
     * Draw axes for the chart
     * @param data Information for all axes
     */
    drawAxes(data = {}) {
        console.log("Drawing Axes with data", data);
        throw "drawAxes() not implemented in base class.";
    }

    /**
     * Set the actual SVG width in pixels
     */
    setSizes() {
        const svg = $("#" + this.canvasID + " svg")[0];
        this.baseData.width = svg.clientWidth;
        this.baseData.height = svg.clientHeight;
    }

    /**
     * Sets new margins by overwriting only given keys; set default if 
     * @param newMargin Object containing keys to update
     */
    setMargins(newMargin = {}) {

        let margin;
        const defaultMargin = {
            top: 5,
            bottom: 5,
            left: 10,
            right: 25
        };

        // Set margins
        if (this.baseData["margin"] === undefined || Helper.emptyObj(newMargin)) {
            margin = defaultMargin;
        } else {
            // Merge objects
            margin = Object.assign(defaultMargin, newMargin);
        }

        this.baseData.margin = margin;

        this.baseData.margin["y"] = margin["top"] + margin["bottom"];
        this.baseData.margin["x"] = margin["left"] + margin["right"];
    }

}

export default BaseChart;