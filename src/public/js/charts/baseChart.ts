class BaseChart {

    svg;

    constructor() {
        this.prepareChart();
    }
    
    prepareChart() {
        console.log("Preparing Chart Canvas");
        this.svg = d3.select('#chartCanvas')
            .append("svg")
            .attr("width", null ?? "100%")
            .attr("height", null ?? "100%")
            .style("margin-left", 10);
    }

    drawChart(data) {
        throw "Draw Chart not implemented.";
    }

}

export default BaseChart;
