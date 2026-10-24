import p5 from "p5";
import { World } from "../world";
import { VAgent } from "../visualAgents/vAgent";
import { DOM } from "../GUI_DOM/DOMManager";
import { ColorFactory } from "../colorFactory";
import { Utils } from "../utils/utils";
import { PermutationHandler } from "../utils/permutationHandler";
import { NewHuman } from "../agents/newAgent";
import { Human } from "../agents/humanAgent";
import { InteractionMatrix } from "./interactionMatrix";
import { Metrics } from "../metrics/metrics";
import { LearnedModels } from "./learnedModels";

export class ABMS {
  p5Instance: p5;

  static globalWorld: World;

  // Boolean variable to control the animation
  running: boolean;

  // This variable controls the simulation pace
  simulationInterval: number | undefined;

  // This variable controls the metrics pace
  metricsInterval: number | undefined;

  // This variable controls the sweep simulation pace
  sweepSimulationInterval: number | undefined;

  // This variable controls the sweep metrics pace
  sweepMetricsInterval: number | undefined;

  // The visual elements representing agents from the world
  static vAgents: VAgent[] = [];

  // Number of new agents
  NA: number;

  constructor(p5: p5) {
    console.log("Instantiating the ABMS class");
    this.p5Instance = p5;
    this.running = false;
    this.NA = 0;
    // set GUI elements
    DOM.buttons.run.onclick = this.runSimulation;
    // Event handlers are invoked with the button as `this`, not the ABMS instance.
    // Preserve the instance context so initialize() can access p5Instance and other fields.
    DOM.buttons.reset.onclick = () => this.initialize();
    DOM.buttons.runSweep.onclick = this.runSweep;
    DOM.buttons.resetSweep.onclick = () => this.initialize();
    DOM.lists.cFactory.addEventListener("change", () => {
      this.initialize();
    });
    DOM.sliders.news.addEventListener("change", () => {
      this.initialize();
    });
    DOM.buttons.trajectories_to_JSON.onclick = this.trajectoriesToJSON;
    DOM.buttons.trajectories_to_JSON2.onclick = this.trajectoriesToJSON2;
    DOM.buttons.trajectories_to_CSV.onclick = this.trajectoriesToCSV;

    // Create an agent for each color
    this.initialize();
  }

  initialize() {
    // Instantiate all the colors
    const cFactory = new ColorFactory(DOM.lists.cFactory.value);
    
    World.permuLoader = PermutationHandler.loadPermutations(DOM.lists.cFactory.value);

    // retrieve all the colors
    const colors = cFactory.getAll();

    // Set the number of new agents
    this.NA = DOM.sliders.news.value;

    // Instantiate the world
    ABMS.globalWorld = new World();

    // Make the world accessible to the console
    (window as typeof window & { world: World }).world = ABMS.globalWorld;

    // clear agents
    ABMS.globalWorld.reset();
    ABMS.globalWorld.colors = colors;
    ABMS.vAgents = [];

    // Randomly select a predefined number of colors
    let nAgentID = [];
    let idsBucket = [];
    for (let i = 0; i < colors.length; i++) {
      idsBucket.push(i);
    }
    for (let i = 0; i < this.NA; i++) {
      let randomIdx = Math.floor(Math.random() * idsBucket.length);
      nAgentID.push(idsBucket.splice(randomIdx, 1)[0]);
    }

    World.permuLoader.then((modelPermu) => {
      World.permutationsLoaded = true;
      for (let i = 0; i < colors.length; i++) {
        let x = Math.floor(Math.random() * this.p5Instance.width);
        let y = Math.floor(Math.random() * this.p5Instance.height);
        let agent;

        // Instantiate the agents whether a learning agent or a normal agent
        let farthestDistance = 100;
        if (nAgentID.includes(i)) {
          console.log("The learning agent is " + colors[i]!.name);
          agent = new NewHuman(x, y, colors[i]!.name, colors[i]!, 0, farthestDistance, modelPermu as string[]);
          ABMS.globalWorld.referenceModel = agent.getPerceivedColorDistanceFeatures(colors.map((a) => a.name));
        } else {
          agent = new Human(x, y, colors[i]!.name, colors[i]!, DOM.lists.cFactory.value, 0, farthestDistance);
        }

        ABMS.globalWorld.subscribe(agent);

        // for each agent instantiate a correspondng vAgent
        ABMS.vAgents.push(new VAgent(agent, this.p5Instance));
      }

      // Initialize the metrics class to calculate social viscosity and other metrics
      Metrics.initialize(ABMS.globalWorld.getHumans(), ABMS.globalWorld.getLearningAgents());

      Utils.setStartTime();

      Utils.resetRecorder();

      /** These are the labels for the world statistics displayed on the ABMS section */
      DOM.labels.agentsInWorld.innerHTML = ABMS.globalWorld.observers.length;
      DOM.labels.humansInWorld.innerHTML = ABMS.globalWorld.getHumans().length;
      DOM.labels.nonhumansInWorld.innerHTML = ABMS.globalWorld.getNonhumans().length;
      let newAgentsName = ABMS.globalWorld.getLearningAgents().map((a) => a.id);
      DOM.labels.learningAgent.innerHTML = newAgentsName.join(", ");
      DOM.buttons.runSweep.innerHTML = "Start Sweep Simulation";
      DOM.buttons.runSweep.style.backgrounColor = "rgb(162, 209, 162)";

      // reset the segmentation checkboxes
      DOM.resetGeneratedCheckboxes();
    });
    // Compute permuations
    // let modelPermu = calculatePermutations(colors)
  }

