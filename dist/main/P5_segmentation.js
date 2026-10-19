"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const p5_1 = __importDefault(require("p5"));
// The segmentation implementation is JavaScript without TypeScript declarations.
// @ts-ignore
const segmentation_js_1 = require("../utils/segmentation.js");
const chart_js_1 = require("../dataViz/chart.js");
const segmentationSketch = (p5) => {
    let canvasTimeSeries;
    let chartTimeSeries;
    let viscosities;
    let slidingWindowSegments;
    let bottomUpSegments;
    let swabSegments;
    const agentIndex = 0;
    const maxError = 0.02;
    function formatViscosityData(data) {
        return data.map(({ agent, viscosities }) => ({
            agent: String(agent),
            viscosities: viscosities.map(([key, value]) => ({ key, value })),
        }));
    }
    p5.setup = function () {
        canvasTimeSeries = p5.createCanvas(850, 400);
        // canvasTimeSeries.parent();
        p5.loadJSON("data/viscosities.json", (data) => {
            // format the viscosity data to ensure it is in the correct structure
            viscosities = formatViscosityData(data);
            chartTimeSeries = new chart_js_1.Chart(this, p5.createVector(50, 350), 750, 300, viscosities[0].viscosities.length, "viscosity", 0, 0);
            // Calculate segmentation for the selected agent in the viscosities array
            const currentAgent = viscosities[agentIndex];
            if (!currentAgent)
                return;
            // Perform segmentation using the three algorithms
            slidingWindowSegments = (0, segmentation_js_1.slidingWindowSegmentation)(currentAgent.viscosities, maxError);
            bottomUpSegments = (0, segmentation_js_1.bottomUpSegmentation)(currentAgent.viscosities, maxError);
            swabSegments = (0, segmentation_js_1.swabSegmentation)(currentAgent.viscosities, maxError);
        });
    };
    p5.draw = function () {
        p5.background(255);
        if (chartTimeSeries) {
            chartTimeSeries.canvas();
        }
        if (!viscosities || !chartTimeSeries)
            return;
        const currentAgent = viscosities[agentIndex];
        if (!currentAgent)
            return;
        // chartTimeSeries.geomPath(currentAgent.viscosities, currentAgent.agent, [0, 0, 255]);
        chartTimeSeries.geomPoint(currentAgent.viscosities, currentAgent.agent, [255, 0, 255]);
        // /***** SLIDING WINDOW ***/
        // slidingWindowSegments.forEach((segment) => {
        //   chartTimeSeries!.geomPath(segment, segment[segment.length - 1]!.key, [205, 155, 0]);
        // });
        /***** BOTTOM-UP ***/
        bottomUpSegments.forEach((segment) => {
            chartTimeSeries.geomPath(segment, "t_" + segment[segment.length - 1].key, [50, 50, 50]);
        });
        /***** SWAB ***/
        // swabSegments.forEach((segment) => {
        //   chartTimeSeries!.geomPath(segment, "t_" + segment[segment.length - 1]!.key, [150, 55, 100]);
        // });
        p5.noLoop();
    };
};
var segmentationInstance = new p5_1.default(segmentationSketch, document.getElementById("TimeSeriesSegmentation") ?? undefined);
//# sourceMappingURL=P5_segmentation.js.map