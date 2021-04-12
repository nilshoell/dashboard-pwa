import KPIBar from './../charts/kpiBar.js';

$(function () {
    new Dashboard();
});

class Dashboard {

    charts = [];

    constructor() {

        const self = this;

        const kpis = [
            {data: [3000,1500,3500]},
            {data: [1500,6485,9800,10000]},
            {data: [1234,9487,3500]},
            {data: [7123,7892,9644]},
            {data: [4678,1500,4584,4500]},
            {data: [9728,6758,3884,3500]}
        ];
        
        kpis.forEach(function (kpi, index) {
            self.renderKPI('kpiBar' + (+index + 1), kpi);
        });

        // this.configureEventListener();
    }

    configureEventListener() {
        const self = this;
        // $(document).on('click', '#addButton', () => self.addChart());
        // $(document).on('click', '#barChart1', () => self.updateData(this.charts[0]));
    }

    renderKPI(canvasID:string, chartData) {
        const chart = new KPIBar(canvasID, {width: "80%"});
        chart.drawChart(chartData);
        this.charts.push(chart);
    }
}