import { TimeSeriesPoint, ViscosityPoint } from "../interfaces";
/**
 * Based on the original sliding window segmentation algorithm by Keogh et al. (2004)
 *  * Segments a time series into windows using a sliding window approach based
 * on a maximum error threshold.
 * @param {*} timeSeries: An array of data points representing the time series,
 * where each point can be an object with 'key' and 'value' properties or an array
 * with two elements.
 * @param {*} maxError: A numeric threshold for the maximum allowable error in a segment.
 * @deprecated this method usues a TimeSeriesPoint interface whic was replaced for the simplier version ViscosityPoint.
 * @returns
 */
export declare function slidingWindowSegmentationOLD(timeSeries: TimeSeriesPoint[], maxError: number): TimeSeriesPoint[][];
export declare function slidingWindowSegmentation(timeSeries: ViscosityPoint[], maxError: number): ViscosityPoint[][];
/**
 * Based on the original sliding window segmentation algorithm by Keogh et al. (2004)
 * Creates a fine approximation and repeatedly merges the adjacent pair with
 * the lowest linear-regression error until no merge is below maxError.
 */
export declare function bottomUpSegmentation(timeSeries: ViscosityPoint[], maxError: number): {
    key: number;
    value: number;
}[][];
/**
 * Based on the original sliding window segmentation algorithm by Keogh et al. (2004)
 * Sliding Window And Bottom-up (SWAB) segmentation.
 * segNum is the target number of points in the working buffer.
 */
export declare function swabSegmentation(timeSeries: ViscosityPoint[], maxError: number, segNum?: number): ViscosityPoint[][];
//# sourceMappingURL=segmentation.d.ts.map