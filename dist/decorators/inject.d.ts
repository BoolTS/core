import type { TConstructor } from "../ultils";
export declare const Inject: <T extends TConstructor<Object>, K extends TConstructor<Object>>(definition: T | string | symbol) => (target: K, _methodName: string | symbol | undefined, parameterIndex: number) => void;
export default Inject;
