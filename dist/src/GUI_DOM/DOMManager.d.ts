/**
 * This static class manages all the GUI elements displayed in the browser and serves as an interface between the DOM and the JavaScript code.
 */
import { Agent } from "../agents/agent";
export declare class DOM {
    static buttons: any;
    static checkboxes: any;
    static labels: any;
    static sliders: any;
    static lists: any;
    constructor();
    /** Initializes all the GUI elements ceated in the DOM
     */
    static initialize(): void;
    /** Updates a slider's label
     * @param {string} sliderName
     * @param {number} value
     */
    static updateSliderValue(sliderName: string, value: number): void;
    /** Retrieves the list of HTML options from a given list
     * @param {string} listKey The name of the list whose options will be retrieved
     * @return {Array} The collection of options
     */
    static getListOptions(listKey: string): any[];
    /** Retrieves the value of all possible parameters for a slider. It creates an array with
     * all the values, starting from the min slider value up to the max slider value,
     * increasing in slider predefined steps.
     * @param {string} sliderKey The name of the slider whose parameters will be retrieved
     * @return {Array} The collection of values
     */
    static getSliderParams(sliderKey: string): number[] | undefined;
    /** Creates an object with the sweep parameters as defined by the user on the GUI */
    static getSweepParams(): any;
    static generateIndividualCheckBoxes(agents: Map<Agent, Map<Number, Number>>): void;
    static resetGeneratedCheckboxes(): void;
}
export default DOM;
//# sourceMappingURL=DOMManager.d.ts.map