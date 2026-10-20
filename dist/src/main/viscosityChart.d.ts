import { Chart } from "../dataViz/chart.js";
import p5 from "p5";
export declare class ViscosityChart {
    p5Instance: p5;
    series: Chart;
    showIndividualSeries: boolean;
    constructor(p5: p5);
    showEachSeries(): void;
    draw(): void;
    viscositiesToJSON(): void;
    globalViscosityToJSON(): void;
    globalViscosityToCSV(): void;
}
//# sourceMappingURL=viscosityChart.d.ts.map