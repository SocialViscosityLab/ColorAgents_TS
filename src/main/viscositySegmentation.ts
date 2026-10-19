import p5 from "p5";
import { slidingWindowSegmentation, bottomUpSegmentation, swabSegmentation } from "../utils/segmentation.js";
import { Chart } from "../dataViz/chart.js";
import { AgentViscosityData, ColorValue, ViscosityPoint } from "../interfaces.js";
import { ABMS } from "./abms.js";
import { DOM } from "../GUI_DOM/DOMManager.js";
import { Metrics } from "../metrics/metrics.js";
import { Utils } from "../utils/utils.js";
import { Agent } from "../agents/agent.js";

export class SegmentationChart {
  p5Instance: p5;
  chartTimeSeries: Chart | undefined;
  /** This map stores six numbers (three pairs of values) for each agent. The first pair is the
   * x,y coords of the segment start, the second the coords of the segment end, the third, the vector
   * resulting of substracting the end-start.
   */
  segments: Map<string, number[][]> | undefined;

  maxError = 0.02;

  constructor(p5: p5) {
    this.p5Instance = p5;
    this.segments = new Map<string, []>();

    DOM.buttons.segmentsToJSON_global.onclick = () => {
      this.segmentsToJSON_global();
    };
    DOM.buttons.segmentsToJSON_each.onclick = () => {
      this.segmentsToJSON_each();
    };
  }

  formatViscosityData(data: any[]): AgentViscosityData[] {
    return data.map(({ agent, viscosities }) => ({
      agent: agent,
      viscosities: viscosities.map(([key, value]: [string, unknown]) => ({ key, value })),
    }));
  }

  /**
   * This method is to be used importing a dataset
   * @param url must "data/viscosities.json"
   */
  loadJSON(urlJSON: string): any {
    this.p5Instance.loadJSON(urlJSON, (data: any) => {
      // format the viscosity data to ensure it is in the correct structure
      return this.formatViscosityData(data);
    });
  }

  draw(abms: ABMS) {
    // Check there is an abm instantiated
    if (!abms) return;

    // invoke the p5.draw function
    this.p5Instance.draw = () => {
      this.p5Instance.background(50);

      // return if there are no metrics instantiated
      if (!Metrics) return;

      // create the canvas or draw it if it exists
      if (this.chartTimeSeries) {
        this.chartTimeSeries.canvas();
      } else {
        this.chartTimeSeries = new Chart(this.p5Instance, this.p5Instance.createVector(50, 350), 750, 300, 1, "viscosity", 0, 0);
      }

      let userChoice = DOM.lists.segmentationDataset.value;

      switch (userChoice) {
        case "globalData":
          DOM.checkboxes.segIndCheckboxes.style.display = "none";
          let viscosityPoints: ViscosityPoint[] = Utils.convertToViscosityPoint(Metrics.globalViscosityData);
          let sgmnts = this.makeSegments(viscosityPoints);
          this.plotSegments(sgmnts, viscosityPoints);
          break;
        case "individualData":
          // Create the individual checkboxes
          DOM.generateIndividualCheckBoxes(Metrics.agentsViscosityData);

          // display the individual checkboxes
          DOM.checkboxes.segIndCheckboxes.style.display = "flex";

          Metrics.agentsViscosityData.forEach((viscosities, agent) => {
            const checkboxes = DOM.checkboxes.segIndCheckboxes.children;

            // Evaluate which checkboxes are checked
            for (let i = 0; i < checkboxes.length; i++) {
              const checkbox = checkboxes[i].children[0];

              // Display checked elements only
              if (checkbox.checked && checkbox.id == agent.id) {
                let viscosityPoints: ViscosityPoint[] = Utils.convertToViscosityPoint(viscosities);
                let sgmnts = this.makeSegments(viscosityPoints);
                this.plotSegments(sgmnts, undefined, agent);
              }
            }
          });
      }
    };
  }

  makeSegments(vPoints: ViscosityPoint[]) {
    let rtn: ViscosityPoint[][] = [];
    // Get the user input for Max Error defult 0.02
    this.maxError = Number(DOM.sliders.segmentationError.value);

    // Calculate the segments
    switch (DOM.lists.segmentationMethod.value) {
      case "slidingWindowSeg":
        rtn = slidingWindowSegmentation(vPoints, this.maxError);
        break;
      case "bottomUpSeg":
        rtn = bottomUpSegmentation(vPoints, this.maxError);
        break;
      case "swabSeg":
        rtn = swabSegmentation(vPoints, this.maxError);
    }

    return rtn;
  }

