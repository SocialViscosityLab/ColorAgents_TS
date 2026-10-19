import p5 from "p5";
import { DOM } from "../GUI_DOM/DOMManager";
import { World } from "../world";
import { ABMS } from "./abms";
import { Metrics } from "../metrics/metrics";
import { NewHuman } from "../agents/newAgent";
import { Human } from "../agents/humanAgent";
import { Agent } from "../agents/agent";
import { VAgent } from "../visualAgents/vAgent";

export class LearnedModels {
  p5Instance: p5;
  lastModel: any;
  lastModelTick = -1;
  learningAgents: NewHuman[] = [];
  tickSlider;

  constructor(p5: p5) {
    this.p5Instance = p5;
    this.tickSlider = DOM.sliders.ticks;
    this.loadAgents();
    DOM.buttons.reset.addEventListener("click", () => {
      this.loadAgents();
    });
    DOM.lists.cFactory.addEventListener("change", () => {
      this.loadAgents();
    });
    DOM.sliders.news.addEventListener("change", () => {
      this.loadAgents();
    });
  }

  // p5.setup = function() {
  //     p5.createCanvas(350, 475);

  // }

  loadAgents() {
    World.permuLoader.then(() => {
      this.learningAgents = ABMS.globalWorld.getLearningAgents();
    });
  }

  setLastModels(time: number) {
    if (time != this.lastModelTick) {
      this.lastModel = Metrics.getModelsAt(time);
      this.lastModelTick = time;
    }
  }

  resetLastModel() {
    this.lastModel = undefined;
  }

  draw(abms: ABMS) {
    this.p5Instance.draw = () => {
      this.p5Instance.background(220);
      if (!abms) return;
      this.p5Instance.noStroke();
      World.permuLoader.then((x) => {
        let arraySize = this.learningAgents.length;
        let margin = 25;
        let fontSize = 20;
        let modelHight = (this.p5Instance.height - margin * 2 - (margin * arraySize) / 4) / arraySize;
        let count = 0;

        this.learningAgents.forEach((learningAgent: NewHuman) => {
          if (this.lastModel != undefined) {
            if (this.lastModel.length > 0) {
              let register = this.lastModel.find((r: Human) => {
                return r.id == learningAgent.id;
              });
              // convert from string to array
              let model = register.model.split(" ");
              this.drawModel(model, learningAgent.id, learningAgent.colorValues?.value.rgb() ?? [0, 0, 0], count);
            } else {
              this.drawModel(learningAgent.cMentalModel, learningAgent.id, learningAgent.colorValues?.value.rgb() ?? [0, 0, 0], count);
            }
          } else {
            this.drawModel(learningAgent.cMentalModel, learningAgent.id, learningAgent.colorValues?.value.rgb() ?? [0, 0, 0], count);
          }
          count++;
        });
      });
    };
  }

  /**
   * model is an array of color names organized by the learning agent
   */
  drawModel(model: string[], learningAgentID: string, learningAgentColor: [number, number, number], idx: number = 1, fontSize: number = 20, margin?: number, modelHight?: number) {
    if (model.length > 0) {
      let x = this.p5Instance.width / 2;
      let y = this.p5Instance.height / (2 * this.learningAgents.length);
      let center = this.p5Instance.createVector(x, y + y * 2 * idx);
      let diam = 100 / this.learningAgents.length + this.p5Instance.height / (2 * this.learningAgents.length);
      let angle = this.p5Instance.TWO_PI / model.length;

      for (let c = 0; c < model.length; c++) {
        if (model[c] != "blanc") {
          let tempColor = ABMS.globalWorld.colors!.find((col) => {
            return col.name == model[c];
          });

          if (tempColor!.value) {
            this.p5Instance.fill(tempColor!.value.rgb());
          } else {
            this.p5Instance.noFill();
          }

          let xPos = Math.cos(c * angle) * diam;
          let yPos = Math.sin(c * angle) * diam;
          //this.p5Instance.ellipse(center.x + xPos, center.y + yPos, 30, 30);
          this.p5Instance.stroke(220);
          this.p5Instance.strokeWeight(10);
          this.p5Instance.arc(center.x, center.y, diam, diam, c * angle, (c + 1) * angle, this.p5Instance.PIE);
        }
      }

      // color name
      this.p5Instance.fill(220);
      this.p5Instance.stroke(220);
      this.p5Instance.strokeWeight(5);
      this.p5Instance.ellipse(center.x, center.y, diam - 60, diam - 60);
      const rgb: [number, number, number] = learningAgentColor;
      this.p5Instance.fill(this.p5Instance.color(...rgb));
      this.p5Instance.ellipse(center.x, center.y, 60, 60);
      this.p5Instance.noStroke();
      this.p5Instance.fill(0);
      this.p5Instance.textSize(fontSize);
      this.p5Instance.textAlign(this.p5Instance.CENTER, this.p5Instance.CENTER);
      this.p5Instance.text(learningAgentID, center.x, center.y);
    }
  }

  static drawModelOnAgent(p5: p5, vAgent: VAgent) {
    let agent = vAgent.agent;
    let model = Array.isArray(agent.cMentalModel) ? agent.cMentalModel : agent.cMentalModel.colorPalette;
    if (model.length > 0) {
      let x = vAgent.agent.pos.x;
      let y = vAgent.agent.pos.y;
      let center = p5.createVector(x, y);
      let box = 10;
      let segmentWidth = box / model.length;

      for (let c = 0; c < model.length; c++) {
        if (model[c] != "blanc") {
          const modelItem = model[c]!;
          const tempColor = typeof modelItem === "string" ? ABMS.globalWorld.colors?.find((color) => color.name === modelItem)?.value.rgb() : modelItem.value.rgb();

          if (tempColor) {
            p5.fill(tempColor);
          } else {
            p5.noFill();
          }

          p5.stroke(220);
          p5.strokeWeight(1);
          p5.rect(center.x + c * box, center.y +10, box, box);
          
        }
      }
    }
  }
}
