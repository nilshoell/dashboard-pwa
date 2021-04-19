import KPITile from './../charts/kpiTile.js';

$(function () {
    $('.carousel').carousel({
        interval: 5000
    });
    new Home();
});

class Home {

    charts = [];

    constructor() {

        const self = this;

        const kpis = [
            {data: {
                barData: [0],
                sparkData: [0],
            }},
            {data: {
                barData: [0],
                sparkData: [0],
            }},
            {data: {
                barData: [0],
                sparkData: [0],
            }}
        ];

        kpis.forEach(function (kpi, index) {
            self.renderKPI('tile' + (+index + 1), kpi);
        });

        this.configureEventListener();
    }

    configureEventListener() {
        const self = this;
        window.addEventListener('resize', () => self.resizeHandler());
        $('#kpiCarousel').on('slid.bs.carousel', function (e) {
            self.resizeHandler();
        });
    }

    renderKPI(canvasID:string, chartData) {
        const chart = new KPITile(canvasID);
        chart.drawChart(chartData);
        this.charts.push(chart);
    }

    resizeHandler() {
        this.charts.forEach((chart:KPITile) => {
            chart.resizeChart();
        });
    }
}