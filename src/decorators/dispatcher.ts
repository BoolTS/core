import type { IDispatcher } from "../interfaces/dispatcher";
import { dispatcherKey } from "../keys";

export type TDispatcherMetadata = undefined;

export const Dispatcher =
    () =>
    <T extends { new (...args: any[]): IDispatcher }>(target: T) => {
        if (!("execute" in target.prototype) || typeof target.prototype.execute !== "function") {
            return;
        }

        const metadata: TDispatcherMetadata = undefined;

        Reflect.defineMetadata(dispatcherKey, metadata, target);
    };

export default Dispatcher;
