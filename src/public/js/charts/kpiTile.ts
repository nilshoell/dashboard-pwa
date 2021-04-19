import BaseChart from "./baseChart.js";
import Sparkline from "./sparkline.js"

class KPITile extends BaseChart {

    svg;
    barHeight;

    constructor(canvasID:string, baseData = {}) {
        super(canvasID, baseData);
        // Set default margins
        this.setMargins({bottom: 0, top: 0, right:0, left:0});
    }

    drawChart(chartData) {
        let self = this;
        this.chartData = chartData;
        const data = chartData.data;
        const margin = this.baseData.margin;
        console.log("Drawing KPITile with data: ", data);

        this.drawAggregates();
        this.drawSparkline();

    }

    drawAggregates() {
        const data = this.chartData.data.barData
        // ACT in center
        // PY top left; deviation below
        // BUD top right; deviation below
        this.svg.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", this.baseData.width)
            .attr("height", this.baseData.height)
            .attr("fill", "white");
    }

    drawSparkline() {
        const data = this.chartData.data.sparkData
        // Sparkline at bottom
        // this.setScales();
    }


}

export default KPITile;
