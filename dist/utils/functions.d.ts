export declare const inferStatusText: (httpCode: number) => string;
type TCallable = <T>(...args: T[]) => unknown;
export declare const hasCallSignature: (value: any) => value is TCallable;
export {};
