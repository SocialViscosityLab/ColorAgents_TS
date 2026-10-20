/**
 * Class for creating a chart with x and y axes, plotting points, paths, vertical lines,
 * and displaying text values at specific keys.
 */
import type p5 from "p5";
import { ViscosityPoint } from "../interfaces";
import { Axis } from "./axis";
export declare class Chart {
    /**
     *
     * @param {p5} p5 the p5 renderer
     * @param {Object} pos the position of the chart
     * @param {number} lengthX the length of the x-axis
     * @param {number} lengthY the length of the y-axis
     * @param {Array} valX the values for the x-axis
     * @param {string} dependentVariable the dependent variable for the y-axis
     * @param {number} minValY the minimum value for the y-axis
     * @param {number} maxValY the maximum value for the y-axis
     */
    p5: p5;
    xAxis: Axis;
    yAxis: Axis;
    pos: p5.Vector;
    constructor(p5: p5, pos: p5.Vector, lengthX: number, lengthY: number, valX: number, dependentVariable: string, minValY: number, maxValY: number);
    /**
     * Plots the chart on the canvas.
     */
    canvas(): void;
    /**
     * Inspired in ggplot2, this function plots points on the chart based on the provided data, label, and color.
     * @param {*} data
     * @param {*} label
     * @param {*} color
     */
    geomPoint(data: ViscosityPoint[], label: string | undefined, color: number[]): void;
    /**
     * Inspired in ggplot2, this function plots a path on the chart based on the provided data, label, and color.
     * @param {*} data
     * @param {*} label
     * @param {*} color
     */
    geomPath(data: ViscosityPoint[], label: string | number | undefined, color: number[], weight?: number): void;
    /**
     * Inspired in ggplot2, this function plots a vertical line on the chart at the specified value with the given color.
     * @param {number} value the x-coordinate where the line should be plotted
     * @param {Array} color the color of the line
     */
    geomVLine(value: number, color?: number[]): void;
    /**
     * Inspired in ggplot2, this function plots the value of a specific key on the chart.
     * @param {*} data the data to plot
     * @param {string} key the key for which to plot the value
     */
    geomTextValueAtKey(data: ViscosityPoint[], key: number, color?: number[]): void;
    /** From Google Gemini
     * @deprecated
     */
    isMouseOverLine(segment: ViscosityPoint[], tolerance?: number): boolean;
    /**Google Gemini */
    isMouseOverLineCanvas(segment: ViscosityPoint[], tolerance?: number): boolean;
}
//# sourceMappingURL=chart.d.ts.map