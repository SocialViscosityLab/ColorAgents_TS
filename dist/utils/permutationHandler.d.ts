import { ColorValue } from "../interfaces";
export declare class PermutationHandler {
    depth: number;
    n: number;
    samples: number;
    permutations: Set<string>;
    curr: number;
    sequence: number[];
    freevals: number;
    /**
     * Private. Create the objet for handle permutation samples
     * @param   {Number} n is the number of items to consider
     * @param   {Number} depth is the number of items that will be explored in 'order'
     * @param   {Nimber} samples counts how many randome samples of the remaining items should be taken
     */
    constructor(n: number, depth: number, samples: number);
    /**
     * Private. Records global viscosity data at the current tick
     * @param   {Number} k the current item explored
     * @param   {Number} priors the items that are explored in order
     * @param   {Nimber} depth is the number of items that will be explored in 'order'
     */
    generate(k: number, priors: number[], depth: number): void;
    density(): number;
    size(): number;
    next(): string | undefined;
    /**
       * Combine the agents in different orders to create possible color models
       * @param {String} agentGroup list of agents' ids
       * @return {Array} List of model permutations or its promise
       */
    static loadPermutations(agentGroup: string): Promise<unknown>;
    /**
     * Calculate the permutations for the selected color model
     */
    static calculatePermutations(colors: ColorValue[]): string[] | undefined;
}
//# sourceMappingURL=permutationHandler.d.ts.map