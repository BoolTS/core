export declare const Inject: <T extends Object>(definition: {
    new (...args: any[]): T;
} | string | symbol) => (target: Object, methodName: string | symbol | undefined, parameterIndex: number) => void;
export default Inject;
