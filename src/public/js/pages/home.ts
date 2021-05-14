import * as API from "./../components/api.js";
import * as Helper from "./../components/helperFunctions.js";

import { BasePage } from "./basePage.js";

/**
 * Executes on document ready
 * Loads data and renders dashboards
 */
$(async function () {
    const home = new Home();

    await home.getMasterData();
    await home.getChartData();

    // Render only first KPI now
    home.renderKPITile("tile1", home.kpis[0]);
    
    home.kpis[0].rendered = true;
});

class Home extends BasePage {

    constructor() {
        super();
        // Initialize carousel
        $(".carousel").carousel({
            interval: 5000
        });

        this.kpis = [
            {id: "74351e8d7097", filter: {period: "MTD"}, rendered: false},
            {id: "dd751c6b67fb", filter: {period: "M"}, rendered: false},
            {id: "54de7813948a", filter: {period: "MTD"}, rendered: false}
        ];
    }

    /**
     * Override parent method to get chart data
     */
    async getChartData() {
        for (let i = 0; i < this.kpis.length; i++) {
            const kpi = this.kpis[i];
            const id = kpi.id;
            kpi.data = {};
            if (kpi.masterdata.aggregate === "sum") {
                kpi.data["barData"] = await API.getBarData(id, kpi.filter);
                kpi.data["sparkData"] = await API.getCumulativeTimeData(id, kpi.filter);
            } else {
                kpi.data["barData"] = await API.getLatestBarData(id, kpi.filter);
                const data = await API.getTimeData(id, kpi.filter);
                kpi.data["sparkData"] = await Helper.movingAvg(data, 5);
            }
        }
    }

    /**
     * Set up event listeners
     */
    configureEventListener() {
        const self = this;
        window.addEventListener("resize", () => self.resizeHandler());

        // Render other charts on first carousel slide
        $(document).on("slid.bs.carousel", "#kpiCarousel", function (e:any) {
            console.log(e.to);
            if (!self.kpis[e.to].rendered) {
                self.renderKPITile("tile" + (e.to +1), self.kpis[e.to]);
                self.kpis[e.to].rendered = true;
            } else {
                self.charts[e.to].resizeChart();
            }
        });

    }
}