import type { IGuard } from "../interfaces";

import { guardKey } from "../keys";

export type TGuardMetadata = undefined;

export const Guard =
    () =>
    <T extends { new (...args: any[]): IGuard }>(target: T) => {
        if (!("enforce" in target.prototype) || typeof target.prototype.enforce !== "function") {
            return;
        }

        const metadata = undefined;

        Reflect.defineMetadata(guardKey, metadata, target);
    };

export default Guard;
