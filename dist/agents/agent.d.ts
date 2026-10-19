import p5 from "p5";
import { ColorValue } from "../interfaces";
import { InteractionDistance } from "../interfaces";
import { World } from "../world";
import { AgentPair } from "../interfaces";
/**
 * The primary class to define an agent situated in a cartesian space.
 */
export declare class Agent {
    /** Unique identifier for this agent */
    id: string;
    /** A color defined as {name, chroma} */
    colorValues: ColorValue | undefined;
    /** Array with all the locations where this agent has been */
    locations: p5.Vector[];
    /** Spatial magnitudes and distances to other agents, keyed by agent ID */
    distancesMap: Map<string, InteractionDistance>;
    pos: p5.Vector;
    lastPos: p5.Vector;
    /** The direction this agent is pointing towards, i.e., its bearing */
    bearing: number;
    pairs: AgentPair[];
    /** This boolean variable defines when this agent feels "comfortable" with its current situation in the world in relation to ALL its interactants. It is used to control when this agents stops or resumes interactions */
    iAmDone: boolean;
    /** Factor of movement for viscosity */
    stepLengthFactor: number;
    /**
     * Instantiates an agent in a cartesian space
     * @param {Number} x  A location on x axis
     * @param {Number} y  A location on y axis
     * @param {String} id A unique identifier
     */
    constructor(x: number, y: number, id: string);
    /**
     * Adds an agent to the list of interactants of this agent
     * @param {[Agent]} a [Agent to be added]
     * @param {[Boolean]} i [Whether the given agent interacts or not with this agent]
     */
    addPair(a: Agent, i: boolean): void;
    /**
     * Sets TRUE to all interactant fields of agents stored in this.pairs
     */
    resetInteractants(): AgentPair[];
    /**
     * Get all pairs
     * @return {[Array]} [All pairs of this agent]
     */
    getPairs(): AgentPair[];
    /**
     * Wheter or not the given element interacts with this agent
     * @param  {[Agent]}  element [description]
     * @return {Boolean}         [description]
     */
    isInteractant(element: AgentPair): boolean;
    /**
     * Wheter or not the given element interacts with this agent AND is an instance of Human
     * @param  {[Agent]}  element [description]
     * @return {Boolean}         [description]
     */
    isHumanInteractant(element: AgentPair): boolean;
    /**
     * Wheter or not the given element interacts with this agent AND is an isntance of Nonhuman
     * @param  {[Agent]}  element [description]
     * @return {Boolean}         [description]
     */
    isNonhumanInteractant(element: AgentPair): boolean;
    /**
     * Returns all the interactants set to TRUE in the collection of pairs
     * @return {[Array]} [description]
     */
    getInteractants(): AgentPair[];
    /**
     * Returns all the Human interactants in the collection of pairs
     * @return {[Array]} [description]
     */
    getHumanInteractants(): AgentPair[];
    /**
     * Returns all the Nonhuman interactants in the collection of pairs
     * @return {[Array]} [description]
     */
    getNonhumanInteractants(): AgentPair[];
    /**
     * Returns TRUE if the given agent is a pair of this agent
     * @param  {[Agent]} agent [description]
     * @return {[Boolean]}       [description]
     */
    pairsWith(agent: Agent): boolean;
    /**
     * The observer notify() function renamed as updateMyWorld. Instances of this class observe an instance of the world class
     * https://pawelgrzybek.com/the-observer-pattern-in-javascript-explained/
     */
    updateMyWorld(world: World): void;
    /**
      Moves closer or away from the position of the other agent
      @param  dist the magnitude of the displacement
      @param  angle the direction of this movement
      */
    move(dist: number, angle: number, stepLengthFactor: number): void;
    /**
     *Moves to the new position
     *@param {p5.Vector} vector the vector to be added to this agent's position
     */
    move2(vector: p5.Vector): void;
    /**
     * Updates the map of spatial magnitudes and pixel distances between this
     * agent and other agent identified by its id
     * @param  {String} id          Other agent's ID
     * @param  {Number} spatialMag  This agent's percived spatial magnitud to other's agent
     * @param  {Number} currentDist Current distance between this and other agent
     * @deprecated
     */
    updateDistanceMap(id: string, spatialMag: number, currentDist: number): void;
    interact(): void;
}
//# sourceMappingURL=agent.d.ts.map