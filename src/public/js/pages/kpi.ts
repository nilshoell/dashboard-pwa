import KPIBar from './../charts/kpiBar.js';
import Sparkline from './../charts/sparkline.js';
import Timeline from './../charts/timeline.js';

$(function () {
    new KPIDashboard();
});

class KPIDashboard {

    charts = [];

    constructor() {

        const self = this;

        const kpi = [58280,59250,57850,58350,59030,59210,58730,58300,59700,59650,60260,60800,58680,59120,60480,62290,59690,59600,62630,62080,62810,60700,63280,63870,64120,60070,62150,62970,75070];

        const components = [
            {
                data_bars: [3000,1500,3500],
                data_spark: [3087,3062,3118,3098,3107,3105,3116,3073,3089,3124,3119,3111,3151,3204,3172,3188,3167,3173,3279,3237,3248,3310,3318,3278,3332,3322,3346,3319,3290,3500]
            },
            {
                data_bars: [7500,9800,6485,10000],
                data_spark: [5769,5748,5924,5934,5960,5817,5998,6056,5980,5855,5911,5939,6153,6025,6156,5964,5900,6224,6234,6215,6052,6286,5983,6022,6149,6138,6231,6210,6104,6485]
            },
            {
                data_bars: [1234,9487,7532],
                data_spark: [10509,10264,10170,10115,10145,10151,9783,9759,9907,9784,9437,9246,9419,9242,9155,8839,8930,8637,8698,8411,8473,8235,8107,8042,7959,7843,7756,7640,7523,7532]
            }
        ];

        this.renderTimeline('timeline1', {data: kpi});
        
        components.forEach(function (kpi, index) {
            self.renderBar('kpibar_' + (+index + 1), {data: kpi.data_bars});
            self.renderSpark('sparkline_' + (+index + 1), {data: kpi.data_spark});
        });

        this.configureEventListener();
    }

    configureEventListener() {

        const self = this;

        // Resize handler
        window.addEventListener('resize', () => self.resizeHandler());

        // Toggle view button
        $(document).on('click', '#toggleView', () => {
            const invisible = $('.kpi-col.d-none');
            const visible = $('.kpi-col').not('d-none');
            visible.addClass('d-none d-sm-block');
            invisible.removeClass('d-none d-sm-block');
            this.resizeHandler();
        });
    }

    renderBar(canvasID:string, chartData) {
        const chart = new KPIBar(canvasID);
        chart.drawChart(chartData);
        this.charts.push(chart);
    }

    renderSpark(canvasID:string, chartData) {
        const chart = new Sparkline(canvasID);
        chart.drawChart(chartData);
        this.charts.push(chart);
    }

    renderTimeline(canvasID:string, chartData) {
        const chart = new Timeline(canvasID);
        chart.drawChart(chartData);
        this.charts.push(chart);
    }

    resizeHandler() {
        this.charts.forEach((chart:KPIBar) => {
            chart.resizeChart();
        });
    }
}