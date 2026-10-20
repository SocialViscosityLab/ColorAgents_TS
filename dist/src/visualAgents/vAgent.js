"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VAgent = void 0;
const newAgent_1 = require("../agents/newAgent");
/**
 * General class to plot agents on a p5.js canvas. This follows the  model view-controller pattern
 */
class VAgent {
    p5;
    agent;
    /**
     * Visual Agent constructor
     * @param {p5} p5    An instance of p5.js
     * @param {Agent} agent An instance of Agent
     */
    constructor(agent, p5) {
        /** The p5.js instance*/
        this.p5 = p5;
        /** The agent instance*/
        this.agent = agent;
    }
    /**
     * Renders visual elements of this agent on screen
     */
    show() {
        const rgb = this.agent.colorValues.value.rgb();
        this.p5.fill(rgb[0], rgb[1], rgb[2], 10);
        // If my task is not completed to a satisfactory degree
        this.p5.stroke(rgb[0], rgb[1], rgb[2]);
        if (this.agent.iAmDone) {
            // thick stroke
            this.p5.stroke(this.agent.colorValues.value.rgb());
            this.p5.fill(rgb[0], rgb[1], rgb[2]);
        }
        // draw ellipse
        this.p5.ellipse(this.agent.pos.x, this.agent.pos.y, 6);
        // learning agent mark
        if (this.agent instanceof newAgent_1.NewHuman) {
            this.p5.ellipse(this.agent.pos.x, this.agent.pos.y, 12);
        }
        // black text
        this.p5.fill(rgb[0], rgb[1], rgb[2]);
        // print agent ID
        this.p5.noStroke();
        this.p5.textSize(10);
        this.p5.text(this.agent.id, this.agent.pos.x - 2, this.agent.pos.y - 11);
        this.p5.noFill();
        this.p5.stroke(this.agent.colorValues.value.rgb());
        this.p5.line(this.agent.pos.x, this.agent.pos.y, this.agent.pos.x + Math.cos(this.agent.bearing) * 10, this.agent.pos.y + Math.sin(this.agent.bearing) * 10);
    }
    /**
     * Shows the perception fields of agents
     */
    showPerceptionField() {
        // stroke color
        this.p5.stroke(this.agent.colorValues.value.rgb()[0], this.agent.colorValues.value.rgb()[1], this.agent.colorValues.value.rgb()[2], 50);
        // for radius
        if (document.getElementById("rule").value == "radius") {
            this.p5.ellipse(this.agent.pos.x, this.agent.pos.y, 2 * Number(document.getElementById("range").value) * this.agent.radiusFactor);
        }
        // for arcs
        if (document.getElementById("rule").value == "byField") {
            let radius = Number(document.getElementById("range").value) * this.agent.radiusFactor * 2;
            let nX = Math.cos(this.agent.bearing) * radius;
            let nY = Math.sin(this.agent.bearing) * radius;
            this.p5.fill(100, 5);
            this.p5.line(this.agent.lastPos.x, this.agent.lastPos.y, this.agent.pos.x + nX, this.agent.pos.y + nY);
            this.p5.arc(this.agent.lastPos.x, this.agent.lastPos.y, radius * 2, radius * 2, this.agent.bearing - this.agent.visualPerceptionAngle / 2, this.agent.bearing + this.agent.visualPerceptionAngle / 2, this.p5.PIE);
            this.p5.noFill();
        }
    }
    /**
     * Show links between this and other agents with whom it interacts
     */
    visualizeInteractions() {
        // for each pair
        for (let pair of this.agent.getHumanInteractants()) {
            // grey stroke
            this.p5.stroke(200, 70);
            // draw an edge connecting this agent and its pair
            this.p5.line(pair.agent.pos.x + 2, pair.agent.pos.y + 2, this.agent.pos.x, this.agent.pos.y);
        }
    }
    /**
     * Shows the trajectory
     */
    showTrajectory() {
        this.p5.stroke(this.agent.colorValues?.value.rgb()[0], this.agent.colorValues?.value.rgb()[1], this.agent.colorValues?.value.rgb()[2], 100);
        this.p5.noFill();
        this.p5.beginShape();
        for (let l of this.agent.locations) {
            this.p5.vertex(l.x, l.y);
        }
        this.p5.endShape();
    }
    showSteps(start = 0, end = this.agent.locations.length, weight = 3) {
        // make sure the end ans start are within array length boundarties
        if (end < start)
            start = end;
        if (start > this.agent.locations.length)
            start = this.agent.locations.length;
        if (end > this.agent.locations.length)
            end = this.agent.locations.length;
        this.p5.stroke(this.agent.colorValues?.value.rgb()[0], this.agent.colorValues?.value.rgb()[1], this.agent.colorValues?.value.rgb()[2], 80);
        this.p5.strokeWeight(weight);
        for (let i = start; i <= end; i++) {
            let pos = this.agent.locations[i];
            this.p5.point(pos?.x, pos?.y);
        }
        this.p5.strokeWeight(1);
    }
}
exports.VAgent = VAgent;
//# sourceMappingURL=vAgent.js.map