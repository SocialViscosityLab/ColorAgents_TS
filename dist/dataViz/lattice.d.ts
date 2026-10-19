export declare class Lattice {
    xLables: Map<string, number>;
    yLables: Map<string, number>;
    constructor(rowLables: string[], colLabels: string[], cellSize: number);
    setColCoords(labels: string[], cellSize: number): Map<string, number>;
    setRowCoords(labels: string[], cellSize: number): Map<string, number>;
    getXFor(label: string): number | undefined;
    getYFor(label: string): number | undefined;
}
//# sourceMappingURL=lattice.d.ts.map