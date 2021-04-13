class BaseChart {

    svg;
    canvasID: string;
    baseData;
    chartData;

    xScale;
    yScale;

    /**
     * Initialise a new chart
     * @param canvasID The ID of the HTML element to draw in
     * @param baseData Additional parameters to control the base SVG
     */
    constructor(canvasID: string, baseData = {}) {
        this.canvasID = canvasID;
        this.baseData = baseData;

        // Set margins
        if (baseData['margin'] === undefined) {
            this.baseData.margin = {
                top: 5,
                bottom: 5,
                left: 10,
                right: 25
            }
        }

        this.baseData.margin['y'] = this.baseData.margin.top + this.baseData.margin.bottom
        this.baseData.margin['x'] = this.baseData.margin.left + this.baseData.margin.right

        // Create base SVG element
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
            .attr("height", this.baseData.height ?? "100%");

        // Read the actual width in pixels
        const svg = $('#' + this.canvasID + ' svg')[0];
        this.baseData.width = svg.clientWidth
        this.baseData.height = svg.clientHeight
        console.log(this.baseData);
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