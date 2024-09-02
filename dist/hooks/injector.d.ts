import "reflect-metadata";
type TDefinition<T = any> = {
    new (...args: any[]): T;
} | string | symbol;
interface IInjector {
    set(key: TDefinition, value: any): void;
    get<T>(definition: TDefinition): T;
}
export declare const Injector: IInjector;
export default Injector;
