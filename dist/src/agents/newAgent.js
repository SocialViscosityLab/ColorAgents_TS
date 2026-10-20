"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewHuman = void 0;
const agent_1 = require("./agent");
const sMentalModel_1 = require("../mentalModels/sMentalModel");
const DOMManager_1 = require("../GUI_DOM/DOMManager");
const main_1 = require("../../main");
const utils_1 = require("../utils/utils");
/**
 * Creates instances of nonhuman agents. Extends Agent
 * @extends Agent
 */
class NewHuman extends agent_1.Agent {
    cMentalModel;
    sMentalModel;
    visualPerceptionAngle;
    farthest;
    radiusFactor;
    cModelPermutations;
    models;
    pdModels;
    currentModelInx;
    sensibility;
    a; /** The initial learning rate */
    c; /** Decreasing factor for the learning rate */
    rPlus; /** The optimistic value to asign to non-explored actions */
    NE; /** The minimum count of explorations for each model before the agent change to a greedy stategy*/
    /** Keeps a record for the interactants list */
    prevState;
    /** Keeps record of the expected result, and current the result */
    expectedResult; /** {red: NaN, org: NaN, yel: NaN, gre: NaN, pur: NaN} */
    interactantsRegister = {}; /** {gre: {…}, org: {…}, pur: {…}, red: {…}, yel: {…}} */
    /** List of qualities for each model */
    qTable;
    /** Matrix with the number of times each model has been explored */
    nTable;
    /** Register of the selected models and their ego-quality values */
    selectedModels;
    /**
     * Constructor
     * @param {Number} x            the x coordinate on canvas
     * @param {Number} y            the y coordinate on canvas
     * @param {String} index        the color's name of this agent
     * @param {ColorValue} theColor the color values of this agent
     * @param {Number} shortest     scalar used by spatial mental model to determine what on canvas how near an agent wants to be from the most similar agent
     * @param {Number} farthest     scalar used by spatial mental model to determine what on canvas how far away an agent was to be from the most dissimilar agent
     * @param {PermutationHandler} cModelPermutations the handler for the possible color mental model permutations
     */
    constructor(x, y, index, theColor, shortest, farthest, cModelPermutations) {
        super(x, y, index);
        /** This can be used to produce the color for theothers, but can't be perceived for the agent */
        this.colorValues = theColor;
        /** This agents' spacial Mental Model. This represents the unique way this agent perceives distances in the world*/
        this.sMentalModel = new sMentalModel_1.SpatialMentalModel(shortest, farthest);
        /** List of possible permutations for a color mentalmodel in the agent's context (including all the agents) */
        this.cModelPermutations = cModelPermutations;
        /** List of possible permutations for a color mental model in the agent's tick (include only the current interactants) */
        this.models;
        /** Features of the models based on the mental distance between the learning agent an the others */
        this.pdModels = {};
        /** Stores the active color mental model*/
        this.cMentalModel = [];
        /** Index of the active color mental model in the array of possible models*/
        this.currentModelInx = -1;
        /** Defines how agents perceive distances*/
        this.sensibility = DOMManager_1.DOM.lists.sensibility.value;
        DOMManager_1.DOM.lists.sensibility.addEventListener("change", () => {
            this.sensibility = DOMManager_1.DOM.lists.sensibility.value;
        });
        /** Visual perception angle in radians*/
        this.visualPerceptionAngle = (Math.PI * 3) / 4;
        // The lowest distance this agent starts perceiving something as far away. This is used in the alpha mapping
        // function of the visualization matrix
        this.farthest = farthest;
        // The amplification factor of interaction radius scope
        this.radiusFactor = 10;
        // ----> Metaparameters for learning
        /** The initial learning rate */
        this.a = DOMManager_1.DOM.sliders.rate.value;
        /** Decreasing factor for the learning rate */
        this.c = DOMManager_1.DOM.sliders.decreasing.value;
        /** The optimistic value to asign to non-explored actions */
        this.rPlus = 1;
        /** The minimum count of explorations for each model before the agent change to a greedy stategy*/
        this.NE = DOMManager_1.DOM.sliders.exploration.value;
        // ----> Records related to the learning process
        /** Keeps a record for the interactants list */
        this.prevState = "";
        /** Keeps record of the expected result, and current the result */
        this.expectedResult = {}; // {red: NaN, org: NaN, yel: NaN, gre: NaN, pur: NaN}
        this.interactantsRegister = {};
        /** List of qualities for each model */
        this.qTable;
        /** Matrix with the number of times each model has been explored */
        this.nTable;
        /** Register of the selected models and their ego-quality values */
        this.selectedModels = [];
    }
    /**
      * Calls one interaction with other agents stored in its own collection of pairs.
      * It is usually used in recursive structures. In this case, this function follows these
      * steps:
      1) Record agent's current position,
      2) Store agent's last position before moving,
      3) Filter pairs with whom to interact according to user settings,
      4) If there is any interactant
      ---> Here the learning is activated
      4.1) Estimate the magnitude of next step using this.calculateStep(),
      4.2) Verfiy if the change is worth to execute the movement. Threshold in user settings,
      4.3 Set the new bearing
      4.4) move or set done status to true.
      5) If no interactants
      5.1) Set done status to true.
      */
    interact() {
        // Store my current position
        this.locations.push(main_1.globalP5.createVector(this.pos.x, this.pos.y));
        // Store the last position before moving
        this.lastPos.set(this.pos);
        // get the interactants
        let interactants = this.retrieveInteractants();
        if (interactants.length > 0) {
            //After each training, the agent select a color mental model to use for its actions
            this.train(interactants);
            let nextPos = this.calculateStep(interactants);
            // Get change magnitude threshold using user settings
            let magnitudeThreshold = DOMManager_1.DOM.sliders.tolerance.value * (this.sMentalModel.farthest - this.sMentalModel.shortest);
            magnitudeThreshold += this.sMentalModel.shortest;
            // Verfiy if the change is worth to execute the movement
            if (nextPos.mag() > Number(magnitudeThreshold)) {
                this.bearing = nextPos.heading();
                this.iAmDone = false;
                // Move
                this.move(nextPos.mag(), nextPos.heading(), this.stepLengthFactor);
            }
            else {
                for (let r in this.expectedResult) {
                    this.expectedResult[r] = 0;
                }
                this.iAmDone = true;
            }
        }
        else {
            this.iAmDone = true;
        }
    }
    // -----------------> Beginning of learning methods
    /**
     * Create or updates the Q table to select the best candidate model to use
     * @param {Array} interactants the collection of interactans of this agent.
     */
    train(interactants) {
        //Initialize the candidate models and the rewards as empty arrays
        let modelCandidates = [];
        let rewards = [];
        // Generate an abstraction of the state and a set of pseudo-interactants defined by their ids(names) and positions
        let [state, pseudolInteractants] = this.getAbstractState(interactants);
        // Confirms if the interactant list changed to generate a new Tables with the new interactants
        if (state != this.prevState) {
            if (this.prevState == "") {
                this.qTable = this.createQTable(pseudolInteractants, false);
            }
            else {
                // If it is not the first evaluated state, the quality values in the old state are translated to the new q-table
                this.qTable = this.createQTable(pseudolInteractants, true);
            }
            this.nTable = new Array(this.qTable.length).fill(0);
        }
        //If there is already an expected result from the agent
        if (this.cMentalModel.length > 0 && state == this.prevState) {
            let result = this.getResult(interactants);
            //Calculate the reward based on the diference from the expectation to the actual result
            rewards = this.calculateInferedReward(result);
        }
        for (let m = 0; m < this.models.length; m++) {
            //The q-table is updated With the rewards
            if (rewards.length > 0) {
                let reward = rewards[m];
                if (reward != 0) {
                    this.nTable[m] = this.nTable[m] + 1;
                    //The q-table is updated
                    let alpha = Number(this.a) * (Number(this.c) / (Number(this.c) + this.nTable[m]));
                    this.qTable[m] = this.qTable[m] + alpha * reward;
                }
            }
            //Define the candidates values based on exploration vs explotation
            if (this.nTable[m] < Number(this.NE)) {
                modelCandidates.push(this.rPlus);
            }
            else {
                modelCandidates.push(this.qTable[m]);
            }
        }
        //Updates the registers
        this.prevState = state;
        this.interactantsRegister = pseudolInteractants;
        //Chose the candidate with the higher value as the current model
        this.currentModelInx = modelCandidates.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1]; //ArgMax form
        /** I changed the code here to follow data type compliance.
         * I get a color list from a new temporary instance of a ColorMentalModel
         */
        //console.log(this.models[this.currentModelInx])
        // const tmp = new ColorMentalModel(this.models![this.currentModelInx!]!, this.sensibility);
        this.cMentalModel = this.models[this.currentModelInx].split(" "); // tmp.getColorNames(); //this.models![this.currentModelInx!]!.split(" ");
        // console.log(this.qTable[this.currentModelInx])
        this.selectedModels.push({ model: this.models[this.currentModelInx], fModel: this.pdModels[this.models[this.currentModelInx]], qValue: this.qTable[this.currentModelInx] });
        //  console.log("N-Table")
        //  console.log(this.nTable)
        //  console.log("Q-Table")
        //  console.log(this.qTable)
    }
    /**
     * Converts the current interactants into an abstract state representation.
     *
     * The state is a space-separated, sorted list of interactant IDs. The
     * accompanying position map preserves each interactant's current
     * coordinates, keyed by its ID.
     *
     * @param {AgentPair[]} interactants Agents currently interacting with this agent.
     * @returns A tuple containing the sorted ID string and the position map.
     */
    getAbstractState(interactants) {
        let state = interactants.map((i) => i.agent.id);
        let smplInteractants = {};
        state.sort();
        state.forEach((a) => {
            let tempInt = interactants.find((i) => {
                let tempId = String(i.agent.id);
                return tempId == a;
            });
            smplInteractants[a] = { x: tempInt.agent.pos.x, y: tempInt.agent.pos.y };
        });
        return [state.join(" "), smplInteractants];
    }
    /**
     * reinterpret the agents' coordinates to identify if the interactants got farther
     * or closer to the agent.
     * @param {Object} interactants
     * @return {Object} Result, list of the "action" took for each agent respect this agent
     */
    getResult(interactants) {
        let result = {};
        for (let ir in this.interactantsRegister) {
            let currentDist = NaN;
            let prevDist = utils_1.Utils.dist(this.pos.x, this.pos.y, this.interactantsRegister[ir].x, this.interactantsRegister[ir].y);
            const interactant = interactants.find((i) => String(i.agent.id) === ir);
            if (interactant) {
                currentDist = utils_1.Utils.dist(this.pos.x, this.pos.y, interactant.agent.pos.x, interactant.agent.pos.y);
            }
            // If I can't find the interactant in my new list, It assumes it is now out of agents' range
            if (Number.isNaN(currentDist)) {
                result[ir] = -1;
            }
            else {
                result[ir] = Math.sign(prevDist - currentDist);
            }
        }
        return result;
    }
    /**
     * List each possible model tha the agente will consider and
     * Creates a list that will contain a quality value for each of the possible models.
     * @return {list} List with the quality values spaces
     */
    createQTable(sInteractants, hasLearned) {
        let models = [];
        let pdModels = {};
        this.cModelPermutations.forEach((permu) => {
            let tempModel = [];
            permu.split(" ").forEach((c) => {
                if (c in sInteractants || c == this.id) {
                    tempModel.push(c);
                }
                else {
                    tempModel.push("blanc");
                }
            });
            let tempModelS = tempModel.join(" ");
            if (!models.includes(tempModelS)) {
                models.push(tempModelS);
                pdModels[tempModelS] = this.getPerceivedColorDistanceFeatures(tempModel);
            }
        });
        let qualityList = new Array(models.length).fill(0);
        // If the agents has learned about models before
        if (hasLearned) {
            // The aggent takes the q-values from the previous explored models
            // And set the new models with similar characteristics that value
            for (let i = 0; i < models.length; i++) {
                let m = models[i];
                let nModel = pdModels[m];
                for (let j = 0; j < this.models.length; j++) {
                    let om = this.models[j];
                    let oModel = this.pdModels[om];
                    let equivalent = true;
                    if (!nModel) {
                        continue;
                    }
                    const oldFeatures = oModel;
                    const newFeatures = nModel;
                    for (let oc in oldFeatures) {
                        if (oc in newFeatures && oldFeatures[oc] != newFeatures[oc]) {
                            equivalent = false;
                        }
                    }
                    if (equivalent) {
                        qualityList[i] = this.qTable[j];
                        break;
                    }
                }
            }
        }
        this.models = models;
        this.pdModels = pdModels;
        // Pass an array of values to create a vector with the array dimensions.
        return qualityList;
    }
    /**
     * Calculates a reward based on two options
     * @param {Array} interactants the collection of interactans of this agent.
     * @return {Array} the representation of the state
     */
    calculateReward(result) {
        let reward = 0;
        //console.log(this.expectedResult)
        //console.log(result)
        if (Object.keys(this.expectedResult).length > 0) {
            for (let er in this.expectedResult) {
                if (!isNaN(this.expectedResult[er])) {
                    if (this.expectedResult[er] === result[er]) {
                        reward += 0.1;
                    }
                    else {
                        reward -= 0.1;
                    }
                }
            }
            return reward;
        }
    }
    /**
     * Calculates a reward based on two options
     * @param {Array} interactants the collection of interactans of this agent.
     * @return {Array} the representation of the state
     */
    calculateInferedReward(result) {
        let iReward = [];
        // Points given by each prediction
        const ppA = {};
        if (Object.keys(this.expectedResult).length > 0) {
            for (let er in this.expectedResult) {
                if (!isNaN(this.expectedResult[er])) {
                    if (this.expectedResult[er] === result[er]) {
                        ppA[er] = 0.01;
                    }
                    else {
                        ppA[er] = -0.01;
                    }
                }
            }
            let pdModel = this.pdModels[this.cMentalModel.join(" ")];
            for (let pdM in this.pdModels) {
                const tempPdM = this.pdModels[pdM];
                let tempReward = 0;
                for (let cpd in tempPdM) {
                    if (tempPdM[cpd] == pdModel[cpd] && !isNaN(ppA[cpd])) {
                        tempReward += ppA[cpd];
                    }
                }
                iReward.push(tempReward);
            }
            return iReward;
        }
    }
    /**
     * Calculates the perceived distance between this agent's color and a target color
     * based on their positions in the mental model color array and the agent's sensibility setting.
     * @deprecated See function with the same name in cMentalModel Class
     * @param targetColor - The target color to calculate distance to
     * @returns The calculated distance value (0 to 1), or undefined if indices are out of bounds
     */
    getPerceivedColorDistance(targetColor) {
        let indexA = this.cMentalModel.indexOf(this.id);
        let indexB = this.cMentalModel.indexOf(targetColor.name);
        if (indexA < this.cMentalModel.length && indexB < this.cMentalModel.length) {
            let delta = Math.abs(indexA - indexB);
            switch (this.sensibility) {
                case "linear":
                    return delta / (this.cMentalModel.length - 1);
                    break;
                case "chordal":
                    let subAngle = (Math.PI * 2) / this.cMentalModel.length;
                    let totalAngle = subAngle * delta;
                    if (totalAngle > Math.PI) {
                        totalAngle = Math.PI * 2 - totalAngle;
                    }
                    let distance = totalAngle / Math.PI;
                    return distance;
                    break;
                case "exponential":
                    return 1 - Math.pow(0.97, delta);
                    break;
            }
        }
        else {
            console.log("index value exceeds color array length");
        }
    }
    /**
     * Translate a color model to a list of attributes based on the distances between the curren agent and the others
     * @param {Array} color simple order list of the colors
     * @return {Object} list of value between 0 and 1, where 1 is the farthest perceived distance for each color in the model
     */
    getPerceivedColorDistanceFeatures(colorMentalModel) {
        let indexA = colorMentalModel.indexOf(this.id);
        let modelFeatures = {};
        for (let indexB = 0; indexB < colorMentalModel.length; indexB++) {
            if (indexB != indexA && colorMentalModel[indexB] != "blanc") {
                let delta = Math.abs(indexA - indexB);
                let perceivedColorDistance = 0;
                switch (this.sensibility) {
                    case "linear":
                        perceivedColorDistance = delta / (colorMentalModel.length - 1);
                        break;
                    case "chordal":
                        let subAngle = (Math.PI * 2) / colorMentalModel.length;
                        let totalAngle = subAngle * delta;
                        if (totalAngle > Math.PI) {
                            totalAngle = Math.PI * 2 - totalAngle;
                        }
                        let distance = totalAngle / Math.PI;
                        perceivedColorDistance = distance;
                        break;
                    case "exponential":
                        perceivedColorDistance = 1 - Math.pow(0.97, delta);
                        break;
                    default:
                        perceivedColorDistance = 0;
                        break;
                }
                modelFeatures[colorMentalModel[indexB]] = perceivedColorDistance;
            }
        }
        return modelFeatures;
    }
    //-------------------------> Common methods
    /**
     * Estimate direction and magnitude of a step by adding the vectors towards each interactant
     * @param {Array} interactants the collection of interactans of this agent.
     * @return {p5.Vector} the vector
     */
    calculateStep(interactants) {
        let vector;
        for (let i of interactants) {
            let interactant = i.agent;
            // Calculate vector magnitude
            // Use the mental model to calculate the perceived distance to each interactant
            let pdModel = this.pdModels[this.cMentalModel.join(" ")];
            let perceivedColorDistance = pdModel[interactant.id];
            /*
                  There are spatial distances between this agent's location and the interactants'
                  locations. Such distances may not correspond to this agent's perceived color
                  distance when converted into spatial distances. The result of mapping the
                  perceived color distance into a spatial distance is the spatial magnitude.
                  If the difference between the spatial magnitude and the spatial distance is
                  negative, this agent should get closer to the other agent, and viceversa.
      
                  This means that this agent should have a mechanism to 'transduce' perceived
                  color distance into the spatial distances. That is why we need a Spatial Mental
                  Model.
                  */
            let spatialMag = this.sMentalModel.mapMagnitude(perceivedColorDistance);
            //Calculate the current spatial distance
            let currentDist = utils_1.Utils.euclideanDist(this, interactant);
            //Calculate the difference between the spatialMagnitude and the actual spatial distance
            let deltaDist = currentDist - spatialMag;
            /** if the agents is farther than the farthest value,
             * the expectations about this agent is not considered in the evaluation of the model
             */
            if (currentDist > this.farthest) {
                this.expectedResult[interactant.id] = NaN;
            }
            else {
                // This will indicate if the agents expect that the specific interactant get closer or farther for it
                this.expectedResult[interactant.id] = Math.sign(deltaDist);
            }
            // Update distances. This could be done somewhere else, but here it saves the cost of iterating over all the interactants
            this.updateDistanceMap(interactant.id, spatialMag, currentDist);
            // for the first interactant
            if (!vector) {
                // Calculate the angle between this and the pair agent
                let tmp = Math.atan2(interactant.pos.y - this.pos.y, interactant.pos.x - this.pos.x);
                vector = main_1.globalP5.createVector(Math.cos(tmp) * deltaDist, Math.sin(tmp) * deltaDist);
            }
            else {
                let tmp = Math.atan2(interactant.pos.y - this.pos.y, interactant.pos.x - this.pos.x);
                let tmpV = main_1.globalP5.createVector(Math.cos(tmp) * deltaDist, Math.sin(tmp) * deltaDist);
                /** CHECk THIS message: When working with two vectors of different sizes, the smaller dimension is used.
                 * In this operation, both vector will be treated as 0D vectors, and any additional values of the linger
                 * vector will be ignored.
                 * I think this expalins why the learning agent stays at 'IAmDone' status quite often */
                vector.add(tmpV);
            }
        }
        if (vector == undefined) {
            return main_1.globalP5.createVector(0, 0);
        }
        else {
            return vector;
        }
    }
    /**
     * Retrieves the agents that should interact with this agent according to the
     * currently selected interaction rule and slider value.
     *
     * When no list is provided, this agent's complete pair list is used. The
     * selected rule may limit the result by proximity, radius, or field; the
     * resulting list is then filtered to include only marked interactants.
     *
     * @param otherAgents Optional agents to filter instead of this agent's pairs.
     * @returns The agents selected as interactants.
     */
    retrieveInteractants(otherAgents) {
        let agents;
        if (!otherAgents) {
            agents = this.getPairs();
        }
        else {
            agents = otherAgents;
        }
        // read the user choice
        let val = DOMManager_1.DOM.sliders.range;
        let interactants;
        switch (DOMManager_1.DOM.lists.rule.value) {
            case "nClosest":
                DOMManager_1.DOM.labels.sliderValue.innerHTML = val.value;
                interactants = utils_1.Utils.chooseNClosest(this, Number(val.value), agents);
                break;
            case "radius":
                DOMManager_1.DOM.labels.sliderValue.innerHTML = val.value * this.radiusFactor;
                interactants = utils_1.Utils.chooseByRadius(this, Number(val.value) * this.radiusFactor, agents);
                break;
            case "byField":
                DOMManager_1.DOM.labels.sliderValue.innerHTML = val.value * this.radiusFactor * 2;
                interactants = utils_1.Utils.chooseByField(this, Number(val.value) * this.radiusFactor * 2, agents);
                break;
            case "all":
                interactants = this.resetInteractants();
                break;
        }
        return interactants.filter(this.isInteractant);
    }
}
exports.NewHuman = NewHuman;
//# sourceMappingURL=newAgent.js.map