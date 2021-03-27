class BaseChart {

    svg;

    prepareChart() {
        this.svg = d3.select('#chartCanvas')
            .append("svg")
            .attr("width", null ?? "100%")
            .attr("height", null ?? "100%")
            .style("margin-left", 10);
    }

    drawChart() {
        throw "Draw Chart not implemented.";
    }

    render() {
        console.log("Render");
        return null;
      }

}

export default BaseChart;
