import { Agent } from "./agents/agent";
import { Color } from "chroma-js";
export interface AgentPair {
    agent: Agent;
    interactant: boolean;
}
export interface ExpectedResult {
    [color: string]: number; /** {red: NaN, org: NaN, yel: NaN, gre: NaN, pur: NaN} */
}
export interface InteractantsRegister {
    [key: string]: {
        x: number;
        y: number;
    };
}
export interface SelectedModel {
    model: string;
    fModel: Record<string, number>;
    qValue: number;
}
export interface ColorValue {
    name: string;
    value: Color;
}
export interface InteractionDistance {
    spatialMag: number;
    currentDist: number;
}
export interface AgentColorValues {
    _rgb: number[];
}
export interface Interactant {
    agent: Agent;
}
export interface MatrixInteraction {
    interactant: string;
    spatialMag: number;
    currentDist: number;
    weightedDifference: number | undefined;
}
export interface MatrixRow {
    id: string;
    interactions: MatrixInteraction[];
}
export type Aid_Bid_Distance = [string, string, number | undefined];
export interface Interaction {
    interactant: string;
    spatialMag: number;
    currentDist: number;
    weightedDifference: number;
}
export interface QualityRecord {
    id: string;
    qValue: number;
    rqValue: number;
    model: string;
}
export interface GlobalQualityRecord {
    tick: number;
    qValue: number;
    rqValue: number;
}
export interface ViscosityPoint {
    key: number;
    value: number;
}
export interface AgentViscosityData {
    agent: Agent;
    viscosities: ViscosityPoint[];
}
export interface NumberPairMap extends Map<number, [number, number]> {
}
export interface TimeSeriesPoint {
    key?: number;
    value?: number;
    [index: number]: number;
}
//# sourceMappingURL=interfaces.d.ts.map