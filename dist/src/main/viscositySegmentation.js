"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SegmentationChart = void 0;
const p5_1 = __importDefault(require("p5"));
const segmentation_js_1 = require("../utils/segmentation.js");
const chart_js_1 = require("../dataViz/chart.js");
const abms_js_1 = require("./abms.js");
const DOMManager_js_1 = require("../GUI_DOM/DOMManager.js");
const metrics_js_1 = require("../metrics/metrics.js");
const utils_js_1 = require("../utils/utils.js");
class SegmentationChart {
    p5Instance;
    chartTimeSeries;
    /** This map stores six numbers (three pairs of values) for each agent. The first pair is the
     * x,y coords of the segment start, the second the coords of the segment end, the third, the vector
     * resulting of substracting the end-start.
     */
    segments;
    maxError = 0.02;
    constructor(p5) {
        this.p5Instance = p5;
        this.segments = new Map();
        DOMManager_js_1.DOM.buttons.segmentsToJSON_global.onclick = () => {
            this.segmentsToJSON_global();
        };
        DOMManager_js_1.DOM.buttons.segmentsToJSON_each.onclick = () => {
            this.segmentsToJSON_each();
        };
    }
    formatViscosityData(data) {
        return data.map(({ agent, viscosities }) => ({
            agent: agent,
            viscosities: viscosities.map(([key, value]) => ({ key, value })),
        }));
    }
    /**
     * This method is to be used importing a dataset
     * @param url must "data/viscosities.json"
     */
    loadJSON(urlJSON) {
        this.p5Instance.loadJSON(urlJSON, (data) => {
            // format the viscosity data to ensure it is in the correct structure
            return this.formatViscosityData(data);
        });
    }
    draw(abms) {
        // Check there is an abm instantiated
        if (!abms)
            return;
        // invoke the p5.draw function
        this.p5Instance.draw = () => {
            this.p5Instance.background(50);
            // return if there are no metrics instantiated
            if (!metrics_js_1.Metrics)
                return;
            // create the canvas or draw it if it exists
            if (this.chartTimeSeries) {
                this.chartTimeSeries.canvas();
            }
            else {
                this.chartTimeSeries = new chart_js_1.Chart(this.p5Instance, this.p5Instance.createVector(50, 350), 750, 300, 1, "viscosity", 0, 0);
            }
            let userChoice = DOMManager_js_1.DOM.lists.segmentationDataset.value;
            switch (userChoice) {
                case "globalData":
                    DOMManager_js_1.DOM.checkboxes.segIndCheckboxes.style.display = "none";
                    let viscosityPoints = utils_js_1.Utils.convertToViscosityPoint(metrics_js_1.Metrics.globalViscosityData);
                    let sgmnts = this.makeSegments(viscosityPoints);
                    this.plotSegments(sgmnts, viscosityPoints);
                    break;
                case "individualData":
                    // Create the individual checkboxes
                    DOMManager_js_1.DOM.generateIndividualCheckBoxes(metrics_js_1.Metrics.agentsViscosityData);
                    // display the individual checkboxes
                    DOMManager_js_1.DOM.checkboxes.segIndCheckboxes.style.display = "flex";
                    metrics_js_1.Metrics.agentsViscosityData.forEach((viscosities, agent) => {
                        const checkboxes = DOMManager_js_1.DOM.checkboxes.segIndCheckboxes.children;
                        // Evaluate which checkboxes are checked
                        for (let i = 0; i < checkboxes.length; i++) {
                            const checkbox = checkboxes[i].children[0];
                            // Display checked elements only
                            if (checkbox.checked && checkbox.id == agent.id) {
                                let viscosityPoints = utils_js_1.Utils.convertToViscosityPoint(viscosities);
                                let sgmnts = this.makeSegments(viscosityPoints);
                                this.plotSegments(sgmnts, undefined, agent);
                            }
                        }
                    });
            }
        };
    }
    makeSegments(vPoints) {
        let rtn = [];
        // Get the user input for Max Error defult 0.02
        this.maxError = Number(DOMManager_js_1.DOM.sliders.segmentationError.value);
        // Calculate the segments
        switch (DOMManager_js_1.DOM.lists.segmentationMethod.value) {
            case "slidingWindowSeg":
                rtn = (0, segmentation_js_1.slidingWindowSegmentation)(vPoints, this.maxError);
                break;
            case "bottomUpSeg":
                rtn = (0, segmentation_js_1.bottomUpSegmentation)(vPoints, this.maxError);
                break;
            case "swabSeg":
                rtn = (0, segmentation_js_1.swabSegmentation)(vPoints, this.maxError);
        }
        return rtn;
    }
    plotSegments(segments, vPoints, agent) {
        // /***** All ***/
        if (!segments)
            return;
        segments.forEach((segment) => {
            // detect if the mouse is over a segment
            let weight = 1;
            if (this.chartTimeSeries.isMouseOverLineCanvas(segment)) {
                // console.log(agent?.id + "_ from:" + segment[0]!.key + " to: " + segment[segment.length - 1]!.key);
                weight = 3;
            }
            this.chartTimeSeries.geomPath(segment, "t_" + segment[segment.length - 1].key, agent?.colorValues?.value._rgb?._unclipped ?? [180, 180, 180], weight);
            // detect if the mouse is over a segment
            if (this.chartTimeSeries.isMouseOverLineCanvas(segment)) {
                // highlight the steps of the agent in the main canvas
                abms_js_1.ABMS.vAgents
                    .filter((vAgent) => vAgent.agent.id === agent?.id)
                    .forEach((vAgent) => {
                    vAgent.showSteps(segment[0].key, segment[segment.length - 1].key, 10);
                });
                // log the agent id and the segment range
                // console.log(agent?.id + " from:" + segment[0]!.key + " to: " + segment[segment.length - 1]!.key);
            }
            // show the viscosity points if provided
            if (vPoints)
                this.chartTimeSeries.geomPoint(vPoints, "all", [255, 180, 255]);
        });
    }
    /** This method returns an array of six numbers (three pairs of values) for each segment.
     * The first pair is the x,y coords of the segment start, the second the coords of the
     * segment end, the third, the vector resulting of substracting the end-start.
     */
    segmentsToVectors(sgmnts) {
        let rtn2 = [];
        if (sgmnts.length == 0)
            return undefined;
        for (let i = 0; i < sgmnts.length; i++) {
            const segment = sgmnts[i];
            if (!segment || segment.length === 0)
                continue;
            const first = segment[0];
            const last = segment[segment.length - 1];
            if (!first || !last)
                continue;
            let vStart = this.p5Instance.createVector(first.key, first.value);
            let vEnd = this.p5Instance.createVector(last.key, last.value);
            let vSub = p5_1.default.Vector.sub(vEnd, vStart);
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
        this.segments.clear();
        let viscosityPoints = utils_js_1.Utils.convertToViscosityPoint(metrics_js_1.Metrics.globalViscosityData);
        let sgmnts = this.makeSegments(viscosityPoints);
        this.segments?.set("global", this.segmentsToVectors(sgmnts) ?? []);
        this.p5Instance.saveJSON(Object.fromEntries(this.segments), "segmentsGlobal.json");
        console.log("Global Viscosity Segments JSON file saved");
    }
    /** This method saves six numbers (three pairs of values) for each segment of each agent's viscosity.
     * The first pair is the x,y coords of the segment start, the second the coords of the
     * segment end, the third, the vector resulting of substracting the end-start.
     */
    segmentsToJSON_each() {
        // clear the segments
        this.segments.clear();
        metrics_js_1.Metrics.agentsViscosityData.forEach((viscosities, agent) => {
            let viscosityPoints = utils_js_1.Utils.convertToViscosityPoint(viscosities);
            let sgmnts = this.makeSegments(viscosityPoints);
            this.segments.set(agent.id, this.segmentsToVectors(sgmnts));
        });
        let ids = [];
        let values = [];
        this.segments.forEach((value, key) => {
            ids.push(key);
            values.push(value);
        });
        let file = { ids: ids, values: values };
        // this.p5Instance.save(file, "segmentsEach.json");
        this.p5Instance.saveJSON(Object.fromEntries(this.segments), "segmentsEach.json");
        console.log("Individual Viscosity Segments JSON file saved");
    }
}
exports.SegmentationChart = SegmentationChart;
//# sourceMappingURL=viscositySegmentation.js.map