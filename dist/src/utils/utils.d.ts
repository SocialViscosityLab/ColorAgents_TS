import { Agent } from "../agents/agent";
import { AgentPair } from "../interfaces";
import { Human } from "../agents/humanAgent";
import { NewHuman } from "../agents/newAgent";
import { World } from "../world";
import { ViscosityPoint } from "../interfaces";
/**
 * Abstract class with utility functions
 */
export declare class Utils {
    static tmpLabels: string[];
    static tmpValues: number[];
    static returnValues: any;
    static startTime: Date | undefined;
    constructor();
    /**
     * Euclidean distance between this agent and other agent
     */
    static euclideanDist(agentA: Agent, agentB: Agent): number;
    /**
     * Adapted from Processing's map()
     */
    static dist(x1: number, y1: number, x2: number, y2: number): number;
    /**
     * Selects the euclidean closest n agents to this agent
     * @param {Agent} thisAgent the reference agent to which this function is applied
     * @param {Number} n the amount of agents to be retrieved
     * @param {Array} otherAgents the agents to validate if they are in front of this agent. If omited, the pairs of thisAgent are used
     * @return {Array} The top 'n' closest interactants
     */
    static chooseNClosest(thisAgent: Agent, n: number, otherAgents?: AgentPair[]): AgentPair[];
    /**
     * Choose the agents within a given radius around this agent
     * @param {Agent} thisAgent the reference agent to which this function is applied
     * @param {Number} r the lenght of the radius (scope) around this agent
     * @param {Array} otherAgents the agents to validate if they are in front of this agent. If omited, the pairs of thisAgent are used
     * @return {Array} The agents within the radius
     */
    static chooseByRadius(thisAgent: Agent, r: number, otherAgents: AgentPair[]): AgentPair[];
    /**
     * Choose the agents in front of this agent. 'In front' is defined by the bearing of this agent
     * @param {Agent} thisAgent the reference agent to which this function is applied
     * @param {Number} k the lenght of the radius scope or the amount of nearby agents to be retrieved
     * @param {Array} otherAgents the agents to validate if they are in front of this agent. If omited, the pairs of thisAgent are used
     * @return {Array} The agents within the perception field
     */
    static chooseByField(thisAgent: Human | NewHuman, k: number, otherAgents: AgentPair[]): AgentPair[];
    static setStartTime(): Date;
    static getExecutionTime(): number;
    /**
     * Calculate a model's quality based on the reference worlds model
     * @param {World} world the world in which the agents are interacting
     * @param {Object} evaluatedModel current featured Model of a learning agents
     * @param {Object} referenceModel Common featured Model in the word
     * @return {Float}  Quality value of the evaluated model based on the common featured model
     */
    static calculateModelRealQuality(world: World, evaluatedModel: {
        [key: string]: number;
    }): number;
    /**
     * Combine the agents in different orders to create possible color models
     * @param {Array} agents list of agents' ids
     * @return {Array} List of meaningful model permutations
     */
    static calculateCModelPermutations(agents: string[]): string[];
    /**
     * Combine the agents in different orders to create possible color models
     * @param {Array} agents list of agents' ids
     * @return {Array} List of meaningful model permutations
     */
    static calculateCModelPermutationSample(agents: string[]): Promise<unknown>;
    static startRecording(val: any): void;
    static recordData(val: any): void;
    static endRecording(): void;
    static getRecording(): unknown[];
    static clearRecorder(): void;
    static resetRecorder(): void;
    static modelQualityToCSV(fileName: string): void;
    static viscosityToCSV(fileName: string): void;
    static convertToViscosityPoint(data: Map<number, number>): ViscosityPoint[];
}
//# sourceMappingURL=utils.d.ts.map