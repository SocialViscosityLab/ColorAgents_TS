/**
 * Class representing an axis in a chart, either horizontal or vertical, with methods to map values
 * to positions and plot the axis on the canvas.
 */
import type p5 from "p5";
export declare class Axis {
    isHorizontal: boolean;
    length: number;
    label: string;
    minValue: number;
    maxValue: number;
    step: number;
    pos?: p5.Vector;
    constructor(isHorizontal: boolean, length: number, minValue: number, maxValue: number, label: string);
    /**
     * Maps a value to a position on the axis.
     * @param {p5} p5
     * @param {number} val
     * @returns
     */
    mapPosition(p5: p5, val: number): number | undefined;
    /**
     * Plots the axis on the canvas.
     * @param {p5} p5
     * @param {Vector} pos
     */
    plot(p5: p5, pos: p5.Vector): void;
}
//# sourceMappingURL=axis.d.ts.map