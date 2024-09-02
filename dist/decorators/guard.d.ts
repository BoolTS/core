import type { IGuard } from "../interfaces";
export type TGuardMetadata = undefined;
export declare const Guard: () => <T extends {
    new (...args: any[]): IGuard;
}>(target: T) => void;
export default Guard;
