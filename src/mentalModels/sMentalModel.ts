/**
 * Spatial Mental Model
 * This mental model is a mechanism to convert values from other mental models into spatial distances.
 * For example, it serves to map the perceived proximity between two colors into a spatial proximity
 * The model needs two parameters to determine what is near and what is far away. When shortests is not undefined
 * it is assumed that it is equal to 0,
 * @param {number} shortest: scalar used by spatial mental model to determine what on canvas how near an agent wants to be from the most similar agent
 * @param {number} farthest: scalar used by spatial mental model to determine what on canvas how far away an agent was to be from the most dissimilar agent
 */
export class SpatialMentalModel {
  farthest: number;
  shortest: number;
  constructor(shortest: number, farthest: number) {
    this.farthest = farthest;
    this.shortest = 0;
    if (shortest) {
      this.shortest = shortest;
    }
  }

  setFarthest(val: number) {
    this.farthest = val;
  }

  setShortest(val: number) {
    this.shortest = val;
  }

  /**
   * Adapted from Processing's map() if either the second or third parameter are omited, the function uses current values
   * of this.shortest and this.farthest
   * @param val a value between 0 and 1. 1 corresponds to the farthest perception
   */
  mapMagnitude(val: number, shortest?: number, farthest?: number) {
    if (shortest && farthest) {
      return shortest + (farthest - shortest) * (val / 1);
    } else {
      return this.shortest + (this.farthest - this.shortest) * (val / 1);
    }
  }

  /** This is an experimental spatial mapping function. The result are pairs of opposite values */
  mapMagnitudeInverted(val: number, shortest?: number, farthest?: number) {
    if (shortest && farthest) {
      return farthest + (shortest - farthest) * (val / 1);
    } else {
      return this.farthest + (this.shortest - this.farthest) * (val / 1);
    }
  }
}
