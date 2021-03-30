import BarChart from './../charts/barChart.js';

$(function () {
    new Dashboard();
});

class Dashboard {

    charts = [];

    constructor() {
        const chart = new BarChart('barChart1');
        const chartData = {data: [12, 5, 6, 6, 9, 10, 12, 15, 17, 23]};
        chart.drawChart(chartData);

        console.log(chart);

        this.charts.push(chart);
        this.configureEventListener();
    }

    configureEventListener() {
        const self = this;
        $(document).on('click', '#addButton', () => self.addChart());
        $(document).on('click', '#barChart1', () => self.updateData(this.charts[0]));
    }

    addChart() {
        const chart = new BarChart('barChart2');
        this.charts.push(chart);
        this.updateData(chart);
    }

    updateData(chart:BarChart) {
        const length = d3.randomInt(5,10);
        const int = d3.randomInt(5, 25);

        let data = [];

        for (let index = 0; index < length(); index++) {
            data.push(int());
        }

        chart.drawChart({data: data});
    }

}