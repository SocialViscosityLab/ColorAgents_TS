"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slidingWindowSegmentationOLD = slidingWindowSegmentationOLD;
exports.slidingWindowSegmentation = slidingWindowSegmentation;
exports.bottomUpSegmentation = bottomUpSegmentation;
exports.swabSegmentation = swabSegmentation;
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
function slidingWindowSegmentationOLD(timeSeries, maxError) {
    const segments = [];
    const valueAt = (point, index) => Number(point.value ?? point[1] ?? point);
    const xAt = (point, index) => Number(point.key ?? point[0] ?? index);
    const calculateError = (window) => {
        if (window.length < 2)
            return 0;
        const n = window.length;
        const meanX = window.reduce((sum, point, i) => sum + xAt(point, i), 0) / n;
        const meanY = window.reduce((sum, point, i) => sum + valueAt(point, i), 0) / n;
        const denominator = window.reduce((sum, point, i) => sum + (xAt(point, i) - meanX) ** 2, 0);
        const slope = denominator === 0 ? 0 : window.reduce((sum, point, i) => sum + (xAt(point, i) - meanX) * (valueAt(point, i) - meanY), 0) / denominator;
        const intercept = meanY - slope * meanX;
        return window.reduce((sum, point, i) => {
            const residual = valueAt(point, i) - (intercept + slope * xAt(point, i));
            return sum + residual ** 2;
        }, 0);
    };
    let anchor = 0;
    while (anchor < timeSeries.length) {
        let end = anchor + 1;
        while (end < timeSeries.length && calculateError(timeSeries.slice(anchor, end + 1)) < maxError) {
            end += 1;
        }
        const segment = timeSeries.slice(anchor, end);
        // Use the segment endpoints to build a linearly interpolated approximation.
        const firstPoint = segment[0];
        const lastPoint = segment[segment.length - 1];
        // Read endpoint coordinates through the helpers so object and array points are supported.
        const firstX = xAt(firstPoint, 0);
        const lastX = xAt(lastPoint, segment.length - 1);
        const firstY = valueAt(firstPoint, 0);
        const lastY = valueAt(lastPoint, segment.length - 1);
        segments.push(segment.map((point, index) => {
            const x = xAt(point, index);
            const ratio = lastX === firstX ? 0 : (x - firstX) / (lastX - firstX);
            return {
                key: x,
                value: firstY + ratio * (lastY - firstY),
            };
        }));
        anchor = end;
    }
    return segments;
}
function slidingWindowSegmentation(timeSeries, maxError) {
    const segments = [];
    const valueAt = (point) => Number(point.value);
    const xAt = (point) => Number(point.key);
    const calculateError = (window) => {
        if (window.length < 2)
            return 0;
        const n = window.length;
        const meanX = window.reduce((sum, point) => sum + xAt(point), 0) / n;
        const meanY = window.reduce((sum, point) => sum + valueAt(point), 0) / n;
        const denominator = window.reduce((sum, point) => sum + (xAt(point) - meanX) ** 2, 0);
        const slope = denominator === 0 ? 0 : window.reduce((sum, point, i) => sum + (xAt(point) - meanX) * (valueAt(point) - meanY), 0) / denominator;
        const intercept = meanY - slope * meanX;
        return window.reduce((sum, point) => {
            const residual = valueAt(point) - (intercept + slope * xAt(point));
            return sum + residual ** 2;
        }, 0);
    };
    let anchor = 0;
    while (anchor < timeSeries.length) {
        let end = anchor + 1;
        while (end < timeSeries.length && calculateError(timeSeries.slice(anchor, end + 1)) < maxError) {
            end += 1;
        }
        const segment = timeSeries.slice(anchor, end);
        // Use the segment endpoints to build a linearly interpolated approximation.
        const firstPoint = segment[0];
        const lastPoint = segment[segment.length - 1];
        // Read endpoint coordinates through the helpers so object and array points are supported.
        const firstX = xAt(firstPoint);
        const lastX = xAt(lastPoint);
        const firstY = valueAt(firstPoint);
        const lastY = valueAt(lastPoint);
        segments.push(segment.map((point) => {
            const x = xAt(point);
            const ratio = lastX === firstX ? 0 : (x - firstX) / (lastX - firstX);
            return {
                key: x,
                value: firstY + ratio * (lastY - firstY),
            };
        }));
        anchor = end;
    }
    return segments;
}
/**
 * Based on the original sliding window segmentation algorithm by Keogh et al. (2004)
 * Creates a fine approximation and repeatedly merges the adjacent pair with
 * the lowest linear-regression error until no merge is below maxError.
 */
