import { Agent } from "./agents/agent";
import { Human } from "./agents/humanAgent";
import { NewHuman } from "./agents/newAgent";
import { Nonhuman } from "./agents/nonhumanAgent";
import { ColorValue } from "./interfaces";
import { Utils } from "./utils/utils";
import { DOM } from "./GUI_DOM/DOMManager";
import { ABMS } from "./main/abms";
/**
 * The world is a collection of observers. If agents observe the world, it means that they are observing each other.
 * Observations could be self referenced, meaning that one agent can have a reflexive interaction
 */
export class World {
  observers: Agent[];
  ticks: number;
  colors: ColorValue[] | undefined;
  referenceModel: { [key: string]: number } | undefined;
  static permuLoader: Promise<unknown>;
  // Boolean to registe if the permutations have been loaded
  static permutationsLoaded: boolean;

  /**
   * Constructor
   */
  constructor() {
    this.observers = [];
    this.ticks = 0;
    this.colors;
    this.referenceModel;
  }

  /**
   * Subscribes an agent as observer to this world. https://pawelgrzybek.com/the-observer-pattern-in-javascript-explained/
   * @param {Agent} observer The agent that observes this world
   */
  subscribe(observer: Agent) {
    //if (observer instanceof Human || observer instanceof Nonhuman){
    this.observers.push(observer);
    // notify
    this.notifyObservers(this);
    //}
  }

  /**
   * Unsubscribes an agent from this world. https://pawelgrzybek.com/the-observer-pattern-in-javascript-explained/
   * @param {Agent} agent If agent is not undefined returns the collection of agents except this agent
   */
  unsubscribe(observer: Agent) {
    this.observers = this.observers.filter((subscriber) => subscriber !== observer);
    // notify
    this.notifyObservers(this);
  }

  /**
   * Notifies all observers the latest version of this world
   * https://pawelgrzybek.com/the-observer-pattern-in-javascript-explained/
   */
  notifyObservers(world: World) {
    this.observers.forEach(function (element) {
      element.updateMyWorld(world);
    });
  }

  /**
   * Returns the collection of agents in the world. If 'exceptAgent' is provided, it returns the collection of agents except that agent
   * @param {Agent} exceptAgent If not undefined returns the collection of agents except this agent
   * @return the collection of agents in the world. If agent is not undefined returns the collection of agents except this agent
   */
  getAgents(exceptAgent?: Agent) {
    if (exceptAgent) {
      return this.observers.filter((subscriber) => subscriber !== exceptAgent);
    } else {
      return this.observers;
    }
  }

  /**
   * Returns the collection of human agents in the world. If agent is not undefined returns the collection of human agents except this agent
   * @param {Agent} agent If agent is not undefined returns the collection of agents except this agent
   * @return the collection of agents in the world. If agent is not undefined returns the collection of agents except this agent
   */
  getHumans(agent?: Agent): Human[] {
    if (agent) {
      return this.observers.filter((subscriber): subscriber is Human => subscriber !== agent && (subscriber instanceof Human || subscriber instanceof NewHuman));
    } else {
      return this.observers.filter((subscriber): subscriber is Human => subscriber instanceof Human || subscriber instanceof NewHuman);
    }
  }

  /**
   * Returns the collection of human agents in the world. If agent is not undefined returns the collection of human agents except this agent
   * @param {Agent} agent If agent is not undefined returns the collection of agents except this agent
   * @return the collection of agents in the world. If agent is not undefined returns the collection of agents except this agent
   */
  getLearningAgents(agent?: NewHuman): NewHuman[] {
    if (agent) {
      return this.observers.filter((subscriber): subscriber is NewHuman => subscriber !== agent && subscriber instanceof NewHuman); //
    } else {
      return this.observers.filter((subscriber): subscriber is NewHuman => subscriber instanceof NewHuman);
    }
  }

  /**
   * Returns the collection of nonhumn agents in the world. If agent is not undefined returns the collection of nonhuman agents except this agent
   * @param {Agent} agent If agent is not undefined returns the collection of agents except this agent
   * @return the collection of agents in the world. If agent is not undefined returns the collection of agents except this agent
   */
  getNonhumans(agent?: Nonhuman): Nonhuman[] {
    if (agent) {
      return this.observers.filter((subscriber) => subscriber !== agent && subscriber instanceof Nonhuman);
    } else {
      return this.observers.filter((subscriber) => subscriber instanceof Nonhuman);
    }
  }

  getAgentById(id: string): Agent | undefined {
    return this.observers.find((subscriber) => subscriber.id === id);
  }

  /**
   * Calls interact() function on all world observers. It should be timed by a
   * Window setInterval() Method from the browser or the server.
   */
  runAgents(limit: number) {
    if (!limit) {
      limit = Infinity;
    }
    if (this.getTicks() < limit) {
      Utils.startRecording(this.getTicks());
      for (var a = 0; a < this.observers.length; a++) {
        Utils.recordData(this.observers[a]);
        this.observers[a]!.interact();
      }
      Utils.endRecording();
      Utils.clearRecorder();
      this.ticks++;
      DOM.labels.ticksInWorld.innerHTML = this.ticks;
    } else {
      // At run completion
      return true;
    }
  }

  /**
   * Clears the world's collection of observers
   */
  reset() {
    this.observers = [];
    this.ticks = 0;
  }

  /**
   * Gets the elapsed number of ticks ran while the main interval function has been enabled
   *
   * @return {Number} The ellapsed number of ticks
   */
  getTicks() {
    return this.ticks;
  }
}
