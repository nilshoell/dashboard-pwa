class BaseChart {

    svg;
    canvasID: string;
    baseData;

    /**
     * Initialise a new chart
     * @param canvasID The ID of the HTML element to draw in
     * @param baseData Additional parameters to control the base SVG
     */
    constructor(canvasID: string, baseData = {}) {
        this.canvasID = canvasID;
        this.baseData = baseData;
        this.prepareChart();
    }

    /**
     * Creates a D3 SVG element as specified
     */
    prepareChart() {
        console.log("Preparing chart canvas on #" + this.canvasID);
        this.svg = d3.select('#' + this.canvasID)
            .append("svg")
            .attr("width", this.baseData.width ?? "100%")
            .attr("height", this.baseData.height ?? "100%")
            .style("margin-left", 10);
    }

    /**
     * Draw the actual chart (not implemented in the base class)
     * @param data JS-Object with data, labels and more
     */
    drawChart(data) {
        throw "drawChart() not implemented in base class.";
    }

    /**
     * Draw axes for the chart
     * @param data Information for all axes
     */
    drawAxes(data) {
        throw "drawAxes() not implemented in base class.";
    }

}

export default BaseChart;