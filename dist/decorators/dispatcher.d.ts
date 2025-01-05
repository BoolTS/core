import type { IDispatcher } from "../interfaces";
export type TDispatcherMetadata = undefined;
export declare const Dispatcher: () => <T extends {
    new (...args: any[]): IDispatcher;
}>(target: T) => void;
export default Dispatcher;
