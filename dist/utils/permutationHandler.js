"use strict";
// # Santiago Nunez-Corrales
// # University of Illinois at Urbana-Champaign
// #
// # Permutation generator at a given depth
// #
// # We assume that entries are generated 1..N for N!
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermutationHandler = void 0;
const utils_1 = require("../utils/utils");
const DOMManager_1 = require("../GUI_DOM/DOMManager");
const main_1 = require("../main/main");
class PermutationHandler {
    depth;
    n;
    samples;
    permutations;
    curr;
    sequence;
    freevals = 0;
    /**
     * Private. Create the objet for handle permutation samples
     * @param   {Number} n is the number of items to consider
     * @param   {Number} depth is the number of items that will be explored in 'order'
     * @param   {Nimber} samples counts how many randome samples of the remaining items should be taken
     */
    constructor(n, depth, samples) {
        this.depth = depth;
        this.n = n;
        this.samples = samples;
        this.permutations = new Set();
        this.curr = 0;
        this.sequence = [];
        for (let i = 0; i < n; i++) {
            this.sequence.push(i + 1);
        }
        if (depth > n) {
            console.error("Permutation depth is larger than permutation length.");
        }
        else if (depth == n) {
            for (let i = 0; i < samples; i++) {
                const tempSec = [];
                const s = [...this.sequence];
                for (let j = 0; j < n; j++) {
                    const randomIdx = Math.floor(Math.random() * s.length);
                    tempSec.push(s.splice(randomIdx, 1)[0]);
                }
                this.permutations.add(tempSec.join(' '));
            }
        }
        else {
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
    generate(k, priors, depth) {
        this.freevals = this.n - depth;
        const prior = priors.concat(k);
        const diffS = this.sequence.filter(x => !prior.includes(x));
        if (depth == 1) {
            for (let i = 0; i < this.samples; i++) {
                const randSec = [];
                const s = [...diffS];
                for (let j = 0; j < this.freevals; j++) {
                    const randomIdx = Math.floor(Math.random() * s.length);
                    randSec.push(s.splice(randomIdx, 1)[0]);
                }
                this.permutations.add((prior.concat(randSec)).join(' '));
            }
        }
        else {
            diffS.forEach(nk => {
                this.generate(nk, prior, depth - 1);
            });
        }
    }
    density() {
        return this.size() / math.gamma(this.n + 1);
    }
    size() {
        return this.permutations.size;
    }
    next() {
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
    static loadPermutations(agentGroup) {
        let permutations = [];
        let permuFileName = "src/permutations/" + agentGroup + ".json";
        // Promise
        var permuProm = new Promise(function (resolve) {
            main_1.globalP5.loadJSON(permuFileName, (data) => {
                permutations = data;
                resolve(permutations);
            }, (response) => {
                alert("The color factory '" + agentGroup + "' is not enabled for Reinforcement learning. Choose a different color factory.");
            });
        });
        return permuProm;
    }
    /**
     * Calculate the permutations for the selected color model
     */
    static calculatePermutations(colors) {
        let mPermutations = [];
        let agentsIDs = colors.map((c) => c.name);
        if (colors.length < 10) {
            mPermutations = utils_1.Utils.calculateCModelPermutations(agentsIDs);
            mPermutations.sort(function (a, b) {
                return 0.5 - Math.random();
            });
            main_1.globalP5.saveJSON(mPermutations, DOMManager_1.DOM.lists.cFactory.value);
            return mPermutations;
        }
        else {
            utils_1.Utils.calculateCModelPermutationSample(agentsIDs).then(function (permutations) {
                mPermutations = permutations;
                main_1.globalP5.saveJSON(permutations, DOMManager_1.DOM.lists.cFactory.value);
                return mPermutations;
            });
        }
    }
}
exports.PermutationHandler = PermutationHandler;
//# sourceMappingURL=permutationHandler.js.map