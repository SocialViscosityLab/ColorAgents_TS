import { ColorValue } from "../interfaces";
import { Agent } from "./agent";

/**
 * Creates instances of nonhuman agents. Extends Agent
 * @extends Agent
 */
export class Nonhuman extends Agent{
  /**
   * Constructor
   * @param {Number} x        [description]
   * @param {Number} y        [description]
   * @param {String} index    [description]
   * @param {[type]} theColor [description]
   */
  constructor (x:number, y:number, index:string, theColor:ColorValue){
		super(x, y, index);
  }
}
