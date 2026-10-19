/**
 * Class for creating a chart with x and y axes, plotting points, paths, vertical lines,
 * and displaying text values at specific keys.
 */

import type p5 from "p5";
import { ViscosityPoint } from "../interfaces";
import { Axis } from "./axis";

export class Chart {
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

  constructor(p5: p5, pos: p5.Vector, lengthX: number, lengthY: number, valX: number, dependentVariable: string, minValY: number, maxValY: number) {
    this.p5 = p5;
    this.xAxis = new Axis(true, lengthX, 0, valX, "ticks");
    this.yAxis = new Axis(false, lengthY, minValY, maxValY, dependentVariable);
    this.pos = pos;
  }

  /**
   * Plots the chart on the canvas.
   */
  canvas(): void {
    this.yAxis.plot(this.p5, this.pos);
    this.xAxis.plot(this.p5, this.pos);
  }

  /**
   * Inspired in ggplot2, this function plots points on the chart based on the provided data, label, and color.
   * @param {*} data
   * @param {*} label
   * @param {*} color
   */
  geomPoint(data: ViscosityPoint[], label: string | undefined, color: number[]): void {
    if (data.length == 0) return;
    this.p5.stroke(color[0] ?? 0, color[1] ?? 0, color[2] ?? 0, 30);
    this.p5.fill(color[0] ?? 0, color[1] ?? 0, color[2] ?? 0, 160);
    let xCoord = 0;
    let yCoord = 0;
    ``;
    data.forEach((entry) => {
      xCoord = this.xAxis.mapPosition(this.p5, entry.key) ?? 0;
      yCoord = this.yAxis.mapPosition(this.p5, entry.value as number) ?? 0;
      this.p5.ellipse(this.pos.x + xCoord, this.pos.y + yCoord, 2, 2);
    });
    if (label) {
      this.p5.text(label, this.pos.x + xCoord + 2, this.pos.y + yCoord + 2);
    }
  }

  /**
   * Inspired in ggplot2, this function plots a path on the chart based on the provided data, label, and color.
   * @param {*} data
   * @param {*} label
   * @param {*} color
   */
  geomPath(data: ViscosityPoint[], label: string | number | undefined, color: number[], weight: number = 1): void {
    if (data.length == 0) return;
    this.p5.stroke(color[0] ?? 0, color[1] ?? 0, color[2] ?? 0);
    this.p5.strokeWeight(weight);
    this.p5.noFill();
    this.p5.beginShape();
    let xCoord = 0;
    let yCoord = 0;
    data.forEach((entry) => {
      xCoord = this.xAxis.mapPosition(this.p5, entry.key) ?? 0;
      yCoord = this.yAxis.mapPosition(this.p5, entry.value as number) ?? 0;
      this.p5.vertex(this.pos.x + (xCoord ?? 0), this.pos.y + (yCoord ?? 0));
    });
    this.p5.endShape();

    if (label) {
      this.p5.noStroke();
      this.p5.fill(color[0] ?? 0, color[1] ?? 0, color[2] ?? 0);
      this.p5.text(label, this.pos.x + xCoord + 2, this.pos.y + yCoord + 2);
    }
    // reset to default stroke weight
    this.p5.strokeWeight(1);
  }

  /**
   * Inspired in ggplot2, this function plots a vertical line on the chart at the specified value with the given color.
   * @param {number} value the x-coordinate where the line should be plotted
   * @param {Array} color the color of the line
   */
  geomVLine(value: number, color?: number[]): void {
    let xCoord = this.xAxis.mapPosition(this.p5, value);
    if (color) {
      this.p5.stroke(color[0] ?? 0, color[1] ?? 0, color[2] ?? 0);
    } else {
      this.p5.stroke(255, 0, 0, 100);
    }
    const mappedX = xCoord ?? 0;
    this.p5.line(this.pos.x + mappedX, this.yAxis.pos!.y, this.pos.x + mappedX, this.yAxis.pos!.y - this.yAxis.length);
  }

