import p5 from "p5";
import { Lattice } from "./lattice.js";
import { InteractionDistance } from "../interfaces.js";
import { Agent } from "../agents/agent.js";
import { World } from "../world.js";
import { MatrixRow } from "../interfaces.js";
/**
 * This class serves to visualize interactions between agents in the form of a heatmap.
 * For each intersection of the underlying matrix, it shows two trianges: the lightness of
 * lower triangle shows the target distance estimated by the agent in the row. The
 * lightness of upper triangle shows the current distance.
 */
export declare class InteractionMatrixCanvas {
    p5: p5;
    agents: Agent[];
    size: number;
    lattice2: Lattice;
    /**
     * Constructor
     * @param {P5} p5    An instance of P5.js
     * @param {World} world An instance of the world
     */
    constructor(p5: p5, world: World);
    /**
     * Plots the heatmap at the coordinates at pos.
     * @param  {PVector} pos  Where on the canvas this heatmap is ploted
     * @param  {Array} rows Rows labels. If ommited it takes agents' ids
     * @param  {Array} cols Columns labels. If ommited it takes agents' ids
     */
    plot(pos: {
        x: number;
        y: number;
    }, rows?: unknown[], cols?: unknown[]): void;
    plot2(pos: {
        x: number;
        y: number;
    }, matrix: MatrixRow[]): void;
    /**
     * If two agents from the same world are in interaction, the proximity distance between those agents
     *  is returned
     * @param  {Agent} agentI [description]
     * @param  {Agent} agentJ [description]
     * @return {Number}        [description]
     */
    markInteraction(agentI: Agent, agentJ: Agent): InteractionDistance | undefined;
    /**
     * Adds labels to matrix
     * @param  {PVector} pos  Heatmap position on canvas
     * @param  {Array} rows Rows labels. If ommited it takes agents' ids
     * @param  {Array} cols Columns labels. If ommited it takes agents' ids
     */
    lattice(pos: {
        x: number;
        y: number;
    }, rows?: unknown[], cols?: unknown[]): void;
    getAgentlabels(agents: Agent[]): string[];
}
export default InteractionMatrixCanvas;
//# sourceMappingURL=interactionMatrixCanvas.d.ts.map