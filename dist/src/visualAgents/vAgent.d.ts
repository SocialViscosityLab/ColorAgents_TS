import { NewHuman } from "../agents/newAgent";
import { Human } from "../agents/humanAgent";
import p5 from "p5";
/**
 * General class to plot agents on a p5.js canvas. This follows the  model view-controller pattern
 */
export declare class VAgent {
    p5: p5;
    agent: Human | NewHuman;
    /**
     * Visual Agent constructor
     * @param {p5} p5    An instance of p5.js
     * @param {Agent} agent An instance of Agent
     */
    constructor(agent: Human | NewHuman, p5: p5);
    /**
     * Renders visual elements of this agent on screen
     */
    show(): void;
    /**
     * Shows the perception fields of agents
     */
    showPerceptionField(): void;
    /**
     * Show links between this and other agents with whom it interacts
     */
    visualizeInteractions(): void;
    /**
     * Shows the trajectory
     */
    showTrajectory(): void;
    showSteps(start?: number, end?: number, weight?: number): void;
}
//# sourceMappingURL=vAgent.d.ts.map