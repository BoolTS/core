import "reflect-metadata";
type TDefinition<T = any> = {
    new (...args: any[]): T;
} | string | symbol;
interface IInjector {
    set(key: TDefinition, value: any): void;
    get<T>(definition: TDefinition): T;
}
export declare class Injector implements IInjector {
    private readonly _mapper;
    /**
     *
     * @param constructor
     */
    get<T>(definition: TDefinition): any;
    /**
     *
     * @param key
     * @param value
     */
    set(key: TDefinition, value: any): void;
}
export default Injector;
