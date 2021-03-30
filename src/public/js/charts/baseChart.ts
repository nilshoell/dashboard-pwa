class BaseChart {

    svg;
    canvasID:string;

    constructor(canvasID:string) {
        this.canvasID = canvasID;
        this.prepareChart();
    }
    
    prepareChart() {
        console.log("Preparing Chart Canvas on #" + this.canvasID);
        this.svg = d3.select('#' + this.canvasID)
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
