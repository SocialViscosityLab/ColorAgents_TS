import p5 from "p5";
import { Chart } from "../dataViz/chart.js";
import { Metrics } from "../metrics/metrics.js";
import { DOM } from "../GUI_DOM/DOMManager.js";
import { World } from "../world.js";
import { ABMS } from "./abms.js";

export class QualityChart {
  p5Instance: p5;
  // The chart object
  series: Chart;
  showIndividualSeries: boolean;

  constructor(p5: p5) {
    this.p5Instance = p5;
    this.series = new Chart(this.p5Instance, p5.createVector(30, 320), 430, 300, 1, "Model quality", -0.1, 0.1);
    // GUI Elements
    DOM.buttons.modelsQuality_to_JSON.onclick = this.modelsQualityToJSON;
    DOM.buttons.globalModelQuality_to_JSON.onclick = this.globalModelQualityToJSON;
    DOM.buttons.globalModelQuality_to_CSV.onclick = this.globalModelQualityToCSV;
    this.showIndividualSeries = false;
  }

  plotIndividualSeries() {
    this.showIndividualSeries = !this.showIndividualSeries;
  }


  draw(abms: ABMS) {
    if (!abms) return;
    this.p5Instance.draw = () => {
      this.p5Instance.background(50);
      if (World.permutationsLoaded) {
        if (DOM.checkboxes.showIndividualModels.checked) {
          Metrics.learningAgents?.forEach((agent) => {
            let tmp = Metrics.agentsQualityData.get(agent);
            const colorArray = agent.colorValues?.value._rgb?._unclipped ?? [0, 0, 0, 255];
            this.series.geomPath(
              tmp
                ? Array.from(tmp.entries()).map(([key, value]) => ({ key, value: value[0] }))
                : [],
              "",
              colorArray,
            );
          });
        }

        if (DOM.checkboxes.showGeneralModel.checked) {
          //go over all the keys of metrics.viscosityData
          this.series.geomPath(
            Metrics.globalQualityData.map((q) => ({ key: q.tick, value: q.qValue })),
            "global",
            [150, 150, 150],
          );
          this.series.geomPath(
            Metrics.globalQualityData.map((q) => ({ key: q.tick, value: q.rqValue })),
            "real\nglobal",
            [200, 200, 200],
          );
        }

        // Plot the chart canvas
        this.series.canvas();

        this.series.geomVLine(DOM.sliders.ticks.value, [255,225,225,100]);
        //console.log(metrics.globalQualityData)
        //series.geomTextValueAtKey(metrics.globalQualityData, Number(DOM.sliders.ticks.value));
      }
    };
  }

  // Exports all the agent's viscosities to JSON. The file is saved in user's download folder
  modelsQualityToJSON() {
    let file = [];
    // first iterator
    let itr1 = Metrics.agentsQualityData.entries();
    let item1 = itr1.next();
    while (!item1.done) {
      // second iterator
      let itr2 = item1.value[1].entries();
      let item2 = itr2.next();
      let tempQArray = [];
      let tempRealArray = [];

      while (!item2.done) {
        tempQArray.push(item2.value[1][0]);
        tempRealArray.push(item2.value[1][1]);

        item2 = itr2.next();
      }
      file.push({ agent: item1.value[0].id, model_quality: tempQArray, model_real_quality: tempRealArray });
      item1 = itr1.next();
    }
    this.p5Instance.saveJSON(file, "models_quality.json");
  }

  // Exports global viscosity to JSON. The file is saved in user's download folder
  globalModelQualityToJSON(fileName: string) {
    let file = [];
    // first iterator
    let itr = Metrics.globalQualityData.entries();
    let item = itr.next();
    while (!item.done) {
      file.push({ tick: item.value[0], quality: item.value[1].qValue, real_quality: item.value[1].rqValue });
      item = itr.next();
    }
    if (fileName !== undefined) {
      this.p5Instance.save(file, fileName + ".json");
    } else {
      this.p5Instance.saveJSON(file, "globalQuality.json");
    }
  }

  // Exports global viscosity to CSV. The file is saved in user's download folder
  globalModelQualityToCSV() {
    let file = [];
    // first iterator
    for (let t = 0; t < Metrics.globalQualityData.length; t++) {
      const qualityRecord = Metrics.globalQualityData[t];
      file.push([t, qualityRecord!.qValue, qualityRecord!.rqValue]);
    }
    this.p5Instance.save(file, "globalQualityCSV.csv");
    console.log("Viscosity CSV file saved");
  }
}
