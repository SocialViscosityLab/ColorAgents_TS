/**
 * Class representing an axis in a chart, either horizontal or vertical, with methods to map values
 * to positions and plot the axis on the canvas.
 */

import type p5 from "p5";

export class Axis {
  isHorizontal: boolean;
  length: number;
  label: string;
  minValue: number;
  maxValue: number;
  step: number;
  pos?: p5.Vector;

  constructor(isHorizontal: boolean, length: number, minValue: number, maxValue: number, label: string) {
    this.isHorizontal = isHorizontal;
    this.length = length;
    this.label = label;
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.step = length / (maxValue - minValue);
  }

  /**
   * Maps a value to a position on the axis.
   * @param {p5} p5
   * @param {number} val
   * @returns
   */
  mapPosition(p5: p5, val: number): number | undefined {
    if (val) {
      if (val < this.minValue) {
        this.minValue = val;
        return this.mapPosition(p5, val);
      } else if (val > this.maxValue) {
        this.maxValue = val;
      }
  
      const rtn = p5.map(val, this.minValue, this.maxValue, 0, this.length);
      if (this.isHorizontal) {
        return rtn;
      } else {
        return -rtn;
      }
    } else {
      return undefined;
    }
  }

  /**
   * Plots the axis on the canvas.
   * @param {p5} p5
   * @param {Vector} pos
   */
  plot(p5: p5, pos: p5.Vector): void {
    this.pos = pos;
    if (this.isHorizontal) {
      p5.stroke(150);
      p5.line(pos.x, pos.y, pos.x + this.length, pos.y);
      p5.noStroke();
      p5.fill(150);
      if (typeof this.maxValue == "number") p5.text(this.maxValue.toFixed(2), pos.x + this.length, pos.y + 15);
      p5.text(this.label, pos.x + this.length / 2, pos.y + 15);
    } else {
      p5.stroke(150);
      p5.line(pos.x, pos.y, pos.x, pos.y - this.length);
      p5.noStroke();
      p5.fill(150);
      p5.text(this.maxValue.toFixed(2), pos.x - 25, pos.y - this.length);
      p5.text(this.minValue.toFixed(2), pos.x - 25, pos.y);
      if (this.minValue != 0 && this.maxValue != 0) {
        p5.fill(200);
        p5.stroke(230);
        let zeroPos = p5.map(0, this.minValue, this.maxValue, pos.y - this.length, pos.y);
        p5.text("0", pos.x - 25, zeroPos);
        p5.line(pos.x, zeroPos, pos.x + this.length, zeroPos);
      }
      p5.push();
      p5.translate(pos.x - 5, pos.y - this.length / 2);
      p5.rotate(-p5.HALF_PI);
      p5.fill(150);
      p5.noStroke();
      p5.text(this.label, 0, 0);
      p5.pop();
    }
  }
}
