"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
const isEqual_1 = __importDefault(require("lodash/isEqual"));
const permutationHandler_1 = require("./permutationHandler");
const main_1 = require("../main/main");
const js_combinatorics_1 = require("js-combinatorics");
// import { globalWorld } from "../main/main";
const metrics_1 = require("../metrics/metrics");
/**
 * Abstract class with utility functions
 */
class Utils {
    static tmpLabels = [];
    static tmpValues = [];
    static returnValues = [];
    static startTime;
    // This constructor is not needed, but it is here because the documentation generatior requires it to format the documentation
    constructor() { }
    /**
     * Euclidean distance between this agent and other agent
     */
    static euclideanDist(agentA, agentB) {
        return Utils.dist(agentA.pos.x, agentA.pos.y, agentB.pos.x, agentB.pos.y);
    }
    /**
     * Adapted from Processing's map()
     */
    static dist(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }
    /**
     * Selects the euclidean closest n agents to this agent
     * @param {Agent} thisAgent the reference agent to which this function is applied
     * @param {Number} n the amount of agents to be retrieved
     * @param {Array} otherAgents the agents to validate if they are in front of this agent. If omited, the pairs of thisAgent are used
     * @return {Array} The top 'n' closest interactants
     */
    static chooseNClosest(thisAgent, n, otherAgents) {
        let pairs;
        if (!otherAgents) {
            pairs = thisAgent.getPairs();
        }
        else {
            pairs = otherAgents;
        }
        let tempCollection = [];
        // calculate distance to all the pairs
        for (let i of pairs) {
            let proximity;
            if (!("agent" in i)) {
                proximity = Utils.euclideanDist(thisAgent, i);
            }
            else {
                proximity = Utils.euclideanDist(thisAgent, i.agent);
            }
            tempCollection.push({ pair: i, prox: proximity });
        }
        // sort them by proximity
        tempCollection.sort(function (a, b) {
            return a.prox - b.prox;
        });
        // sets the upper limit of n
        if (n > pairs.length) {
            n = pairs.length;
        }
        // reset all the agents
        for (let a of pairs) {
            a.interactant = false;
        }
        // enable the top N
        for (let i = 0; i < n; i++) {
            for (let a of pairs) {
                /** COMMENT THIS */
                // console.log(tempCollection[i]?.pair.agent);
                // console.log(a.agent);
                // console.log(isEqual(a.agent, tempCollection[i]?.pair.agent));
                if ((0, isEqual_1.default)(a.agent, tempCollection[i]?.pair.agent)) {
                    a.interactant = true;
                }
            }
        }
        return pairs;
    }
    /**
     * Choose the agents within a given radius around this agent
     * @param {Agent} thisAgent the reference agent to which this function is applied
     * @param {Number} r the lenght of the radius (scope) around this agent
     * @param {Array} otherAgents the agents to validate if they are in front of this agent. If omited, the pairs of thisAgent are used
     * @return {Array} The agents within the radius
     */
    static chooseByRadius(thisAgent, r, otherAgents) {
        let pairs;
        if (!otherAgents) {
            pairs = thisAgent.getPairs();
        }
        else {
            pairs = otherAgents;
        }
        // calculate distance to all the pairs
        for (let i of pairs) {
            let proximity = Utils.euclideanDist(thisAgent, i.agent);
            if (proximity <= r) {
                i.interactant = true;
            }
            else {
                i.interactant = false;
            }
        }
        return pairs;
    }
    /**
     * Choose the agents in front of this agent. 'In front' is defined by the bearing of this agent
     * @param {Agent} thisAgent the reference agent to which this function is applied
     * @param {Number} k the lenght of the radius scope or the amount of nearby agents to be retrieved
     * @param {Array} otherAgents the agents to validate if they are in front of this agent. If omited, the pairs of thisAgent are used
     * @return {Array} The agents within the perception field
     */
    static chooseByField(thisAgent, k, otherAgents) {
        let pairs;
        if (!otherAgents) {
            pairs = thisAgent.getPairs();
        }
        else {
            pairs = otherAgents;
        }
        //filter interactants by perception scope
        pairs = this.chooseByRadius(thisAgent, k, pairs);
        for (let a of pairs) {
            if (a.interactant == true) {
                let angleBetween = Math.atan2(a.agent.pos.y - thisAgent.pos.y, a.agent.pos.x - thisAgent.pos.x);
                if (thisAgent.bearing - thisAgent.visualPerceptionAngle / 2 < angleBetween && angleBetween < thisAgent.bearing + thisAgent.visualPerceptionAngle / 2) {
                    a.interactant = true;
                }
                else {
                    a.interactant = false;
                }
            }
        }
        return pairs;
    }
    static setStartTime() {
        return (this.startTime = new Date());
    }
    static getExecutionTime() {
        var currentTime = new Date();
        var timeDiff = currentTime.getTime() - this.startTime.getTime(); //in ms
        // strip the ms
        timeDiff /= 1000;
        // get seconds
        var seconds = Math.round(timeDiff);
        return seconds;
    }
    /**
     * Calculate a model's quality based on the reference worlds model
     * @param {World} world the world in which the agents are interacting
     * @param {Object} evaluatedModel current featured Model of a learning agents
     * @param {Object} referenceModel Common featured Model in the word
     * @return {Float}  Quality value of the evaluated model based on the common featured model
     */
    static calculateModelRealQuality(world, evaluatedModel) {
        let referenceModel = world.referenceModel;
        let quality = 0;
        if (Object.keys(evaluatedModel).length > 0) {
            for (let c in evaluatedModel) {
                if (evaluatedModel[c] === referenceModel[c]) {
                    quality += 0.01;
                }
                else {
                    quality -= 0.01;
                }
            }
        }
        return quality;
    }
    /**
     * Combine the agents in different orders to create possible color models
     * @param {Array} agents list of agents' ids
     * @return {Array} List of meaningful model permutations
     */
    static calculateCModelPermutations(agents) {
        let permutations = [];
        let cmbs = (0, js_combinatorics_1.permutation)(agents).toArray();
        cmbs.forEach((cmb) => {
            let invModel = cmb.reverse().join(" ");
            if (!permutations.includes(invModel)) {
                permutations.push(cmb.reverse().join(" "));
            }
        });
        return permutations;
    }
    /**
     * Combine the agents in different orders to create possible color models
     * @param {Array} agents list of agents' ids
     * @return {Array} List of meaningful model permutations
     */
    static calculateCModelPermutationSample(agents) {
        let permutations = [];
        // Promise
        var permuProm = new Promise(function (resolve, reject) {
            let p = new permutationHandler_1.PermutationHandler(agents.length, 2, 10);
            let samples = p.permutations;
            // the higher that it goes with n=20 is depth = 4 and samples = 10
            console.log(p.size());
            console.log(p.density());
            samples.forEach((sample) => {
                let tempS = sample.split(" ").map((x) => agents[Number(x)]);
                let invModel = tempS.reverse().join(" ");
                if (!permutations.includes(invModel)) {
                    permutations.push(tempS.reverse().join(" "));
                }
            });
            if (permutations.length > 0) {
                //console.log(permutations)
                resolve(permutations);
            }
            else {
                var reason = new Error("no permutations");
                reject(reason); // reject
            }
        });
        return permuProm;
    }
    // DATA RECORDER
    static startRecording(val) {
        this.tmpLabels.push("tick");
        this.tmpValues.push(val);
    }
    static recordData(val) {
        this.tmpLabels.push(val.id + "_x");
        this.tmpLabels.push(val.id + "_y");
        this.tmpValues.push(val.pos.x);
        this.tmpValues.push(val.pos.y);
    }
    static endRecording() {
        this.returnValues.splice(0, 1, this.tmpLabels);
        this.returnValues.push(this.tmpValues);
    }
    static getRecording() {
        return Array.from(this.returnValues);
    }
    static clearRecorder() {
        this.tmpLabels = [];
        this.tmpValues = [];
    }
    static resetRecorder() {
        this.clearRecorder();
        this.returnValues = [];
    }
    // Exports global viscosity to CSV. The file is saved in user's download folder
    static modelQualityToCSV(fileName) {
        let file = [];
        // first iterator
        for (let t = 0; t < metrics_1.Metrics.globalQualityData.length; t++) {
            const qualityRecord = metrics_1.Metrics.globalQualityData[t];
            file.push([t, qualityRecord.qValue, qualityRecord.rqValue]);
        }
        main_1.globalP5.save(file, fileName + "_quality.csv");
    }
    // Exports global viscosity to CSV. The file is saved in user's download folder
    static viscosityToCSV(fileName) {
        let file = [];
        // first iterator
        let itr = metrics_1.Metrics.globalViscosityData.entries();
        let item = itr.next();
        while (!item.done) {
            file.push([item.value[0], item.value[1]]);
            item = itr.next();
        }
        main_1.globalP5.save(file, fileName + "_viscosity.csv");
    }
    static convertToViscosityPoint(data) {
        let rtn = [];
        if (data) {
            data.forEach((value, key) => {
                const point = value;
                if (point) {
                    rtn.push({ key, value });
                }
            });
        }
        return rtn;
    }
}
exports.Utils = Utils;
//# sourceMappingURL=utils.js.map