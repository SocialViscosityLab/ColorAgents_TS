import p5 from "p5";
import { InteractionMatrixCanvas } from "../dataViz/interactionMatrixCanvas";
import { DOM } from "../GUI_DOM/DOMManager";
import { vizMatrix } from "../main/main.js";
import { World } from "../world";
import { MatrixRow, Aid_Bid_Distance } from "../interfaces";
import { ABMS } from "./abms";
import { Metrics } from "../metrics/metrics";

export class InteractionMatrix {
  p5Element: p5;
  static vizMatrixCanvas: InteractionMatrixCanvas;
  static lastMatrix: MatrixRow[] | undefined;
  static lastMatrixTick = -Infinity;

  constructor(p5Element: p5) {
    console.log("Instantiating the InteractionMatrix class");
    this.p5Element = p5Element;

    /*Setup the interaction matrix visualizer*/

    this.initialize();

    DOM.sliders.ticks.addEventListener('input', (evt: Event) => {
      const target = evt.target;
      if (!(target instanceof HTMLInputElement)) return;
      InteractionMatrix.setLastMatrix(Number(target.value));
    });

    DOM.buttons.reset.addEventListener("click", () => {
      this.initialize();
    });
    //DOM.checkboxes.showMatrix.onclick = sIntlastMatrix;
    DOM.lists.cFactory.addEventListener("change", () => {
      this.initialize();
    });
    DOM.buttons.interactionMatrix_to_JSON.onclick = this.interactionMatrixToJSON;
    DOM.buttons.interactionMatrix_to_CSV.onclick = () => {
      this.interactionMatrixToCSV(true);
    };
  }

  // Exports global viscosity to CSV. The file is saved in user's download folder
  interactionMatrixToJSON() {
    let ticks = [];
    for (let i = 0; i < ABMS.globalWorld.getTicks(); i++) {
      let tempMatrix = Metrics.getMatrixAt(i);
      let tempPairs: Aid_Bid_Distance[] = [];
      tempMatrix.forEach((a) => {
        a.interactions.forEach((p) => {
          let tempPair: Aid_Bid_Distance = [a.id, p.interactant, undefined];
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
  interactionMatrixToCSV(symmetrical: boolean) {
    if (symmetrical) {
      console.log("Saving a symmetrical matrix");
    } else {
      console.log("Saving an asymmetricl matrix");
    }
    // column headings
    let file = ["tick, from, to, distance, spatialMag, weightedDiff"];
    for (let i = 0; i < ABMS.globalWorld.getTicks(); i++) {
      let tempMatrix = Metrics.getMatrixAt(i);
      let tempPairs: any = [];
      let tempRow = [i];
      tempMatrix.forEach((a) => {
        a.interactions.forEach((p) => {
          let tempPair: any = [a.id, p.interactant];

          // if a simetrical matrix is needed
          if (symmetrical) {
            tempPair.push(p.currentDist);
            tempPair.push(p.spatialMag);
            tempPair.push(p.weightedDifference);
            file.push(String(tempRow.concat(tempPair)));
          } else {
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

  pairInArray(pairA: Aid_Bid_Distance, pairs: Aid_Bid_Distance[]): boolean {
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

  printP5(a: number, b: number) {
    let vctr = this.p5Element.createVector(a, b);
    console.log("Vector created in InteractionMatrix class: ", vctr);
    console.log(this);
  }

  initialize() {
    InteractionMatrix.resetLastMatrix();
    // Reset matrix visualizer
    World.permuLoader.then((a) => {
      InteractionMatrix.vizMatrixCanvas = new InteractionMatrixCanvas(vizMatrix, ABMS.globalWorld);
    });
  }

  draw(abms: ABMS): void {
    this.p5Element.draw = () => {
      this.p5Element.background(250);
      if (!abms) return;
      World.permuLoader.then((a) => {
        
        // MATRICES
        if (DOM.checkboxes.showMatrix.checked && InteractionMatrix.lastMatrix != undefined) {
          InteractionMatrix.vizMatrixCanvas.plot2(this.p5Element.createVector(25, 30), InteractionMatrix.lastMatrix);
        }
      });
    };
  }

  static resetLastMatrix() {
    InteractionMatrix.lastMatrix = undefined;
  }

  static setLastMatrix(time: number) {
    if (time != InteractionMatrix.lastMatrixTick) {
      InteractionMatrix.lastMatrix = Metrics.getMatrixAt(time);
      InteractionMatrix.lastMatrixTick = time;
    }
  }
}
