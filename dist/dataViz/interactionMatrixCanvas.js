"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionMatrixCanvas = void 0;
const lattice_js_1 = require("./lattice.js");
const humanAgent_js_1 = require("../agents/humanAgent.js");
const newAgent_js_1 = require("../agents/newAgent.js");
/**
 * This class serves to visualize interactions between agents in the form of a heatmap.
 * For each intersection of the underlying matrix, it shows two trianges: the lightness of
 * lower triangle shows the target distance estimated by the agent in the row. The
 * lightness of upper triangle shows the current distance.
 */
class InteractionMatrixCanvas {
    p5;
    // world: World;
    agents;
    size;
    lattice2;
    /**
     * Constructor
     * @param {P5} p5    An instance of P5.js
     * @param {World} world An instance of the world
     */
    constructor(p5, world) {
        console.log("Instantiating the InteractionMatrixCanvas class");
        // The p5.js instance
        this.p5 = p5;
        // the agents from the world
        this.agents = world.getAgents();
        // the matrix cell size
        this.size = (p5.width - 30) / this.agents.length;
        // lattice second version
        const agentLabels = this.getAgentlabels(world.getAgents());
        this.lattice2 = new lattice_js_1.Lattice(agentLabels, agentLabels, this.size);
    }
    /**
     * Plots the heatmap at the coordinates at pos.
     * @param  {PVector} pos  Where on the canvas this heatmap is ploted
     * @param  {Array} rows Rows labels. If ommited it takes agents' ids
     * @param  {Array} cols Columns labels. If ommited it takes agents' ids
     */
    plot(pos, rows, cols) {
        this.lattice(pos, rows, cols);
        //this.p5.stroke(0,20);
        this.p5.noFill();
        // iterate over rows
        for (var i = 0; i < this.agents.length; i++) {
            // I
            let agentI = this.agents[i];
            // y coordinate
            let yTemp = pos.y + i * this.size;
            // iterate over columns
            for (var j = 0; j < this.agents.length; j++) {
                // J
                let agentJ = this.agents[j];
                if (!agentI || !agentJ) {
                    continue;
                }
                // x coordinate
                let xTemp = pos.x + j * this.size + this.size + 10;
                // get the distance bewteen agent i and agent j
                let dist = this.markInteraction(agentI, agentJ);
                // if agents interact
                if ((dist && agentI instanceof humanAgent_js_1.Human) || agentI instanceof newAgent_js_1.NewHuman) {
                    let alphaMagnitude = this.p5.map(dist.spatialMag, 0, agentI.farthest, 0, 255);
                    let alphaDistance = this.p5.map(dist.currentDist, 0, agentI.farthest, 0, 255);
                    //this.p5.stroke(0,20);
                    // this color represents the ideal distance between agents
                    let tempColor = agentI.colorValues.value._rgb._unclipped;
                    console.log(tempColor);
                    this.p5.fill(tempColor[0], tempColor[1], tempColor[2], alphaMagnitude);
                    this.p5.fill(80, alphaMagnitude);
                    // Triangle below for desired distance
                    this.p5.triangle(xTemp, yTemp, xTemp, yTemp + this.size, xTemp + this.size, yTemp + this.size);
                    // this color represents the current distance between agents. The saturated the farther
                    this.p5.fill(tempColor[0], tempColor[1], tempColor[2], alphaDistance);
                    this.p5.fill(80, alphaDistance);
                    // Triangle above for current distance
                    this.p5.triangle(xTemp, yTemp, xTemp + this.size, yTemp, xTemp + this.size, yTemp + this.size);
                }
                else {
                    this.p5.noStroke();
                    this.p5.noFill();
                    this.p5.rect(xTemp, yTemp, this.size, this.size);
                }
            }
        }
    }
    plot2(pos, matrix) {
        this.lattice(pos);
        this.p5.noFill();
        // iterate over rows
        for (var i = 0; i < matrix.length; i++) {
            const row = matrix[i];
            if (!row) {
                continue;
            }
            let agentI = row.id;
            // y coordinate
            let yTemp = pos.y + (this.lattice2.getYFor(String(agentI)) ?? 0);
            // iterate over columns
            for (var j = 0; j < row.interactions.length; j++) {
                let interaction = row.interactions[j];
                if (!interaction) {
                    continue;
                }
                let agentJ = interaction.interactant;
                // x coordinate
                let xTemp = pos.x + (this.lattice2.getXFor(String(agentJ)) ?? 0);
                let alphaMagnitude = this.p5.map(interaction.spatialMag, 0, 100, 0, 255);
                let alphaDistance = this.p5.map(interaction.currentDist, 0, 100, 0, 255);
                // this color represents the ideal distance between agents
                this.p5.fill(80, alphaMagnitude);
                // Triangle below for desired distance
                this.p5.triangle(xTemp, yTemp, xTemp, yTemp + this.size, xTemp + this.size, yTemp + this.size);
                // this color represents the current distance between agents. The saturated the farther
                this.p5.fill(80, alphaDistance);
                // Triangle above for current distance
                this.p5.triangle(xTemp, yTemp, xTemp + this.size, yTemp, xTemp + this.size, yTemp + this.size);
            }
        }
    }
    /**
     * If two agents from the same world are in interaction, the proximity distance between those agents
     *  is returned
     * @param  {Agent} agentI [description]
     * @param  {Agent} agentJ [description]
     * @return {Number}        [description]
     */
    markInteraction(agentI, agentJ) {
        // get all the interactants
        let interactants = agentI.getInteractants();
        for (var i = 0; i < interactants.length; i++) {
            // Check if the given agent is in the list of interactants
            if (interactants[i].agent.id === agentJ.id) {
                // return the distances
                return agentI.distancesMap.get(agentJ.id);
            }
        }
    }
    /**
     * Adds labels to matrix
     * @param  {PVector} pos  Heatmap position on canvas
     * @param  {Array} rows Rows labels. If ommited it takes agents' ids
     * @param  {Array} cols Columns labels. If ommited it takes agents' ids
     */
    lattice(pos, rows, cols) {
        // rows
        this.p5.fill(0, 80);
        this.p5.noStroke();
        this.p5.textSize(9);
        for (var i = 0; i < this.agents.length; i++) {
            if (!rows) {
                this.p5.textAlign(this.p5.RIGHT, this.p5.CENTER);
                this.p5.text(this.agents[i].id, pos.x - 2, pos.y + i * this.size + this.size / 2);
            }
        }
        // columns
        this.p5.textAlign(this.p5.LEFT, this.p5.CENTER);
        for (var i = 0; i < this.agents.length; i++) {
            if (!cols) {
                this.p5.push();
                this.p5.translate(pos.x + i * this.size + this.size / 2, pos.y - 2);
                this.p5.rotate(-Math.PI / 2);
                this.p5.text(this.agents[i].id, 0, 0);
                this.p5.pop();
            }
        }
    }
    getAgentlabels(agents) {
        let labels = [];
        for (var i = 0; i < agents.length; i++) {
            labels.push(String(agents[i].id));
        }
        return labels;
    }
}
exports.InteractionMatrixCanvas = InteractionMatrixCanvas;
exports.default = InteractionMatrixCanvas;
//# sourceMappingURL=interactionMatrixCanvas.js.map