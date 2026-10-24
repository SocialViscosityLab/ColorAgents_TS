// # Santiago Nunez-Corrales
// # University of Illinois at Urbana-Champaign
// #
// # Permutation generator at a given depth
// #
// # We assume that entries are generated 1..N for N!

import { Utils } from "../utils/utils";
import {ColorValue} from "../interfaces";
import {DOM} from "../GUI_DOM/DOMManager";
import { globalP5 } from "../main/main";

declare const math: { gamma(value: number): number };

export class PermutationHandler {
    depth: number;
    n: number;
    samples: number;
    permutations: Set<string>;
    curr: number;
    sequence: number[];
    freevals: number = 0;

    /**
     * Private. Create the objet for handle permutation samples
     * @param   {Number} n is the number of items to consider
     * @param   {Number} depth is the number of items that will be explored in 'order'
     * @param   {Nimber} samples counts how many randome samples of the remaining items should be taken
     */
    constructor(n: number, depth: number, samples: number) {
        this.depth = depth;
        this.n = n;
        this.samples = samples;

        this.permutations = new Set<string>();
        this.curr = 0;
        this.sequence = [];
        for (let i = 0; i < n; i++) { this.sequence.push(i + 1); }

        if (depth > n) {
            console.error("Permutation depth is larger than permutation length.");
        } else if (depth == n) {
            for (let i = 0; i < samples; i++) {
                const tempSec: number[] = [];
                const s = [...this.sequence];
                for (let j = 0; j < n; j++) {
                    const randomIdx = Math.floor(Math.random() * s.length);
                    tempSec.push(s.splice(randomIdx, 1)[0]!);
                }
                this.permutations.add(tempSec.join(' '));
            }
        } else {
            this.sequence.forEach(k => {
                this.generate(k, [], depth);
            });
        }
    }

    /**
     * Private. Records global viscosity data at the current tick
     * @param   {Number} k the current item explored
     * @param   {Number} priors the items that are explored in order
     * @param   {Nimber} depth is the number of items that will be explored in 'order'
     */
    generate(k: number, priors: number[], depth: number): void {
        this.freevals = this.n - depth;

        const prior = priors.concat(k);
        const diffS = this.sequence.filter(x => !prior.includes(x));

        if (depth == 1) {
            for (let i = 0; i < this.samples; i++) {
                const randSec: number[] = [];
                const s = [...diffS];
                for (let j = 0; j < this.freevals; j++) {
                    const randomIdx = Math.floor(Math.random() * s.length);
                    randSec.push(s.splice(randomIdx, 1)[0]!);
                }
                this.permutations.add((prior.concat(randSec)).join(' '));
            }
        } else {
            diffS.forEach(nk => {
                this.generate(nk, prior, depth - 1);
            });
        }
    }

    density(): number {
        return this.size() / math.gamma(this.n + 1);
    }
    size(): number {
        return this.permutations.size;
    }
    next(): string | undefined {
        const values = Array.from(this.permutations);
        const target = values[this.curr];
        this.curr = (this.curr + 1) % this.size();
        return target;
    }

    /**
       * Combine the agents in different orders to create possible color models
       * @param {String} agentGroup list of agents' ids
       * @return {Array} List of model permutations or its promise
       */
      static loadPermutations(agentGroup: string) {
        let permutations: string[] = [];
        let permuFileName = "src/permutations/" + agentGroup + ".json";
        // Promise
        var permuProm = new Promise(function (resolve) {
            
          globalP5.loadJSON(
            permuFileName,
            (data: any) => {
              permutations = data;
              resolve(permutations);
            },
            (response: any) => {
              alert("The color factory '" + agentGroup + "' is not enabled for Reinforcement learning. Choose a different color factory.");
            },
          );
        });
        return permuProm;
      }
    
      /**
       * Calculate the permutations for the selected color model
       */
      static calculatePermutations(colors: ColorValue[]) {
        let mPermutations = [];
        let agentsIDs = colors.map((c) => c.name);
        if (colors.length < 10) {
          mPermutations = Utils.calculateCModelPermutations(agentsIDs);
          mPermutations.sort(function (a, b) {
            return 0.5 - Math.random();
          });
          globalP5.saveJSON(mPermutations, DOM.lists.cFactory.value);
          return mPermutations;
        } else {
          Utils.calculateCModelPermutationSample(agentsIDs).then(function (permutations) {
            mPermutations = permutations as any[];
            globalP5.saveJSON(permutations!, DOM.lists.cFactory.value);
            return mPermutations;
          });
        }
      }
}

