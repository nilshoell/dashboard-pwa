import BarChart from "./charts/barChart.js";

console.log("index.js linked");

$(function () {
    console.log("Document Ready");
    new App();
});

class App {
    constructor() {
        new BarChart();
    }
}