  /**
   * Inspired in ggplot2, this function plots the value of a specific key on the chart.
   * @param {*} data the data to plot
   * @param {string} key the key for which to plot the value
   */
  geomTextValueAtKey(data: ViscosityPoint[], key: number, color?: number[]): void {
    let value: number | undefined = data[key]?.value as number | undefined;
    let xCoord: number;
    let yCoord: number;
    if (value == undefined) {
      xCoord = this.xAxis.mapPosition(this.p5, key) ?? 0;
      yCoord = 0;
    } else {
      xCoord = this.xAxis.mapPosition(this.p5, key) ?? 0;
      yCoord = this.yAxis.mapPosition(this.p5, value) ?? 0;
    }
    this.p5.noStroke();
    this.p5.fill(255, 0, 0, 100);
    if (color) this.p5.fill(color[0]!, color[1]!, color[2]!, color[3]!);
    this.p5.textSize(10);
    this.p5.text(Number(value).toFixed(2), this.pos.x + xCoord + 3, this.pos.y + yCoord);
    this.p5.text(key, this.pos.x + xCoord, this.pos.y + 10);
  }

  /** From Google Gemini
   * @deprecated
   */
  isMouseOverLine(segment: ViscosityPoint[], tolerance: number = 1): boolean {
    // 1. Check the bounding box first (Quick optimization check)
    let x1 = segment[0]?.key!;
    let y1 = segment[0]?.value!;
    let x2 = segment[segment.length - 1]?.key!;
    let y2 = segment[segment.length - 1]?.value!;
    const mouseX = this.p5.mouseX;
    const mouseY = this.p5.mouseY;

    x1 = this.pos.x + this.xAxis.mapPosition(this.p5, x1)!;
    y1 = this.pos.y + this.yAxis.mapPosition(this.p5, y1)!;
    x2 = this.pos.x + this.xAxis.mapPosition(this.p5, x2)!;
    y2 = this.pos.y + this.yAxis.mapPosition(this.p5, y2)!;

    if (mouseX < Math.min(x1, x2) - tolerance || mouseX > Math.max(x1, x2) + tolerance || mouseY < Math.min(y1, y2) - tolerance || mouseY > Math.max(y1, y2) + tolerance) {
      return false;
    }

    // 2. Calculate the distance from mouse to the infinite line
    // Formula: |(y2-y1)x0 - (x2-x1)y0 + x2y1 - y2x1| / sqrt((y2-y1)^2 + (x2-x1)^2)
    let num = Math.abs((y2 - y1) * mouseX - (x2 - x1) * mouseY + x2 * y1 - y2 * x1);
    let den = Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));

    // Prevent division by zero if the line is actually a single point
    if (den === 0) return this.p5.dist(mouseX, mouseY, x1, y1) < tolerance;

    let distance = num / den;

    let over = distance < tolerance;

    // 3. Return true if the mouse is close enough to the mathematical line
    return over;
  }

  /**Google Gemini */
  isMouseOverLineCanvas(segment: ViscosityPoint[], tolerance = 2): boolean {
    const p5 = this.p5;
    const density = p5.pixelDensity();

    // 1. Scale mouse coordinates to match the physical device pixel grid
    const physicalMouseX = p5.mouseX * density;
    const physicalMouseY = p5.mouseY * density;

    // 2. Map coordinates relative to your graph component's local setup
    let x1 = this.pos.x + this.xAxis.mapPosition(p5, segment[0]?.key!)!;
    let y1 = this.pos.y + this.yAxis.mapPosition(p5, segment[0]?.value!)!;
    let x2 = this.pos.x + this.xAxis.mapPosition(p5, segment[segment.length - 1]?.key!)!;
    let y2 = this.pos.y + this.yAxis.mapPosition(p5, segment[segment.length - 1]?.value!)!;

    const ctx = p5.drawingContext as CanvasRenderingContext2D;

    // 3. Define the path line segment
    const path = new Path2D();
    path.moveTo(x1, y1);
    path.lineTo(x2, y2);

    // Save context state to prevent tolerance configuration leakage
    ctx.save();

    // 4. Scale tolerance by pixel density so hitboxes remain proportional on high-DPI screens
    ctx.lineWidth = tolerance * density;
    ctx.lineCap = "round";

    // 6. Test the point using the active matrix and physical screen coordinates
    const isPointOnStroke = ctx.isPointInStroke(path, physicalMouseX, physicalMouseY);

    ctx.restore(); // Restore original stroke styles for subsequent rendering loops

    return isPointOnStroke;
  }
}
