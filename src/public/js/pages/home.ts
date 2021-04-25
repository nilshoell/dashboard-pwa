import KPITile from "./../charts/kpiTile.js";

$(function () {
    // Setup Object
    new Home();
});

class Home {

    charts = [];
    kpis = [];

    constructor() {

        const self = this;

        // Initialize carousel
        $(".carousel").carousel({
            interval: 5000
        });

        this.kpis = [
            {data: {
                barData: [5210,4530,6890],
                sparkData: randomSpark(4000,5000,30,4530),
            }, name: "Test-KPI 1", rendered: false},
            {data: {
                barData: [2550210,7445300,9468990],
                sparkData: randomSpark(7000000,7500000,30,7445300),
            }, name: "Test-KPI 2", rendered: false},
            {data: {
                barData: [52100,45300,68900],
                sparkData: randomSpark(40000,45000,30,45300),
            }, name: "Test-KPI 3", rendered: false}
        ];

        // Render the first KPI
        self.renderKPI("tile1", this.kpis[0]);

        this.configureEventListener();
    }

    configureEventListener() {
        const self = this;
        window.addEventListener("resize", () => self.resizeHandler());

        // Render other charts on first carousel slide
        $("#kpiCarousel").on("slid.bs.carousel", function (e) {
            if (!self.kpis[e.to].rendered) {
                self.renderKPI("tile" + (e.to +1), self.kpis[e.to]);
                self.kpis[e.to].rendered = true;
            } else {
                self.charts[e.to].resizeChart();
            }
        });

    }

    // Render the KPIs
    renderKPI(canvasID:string, chartData) {
        const chart = new KPITile(canvasID);
        chart.drawChart(chartData);
        this.charts.push(chart);
    }

    // Resize all charts
    resizeHandler() {
        this.charts.forEach((chart:KPITile) => {
            chart.resizeChart();
        });
    }
}