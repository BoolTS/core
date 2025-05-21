import type { TConstructor } from "../ultils";
export declare const Injectable: <T extends TConstructor<Object>>() => (target: T) => void;
export default Injectable;
