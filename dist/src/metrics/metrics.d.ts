import { Human } from "../agents/humanAgent";
import { NewHuman } from "../agents/newAgent";
import { Agent } from "../agents/agent";
import { MatrixRow } from "../interfaces";
import { Interaction } from "../interfaces";
import { QualityRecord } from "../interfaces";
import { GlobalQualityRecord } from "../interfaces";
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
export declare class Metrics {
    static metricsMap: Map<number, Map<Agent, Interaction[]>>;
    static agents: Human[];
    static learningAgents: NewHuman[] | undefined;
    static agentsViscosityData: Map<Agent, Map<number, number>>;
    static globalViscosityData: Map<number, number>;
    static agentsQualityData: Map<NewHuman, Map<number, [number, number]>>;
    static globalQualityData: GlobalQualityRecord[];
    /**To be invoked once the world is instantiated and the agents are created.
    It is used to set the static properties of this class.*/
    static initialize(humanAgents: Human[], learners?: NewHuman[]): void;
    /**
     * This function stores the data from agents interaction in the main collection named
     * metricsMap. It is recursively called from a browser's setInterval function controlled
     * in the main.js file.
     */
    static getMetricsData(): void;
    /**
     * Private. Records agent viscosity data at the current tick
     * @param  {Agent} agent The agent to record data from
     */
    static recordAgentViscosityData(agent: Agent): void;
    /**
     * Private. Records agent Model's quality data at the current tick
     * @param  {Agent} agent The agent to record data from
     */
    static recordAgentQualityData(agent: NewHuman): void;
    /**
     * Private. Records global viscosity data at the current tick
     * @return  {Number} global Viscosity value at current tick
     */
    static recordGlobalViscosityData(): number;
    /**
     * Private. Records global model's quality data at the current tick
     * @return  {Number} global models' quality value at current tick
     */
    static recordGlobalQualityData(): GlobalQualityRecord[];
    /**
     * Gets the interactions from the distancesMap of a given agent.
     * @param  {Map} innerMap The temporal innerMap storing the interactions occurred in a time tick
     * @param  {Agent} agent    The agent to which interactions want to be retrieved.
     */
    static getInteractions(innerMap: Map<Human | NewHuman, Interaction[]>, agent: Human | NewHuman): void;
    /**
     * Retrieves the array of interactions stored in an innerMap, which in turn is
     * stored inside the metricsMap. The time is a key used to retrieve the corresponding
     * innerMap, agent is a key used to retrieve the corresponding array from the innerMap.
     * @param  {Number} time  The tick number from the sequence of stored interactions
     * @param  {Agent} agent The agent from which the interactions are retrieve.
     * @return {Array} The array of interactions stored for a given agent.
     */
    static retrieveInteractionsAtFor(time: number, agent: Agent): Interaction[] | undefined;
    /**
     * Retrieves the innerMap stored in the given key (time) from the metricsMap.
     * @param  {Number} time  The time tick of the sequence of stored interactions
     * @return {Map} The Map of interactions stored at the given time
     */
    static retrieveInteractionsAt(time: number): Map<Agent, Interaction[]> | undefined;
    /**
     * Calculates the viscosity for all agents at a given moment in time
     * @param  {Number} time The tick counter value representing the moment in time from which viscosity wants to be calculated
     * @return {Number}      The viscosity value at time tick
     */
    static viscosityAt(time: number): number;
    /**
     * Calculates the quality for the model of all agents at a given moment in time
     * @param  {Number} time The tick counter value representing the moment in time from which model's quality wants to be calculated
     * @return {Number}      The models' quality value at time tick
     */
    static qualityAt(time: number): [number, number];
    /**
     * Calculates the agent's viscosity at a given moment in time
     * @param  {Number} time The tick counter value representing the moment in time from which viscosity wants to be calculated
     * @param  {Agent} agent  The agent whose viscosity wants to be calculated
     * @return {Number}       The agent's viscosity value at tick time
     */
    static viscosityAtFor(time: number, agent: Agent): number;
    /**
     * Calculates the agent's model's quality at a given moment in time
     * @param  {Number} time The tick counter value representing the moment in time from which quality wants to be retrived
     * @param  {Agent} agent  The agent whose model's quality wants to be retrieved
     * @return {[number,number]}  The agent's model quality value at tick time
     */
    static qualityAtFor(time: number, agent: Agent): [number, number];
    /**
     * Gets an array with the all the interactions at time tick.
     * Each entry has two pairs (id:agent.id, interactions:interactions) Interactions
     * is an array which entries are the interactions with these attributes:
     * currentDist, interactant, spatialMag, weightedDifference
     * @param  {Number} time The tick counter value representing the moment in time from which the matrix is composed
     * @return {Array}      The array of id:agent.id, interactions:interactions
     */
    static getMatrixAt(time: number): MatrixRow[];
    /**
     * Gets the selected models for each learning agent at a specific
     * time tick
     */
    static getModelsAt(time: number): QualityRecord[];
}
//# sourceMappingURL=metrics.d.ts.map