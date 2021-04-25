import BarChart from "../charts/barChart.js";
import ColumnChart from "../charts/columnChart.js";

$(function () {
    new CustomerDashboard();
});

class CustomerDashboard {

    charts = [];

    constructor() {
        const barChart = new BarChart("barChart1");
        const barChartData = {data: [12, 5, 6, 6, 9, 10, 12, 15, 17, 23]};
        barChart.drawChart(barChartData);

        const columnChart = new ColumnChart("columnChart1");
        const columnChartData = {data: [1234567,1567890,5678901,3456789,8901234,10123456,9500000,8300000,7400000,6700000,3254700]};
        columnChart.drawChart(columnChartData);

        this.charts.push(barChart);
        this.charts.push(columnChart);
        this.configureEventListener();
    }

    configureEventListener() {
        const self = this;
        // $(document).on("click", "#addButton", () => self.addChart());
        // $(document).on("click", "#barChart1", () => self.updateData(this.charts[0]));
        window.addEventListener("resize", () => self.resizeHandler());
    }

    addChart() {
        const chart = new BarChart("barChart2");
        this.charts.push(chart);
        this.updateData(chart);
    }

    resizeHandler() {
        this.charts.forEach((chart:BarChart) => {
            chart.resizeChart();
        });
    }

    updateData(chart:BarChart) {
        const length = d3.randomInt(5,10);
        const int = d3.randomInt(5, 25);

        const data = [];

        for (let index = 0; index < length(); index++) {
            data.push(int());
        }

        chart.drawChart({data: data});
    }

}