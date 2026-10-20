import p5 from "p5";
import { Chart } from "../dataViz/chart.js";
import { AgentViscosityData, ViscosityPoint } from "../interfaces.js";
import { ABMS } from "./abms.js";
import { Agent } from "../agents/agent.js";
export declare class SegmentationChart {
    p5Instance: p5;
    chartTimeSeries: Chart | undefined;
    /** This map stores six numbers (three pairs of values) for each agent. The first pair is the
     * x,y coords of the segment start, the second the coords of the segment end, the third, the vector
     * resulting of substracting the end-start.
     */
    segments: Map<string, number[][]> | undefined;
    maxError: number;
    constructor(p5: p5);
    formatViscosityData(data: any[]): AgentViscosityData[];
    /**
     * This method is to be used importing a dataset
     * @param url must "data/viscosities.json"
     */
    loadJSON(urlJSON: string): any;
    draw(abms: ABMS): void;
    makeSegments(vPoints: ViscosityPoint[]): ViscosityPoint[][];
    plotSegments(segments: ViscosityPoint[][], vPoints?: ViscosityPoint[], agent?: Agent): void;
    /** This method returns an array of six numbers (three pairs of values) for each segment.
     * The first pair is the x,y coords of the segment start, the second the coords of the
     * segment end, the third, the vector resulting of substracting the end-start.
     */
    segmentsToVectors(sgmnts: ViscosityPoint[][]): number[][] | undefined;
    /** This method saves six numbers (three pairs of values) for each segment of the global viscosity.
     * The first pair is the x,y coords of the segment start, the second the coords of the
     * segment end, the third, the vector resulting of substracting the end-start.
     */
    segmentsToJSON_global(): void;
    /** This method saves six numbers (three pairs of values) for each segment of each agent's viscosity.
     * The first pair is the x,y coords of the segment start, the second the coords of the
     * segment end, the third, the vector resulting of substracting the end-start.
     */
    segmentsToJSON_each(): void;
}
//# sourceMappingURL=viscositySegmentation.d.ts.map