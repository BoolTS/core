import type { TConstructor } from "../ultils";

import { injectableKey } from "../keys";

export const Injectable =
    <T extends TConstructor<Object>>() =>
    (target: T) =>
        Reflect.defineMetadata(injectableKey, undefined, target);

export default Injectable;
