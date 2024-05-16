export declare const injectableKey = "__bool:injectable__";
export declare const Injectable: () => <T extends Object>(target: T, context?: ClassDecoratorContext) => T;
export default Injectable;
