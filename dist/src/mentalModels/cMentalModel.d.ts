import { Color } from "chroma-js";
import { ColorFactory } from "../colorFactory";
import { ColorValue } from "../interfaces";
/**
 * A color mental model is a ordered sequence of colors particular to each agent in
 * the world. Every color mental model belongs to an agent, therefore, color mental
 * models exist only in the 'mind' of each agent.
 * By default this class returns the Newtonean rainbow model, but other models are
 * available.
 * @param {string} colorPalette The name of the color palette to be used
 * @param {string} sensibility  The name of the Sensibility function, either linear, circular or exponential
 */
export declare class ColorMentalModel {
    cFactory: ColorFactory | undefined;
    colorPalette: ColorValue[];
    sensibility: string | undefined;
    myIndex: number | undefined;
    constructor(colorPalette: string, sensibility: string);
    /**
     * Sets the color palette to this color mental model
     * @param {Array} palette the new color palette
     */
    setColorPalette(paletteName: string): void;
    /**
     * Finds the color index in a color palette
     * @param {Color} color the color to be matched to a color palette
     */
    setMyIndex(color: Color): void;
    /**
      Returns a value between 0 and 1, where 1 is the farthest perceived distance
      * @param {Color} reference the reference color`must be between 0 and colorPalette.length
      * @param {Color} target the color to be compared with must be between 0 and colorPalette.length
      * @return a value between 0 and 1, where 1 is the farthest perceived distance
      */
    getPerceivedColorDistance(target: Color, reference?: Color): number | undefined;
    /**
     * Finds the index of a color in a given palette. If the exact color is not found,
     * then it retrievs the closest. It uses lodas.js https://lodash.com/ to evaluale
     * object attributes equality (value equality) and chroma.js library to estimate
     * the color proximity
     * @param {Color} color the color to be matched in the palette
     * @param {ColorValue[]} pal the palette to be used. If undefined the palette of this cMentalModelis used
     * @return The index of the given color in the palette sequence
     */
    findColorIndex(color: Color, pal?: ColorValue[]): number | undefined;
    /**
     * Returns a value between 0 and 1, where 1 is the farthest perceived distance
     * indexA and indexB must be between 0 and colorPalette.length
     * @param  {Number} indexA index of reference color in the colorPalette
     * @param  {Number} indexB index of target color in the colorPalette.
     * @return {Number} The value between 0 and 1, where 1 is the farthest perceived distance
     */
    calcPerceivedDist(indexA: number, indexB: number): number | undefined;
    /**
     * Returns a binary signal if a target color is between a given percentage similarity in the current colorpalette
     * @param  {Color}  target     target color
     * @param  {Number}  percentage percentage of "color similarity"
     * @return {Boolean}            True if the target color is similar enough to the index of this cMentalModel
     */
    isActionTrigger(target: Color, percentage: number): boolean | undefined;
    /**
     * Updates the sensibility function used to calculate perceived color distance.
     * @param {string} value The sensibility function name, such as linear, chordal, or exponential.
     */
    updateSensibility(value: string): void;
    /**
     * Returns the names of all colors in the current color palette.
     * @returns An array containing the palette color names in palette order.
     */
    getColorNames(): string[];
}
//# sourceMappingURL=cMentalModel.d.ts.map