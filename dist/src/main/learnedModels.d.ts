import p5 from "p5";
import { ABMS } from "./abms";
import { NewHuman } from "../agents/newAgent";
import { VAgent } from "../visualAgents/vAgent";
export declare class LearnedModels {
    p5Instance: p5;
    lastModel: any;
    lastModelTick: number;
    learningAgents: NewHuman[];
    tickSlider: any;
    constructor(p5: p5);
    loadAgents(): void;
    setLastModels(time: number): void;
    resetLastModel(): void;
    draw(abms: ABMS): void;
    /**
     * model is an array of color names organized by the learning agent
     */
    drawModel(model: string[], learningAgentID: string, learningAgentColor: [number, number, number], idx?: number, fontSize?: number, margin?: number, modelHight?: number): void;
    static drawModelOnAgent(p5: p5, vAgent: VAgent): void;
}
//# sourceMappingURL=learnedModels.d.ts.map