import type { TConstructor } from "../utils";

import { guardKey } from "../constants/keys";

export type TGuardMetadata = undefined;

export const Guard =
    <T extends TConstructor<Object>>() =>
    (target: T) => {
        if (!("enforce" in target.prototype) || typeof target.prototype.enforce !== "function") {
            return;
        }

        const metadata = undefined;

        Reflect.defineMetadata(guardKey, metadata, target);

        return target;
    };

export default Guard;
