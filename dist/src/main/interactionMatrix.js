"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionMatrix = void 0;
const interactionMatrixCanvas_1 = require("../dataViz/interactionMatrixCanvas");
const DOMManager_1 = require("../GUI_DOM/DOMManager");
const main_js_1 = require("../../main.js");
const world_1 = require("../world");
const abms_1 = require("./abms");
const metrics_1 = require("../metrics/metrics");
class InteractionMatrix {
    p5Element;
    static vizMatrixCanvas;
    static lastMatrix;
    static lastMatrixTick = -Infinity;
    constructor(p5Element) {
        console.log("Instantiating the InteractionMatrix class");
        this.p5Element = p5Element;
        /*Setup the interaction matrix visualizer*/
        this.initialize();
        DOMManager_1.DOM.sliders.ticks.addEventListener('input', (evt) => {
            const target = evt.target;
            if (!(target instanceof HTMLInputElement))
                return;
            InteractionMatrix.setLastMatrix(Number(target.value));
        });
        DOMManager_1.DOM.buttons.reset.addEventListener("click", () => {
            this.initialize();
        });
        //DOM.checkboxes.showMatrix.onclick = sIntlastMatrix;
        DOMManager_1.DOM.lists.cFactory.addEventListener("change", () => {
            this.initialize();
        });
        DOMManager_1.DOM.buttons.interactionMatrix_to_JSON.onclick = this.interactionMatrixToJSON;
        DOMManager_1.DOM.buttons.interactionMatrix_to_CSV.onclick = () => {
            this.interactionMatrixToCSV(true);
        };
    }
    // Exports global viscosity to CSV. The file is saved in user's download folder
    interactionMatrixToJSON() {
        let ticks = [];
        for (let i = 0; i < abms_1.ABMS.globalWorld.getTicks(); i++) {
            let tempMatrix = metrics_1.Metrics.getMatrixAt(i);
            let tempPairs = [];
            tempMatrix.forEach((a) => {
                a.interactions.forEach((p) => {
                    let tempPair = [a.id, p.interactant, undefined];
                    console.log(this);
                    if (!this.pairInArray(tempPair, tempPairs)) {
                        tempPair[2] = p.currentDist;
                        tempPairs.push(tempPair);
                    }
                });
            });
            ticks.push({ id: i, interactions: tempPairs });
        }
        let file = { ticks: ticks };
        this.p5Element.save(file, "matrix.json");
        console.log("Matrix JSON file saved");
    }
    /**
     * Exports global viscosity to CSV. The file is saved in user's download folder
     * @param {*} simetrical True if the matrix need to be simmetrical. This MUST be tru when the interactions are not mutual, such as A sees B but B does not see A
     */
    interactionMatrixToCSV(symmetrical) {
        if (symmetrical) {
            console.log("Saving a symmetrical matrix");
        }
        else {
            console.log("Saving an asymmetricl matrix");
        }
        // column headings
        let file = ["tick, from, to, distance, spatialMag, weightedDiff"];
        for (let i = 0; i < abms_1.ABMS.globalWorld.getTicks(); i++) {
            let tempMatrix = metrics_1.Metrics.getMatrixAt(i);
            let tempPairs = [];
            let tempRow = [i];
            tempMatrix.forEach((a) => {
                a.interactions.forEach((p) => {
                    let tempPair = [a.id, p.interactant];
                    // if a simetrical matrix is needed
                    if (symmetrical) {
                        tempPair.push(p.currentDist);
                        tempPair.push(p.spatialMag);
                        tempPair.push(p.weightedDifference);
                        file.push(String(tempRow.concat(tempPair)));
                    }
                    else {
                        if (!this.pairInArray(tempPair, tempPairs)) {
                            tempPair.push(p.currentDist);
                            tempPair.push(p.spatialMag);
                            tempPair.push(p.weightedDifference);
                            tempPairs.push(tempRow.concat(tempPair));
                            file.push(String(tempRow.concat(tempPair)));
                        }
                    }
                });
            });
        }
        this.p5Element.save(file, "matrixCSV.csv");
        console.log("Matrix CSV file saved");
    }
    pairInArray(pairA, pairs) {
        let isInArray = false;
        if (Object.keys(pairs).length != 0) {
            pairs.forEach((pairB) => {
                if (pairB.includes(pairA[0]) && pairB.includes(pairA[1])) {
                    isInArray = true;
                }
            });
        }
        return isInArray;
    }
    printP5(a, b) {
        let vctr = this.p5Element.createVector(a, b);
        console.log("Vector created in InteractionMatrix class: ", vctr);
        console.log(this);
    }
    initialize() {
        InteractionMatrix.resetLastMatrix();
        // Reset matrix visualizer
        world_1.World.permuLoader.then((a) => {
            InteractionMatrix.vizMatrixCanvas = new interactionMatrixCanvas_1.InteractionMatrixCanvas(main_js_1.vizMatrix, abms_1.ABMS.globalWorld);
        });
    }
    draw(abms) {
        this.p5Element.draw = () => {
            this.p5Element.background(250);
            if (!abms)
                return;
            world_1.World.permuLoader.then((a) => {
                // MATRICES
                if (DOMManager_1.DOM.checkboxes.showMatrix.checked && InteractionMatrix.lastMatrix != undefined) {
                    InteractionMatrix.vizMatrixCanvas.plot2(this.p5Element.createVector(25, 30), InteractionMatrix.lastMatrix);
                }
            });
        };
    }
    static resetLastMatrix() {
        InteractionMatrix.lastMatrix = undefined;
    }
    static setLastMatrix(time) {
        if (time != InteractionMatrix.lastMatrixTick) {
            InteractionMatrix.lastMatrix = metrics_1.Metrics.getMatrixAt(time);
            InteractionMatrix.lastMatrixTick = time;
        }
    }
}
exports.InteractionMatrix = InteractionMatrix;
//# sourceMappingURL=interactionMatrix.js.map