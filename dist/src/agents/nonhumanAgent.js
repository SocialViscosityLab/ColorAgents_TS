"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nonhuman = void 0;
const agent_1 = require("./agent");
/**
 * Creates instances of nonhuman agents. Extends Agent
 * @extends Agent
 */
class Nonhuman extends agent_1.Agent {
    /**
     * Constructor
     * @param {Number} x        [description]
     * @param {Number} y        [description]
     * @param {String} index    [description]
     * @param {[type]} theColor [description]
     */
    constructor(x, y, index, theColor) {
        super(x, y, index);
    }
}
exports.Nonhuman = Nonhuman;
//# sourceMappingURL=nonhumanAgent.js.map