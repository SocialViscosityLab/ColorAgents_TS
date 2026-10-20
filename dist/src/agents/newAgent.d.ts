import { ColorValue } from "../interfaces";
import { Agent } from "./agent";
import { AgentPair } from "../interfaces";
import { SpatialMentalModel } from "../mentalModels/sMentalModel";
import { ExpectedResult } from "../interfaces";
import { InteractantsRegister } from "../interfaces";
import { SelectedModel } from "../interfaces";
/**
 * Creates instances of nonhuman agents. Extends Agent
 * @extends Agent
 */
export declare class NewHuman extends Agent {
    cMentalModel: string[];
    sMentalModel: SpatialMentalModel;
    visualPerceptionAngle: number;
    farthest: number;
    radiusFactor: number;
    cModelPermutations: string[];
    models: string[] | undefined;
    pdModels: Record<string, Record<string, number>>;
    currentModelInx: number | undefined;
    sensibility: string;
    a: string; /** The initial learning rate */
    c: string; /** Decreasing factor for the learning rate */
    rPlus: number; /** The optimistic value to asign to non-explored actions */
    NE: string; /** The minimum count of explorations for each model before the agent change to a greedy stategy*/
    /** Keeps a record for the interactants list */
    prevState: string;
    /** Keeps record of the expected result, and current the result */
    expectedResult: ExpectedResult; /** {red: NaN, org: NaN, yel: NaN, gre: NaN, pur: NaN} */
    interactantsRegister: InteractantsRegister; /** {gre: {…}, org: {…}, pur: {…}, red: {…}, yel: {…}} */
    /** List of qualities for each model */
    qTable: number[] | undefined;
    /** Matrix with the number of times each model has been explored */
    nTable: number[] | undefined;
    /** Register of the selected models and their ego-quality values */
    selectedModels: SelectedModel[];
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
    constructor(x: number, y: number, index: string, theColor: ColorValue, shortest: number, farthest: number, cModelPermutations: string[]);
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
    interact(): void;
    /**
     * Create or updates the Q table to select the best candidate model to use
     * @param {Array} interactants the collection of interactans of this agent.
     */
    train(interactants: AgentPair[]): void;
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
    getAbstractState(interactants: AgentPair[]): [string, InteractantsRegister];
    /**
     * reinterpret the agents' coordinates to identify if the interactants got farther
     * or closer to the agent.
     * @param {Object} interactants
     * @return {Object} Result, list of the "action" took for each agent respect this agent
     */
    getResult(interactants: AgentPair[]): {
        [key: string]: number;
    };
    /**
     * List each possible model tha the agente will consider and
     * Creates a list that will contain a quality value for each of the possible models.
     * @return {list} List with the quality values spaces
     */
    createQTable(sInteractants: InteractantsRegister, hasLearned: boolean): any[];
    /**
     * Calculates a reward based on two options
     * @param {Array} interactants the collection of interactans of this agent.
     * @return {Array} the representation of the state
     */
    calculateReward(result: ExpectedResult): number | undefined;
    /**
     * Calculates a reward based on two options
     * @param {Array} interactants the collection of interactans of this agent.
     * @return {Array} the representation of the state
     */
    calculateInferedReward(result: ExpectedResult): number[] | undefined;
    /**
     * Calculates the perceived distance between this agent's color and a target color
     * based on their positions in the mental model color array and the agent's sensibility setting.
     * @deprecated See function with the same name in cMentalModel Class
     * @param targetColor - The target color to calculate distance to
     * @returns The calculated distance value (0 to 1), or undefined if indices are out of bounds
     */
    getPerceivedColorDistance(targetColor: ColorValue): number | undefined;
    /**
     * Translate a color model to a list of attributes based on the distances between the curren agent and the others
     * @param {Array} color simple order list of the colors
     * @return {Object} list of value between 0 and 1, where 1 is the farthest perceived distance for each color in the model
     */
    getPerceivedColorDistanceFeatures(colorMentalModel: string[]): {
        [key: string]: number;
    };
    /**
     * Estimate direction and magnitude of a step by adding the vectors towards each interactant
     * @param {Array} interactants the collection of interactans of this agent.
     * @return {p5.Vector} the vector
     */
    calculateStep(interactants: AgentPair[]): import("p5").default.Vector;
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
    retrieveInteractants(otherAgents?: AgentPair[]): AgentPair[];
}
//# sourceMappingURL=newAgent.d.ts.map