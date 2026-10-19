import { Agent } from "./agent";
import { AgentPair } from "../interfaces";
import { ColorValue } from "../interfaces";
import { ColorMentalModel } from "../mentalModels/cMentalModel";
import { SpatialMentalModel } from "../mentalModels/sMentalModel";
/**
Human agent. Extends Agent
@param {Number} x the x coordinate on canvas
@param {Number} y the y coordinate on canvas
@param {String} index the id of this agent
@param {ColorValue} theColor the color id of this agent.
@param {String} colorPalette the color palette used by this agent
@param {Number} shortest scalar used by spatial mental model to determine what on canvas
how near an agent wants to be from the most similar agent
@param {Number} farthest scalar used by spatial mental model to determine what on canvas
how far away an agent was to be from the most dissimilar agent
*/
export declare class Human extends Agent {
    cMentalModel: ColorMentalModel;
    sMentalModel: SpatialMentalModel;
    visualPerceptionAngle: number;
    farthest: number;
    radiusFactor: number;
    constructor(x: number, y: number, index: string, theColor: ColorValue, colorPalette: string, shortest: number, farthest: number);
    /**
      * Calls one interaction with other agents stored in its own collection of pairs.
      * It is usually used in recursive structures. In this case, this function follows these
      * steps:
      1) Record agent's current position,
      2) Store agent's last position before moving,
      3) Filter pairs with whom to interact according to user settings,
      4) If there is any interactant
      4.1) Estimate the magnitude of next step using this.calculateStep(),
      4.2) Verfiy if the change is worth to execute the movement. Threshold in user settings,
      4.3 Set the new bearing
      4.4) move or set done status to true.
      5) If no interactants
      5.1) Set done status to true.
      */
    interact(): void;
    /**
     * Estimate direction and magnitude of a step by adding the vectors towards each interactant
     * @param {Array} interactants the collection of interactans of this agent.
     * @return {p5.Vector} the vector
     */
    calculateStep(interactants: AgentPair[]): import("p5").default.Vector;
    /**
     * Retrieves a filtered subset of agents from the total set of pairs. By default it retrieves all of them
     *  @param {Array} agents The list of agents with whom this agent will interact. Agents in this list will be matched with
     *  this agent's list of pairs and set their {boolean} interactant parameter to TRUE.
     *  @return {Array} The list of "TRUE" interactants
     */
    retrieveInteractants(otherAgents?: AgentPair[]): AgentPair[];
}
//# sourceMappingURL=humanAgent.d.ts.map