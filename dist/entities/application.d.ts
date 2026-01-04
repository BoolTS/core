import type { ICustomValidator, TApplicationOptions, TPreLaunch } from "../interfaces";
import type { TConstructor } from "../utils";
export declare class Application<TRootClass extends Object = Object> {
    #private;
    private readonly classConstructor;
    private readonly options;
    constructor(classConstructor: TConstructor<TRootClass>, options: TApplicationOptions);
    /**
     * Static method to initialize app and await all reloads.
     * @param classConstructor
     * @param options
     * @returns
     */
    static create<TRootClass extends Object = Object>(classConstructor: TConstructor<TRootClass>, options: TApplicationOptions): Promise<Application<TRootClass>>;
    /**
     * Register app validator to execute all validations process in app.
     * @param validator
     */
    useValidator(validator: ICustomValidator): void;
    /**
     *
     * @returns
     */
    preLaunch(): Promise<NonNullable<TPreLaunch>>;
    /**
     * Start listen app on a port
     * @param port
     */
    listen(): Promise<void>;
    /**
     *
     * @param param0
     * @returns
     */
    private serializeResponse;
    /**
     *
     * @param response
     * @returns
     */
    private finalizeResponse;
}