  //Function controlled by guy element that enables or disables the animation
  runSimulation() {
    if (World.permutationsLoaded) {
      this.running = !this.running;
      if (this.running) {
        // the max number of iterations the internal tick counter should get before stopping the simmulation
        let iterations;
        if (DOM.checkboxes.sweepDuration.checked) {
          iterations = DOM.sliders.duration.value;
        } else {
          iterations = Infinity;
        }

        // the interval controlling how often the world updates itself. Units in milliseconds
        let interval = DOM.sliders.tickLength.value;

        this.simulationInterval = setInterval(() => {
          ABMS.globalWorld.runAgents(iterations);
        }, interval);
        // calculate metrics
        this.metricsInterval = setInterval(() => {
          (Metrics.getMetricsData(), InteractionMatrix.setLastMatrix(ABMS.globalWorld.getTicks()));
        }, interval);
      } else {
        clearInterval(this.simulationInterval);
        clearInterval(this.metricsInterval);
      }

      // Update DOM element content
      if (this.running) {
        DOM.buttons.run.innerHTML = "Running";
        DOM.buttons.run.style.backgroundColor = "rgb(240, 162, 186)";
      } else {
        DOM.buttons.run.innerHTML = "On hold";
        DOM.buttons.run.style.backgroundColor = "rgb(162, 209, 162)";
      }
    }
  }

  //Function controlled by guy element that enables or disables the animation
  runSimulationSweep(label: string) {
    return new Promise<void>((resolve, reject) => {
      // the max number of iterations the internal tick counter should get before stopping the simmulation
      let iterations = DOM.sliders.duration.value;

      // the interval controlling how often the world updates itself. Units in milliseconds
      let interval = DOM.sliders.tickLength.value;

      // Change the GUI button
      DOM.buttons.runSweep.innerHTML = "Running: " + label;
      DOM.buttons.runSweep.style.backgroundColor = "rgb(240, 162, 186)";

      this.sweepSimulationInterval = setInterval(() => {
        ABMS.globalWorld.runAgents(iterations);
        if (ABMS.globalWorld.ticks == iterations) {
          //trajectoriesToCSV(label);
          Utils.modelQualityToCSV(label);
          Utils.viscosityToCSV(label);
          clearInterval(this.sweepSimulationInterval);
          clearInterval(this.sweepMetricsInterval);
          DOM.buttons.runSweep.innerHTML = "Completed";
          DOM.buttons.runSweep.style.backgroundColor = "rgb(204, 202, 133)";
          resolve();
        }
      }, interval);

      // calculate metrics
      this.sweepMetricsInterval = setInterval(() => {
        (Metrics.getMetricsData(), InteractionMatrix.setLastMatrix(ABMS.globalWorld.getTicks()));
      }, interval);
    });
  }