function bottomUpSegmentation(timeSeries, maxError) {
    const valueAt = (point) => Number(point.value);
    const xAt = (point) => Number(point.key);
    const regressionError = (points) => {
        if (points.length < 2)
            return 0;
        const meanX = points.reduce((sum, point) => sum + xAt(point), 0) / points.length;
        const meanY = points.reduce((sum, point) => sum + valueAt(point), 0) / points.length;
        const denominator = points.reduce((sum, point) => sum + (xAt(point) - meanX) ** 2, 0);
        const slope = denominator === 0 ? 0 : points.reduce((sum, point) => sum + (xAt(point) - meanX) * (valueAt(point) - meanY), 0) / denominator;
        const intercept = meanY - slope * meanX;
        return points.reduce((sum, point) => {
            const residual = valueAt(point) - (intercept + slope * xAt(point));
            return sum + residual ** 2;
        }, 0);
    };
    const merge = (left, right) => [...left, ...right];
    const approximate = (points) => {
        const first = points[0];
        const last = points[points.length - 1];
        const firstX = xAt(first);
        const lastX = xAt(last);
        const meanX = points.reduce((sum, point) => sum + xAt(point), 0) / points.length;
        const meanY = points.reduce((sum, point) => sum + valueAt(point), 0) / points.length;
        const denominator = points.reduce((sum, point) => sum + (xAt(point) - meanX) ** 2, 0);
        const slope = denominator === 0 ? 0 : points.reduce((sum, point) => sum + (xAt(point) - meanX) * (valueAt(point) - meanY), 0) / denominator;
        const intercept = meanY - slope * meanX;
        return points.map((point) => ({
            key: xAt(point),
            value: intercept + slope * xAt(point),
        }));
    };
    if (timeSeries.length === 0)
        return [];
    const segments = [];
    for (let i = 0; i < timeSeries.length; i += 2) {
        segments.push(timeSeries.slice(i, i + 2));
    }
    while (segments.length > 1) {
        let cheapestIndex = 0;
        let cheapestCost = regressionError(merge(segments[0], segments[1]));
        for (let i = 1; i < segments.length - 1; i += 1) {
            const cost = regressionError(merge(segments[i], segments[i + 1]));
            if (cost < cheapestCost) {
                cheapestIndex = i;
                cheapestCost = cost;
            }
        }
        if (cheapestCost >= maxError)
            break;
        segments.splice(cheapestIndex, 2, merge(segments[cheapestIndex], segments[cheapestIndex + 1]));
    }
    return segments.map(approximate);
}
/**
 * Based on the original sliding window segmentation algorithm by Keogh et al. (2004)
 * Sliding Window And Bottom-up (SWAB) segmentation.
 * segNum is the target number of points in the working buffer.
 */
function swabSegmentation(timeSeries, maxError, segNum = 10) {
    if (timeSeries.length === 0)
        return [];
    const valueAt = (point) => Number(point.value);
    const xAt = (point) => Number(point.key);
    const regressionError = (points) => {
        if (points.length < 2)
            return 0;
        const meanX = points.reduce((sum, point) => sum + xAt(point), 0) / points.length;
        const meanY = points.reduce((sum, point) => sum + valueAt(point), 0) / points.length;
        const denominator = points.reduce((sum, point) => sum + (xAt(point) - meanX) ** 2, 0);
        const slope = denominator === 0 ? 0 : points.reduce((sum, point) => sum + (xAt(point) - meanX) * (valueAt(point) - meanY), 0) / denominator;
        const intercept = meanY - slope * meanX;
        return points.reduce((sum, point) => {
            const residual = valueAt(point) - (intercept + slope * xAt(point));
            return sum + residual ** 2;
        }, 0);
    };
    const approximate = (points) => {
        const meanX = points.reduce((sum, point) => sum + xAt(point), 0) / points.length;
        const meanY = points.reduce((sum, point) => sum + valueAt(point), 0) / points.length;
        const denominator = points.reduce((sum, point) => sum + (xAt(point) - meanX) ** 2, 0);
        const slope = denominator === 0 ? 0 : points.reduce((sum, point) => sum + (xAt(point) - meanX) * (valueAt(point) - meanY), 0) / denominator;
        const intercept = meanY - slope * meanX;
        return points.map((point) => ({
            key: xAt(point),
            value: intercept + slope * xAt(point),
        }));
    };
    const target = Math.max(2, Math.floor(segNum));
    const lower = Math.max(2, Math.floor(target / 2));
    const upper = Math.max(lower, target * 2);
    const result = [];
    let buffer = timeSeries.slice(0, target);
    let next = buffer.length;
    while (buffer.length > 0) {
        if (next >= timeSeries.length) {
            result.push(...bottomUpSegmentation(buffer, maxError));
            break;
        }
        const segments = bottomUpSegmentation(buffer, maxError);
        const first = segments[0];
        if (!first)
            break;
        result.push(first);
        buffer = buffer.slice(first.length);
        // BEST LINE: append points while the regression error remains valid.
        while (next < timeSeries.length && buffer.length < upper) {
            const candidate = buffer.concat(timeSeries[next]);
            if (buffer.length >= lower && regressionError(candidate) > maxError)
                break;
            buffer = candidate;
            next += 1;
        }
        // Ensure progress when the next point cannot extend the current line.
        if (next < timeSeries.length && buffer.length === 0) {
            buffer.push(timeSeries[next]);
            next += 1;
        }
    }
    return result.map((segment) => approximate(segment));
}
//# sourceMappingURL=segmentation.js.map