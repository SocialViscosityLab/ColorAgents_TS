import { Chart } from "../dataViz/chart.js";
import { DOM } from "../GUI_DOM/DOMManager.js";
import p5 from "p5";
import { World } from "../world.js";
import { Metrics } from "../metrics/metrics.js";
import { ViscosityPoint } from "../interfaces.js";
import { Utils } from "../utils/utils.js";

export class ViscosityChart {
  p5Instance: p5;
  // The chart object
  series;
  showIndividualSeries: boolean;

  constructor(p5: p5) {
    this.p5Instance = p5;
    this.series = new Chart(p5, p5.createVector(30, 320), 430, 300, 1, "Social viscosity", 0, 1);
    this.showIndividualSeries = false;

    // GUI Elements
    DOM.buttons.viscosities_to_JSON.onclick = this.viscositiesToJSON;
    DOM.buttons.globalViscosity_to_JSON.onclick = this.globalViscosityToJSON;
    DOM.buttons.globalViscosity_to_CSV.onclick = this.globalViscosityToCSV;
  }

  showEachSeries() {
    this.showIndividualSeries = !this.showIndividualSeries;
  }

  draw() {
    this.p5Instance.draw = () => {
      this.p5Instance.background(50);
      World.permuLoader.then((a) => {
        // Show individual viscosity
        if (DOM.checkboxes.showIndividualSeries.checked) {
          //go over all the keys of metrics.viscosityData
          Metrics.agentsViscosityData.forEach((value, agent) => {
            this.series.geomPath(Utils.convertToViscosityPoint(value), "", agent.colorValues!.value.rgb());
          });
        }

        // Show consolidated viscosity
        if (DOM.checkboxes.showSeries.checked) {
          this.series.geomPath(Utils.convertToViscosityPoint(Metrics.globalViscosityData), "global", [180, 180, 180]);
        }

        // Plot the chart canvas
        this.series.canvas();

        // Set the max value of tickSlider

        DOM.sliders.ticks.max = this.series.xAxis.maxValue;

        this.series.geomVLine(Number(DOM.sliders.ticks.value),[255,225,225,100]);

        this.series.geomTextValueAtKey(Utils.convertToViscosityPoint(Metrics.globalViscosityData), Number(DOM.sliders.ticks.value),[255,225,225,100]);
      });
    };
  }

  // Exports all the agent's viscosities to JSON. The file is saved in user's download folder
  viscositiesToJSON() {
    let file = [];
    // first iterator
    let itr1 = Metrics.agentsViscosityData.entries();
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
    let itr = Metrics.globalViscosityData.entries();
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
    let itr = Metrics.globalViscosityData.entries();
    let item = itr.next();
    while (!item.done) {
      file.push([item.value[0], item.value[1]]);
      item = itr.next();
    }
    this.p5Instance.save(file, "globalViscosityCSV.csv");
    console.log("Viscosity CSV file saved");
  }
}
