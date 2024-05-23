import "reflect-metadata";
interface IInjector {
    get<T>(classDefinition: {
        new (...args: any[]): T;
    }): T;
}
export declare const Injector: IInjector;
export default Injector;
