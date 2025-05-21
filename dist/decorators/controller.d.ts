import type { TConstructor } from "../ultils";
import type { THttpMetadata } from "./http";
export type TControllerMetadata = Required<{
    prefix: string;
    httpMetadata: THttpMetadata;
}>;
export declare const Controller: <T extends TConstructor<Object>>(prefix?: string) => (target: T) => void;
export default Controller;
