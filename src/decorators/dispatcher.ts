import type { IDispatcher } from "../interfaces";

import { dispatcherKey } from "../keys";

export type TDispatcherMetadata = undefined;

export const Dispatcher =
    () =>
    <T extends { new (...args: any[]): IDispatcher }>(target: T) => {
        const metadata: TDispatcherMetadata = undefined;

        Reflect.defineMetadata(dispatcherKey, metadata, target);
    };

export default Dispatcher;
