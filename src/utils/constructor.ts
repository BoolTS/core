export type TConstructor<T, K extends any[] = any[]> = new (...args: K) => T;
