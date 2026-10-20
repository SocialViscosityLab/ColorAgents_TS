"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Metrics = void 0;
const utils_1 = require("../utils/utils");
const abms_1 = require("../main/abms");
/**
 * Notes:
 * Urbana, USA, May 2019
 * 1. Social viscosity measures the evolution of where I am in contrast to where
 * I want to be in relation to all my interactants
 *
 * 2.Social viscosity measures the contrast between where I am and where I want
 * to be in relation to all my interactants over a period of time, i.e., the execution
 * of a task or a practice.
 *
 * Santa Marta, Colombia, June 2019
 * 3. Social viscosity is estimated by contrasting "where I am" with "where I intend
 * to be" in relation to all my interactants over the duration of an action, task or practice.
 *
 * The same could also be reframed:
 * 4. The viscosity of a social practice is estimated by contrasting the situation
 * agents "intended to be" with the situation they "ended" after the execution of
 * social actions. The definition os "situation" encompasses the interactions with
 * each interactant and with the world.
 *
 * Cali, Colombia, Sept 2026
 * This clase became Static because it makes easier to access its methods and properties from other classes.
 * It is not necessary to instantiate it. It has an initialize method to be invoked once the world is instantiated
 * and populated with agents in abms.initialize()
 */
class Metrics {
    static metricsMap;
    static agents;
    static learningAgents;
    static agentsViscosityData;
    static globalViscosityData;
    static agentsQualityData;
    static globalQualityData;
    /**To be invoked once the world is instantiated and the agents are created.
    It is used to set the static properties of this class.*/
    static initialize(humanAgents, learners) {
        console.log("Initializing static atttributes of the Metrics class");
        /** The metricsMap is a nested structure of key-value pairs. At the top of the
            structure there is a Map whose keys are timeStamps retrieved from the world's ticker. For
            each timeStamp there is a collection of all the interactions occurred at that
            moment organized by agents. Such inner collection is also a map of key-value
            pairs where the key is the agent and the pair is an array of interactions of that
            agent with all the others.
            */
        Metrics.metricsMap = new Map();
        Metrics.agents = humanAgents;
        Metrics.learningAgents = learners;
        // Map with key: agent value: anotherMap with key: time tick, value: viscosity
        Metrics.agentsViscosityData = new Map();
        // Map with key: time tick, value: viscosity
        Metrics.globalViscosityData = new Map();
        // Map with key: agent value: anotherMap with key: time tick, value: Quality
        Metrics.agentsQualityData = new Map();
        // Map with key: time tick, value: quality
        Metrics.globalQualityData = [];
        // Make the world accessible to the console
        window.metrics = Metrics;
    }
    /**
     * This function stores the data from agents interaction in the main collection named
     * metricsMap. It is recursively called from a browser's setInterval function controlled
     * in the main.js file.
     */
    static getMetricsData() {
        let innerMap = new Map();
        // Get interactions for each agent in current time
        for (let agent of Metrics.agents) {
            Metrics.getInteractions(innerMap, agent);
        }
        //save interactions for the current tick time.
        Metrics.metricsMap.set(abms_1.ABMS.globalWorld.getTicks(), innerMap);
        for (let agent of Metrics.agents) {
            Metrics.recordAgentViscosityData(agent);
        }
        for (let lAgent of Metrics.learningAgents ?? []) {
            Metrics.recordAgentQualityData(lAgent);
        }
        Metrics.recordGlobalQualityData();
        let vscsty = Metrics.recordGlobalViscosityData();
        document.getElementById("viscosityInWorld").innerHTML = vscsty.toFixed(2);
    }
    /**
     * Private. Records agent viscosity data at the current tick
     * @param  {Agent} agent The agent to record data from
     */
    static recordAgentViscosityData(agent) {
        let tmp = Metrics.agentsViscosityData.get(agent);
        let tmpTick = abms_1.ABMS.globalWorld.getTicks();
        if (!tmp) {
            let tmpInnerMap = new Map();
            tmpInnerMap.set(tmpTick, Metrics.viscosityAtFor(tmpTick, agent));
            Metrics.agentsViscosityData.set(agent, tmpInnerMap);
        }
        else {
            tmp.set(tmpTick, Metrics.viscosityAtFor(tmpTick, agent));
        }
    }
    /**
     * Private. Records agent Model's quality data at the current tick
     * @param  {Agent} agent The agent to record data from
     */
    static recordAgentQualityData(agent) {
        // Attempt to retrieve the guality data for the learning agent
        let tmp = Metrics.agentsQualityData.get(agent);
        /**IMPORTANT this time parameter is set to the previous tick (t-1) because the
         * quality recorded corresponds to the step just , not the current
         * CHECK THIS OUT!!!!!!! I AM NOT 100% sure.*/
        let tmpTick = abms_1.ABMS.globalWorld.getTicks() - 1;
        if (!tmp) {
            let tmpInnerMap = new Map();
            tmpInnerMap.set(tmpTick, [Metrics.qualityAtFor(tmpTick, agent)[0], Metrics.qualityAtFor(tmpTick, agent)[1]]);
            Metrics.agentsQualityData.set(agent, tmpInnerMap);
        }
        else {
            tmp.set(tmpTick, [Metrics.qualityAtFor(tmpTick, agent)[0], Metrics.qualityAtFor(tmpTick, agent)[1]]);
        }
    }
    /**
     * Private. Records global viscosity data at the current tick
     * @return  {Number} global Viscosity value at current tick
     */
    static recordGlobalViscosityData() {
        let tmp = Metrics.viscosityAt(abms_1.ABMS.globalWorld.getTicks());
        Metrics.globalViscosityData.set(abms_1.ABMS.globalWorld.getTicks(), tmp);
        return tmp;
    }
    /**
     * Private. Records global model's quality data at the current tick
     * @return  {Number} global models' quality value at current tick
     */
    static recordGlobalQualityData() {
        //Metrics.globalQualityData = []
        // for (let t = 0; t < world.getTicks(); t++) {
        let tmpTick = abms_1.ABMS.globalWorld.getTicks() - 1;
        Metrics.globalQualityData.push({ tick: tmpTick, qValue: Metrics.qualityAt(tmpTick)[0], rqValue: Metrics.qualityAt(tmpTick)[1] });
        // }
        //let tmpGQ = Metrics.qualityAt(ABMS.globalWorld.getTicks())[0];
        //let tmpRGQ = Metrics.qualityAt(ABMS.globalWorld.getTicks())[1];
        //Metrics.globalQualityData.set(ABMS.globalWorld.getTicks(), (tmpGQ, tmpRGQ));
        return Metrics.globalQualityData;
    }
    /**
     * Gets the interactions from the distancesMap of a given agent.
     * @param  {Map} innerMap The temporal innerMap storing the interactions occurred in a time tick
     * @param  {Agent} agent    The agent to which interactions want to be retrieved.
     */
    static getInteractions(innerMap, agent) {
        // retrieve agent's interactants
        let interactants = agent.retrieveInteractants();
        let interactions = [];
        // Iterate over its interactants 'i' at the previous time step
        for (let interactant of interactants) {
            let intendedDist;
            try {
                // Take the intendend distances in the previous time step to each interactant
                intendedDist = agent.distancesMap.get(interactant.agent.id).spatialMag;
            }
            catch (error) {
                // It might be the case that at the current time these agents start an
                // inteaction. Therefore there is no stored spatialMag in the previuos
                // time tick. In that case the intendedDist is set to 0.
                intendedDist = 0;
            }
            // Take the current distance to each 'i'
            let currentDist = utils_1.Utils.euclideanDist(agent, interactant.agent);
            // Calculate weighted difference
            let weightedDeltaDist = Math.abs((currentDist - intendedDist) / intendedDist);
            // If the intendedDist == 0 then the weightedDeltaDist will be infinite.
            // That does not make sense because it would mean that Agent estimated to
            // be infinitely far away from the interactant. Thus, weightedDeltaDist is set to 0
            if (!isFinite(weightedDeltaDist)) {
                weightedDeltaDist = 0;
            }
            // Timetag it and record interaction
            interactions.push({ interactant: interactant.agent.id, spatialMag: intendedDist, currentDist: currentDist, weightedDifference: weightedDeltaDist });
        }
        //  store the interactions with each agent
        innerMap.set(agent, interactions);
    }
    /**
     * Retrieves the array of interactions stored in an innerMap, which in turn is
     * stored inside the metricsMap. The time is a key used to retrieve the corresponding
     * innerMap, agent is a key used to retrieve the corresponding array from the innerMap.
     * @param  {Number} time  The tick number from the sequence of stored interactions
     * @param  {Agent} agent The agent from which the interactions are retrieve.
     * @return {Array} The array of interactions stored for a given agent.
     */
    static retrieveInteractionsAtFor(time, agent) {
        let rtn = Metrics.metricsMap.get(time).get(agent);
        if (!rtn) {
            console.log("Interactions array missed at time: " + time + " for agent " + agent.id);
        }
        return rtn;
    }
    /**
     * Retrieves the innerMap stored in the given key (time) from the metricsMap.
     * @param  {Number} time  The time tick of the sequence of stored interactions
     * @return {Map} The Map of interactions stored at the given time
     */
    static retrieveInteractionsAt(time) {
        if (abms_1.ABMS.globalWorld.getTicks() > 0) {
            let rtn = Metrics.metricsMap.get(time);
            if (!rtn) {
                console.log("Interaction map missed at time: " + time);
            }
            return rtn;
        }
    }
    /**
     * Calculates the viscosity for all agents at a given moment in time
     * @param  {Number} time The tick counter value representing the moment in time from which viscosity wants to be calculated
     * @return {Number}      The viscosity value at time tick
     */
    static viscosityAt(time) {
        // Get the innerMap of interactions at given time
        let interactions = Metrics.retrieveInteractionsAt(time);
        let accumulated = 0;
        try {
            // iterate over each agent
            interactions?.forEach((key, agent) => {
                accumulated += Metrics.viscosityAtFor(time, agent);
            });
            // average by agents
            accumulated = accumulated / interactions.size;
        }
        catch (error) {
            console.log("Interaction undefined at time " + time);
        }
        // return averaged result
        return accumulated;
    }
    /**
     * Calculates the quality for the model of all agents at a given moment in time
     * @param  {Number} time The tick counter value representing the moment in time from which model's quality wants to be calculated
     * @return {Number}      The models' quality value at time tick
     */
    static qualityAt(time) {
        // Get the innerMap of interactions at given time
        let modelsQuality = Metrics.getModelsAt(time);
        let generalQuality = 0;
        let generalRealQuality = 0;
        let accumulated = 0;
        let accumulatedReal = 0;
        try {
            // iterate over each agent
            modelsQuality.forEach((r) => {
                accumulated += r.qValue;
                accumulatedReal += r.rqValue;
            });
            // average by agents
            generalQuality = accumulated / modelsQuality.length;
            generalRealQuality = accumulatedReal / modelsQuality.length;
        }
        catch (error) {
            console.log("Interaction undefined at time " + time);
        }
        // return averaged result
        return [generalQuality, generalRealQuality];
    }
    /**
     * Calculates the agent's viscosity at a given moment in time
     * @param  {Number} time The tick counter value representing the moment in time from which viscosity wants to be calculated
     * @param  {Agent} agent  The agent whose viscosity wants to be calculated
     * @return {Number}       The agent's viscosity value at tick time
     */
    static viscosityAtFor(time, agent) {
        // Get the array of interactions at given time
        let interactions = Metrics.retrieveInteractionsAtFor(time, agent);
        let innerAccumulate = 0;
        // iterate over the interactants
        for (let interactant of interactions) {
            // accumulate the weightedDeltaDist
            innerAccumulate += interactant.weightedDifference;
        }
        // average by getInteractants
        if (innerAccumulate != 0 && interactions.length > 0) {
            innerAccumulate = innerAccumulate / interactions.length;
        }
        // return averaged result
        return innerAccumulate;
    }
    /**
     * Calculates the agent's model's quality at a given moment in time
     * @param  {Number} time The tick counter value representing the moment in time from which quality wants to be retrived
     * @param  {Agent} agent  The agent whose model's quality wants to be retrieved
     * @return {[number,number]}  The agent's model quality value at tick time
     */
    static qualityAtFor(time, agent) {
        let qualityRecord = Metrics.getModelsAt(time);
        let record = qualityRecord.find((r) => {
            return r.id == agent.id;
        });
        return [record.qValue, record.rqValue];
    }
    /**
     * Gets an array with the all the interactions at time tick.
     * Each entry has two pairs (id:agent.id, interactions:interactions) Interactions
     * is an array which entries are the interactions with these attributes:
     * currentDist, interactant, spatialMag, weightedDifference
     * @param  {Number} time The tick counter value representing the moment in time from which the matrix is composed
     * @return {Array}      The array of id:agent.id, interactions:interactions
     */
    static getMatrixAt(time) {
        let innerMap = Metrics.retrieveInteractionsAt(time);
        let rtn = [];
        if (abms_1.ABMS.globalWorld.getTicks() > 0) {
            try {
                innerMap?.forEach((interactions, agent) => {
                    rtn.push({ id: agent.id, interactions: interactions });
                });
            }
            catch (error) {
                console.log("Map collections not initialized at time " + time);
            }
        }
        return rtn;
    }
    /**
     * Gets the selected models for each learning agent at a specific
     * time tick
     */
    static getModelsAt(time) {
        let selectedModels = [];
        let lAs = abms_1.ABMS.globalWorld.getLearningAgents();
        if (abms_1.ABMS.globalWorld.getTicks() > 0) {
            lAs.forEach((lAgent) => {
                try {
                    let modelRecord = lAgent.selectedModels[time];
                    if (modelRecord) {
                        selectedModels.push({ id: lAgent.id, qValue: modelRecord.qValue, rqValue: utils_1.Utils.calculateModelRealQuality(abms_1.ABMS.globalWorld, lAgent.pdModels[modelRecord.model]), model: modelRecord.model });
                    }
                }
                catch (error) {
                    selectedModels.push({ id: lAgent.id, qValue: lAgent.qTable[lAgent.currentModelInx] ?? 0, rqValue: utils_1.Utils.calculateModelRealQuality(abms_1.ABMS.globalWorld, lAgent.pdModels[lAgent.cMentalModel.join(" ")]), model: lAgent.cMentalModel.join(" ") });
                }
            });
        }
        else {
            console.warn("simulation tick <= 0. Current tick:" + abms_1.ABMS.globalWorld.getTicks());
        }
        return selectedModels;
    }
}
exports.Metrics = Metrics;
//# sourceMappingURL=metrics.js.map