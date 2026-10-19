import p5 from "p5";
import { DOM } from "./src/GUI_DOM/DOMManager";
import { InteractionMatrix } from "./src/main/interactionMatrix";
import { ABMS } from "./src/main/abms.js";
import { ViscosityChart } from "./src/main/viscosityChart";
import { QualityChart } from "./src/main/modelsQualityChart";
import { LearnedModels } from "./src/main/learnedModels";
import { SegmentationChart } from "./src/main/viscositySegmentation";
import { setUpUserInteractions } from "./src/GUI_DOM/userInteraction";

/**
 * The class Metrics and the ABMS's world indtance are available on the console. The instances are 'attached' to the global
 * window in each initialize() function.
 */

p5.disableFriendlyErrors = true;

/** GLOBAL P5 INSTANCES */
export var mainP5: p5;
export var vizMatrix: p5;
export var viscositySeries: p5;
export var qualitySeries: p5;
export var vizLearnedModels: p5;
export var segmentationInstance: p5;

/** GLOBAL VARIABLES */
export var globalP5: p5;

/** TODO 
 * Create a global variable for 
 * farthestDistance to be used in the instantiation of the agents AND 
 * the visualization matrix mapping of color. 
 * This will allow for a more flexible and dynamic approach to setting the farthest distance for agents in the simulation.
*/


/** P5  CANVASES */
const abmsCanvas = (p5: p5) => {
  p5.setup = function () {
    p5.createCanvas(500, 500);
    console.log("Setting up a P5 sketch for the ABMS");
  };

  globalP5 = p5;
};

const heatmapCanvas = function (p5: p5) {
  p5.setup = function () {
    console.log("Setting up a P5 sketch for the HeatMap");
    p5.createCanvas(350, 370);
  };
};

const viscosityCanvas = function (p5: p5) {
  p5.setup = function () {
    console.log("Setting up a P5 skecth for the Viscosity chart");
    p5.createCanvas(500, 350);
  };
};

const learningQualityCanvas = function (p5: p5) {
  p5.setup = function () {
    console.log("Setting up a p5 skecth for the Learning Quality chart");
    p5.createCanvas(500, 350);
  };
};

const learnedModelsCanvas = function (p5: p5) {
  p5.setup = function () {
    console.log("Setting up a p5 sketch for the LernedModels rings");
    p5.createCanvas(350, 475);
  };
};

const segmentationCanvas = function (p5: p5) {
  p5.setup = function () {
    console.log("Setting up a p5 sketch for the Viscosity Segmentation chart");
    p5.createCanvas(850, 400);
  };
};

/** INITIALIZE DOM ELEMENTS */
DOM.initialize();


/** INSTANTIATE P5 SKETCHES */
mainP5 = new p5(abmsCanvas, document.getElementById("ColorAgents") ?? undefined);
vizMatrix = new p5(heatmapCanvas, document.getElementById("PlotMatrix") as HTMLElement);
viscositySeries = new p5(viscosityCanvas, document.getElementById("TimeSeries") as HTMLElement);
qualitySeries = new p5(learningQualityCanvas, document.getElementById("QualityChart") as HTMLElement);
vizLearnedModels = new p5(learnedModelsCanvas, document.getElementById("LearnedModels") as HTMLElement);
segmentationInstance = new p5(segmentationCanvas, document.getElementById("TimeSeriesSegmentation") as HTMLElement);


/** INSTANTIATE OBJECTS */
// Instantiate the ABMS class to run the simulation
const abms = new ABMS(mainP5);
// run the simulation in a loop;
abms.draw();

const viscosityChart = new ViscosityChart(viscositySeries);
viscosityChart.draw();

// Instantiate the InteractionMatrix class to visualize the interaction matrix
const interactionMatrix = new InteractionMatrix(vizMatrix);
// It received the abms as a condition to plot the matrix
interactionMatrix.draw(abms);

const learningQualityChart = new QualityChart(qualitySeries);
learningQualityChart.draw(abms);

const learnedModelRings = new LearnedModels(vizLearnedModels);
learnedModelRings.draw(abms);

const segmentationChart = new SegmentationChart(segmentationInstance);
segmentationChart.draw(abms);


// Set up user interactions for the floating div
setUpUserInteractions();
