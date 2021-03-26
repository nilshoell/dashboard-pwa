import * as d3 from "d3";

class BaseChart {

    svg;

    prepareChart() {
        this.svg = d3.select('#chartCanvas')
            .append("svg")
            .attr("width", this.props.width ?? "100%")
            .attr("height", this.props.height ?? "100%")
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
