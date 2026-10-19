import { Agent } from "./agents/agent";
import { Human } from "./agents/humanAgent";
import { NewHuman } from "./agents/newAgent";
import { Nonhuman } from "./agents/nonhumanAgent";
import { ColorValue } from "./interfaces";
/**
 * The world is a collection of observers. If agents observe the world, it means that they are observing each other.
 * Observations could be self referenced, meaning that one agent can have a reflexive interaction
 */
export declare class World {
    observers: Agent[];
    ticks: number;
    colors: ColorValue[] | undefined;
    referenceModel: {
        [key: string]: number;
    } | undefined;
    static permuLoader: Promise<unknown>;
    static permutationsLoaded: boolean;
    /**
     * Constructor
     */
    constructor();
    /**
     * Subscribes an agent as observer to this world. https://pawelgrzybek.com/the-observer-pattern-in-javascript-explained/
     * @param {Agent} observer The agent that observes this world
     */
    subscribe(observer: Agent): void;
    /**
     * Unsubscribes an agent from this world. https://pawelgrzybek.com/the-observer-pattern-in-javascript-explained/
     * @param {Agent} agent If agent is not undefined returns the collection of agents except this agent
     */
    unsubscribe(observer: Agent): void;
    /**
     * Notifies all observers the latest version of this world
     * https://pawelgrzybek.com/the-observer-pattern-in-javascript-explained/
     */
    notifyObservers(world: World): void;
    /**
     * Returns the collection of agents in the world. If 'exceptAgent' is provided, it returns the collection of agents except that agent
     * @param {Agent} exceptAgent If not undefined returns the collection of agents except this agent
     * @return the collection of agents in the world. If agent is not undefined returns the collection of agents except this agent
     */
    getAgents(exceptAgent?: Agent): Agent[];
    /**
     * Returns the collection of human agents in the world. If agent is not undefined returns the collection of human agents except this agent
     * @param {Agent} agent If agent is not undefined returns the collection of agents except this agent
     * @return the collection of agents in the world. If agent is not undefined returns the collection of agents except this agent
     */
    getHumans(agent?: Agent): Human[];
    /**
     * Returns the collection of human agents in the world. If agent is not undefined returns the collection of human agents except this agent
     * @param {Agent} agent If agent is not undefined returns the collection of agents except this agent
     * @return the collection of agents in the world. If agent is not undefined returns the collection of agents except this agent
     */
    getLearningAgents(agent?: NewHuman): NewHuman[];
    /**
     * Returns the collection of nonhumn agents in the world. If agent is not undefined returns the collection of nonhuman agents except this agent
     * @param {Agent} agent If agent is not undefined returns the collection of agents except this agent
     * @return the collection of agents in the world. If agent is not undefined returns the collection of agents except this agent
     */
    getNonhumans(agent?: Nonhuman): Nonhuman[];
    getAgentById(id: string): Agent | undefined;
    /**
     * Calls interact() function on all world observers. It should be timed by a
     * Window setInterval() Method from the browser or the server.
     */
    runAgents(limit: number): true | undefined;
    /**
     * Clears the world's collection of observers
     */
    reset(): void;
    /**
     * Gets the elapsed number of ticks ran while the main interval function has been enabled
     *
     * @return {Number} The ellapsed number of ticks
     */
    getTicks(): number;
}
//# sourceMappingURL=world.d.ts.map