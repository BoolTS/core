import "reflect-metadata";
interface IInjector {
    get<T>(target: new (...args: any[]) => T): T;
}
export declare const Injector: IInjector;
export default Injector;
