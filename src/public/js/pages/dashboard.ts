import BarChart from './../charts/barChart.js';

$(function () {
    new Dashboard();
});

class Dashboard {

    x:number;

    constructor() {
        const chart = new BarChart();
        const data = [12, 5, 6, 6, 9, 10, 12, 15, 17, 23];
        chart.drawChart(data);
        this.x = 5;
        this.configureEventListener();
    }

    configureEventListener() {
        const self = this;
        $(document).on('click', 'h3', () => self.clickHandler());
    }

    clickHandler() {
        console.log("Click Detected");
    }

}