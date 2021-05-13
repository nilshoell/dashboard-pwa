import KPITile from "./../charts/kpiTile.js";
import * as API from "./../components/api.js";

$(async function () {
    // Setup Object
    const home = new Home();
    await home.getKPIData();

    // Render only first KPI now
    home.renderKPI("tile1", home.kpis[0]);
    
    home.kpis[0].rendered = true;
});

class Home {

    charts = [];
    kpis = [];

    constructor() {

        // Initialize carousel
        $(".carousel").carousel({
            interval: 5000
        });

        this.kpis = [
            {kpi: "74351e8d7097", period: "MTD", rendered: false},
            {kpi: "dd751c6b67fb", period: "M", rendered: false},
            {kpi: "54de7813948a", period: "MTD", rendered: false}
        ];

        this.configureEventListener();
    }

    async getKPIData() {

        for (let i = 0; i < this.kpis.length; i++) {

            const kpi = this.kpis[i];
            const id = kpi.kpi;

            // Get master data
            this.kpis[i]["masterdata"] = await API.callApi("masterdata", id);
            this.kpis[i]["data"] = {};

            // Get values
            if (this.kpis[i]["masterdata"].aggregate === "sum") {
                this.kpis[i]["data"]["barData"] = await API.getBarData(id, kpi.period);
                this.kpis[i]["data"]["sparkData"] = await API.getCumulativeTimeData(id, "AC", kpi.period);
                this.kpis[i]["filter"] = {period: kpi.period, scenario: "AC"};
            } else {
                this.kpis[i]["data"]["barData"] = await API.getLatestBarData(id);
                this.kpis[i]["data"]["sparkData"] = await API.getTimeData(id);
                this.kpis[i]["filter"] = {period: "Latest", scenario: "AC"};
            }
        }
    }

    configureEventListener() {
        const self = this;
        window.addEventListener("resize", () => self.resizeHandler());

        // Render other charts on first carousel slide
        $(document).on("slid.bs.carousel", "#kpiCarousel", function (e:any) {
            console.log(e.to);
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