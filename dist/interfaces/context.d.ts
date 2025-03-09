export type TContextOptions = Partial<{
    isStatic: boolean;
    isPassthrough: boolean;
}>;
export interface IContext {
    get: <T = unknown>(key: symbol, options?: TContextOptions) => T;
    has: (key: symbol, options?: TContextOptions) => boolean;
    set: <T = unknown>(key: symbol, value: T, options?: TContextOptions) => ThisType<IContext>;
    setOptions: (options: TContextOptions) => ThisType<IContext>;
}
