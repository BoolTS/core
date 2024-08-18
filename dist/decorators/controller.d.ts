import type { IController } from "../interfaces/controller";
import { type THttpMetadata } from "./http";
export type TControllerMetadata = Required<{
    prefix: string;
    httpMetadata: THttpMetadata;
}>;
export declare const controllerKey: unique symbol;
export declare const Controller: (prefix: string) => <T extends {
    new (...args: any[]): IController;
}>(target: T) => void;
export default Controller;