  /**
   * Asynch function that executes a series of simulation runs with the parameters given. The parameters are arrays containing
   * the conditions to be tested. The conditions are executed in the following order: 1) ColorFactory, 2)interaction rule
   * 3) range, 4) sensibility, 5) tolerance, 6) Number of runs.
   *
   * @param {Object} param Object containing key:value pairs where the keys must match these names: cFactory, rule, range,
   * sensibility, tolerance, runs. The corresponding values must be arrays of categorical parameters. In the case of continuous inputs,
   * such as sliders, the array of all steps from the min to the max value of the slider must be added. For convenience, the class
   * DOM has the abstract methods getListOptions() and getSliderParams() to retrieve all the categorical values of lists and sliders
   * from the HTML GUI elements.
   */
  async runSweep(param: any) {
    // This guarantees that each run has a time limit
    DOM.checkboxes.sweepDuration.checked = true;

    // If no parameters are provided, they are retrieved from the user input on the GUI interface
    if (param instanceof MouseEvent) {
      param = DOM.getSweepParams();
    }

    if (param instanceof Object) {
      // cFactory
      if (!param.cFactory) {
        param.cFactory = [DOM.lists.cFactory.value];
      }
      for (let i = 0; i < param.cFactory.length; i++) {
        let next0 = param.cFactory[i];
        // iRule
        if (!param.rule) {
          param.rule = [DOM.lists.rule.value];
        }
        for (let j = 0; j < param.rule.length; j++) {
          let next1 = param.rule[j];
          // scope
          if (!param.range) {
            param.range = [DOM.sliders.range.value];
          }
          for (let k = 0; k < param.range.length; k++) {
            let next2 = param.range[k];
            // sensibility
            if (!param.sensibility) {
              param.sensibility = [DOM.lists.sensibility.value];
            }
            for (let l = 0; l < param.sensibility.length; l++) {
              let next3 = param.sensibility[l];
              // tolerance
              if (!param.tolerance) {
                param.tolerance = [DOM.sliders.tolerance.value];
              }
              for (let m = 0; m < param.tolerance.length; m++) {
                let next4 = param.tolerance[m];
                for (let n = 0; n < param.rate.length; n++) {
                  let next5 = param.rate[n];
                  for (let s = 0; s < param.decreasing.length; s++) {
                    let next6 = param.decreasing[s];
                    for (let t = 0; t < param.exploration.length; t++) {
                      let next7 = param.exploration[t];
                      // number of repetitions
                      for (let u = 0; u < param.runs; u++) {
                        // Change DOM values for the condition values
                        DOM.lists.cFactory.value = next0;
                        DOM.lists.rule.value = next1;
                        DOM.sliders.range.value = next2;
                        DOM.lists.sensibility.value = next3;
                        DOM.sliders.tolerance.value = next4;
                        DOM.sliders.rate.value = next5;
                        DOM.sliders.decreasing.value = next6;
                        DOM.sliders.exploration.value = next7;
                        let event = new Event("change");
                        // Initialize all conditions
                        DOM.lists.cFactory.dispatchEvent(event);
                        // run the simulation IN A PROMISE
                        let currentRun = next0 + ", " + next1 + ", " + next2 + ", " + next3 + ", tole " + next4 + ", lRate " + next5 + ", decr " + next6 + ", expl " + next7 + ", run " + u;
                        await this.runSimulationSweep(currentRun);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      alert("Wrong parameter format for sweep run");
    }
  }

  trajectoriesToJSON() {
    let file: any = [];
    ABMS.globalWorld.getAgents().forEach((agent) => {
      file.push({ agent: agent.id, locations: agent.locations });
    });
    this.p5Instance.saveJSON(file, "trajectories.json");
  }

  trajectoriesToJSON2() {
    this.p5Instance.saveJSON(Utils.getRecording(), "trajectoriesV2.json", true);
  }

  trajectoriesToCSV(label: string) {
    if (!label || typeof label != "string") {
      label = "trajectoriesCSV.csv";
    }
    this.p5Instance.save(Utils.getRecording(), label);
    console.log("Saved: " + label);
  }

  draw() {
    this.p5Instance.draw = () => {
      this.p5Instance.background(50);

      if (World.permutationsLoaded) {
        // go over all the agents
        for (let a = 0; a < ABMS.vAgents.length; a++) {
          if (DOM.checkboxes.showAgents.checked) {
            ABMS.vAgents[a]?.show();
          }

          // show network
          if (DOM.checkboxes.showInteractions.checked) {
            ABMS.vAgents[a]?.visualizeInteractions();
          }

          //
          if (DOM.checkboxes.showPerceptionField.checked) {
            ABMS.vAgents[a]?.showPerceptionField();
          }

          // animate agents
          if (DOM.checkboxes.showTrajectories.checked) {
            ABMS.vAgents[a]?.showTrajectory();
          }

          // show steps
          if (DOM.checkboxes.showSteps.checked) {
            ABMS.vAgents[a]?.showSteps();
          }

          let mouseProximity = this.p5Instance.dist(this.p5Instance.mouseX, this.p5Instance.mouseY, ABMS.vAgents[a]!.agent.pos.x, ABMS.vAgents[a]!.agent.pos.y);

          if (mouseProximity < 10) {
            LearnedModels.drawModelOnAgent(this.p5Instance, ABMS.vAgents[a]!);
          }
        }
      }
    };
  }
}
