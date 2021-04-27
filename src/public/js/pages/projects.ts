import Sparkline from "../charts/sparkline.js";

$(function () {
    new Projects();
});

class Projects {

    charts = [];
    constructor() {

        const self = this;

        const kpis = [
            {data: [108,118,113,111,113,102,101,116,103,111,123,126,150,137,130,126,140,139,136,127,137,180,186,159,144,199,190,165,194,150,166]},
            {data: [3423,2649,4519,4324,1811,4748,3164,1961,1683,3532,1124,3807,4064,4806,5378,6578]},
            {data: [199,189,183,176,164,159,157,152,150,148,148,145,143,139,137,135,128,127,124,121,119,116,115,112,110,109,109,108,108,104,102,70,50,30,0,-10]},
            {data: [4678,1500,4584,1000,1300,1400,1500,2300]},
            {data: [116,109,114,120,101,112,100,102,107,105,110,128,123,145,147,124,140,134,129,138,124,175,172,147,146,142,156,153,198,173,184]}
        ];

        kpis.forEach(function (kpi, index) {
            const kpiData = {};
            const count = kpi.data.length;
            const date = (x:number) => {
                const diff = (count - (x + 1)) * 86400000;
                const newDate = new Date(new Date().getTime() - diff);
                return newDate.getFullYear() + "-" + String(newDate.getMonth() + 1).padStart(2,"0") + "-" + String(newDate.getDate()).padStart(2,"0");
            };
            kpiData["data"] = kpi.data.map((d, i) => {return {date: date(i), val: d};});
            self.renderKPI("sparkline" + (+index + 1), kpiData);
        });

        this.configureEventListener();
    }

    configureEventListener() {
        const self = this;
        window.addEventListener("resize", () => self.resizeHandler());
    }

    renderKPI(canvasID:string, chartData) {
        const chart = new Sparkline(canvasID);
        chart.drawChart(chartData);
        this.charts.push(chart);
    }

    resizeHandler() {
        this.charts.forEach((chart:Sparkline) => {
            chart.resizeChart();
        });
    }
}