  plotSegments(segments: ViscosityPoint[][], vPoints?: ViscosityPoint[], agent?: Agent) {
    // /***** All ***/
    if (!segments) return;
    segments.forEach((segment) => {
      // detect if the mouse is over a segment
      let weight = 1;
      if (this.chartTimeSeries!.isMouseOverLineCanvas(segment)) {
       // console.log(agent?.id + "_ from:" + segment[0]!.key + " to: " + segment[segment.length - 1]!.key);
        weight = 3;
      }

      this.chartTimeSeries!.geomPath(segment, "t_" + segment[segment.length - 1]!.key, agent?.colorValues?.value._rgb?._unclipped ?? [180, 180, 180], weight);

      // detect if the mouse is over a segment
      if (this.chartTimeSeries!.isMouseOverLineCanvas(segment)) {
        // highlight the steps of the agent in the main canvas
        ABMS.vAgents
          .filter((vAgent) => vAgent.agent.id === agent?.id)
          .forEach((vAgent) => {
            vAgent.showSteps(segment[0]!.key, segment[segment.length - 1]!.key, 10);
          });

        // log the agent id and the segment range
        // console.log(agent?.id + " from:" + segment[0]!.key + " to: " + segment[segment.length - 1]!.key);
      }

      // show the viscosity points if provided
      if (vPoints) this.chartTimeSeries!.geomPoint(vPoints, "all", [255, 180, 255]);
    });
  }

  /** This method returns an array of six numbers (three pairs of values) for each segment.
   * The first pair is the x,y coords of the segment start, the second the coords of the
   * segment end, the third, the vector resulting of substracting the end-start.
   */
  segmentsToVectors(sgmnts: ViscosityPoint[][]) {
    let rtn2 = [];
    if (sgmnts.length == 0) return undefined;

    for (let i = 0; i < sgmnts.length; i++) {
      const segment = sgmnts[i];
      if (!segment || segment.length === 0) continue;
      const first = segment[0];
      const last = segment[segment.length - 1];
      if (!first || !last) continue;

      let vStart = this.p5Instance.createVector(first.key, first.value);
      let vEnd = this.p5Instance.createVector(last.key, last.value);
      let vSub = p5.Vector.sub(vEnd, vStart);

      rtn2[i] = [vStart.x, vStart.y, vEnd.x, vEnd.y, vSub.x, vSub.y];
    }

    return rtn2;
  }

  /** This method saves six numbers (three pairs of values) for each segment of the global viscosity.
   * The first pair is the x,y coords of the segment start, the second the coords of the
   * segment end, the third, the vector resulting of substracting the end-start.
   */
  segmentsToJSON_global() {
    // clear the segments
    this.segments!.clear();

    let viscosityPoints: ViscosityPoint[] = Utils.convertToViscosityPoint(Metrics.globalViscosityData);
    let sgmnts = this.makeSegments(viscosityPoints);
    this.segments?.set("global", this.segmentsToVectors(sgmnts) ?? []);
    this.p5Instance.saveJSON(Object.fromEntries(this.segments!), "segmentsGlobal.json");
    console.log("Global Viscosity Segments JSON file saved");
  }

  /** This method saves six numbers (three pairs of values) for each segment of each agent's viscosity.
   * The first pair is the x,y coords of the segment start, the second the coords of the
   * segment end, the third, the vector resulting of substracting the end-start.
   */
  segmentsToJSON_each() {
    // clear the segments
    this.segments!.clear();

    Metrics.agentsViscosityData.forEach((viscosities, agent) => {
      let viscosityPoints: ViscosityPoint[] = Utils.convertToViscosityPoint(viscosities);
      let sgmnts = this.makeSegments(viscosityPoints);
      this.segments!.set(agent.id, this.segmentsToVectors(sgmnts)!);
    });

    let ids:any = [];
    let values:any = [];
    
    this.segments!.forEach((value, key) => {
      ids.push(key);
      values.push(value);
    });

    let file = { ids: ids, values: values };

   // this.p5Instance.save(file, "segmentsEach.json");
    this.p5Instance.saveJSON(Object.fromEntries(this.segments!), "segmentsEach.json");
    console.log("Individual Viscosity Segments JSON file saved");
  }
}
