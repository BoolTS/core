import type { TConstructor } from "../utils";

import { injectKey } from "../constants/keys";

export const Inject =
    <T extends TConstructor<Object>, K extends TConstructor<Object>>(
        definition: T | string | symbol
    ) =>
    (target: K, _methodName: string | symbol | undefined, parameterIndex: number) => {
        const designParameterTypes: any[] = Reflect.getMetadata(injectKey, target) || [];

        designParameterTypes[parameterIndex] = definition;

        Reflect.defineMetadata(injectKey, designParameterTypes, target);
    };

export default Inject;
