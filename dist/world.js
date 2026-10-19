"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.World = void 0;
const humanAgent_1 = require("./agents/humanAgent");
const newAgent_1 = require("./agents/newAgent");
const nonhumanAgent_1 = require("./agents/nonhumanAgent");
const utils_1 = require("./utils/utils");
const DOMManager_1 = require("./GUI_DOM/DOMManager");
/**
 * The world is a collection of observers. If agents observe the world, it means that they are observing each other.
 * Observations could be self referenced, meaning that one agent can have a reflexive interaction
 */
class World {
    observers;
    ticks;
    colors;
    referenceModel;
    static permuLoader;
    // Boolean to registe if the permutations have been loaded
    static permutationsLoaded;
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
    subscribe(observer) {
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
    unsubscribe(observer) {
        this.observers = this.observers.filter((subscriber) => subscriber !== observer);
        // notify
        this.notifyObservers(this);
    }
    /**
     * Notifies all observers the latest version of this world
     * https://pawelgrzybek.com/the-observer-pattern-in-javascript-explained/
     */
    notifyObservers(world) {
        this.observers.forEach(function (element) {
            element.updateMyWorld(world);
        });
    }
    /**
     * Returns the collection of agents in the world. If 'exceptAgent' is provided, it returns the collection of agents except that agent
     * @param {Agent} exceptAgent If not undefined returns the collection of agents except this agent
     * @return the collection of agents in the world. If agent is not undefined returns the collection of agents except this agent
     */
    getAgents(exceptAgent) {
        if (exceptAgent) {
            return this.observers.filter((subscriber) => subscriber !== exceptAgent);
        }
        else {
            return this.observers;
        }
    }
    /**
     * Returns the collection of human agents in the world. If agent is not undefined returns the collection of human agents except this agent
     * @param {Agent} agent If agent is not undefined returns the collection of agents except this agent
     * @return the collection of agents in the world. If agent is not undefined returns the collection of agents except this agent
     */
    getHumans(agent) {
        if (agent) {
            return this.observers.filter((subscriber) => subscriber !== agent && (subscriber instanceof humanAgent_1.Human || subscriber instanceof newAgent_1.NewHuman));
        }
        else {
            return this.observers.filter((subscriber) => subscriber instanceof humanAgent_1.Human || subscriber instanceof newAgent_1.NewHuman);
        }
    }
    /**
     * Returns the collection of human agents in the world. If agent is not undefined returns the collection of human agents except this agent
     * @param {Agent} agent If agent is not undefined returns the collection of agents except this agent
     * @return the collection of agents in the world. If agent is not undefined returns the collection of agents except this agent
     */
    getLearningAgents(agent) {
        if (agent) {
            return this.observers.filter((subscriber) => subscriber !== agent && subscriber instanceof newAgent_1.NewHuman); //
        }
        else {
            return this.observers.filter((subscriber) => subscriber instanceof newAgent_1.NewHuman);
        }
    }
    /**
     * Returns the collection of nonhumn agents in the world. If agent is not undefined returns the collection of nonhuman agents except this agent
     * @param {Agent} agent If agent is not undefined returns the collection of agents except this agent
     * @return the collection of agents in the world. If agent is not undefined returns the collection of agents except this agent
     */
    getNonhumans(agent) {
        if (agent) {
            return this.observers.filter((subscriber) => subscriber !== agent && subscriber instanceof nonhumanAgent_1.Nonhuman);
        }
        else {
            return this.observers.filter((subscriber) => subscriber instanceof nonhumanAgent_1.Nonhuman);
        }
    }
    getAgentById(id) {
        return this.observers.find((subscriber) => subscriber.id === id);
    }
    /**
     * Calls interact() function on all world observers. It should be timed by a
     * Window setInterval() Method from the browser or the server.
     */
    runAgents(limit) {
        if (!limit) {
            limit = Infinity;
        }
        if (this.getTicks() < limit) {
            utils_1.Utils.startRecording(this.getTicks());
            for (var a = 0; a < this.observers.length; a++) {
                utils_1.Utils.recordData(this.observers[a]);
                this.observers[a].interact();
            }
            utils_1.Utils.endRecording();
            utils_1.Utils.clearRecorder();
            this.ticks++;
            DOMManager_1.DOM.labels.ticksInWorld.innerHTML = this.ticks;
        }
        else {
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
exports.World = World;
//# sourceMappingURL=world.js.map