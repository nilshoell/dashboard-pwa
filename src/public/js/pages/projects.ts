import KPIBar from '../charts/kpiBar.js';
import Sparkline from '../charts/sparkline.js';

$(function () {
    new Projects();
});

class Projects {

    charts = [];

    constructor() {

        const self = this;

        const kpis = [
            {data: [108,118,113,111,113,102,101,116,103,111,123,126,150,137,130,126,140,139,136,127,137,180,186,159,144,199,190,165,194,150,166]},
            {data: [3423,2649,4519,4324,1811,4748,3164,1961,1683,3532,1124,3807,2064,2806]},
            {data: [199,189,183,176,164,159,157,152,150,148,148,145,143,139,137,135,128,127,124,121,119,116,115,112,110,109,109,108,108,104,102]},
            {data: [4678,1500,4584,1000,1300,1400,1500,2300]},
            {data: [116,109,114,120,101,112,100,102,107,105,110,128,123,145,147,124,140,134,129,138,124,175,172,147,146,142,156,153,198,173,184]}
        ];
        
        kpis.forEach(function (kpi, index) {
            self.renderKPI('sparkline' + (+index + 1), kpi);
        });

        this.configureEventListener();
    }

    configureEventListener() {
        const self = this;
        // $(document).on('click', '#addButton', () => self.addChart());
        // $(document).on('click', '#barChart1', () => self.updateData(this.charts[0]));
    }

    renderKPI(canvasID:string, chartData) {
        const chart = new Sparkline(canvasID);
        chart.drawChart(chartData);
        this.charts.push(chart);
    }
}