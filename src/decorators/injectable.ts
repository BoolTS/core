import type { TConstructor } from "../utils";

import { injectableKey } from "../constants/keys";

export const Injectable =
    <T extends TConstructor<Object>>() =>
    (target: T) =>
        Reflect.defineMetadata(injectableKey, undefined, target);

export default Injectable;
