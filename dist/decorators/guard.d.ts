import type { TConstructor } from "../utils";
export type TGuardMetadata = undefined;
export declare const Guard: <T extends TConstructor<Object>>() => (target: T) => T | undefined;
export default Guard;
