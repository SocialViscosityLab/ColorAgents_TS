import p5 from "p5";
import { InteractionMatrixCanvas } from "../dataViz/interactionMatrixCanvas";
import { MatrixRow, Aid_Bid_Distance } from "../interfaces";
import { ABMS } from "./abms";
export declare class InteractionMatrix {
    p5Element: p5;
    static vizMatrixCanvas: InteractionMatrixCanvas;
    static lastMatrix: MatrixRow[] | undefined;
    static lastMatrixTick: number;
    constructor(p5Element: p5);
    interactionMatrixToJSON(): void;
    /**
     * Exports global viscosity to CSV. The file is saved in user's download folder
     * @param {*} simetrical True if the matrix need to be simmetrical. This MUST be tru when the interactions are not mutual, such as A sees B but B does not see A
     */
    interactionMatrixToCSV(symmetrical: boolean): void;
    pairInArray(pairA: Aid_Bid_Distance, pairs: Aid_Bid_Distance[]): boolean;
    printP5(a: number, b: number): void;
    initialize(): void;
    draw(abms: ABMS): void;
    static resetLastMatrix(): void;
    static setLastMatrix(time: number): void;
}
//# sourceMappingURL=interactionMatrix.d.ts.map