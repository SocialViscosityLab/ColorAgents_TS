"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViscosityChart = void 0;
const chart_js_1 = require("../dataViz/chart.js");
const DOMManager_js_1 = require("../GUI_DOM/DOMManager.js");
const world_js_1 = require("../world.js");
const metrics_js_1 = require("../metrics/metrics.js");
const utils_js_1 = require("../utils/utils.js");
class ViscosityChart {
    p5Instance;
    // The chart object
    series;
    showIndividualSeries;
    constructor(p5) {
        this.p5Instance = p5;
        this.series = new chart_js_1.Chart(p5, p5.createVector(30, 320), 430, 300, 1, "Social viscosity", 0, 1);
        this.showIndividualSeries = false;
        // GUI Elements
        DOMManager_js_1.DOM.buttons.viscosities_to_JSON.onclick = this.viscositiesToJSON;
        DOMManager_js_1.DOM.buttons.globalViscosity_to_JSON.onclick = this.globalViscosityToJSON;
        DOMManager_js_1.DOM.buttons.globalViscosity_to_CSV.onclick = this.globalViscosityToCSV;
    }
    showEachSeries() {
        this.showIndividualSeries = !this.showIndividualSeries;
    }
    draw() {
        this.p5Instance.draw = () => {
            this.p5Instance.background(50);
            world_js_1.World.permuLoader.then((a) => {
                // Show individual viscosity
                if (DOMManager_js_1.DOM.checkboxes.showIndividualSeries.checked) {
                    //go over all the keys of metrics.viscosityData
                    metrics_js_1.Metrics.agentsViscosityData.forEach((value, agent) => {
                        this.series.geomPath(utils_js_1.Utils.convertToViscosityPoint(value), "", agent.colorValues.value.rgb());
                    });
                }
                // Show consolidated viscosity
                if (DOMManager_js_1.DOM.checkboxes.showSeries.checked) {
                    this.series.geomPath(utils_js_1.Utils.convertToViscosityPoint(metrics_js_1.Metrics.globalViscosityData), "global", [180, 180, 180]);
                }
                // Plot the chart canvas
                this.series.canvas();
                // Set the max value of tickSlider
                DOMManager_js_1.DOM.sliders.ticks.max = this.series.xAxis.maxValue;
                this.series.geomVLine(Number(DOMManager_js_1.DOM.sliders.ticks.value), [255, 225, 225, 100]);
                this.series.geomTextValueAtKey(utils_js_1.Utils.convertToViscosityPoint(metrics_js_1.Metrics.globalViscosityData), Number(DOMManager_js_1.DOM.sliders.ticks.value), [255, 225, 225, 100]);
            });
        };
    }
    // Exports all the agent's viscosities to JSON. The file is saved in user's download folder
    viscositiesToJSON() {
        let file = [];
        // first iterator
        let itr1 = metrics_js_1.Metrics.agentsViscosityData.entries();
        let item1 = itr1.next();
        while (!item1.done) {
            // second iterator
            let itr2 = item1.value[1].entries();
            let item2 = itr2.next();
            let tempArray = [];
            while (!item2.done) {
                tempArray.push(item2.value);
                item2 = itr2.next();
            }
            file.push({ agent: item1.value[0].id, viscosities: tempArray });
            item1 = itr1.next();
        }
        this.p5Instance.saveJSON(file, "viscosities.json");
    }
    // Exports global viscosity to JSON. The file is saved in user's download folder
    globalViscosityToJSON() {
        let file = [];
        // first iterator
        let itr = metrics_js_1.Metrics.globalViscosityData.entries();
        let item = itr.next();
        while (!item.done) {
            file.push({ tick: item.value[0], viscosity: item.value[1] });
            item = itr.next();
        }
        this.p5Instance.saveJSON(file, "globalViscosity.json");
    }
    // Exports global viscosity to CSV. The file is saved in user's download folder
    globalViscosityToCSV() {
        let file = [];
        // first iterator
        let itr = metrics_js_1.Metrics.globalViscosityData.entries();
        let item = itr.next();
        while (!item.done) {
            file.push([item.value[0], item.value[1]]);
            item = itr.next();
        }
        this.p5Instance.save(file, "globalViscosityCSV.csv");
        console.log("Viscosity CSV file saved");
    }
}
exports.ViscosityChart = ViscosityChart;
//# sourceMappingURL=viscosityChart.js.map