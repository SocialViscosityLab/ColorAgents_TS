import { ColorValue } from "./interfaces";
/**
 * A factory of color palettes
 */
export declare class ColorFactory {
    /**
     * Constructor
     * @param {String} cSpace The name of color palette from the menu of available palettes in HTML interface
     */
    colors: ColorValue[];
    newtonValues: string[];
    munsellValues: string[];
    munsellValuesAlternated: string[];
    secondaryValues: string[];
    test: string[];
    constructor(cSpace: string);
    /**
     * Retrieves the color for the required color space
     * @param  {string} cSpace The required color space
     * @return {Array}        [description]
     */
    initialize(cSpace: string): void;
    getAll(): ColorValue[];
    /**
     * Gets an array of 20 ordered colors in Munsell color space
     * @return {Array} 20 ordered colors in Munsell color space
     */
    getMunsell(): ColorValue[];
    /**
     * Gests and array of 20 ordered colors in Newtonean color space
     * @return {Array} 20 ordered colors in Newtonean color space
     */
    getNewton(): ColorValue[];
}
//# sourceMappingURL=colorFactory.d.ts.map