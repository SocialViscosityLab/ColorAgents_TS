import p5 from "p5";
import { ColorValue } from "../interfaces";
import { globalP5 } from "../main/main";
import { InteractionDistance } from "../interfaces";
import {World} from "../world"
import { AgentPair } from "../interfaces";



/**
 * The primary class to define an agent situated in a cartesian space.
 */
export class Agent {
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
  constructor(x: number, y: number, id: string) {
    /** Unique {String} identifier for this agent */
    this.id = id;

    /** A {p5.Vector} storing current x and y */
    this.pos = globalP5.createVector(x, y);

    /**  A color defined as {name, chroma} */
    this.colorValues = undefined;

    /** Array with all the locations where this agent has been */
    this.locations = [];

    /** Map with key: interactant id, and value: an object with spatialMag:the
        latest spatialmagnitude , and currentDist:the current distance to all other agents */
    this.distancesMap = new Map();

    /** The {p5.Vector} position previously stored at this.pos before this.pos was updated*/
    this.lastPos = globalP5.createVector(x, y);

    /** The direction this agent is pointing towards, i.e., its bearing*/
    //this.bearing = 0;
    // By default agents bearing points towards the center of the world
    this.bearing = globalP5.createVector(globalP5.width / 2 - x, globalP5.height / 2 - y).heading();

    /** A map storing pairs of {agent}agent: {boolean}interactant.*/
    this.pairs = [];

    /** This boolean variable defines when this agent feels "comfortable" with its current situation in the
        world in relation to ALL its interactants. It is used to control when this agents stops or resumes interactions*/
    this.iAmDone = false;

    //Factor of movement for viscosity
    this.stepLengthFactor = 0.01;
  }

  /**
   * Adds an agent to the list of interactants of this agent
   * @param {[Agent]} a [Agent to be added]
   * @param {[Boolean]} i [Whether the given agent interacts or not with this agent]
   */
  addPair(a: Agent, i: boolean) {
    this.pairs.push({ agent: a, interactant: i });
  }

  /**
   * Sets TRUE to all interactant fields of agents stored in this.pairs
   */
  resetInteractants() {
    for (let p of this.pairs) {
      p.interactant = true;
    }
    return this.pairs;
  }

  /**
   * Get all pairs
   * @return {[Array]} [All pairs of this agent]
   */
  getPairs() {
    return this.pairs;
  }

  /**
   * Wheter or not the given element interacts with this agent
   * @param  {[Agent]}  element [description]
   * @return {Boolean}         [description]
   */
  isInteractant(element: AgentPair) {
    return element.interactant == true;
  }

  /**
   * Wheter or not the given element interacts with this agent AND is an instance of Human
   * @param  {[Agent]}  element [description]
   * @return {Boolean}         [description]
   */
  isHumanInteractant(element: AgentPair) {
    // Use the runtime class name instead of importing subclasses. Importing
    // them here creates a circular dependency because they extend Agent.
    const agentType = element.agent.constructor.name;
    return element.interactant == true &&
      (agentType === "Human" || agentType === "NewHuman");
  }

  /**
   * Wheter or not the given element interacts with this agent AND is an isntance of Nonhuman
   * @param  {[Agent]}  element [description]
   * @return {Boolean}         [description]
   */
  isNonhumanInteractant(element: AgentPair) {
    return element.interactant == true && element.agent.constructor.name === "Nonhuman";
  }

  /**
   * Returns all the interactants set to TRUE in the collection of pairs
   * @return {[Array]} [description]
   */
  getInteractants() {
    return this.pairs.filter(this.isInteractant);
  }

  /**
   * Returns all the Human interactants in the collection of pairs
   * @return {[Array]} [description]
   */
  getHumanInteractants() {
    return this.pairs.filter(this.isHumanInteractant);
  }

  /**
   * Returns all the Nonhuman interactants in the collection of pairs
   * @return {[Array]} [description]
   */
  getNonhumanInteractants() {
    return this.pairs.filter(this.isNonhumanInteractant);
  }

  /**
   * Returns TRUE if the given agent is a pair of this agent
   * @param  {[Agent]} agent [description]
   * @return {[Boolean]}       [description]
   */
  pairsWith(agent: Agent) {
    for (let i = 0; i < this.pairs.length; i++) {
      if (this.pairs[i]!.agent.id == agent.id) {
        return true;
      }
    }
    return false;
  }

  /**
   * The observer notify() function renamed as updateMyWorld. Instances of this class observe an instance of the world class
   * https://pawelgrzybek.com/the-observer-pattern-in-javascript-explained/
   */
  updateMyWorld(world: World) {
    // The world has changed!!! Update all the references to the world
    for (let h of world.getHumans(this)) {
      if (!this.pairsWith(h)) {
        this.addPair(h, false);
      }
    }
  }

  /**
    Moves closer or away from the position of the other agent
    @param  dist the magnitude of the displacement
    @param  angle the direction of this movement
    */
  move(dist: number, angle: number, stepLengthFactor: number) {
    //****** ESTO ES UNA CHAMBONADA *******/
    /** SE DEBE REVISAR COMO SE CALCULA LA LONGITUD DEL PASO PARA
     * COMPENSAR LA SUMA DE VECTORES HECHA EN newAgent.js: calculateStep().
     */
    //let mappedStep = mainP5.map(dist, 0, 200, 0, stepLengthFactor * 100)

    // Get step in x
    var stepX = Math.cos(angle) * dist * stepLengthFactor;
    // Get step in y
    var stepY = Math.sin(angle) * dist * stepLengthFactor;
    // move forward in x & y
    this.pos.x += stepX;
    this.pos.y += stepY;
  }

  /**
   *Moves to the new position
   *@param {p5.Vector} vector the vector to be added to this agent's position
   */
  move2(vector: p5.Vector) {
    this.pos.add(vector);
  }

  /**
   * Updates the map of spatial magnitudes and pixel distances between this
   * agent and other agent identified by its id
   * @param  {String} id          Other agent's ID
   * @param  {Number} spatialMag  This agent's percived spatial magnitud to other's agent
   * @param  {Number} currentDist Current distance between this and other agent
   * @deprecated
   */
  updateDistanceMap(id: string, spatialMag: number, currentDist: number) {
    this.distancesMap.set(id, { spatialMag: spatialMag, currentDist: currentDist });
  }

  // To be defined by this class' hiers
  interact(){}
}
