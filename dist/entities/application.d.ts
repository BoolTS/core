import type { TContainerMetadata, TWebSocketEventHandlerMetadata } from "../decorators";
import type { TConstructor } from "../ultils";
import { parse as QsParse } from "qs";
import type { ICustomValidator } from "../interfaces/customValidator";
type TParamsType = Record<string, string>;
type TApplicationOptions = Required<{
    port: number;
}> & Partial<{
    config: Record<string | symbol, any> | (() => Record<string | symbol, any>);
    prefix: string;
    debug: boolean;
    log: Partial<{
        methods: Array<"GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS">;
    }>;
    queryParser: Parameters<typeof QsParse>[1];
    static: Required<{
        path: string;
    }> & Partial<{
        headers: TParamsType;
        cacheTimeInSeconds: number;
    }>;
    cors: Partial<{
        credentials: boolean;
        origins: string | Array<string>;
        methods: Array<"GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS">;
        headers: Array<string>;
    }>;
}>;
type TPreLaunch = undefined | Readonly<{
    containerMetadata: TContainerMetadata;
    modulesConverted: Array<TConstructor<unknown>>;
    resolutedContainer?: Awaited<ReturnType<Application["containerResolution"]>>;
    resolutedModules: Array<Awaited<ReturnType<Application["moduleResolution"]>>>;
    webSocketsMap: Map<string, TWebSocketEventHandlerMetadata>;
}>;
export declare class Application<TRootClass extends Object = Object> {
    #private;
    private readonly classConstructor;
    private readonly options;
    constructor(classConstructor: TConstructor<TRootClass>, options: TApplicationOptions);
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
    private containerResolution;
    /**
     *
     * @param param0
     * @returns
     */
    private moduleResolution;
    /**
     *
     * @param data
     * @param zodSchema
     * @param argumentIndex
     * @param funcName
     * @returns
     */
    private argumentsResolution;
    /**
     *
     * @param param0
     * @returns
     */
    private initControllerInstance;
    /**
     *
     * @param param0
     * @returns
     */
    private initWebSocketInstance;
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
    /**
     *
     * @param param0
     * @returns
     */
    private httpFetcher;
    /**
     *
     * @param bun
     * @param bool
     * @returns
     */
    private webSocketFetcher;
}
export {};
