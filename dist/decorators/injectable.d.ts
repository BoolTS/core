import type { TConstructor } from "../utils";
export declare const Injectable: <T extends TConstructor<Object>>() => (target: T) => void;
export default Injectable;
