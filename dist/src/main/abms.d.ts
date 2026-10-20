import p5 from "p5";
import { World } from "../world";
import { VAgent } from "../visualAgents/vAgent";
export declare class ABMS {
    p5Instance: p5;
    static globalWorld: World;
    running: boolean;
    simulationInterval: number | undefined;
    metricsInterval: number | undefined;
    sweepSimulationInterval: number | undefined;
    sweepMetricsInterval: number | undefined;
    static vAgents: VAgent[];
    NA: number;
    constructor(p5: p5);
    initialize(): void;
    runSimulation(): void;
    runSimulationSweep(label: string): Promise<void>;
    /**
     * Asynch function that executes a series of simulation runs with the parameters given. The parameters are arrays containing
     * the conditions to be tested. The conditions are executed in the following order: 1) ColorFactory, 2)interaction rule
     * 3) range, 4) sensibility, 5) tolerance, 6) Number of runs.
     *
     * @param {Object} param Object containing key:value pairs where the keys must match these names: cFactory, rule, range,
     * sensibility, tolerance, runs. The corresponding values must be arrays of categorical parameters. In the case of continuous inputs,
     * such as sliders, the array of all steps from the min to the max value of the slider must be added. For convenience, the class
     * DOM has the abstract methods getListOptions() and getSliderParams() to retrieve all the categorical values of lists and sliders
     * from the HTML GUI elements.
     */
    runSweep(param: any): Promise<void>;
    trajectoriesToJSON(): void;
    trajectoriesToJSON2(): void;
    trajectoriesToCSV(label: string): void;
    draw(): void;
}
//# sourceMappingURL=abms.d.ts.map