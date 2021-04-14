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

        this.setMargins();

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
     * Draw the actual chart (not implemented in the base class)
     * @param data JS-Object with data, labels and more
     */
    drawChart(data) {
        throw "drawChart() not implemented in base class.";
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
    drawAxes(data) {
        throw "drawAxes() not implemented in base class.";
    }

    /**
     * Set the actual SVG width in pixels
     */
    setSizes() {
        const svg = $('#' + this.canvasID + ' svg')[0];
        this.baseData.width = svg.clientWidth
        this.baseData.height = svg.clientHeight
    }

    /**
     * Sets new margins by overwriting only given keys; set default if 
     * @param newMargin Object containing keys to update
     */
    setMargins(newMargin = {}) {

        console.log("old", this.baseData.margin);

        let margin:Object;
        let defaultMargin = {
            top: 5,
            bottom: 5,
            left: 10,
            right: 25
        }

        // Set margins
        if (this.baseData['margin'] === undefined || newMargin == {}) {
            margin = defaultMargin;
        } else {
            // Merge objects
            margin = Object.assign(defaultMargin, newMargin);
        }

        this.baseData.margin = margin;

        this.baseData.margin['y'] = margin['top'] + margin['bottom'];
        this.baseData.margin['x'] = margin['left'] + margin['right'];

        console.log("new", this.baseData.margin);

    }

}

export default BaseChart;