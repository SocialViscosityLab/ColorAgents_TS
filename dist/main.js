"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalP5 = exports.segmentationInstance = exports.vizLearnedModels = exports.qualitySeries = exports.viscositySeries = exports.vizMatrix = exports.mainP5 = void 0;
const p5_1 = __importDefault(require("p5"));
const DOMManager_1 = require("./src/GUI_DOM/DOMManager");
const interactionMatrix_1 = require("./src/main/interactionMatrix");
const abms_js_1 = require("./src/main/abms.js");
const viscosityChart_1 = require("./src/main/viscosityChart");
const modelsQualityChart_1 = require("./src/main/modelsQualityChart");
const learnedModels_1 = require("./src/main/learnedModels");
const viscositySegmentation_1 = require("./src/main/viscositySegmentation");
const userInteraction_1 = require("./src/GUI_DOM/userInteraction");
/**
 * The class Metrics and the ABMS's world indtance are available on the console. The instances are 'attached' to the global
 * window in each initialize() function.
 */
p5_1.default.disableFriendlyErrors = true;
/** TODO
 * Create a global variable for
 * farthestDistance to be used in the instantiation of the agents AND
 * the visualization matrix mapping of color.
 * This will allow for a more flexible and dynamic approach to setting the farthest distance for agents in the simulation.
*/
/** P5  CANVASES */
const abmsCanvas = (p5) => {
    p5.setup = function () {
        p5.createCanvas(500, 500);
        console.log("Setting up a P5 sketch for the ABMS");
    };
    exports.globalP5 = p5;
};
const heatmapCanvas = function (p5) {
    p5.setup = function () {
        console.log("Setting up a P5 sketch for the HeatMap");
        p5.createCanvas(350, 370);
    };
};
const viscosityCanvas = function (p5) {
    p5.setup = function () {
        console.log("Setting up a P5 skecth for the Viscosity chart");
        p5.createCanvas(500, 350);
    };
};
const learningQualityCanvas = function (p5) {
    p5.setup = function () {
        console.log("Setting up a p5 skecth for the Learning Quality chart");
        p5.createCanvas(500, 350);
    };
};
const learnedModelsCanvas = function (p5) {
    p5.setup = function () {
        console.log("Setting up a p5 sketch for the LernedModels rings");
        p5.createCanvas(350, 475);
    };
};
const segmentationCanvas = function (p5) {
    p5.setup = function () {
        console.log("Setting up a p5 sketch for the Viscosity Segmentation chart");
        p5.createCanvas(850, 400);
    };
};
/** INITIALIZE DOM ELEMENTS */
DOMManager_1.DOM.initialize();
/** INSTANTIATE P5 SKETCHES */
exports.mainP5 = new p5_1.default(abmsCanvas, document.getElementById("ColorAgents") ?? undefined);
exports.vizMatrix = new p5_1.default(heatmapCanvas, document.getElementById("PlotMatrix"));
exports.viscositySeries = new p5_1.default(viscosityCanvas, document.getElementById("TimeSeries"));
exports.qualitySeries = new p5_1.default(learningQualityCanvas, document.getElementById("QualityChart"));
exports.vizLearnedModels = new p5_1.default(learnedModelsCanvas, document.getElementById("LearnedModels"));
exports.segmentationInstance = new p5_1.default(segmentationCanvas, document.getElementById("TimeSeriesSegmentation"));
/** INSTANTIATE OBJECTS */
// Instantiate the ABMS class to run the simulation
const abms = new abms_js_1.ABMS(exports.mainP5);
// run the simulation in a loop;
abms.draw();
const viscosityChart = new viscosityChart_1.ViscosityChart(exports.viscositySeries);
viscosityChart.draw();
// Instantiate the InteractionMatrix class to visualize the interaction matrix
const interactionMatrix = new interactionMatrix_1.InteractionMatrix(exports.vizMatrix);
// It received the abms as a condition to plot the matrix
interactionMatrix.draw(abms);
const learningQualityChart = new modelsQualityChart_1.QualityChart(exports.qualitySeries);
learningQualityChart.draw(abms);
const learnedModelRings = new learnedModels_1.LearnedModels(exports.vizLearnedModels);
learnedModelRings.draw(abms);
const segmentationChart = new viscositySegmentation_1.SegmentationChart(exports.segmentationInstance);
segmentationChart.draw(abms);
// Set up user interactions for the floating div
(0, userInteraction_1.setUpUserInteractions)();
//# sourceMappingURL=main.js.map