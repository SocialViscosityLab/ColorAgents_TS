import p5 from "p5";
import { Chart } from "../dataViz/chart.js";
import { ABMS } from "./abms.js";
export declare class QualityChart {
    p5Instance: p5;
    series: Chart;
    showIndividualSeries: boolean;
    constructor(p5: p5);
    plotIndividualSeries(): void;
    draw(abms: ABMS): void;
    modelsQualityToJSON(): void;
    globalModelQualityToJSON(fileName: string): void;
    globalModelQualityToCSV(): void;
}
//# sourceMappingURL=modelsQualityChart.d.ts.map