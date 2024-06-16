import "reflect-metadata";
import "colors";

import * as Qs from "qs";
import * as ResponseTime from "response-time";

import { type IControllerRoute, type TModuleOptions, controllerKey, controllerRoutesKey, moduleKey } from "../decorators";
import { default as ExpressApp, Router, json, urlencoded, Request, Response, NextFunction, Errback } from "express";
import { Injector } from "./injector";
import { errorInfer } from "../http";


export type TBoolFactoryOptions = Partial<{
    debug: boolean;
    log: Partial<{
        methods: Array<"GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS">;
    }>;
    queryParser: Partial<{
        depth: 10,
        arrayLimit: 50
    }>;
    prefix: string;
}>;


/**
 * 
 * @param target 
 * @param router 
 */
const controllerCreator = (
    controllerConstructor: new (...args: any[]) => unknown,
    parentRouter: Router = Router()
) => {
    if (!Reflect.getOwnMetadataKeys(controllerConstructor).includes(controllerKey)) {
        throw Error(`${controllerConstructor.name} is not a controller.`);
    }

    const controller = Injector.get(controllerConstructor);

    if (!controller) {
        throw Error("Can not initialize controller.");
    }

    const controllerMetadata = Reflect.getOwnMetadata(controllerKey, controllerConstructor) || "/";
    const routesMetadata = (Reflect.getOwnMetadata(controllerRoutesKey, controllerConstructor) || []) as Array<IControllerRoute>;
    const router = Router();

    routesMetadata.forEach(routeMetadata => {
        if (typeof routeMetadata.descriptor.value !== "function") {
            return;
        }

        const route = router.route(routeMetadata.path);

        switch (routeMetadata.httpMethod) {
            case "GET":
                return route.get(routeMetadata.descriptor.value.bind(controller));
            case "POST":
                return route.post(routeMetadata.descriptor.value.bind(controller));
            case "PUT":
                return route.put(routeMetadata.descriptor.value.bind(controller));
            case "PATCH":
                return route.patch(routeMetadata.descriptor.value.bind(controller));
            case "DELETE":
                return route.delete(routeMetadata.descriptor.value.bind(controller));
            case "OPTIONS":
                return route.options(routeMetadata.descriptor.value.bind(controller));
        }
    });

    return parentRouter.use(controllerMetadata, router);
}


/**
 * 
 * @param target 
 */
export const BoolFactory = (
    target: new (...args: any[]) => unknown,
    options?: TBoolFactoryOptions
) => {
    if (!Reflect.getOwnMetadataKeys(target).includes(moduleKey)) {
        throw Error(`${target.name} is not a module.`);
    }

    const metadata = Reflect.getOwnMetadata(moduleKey, target) as TModuleOptions;
    const allowOrigins = !metadata?.allowOrigins ?
        ["*"] : typeof metadata.allowOrigins !== "string" ?
            metadata.allowOrigins : [metadata.allowOrigins];
    const allowMethods = !metadata?.allowMethods ?
        ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"] : metadata.allowMethods;
    const app = ExpressApp();
    const factoryOptions = Object.freeze({
        allowLogsMethods: !options?.log?.methods ? ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"] : options.log.methods
    });
    const routers = !metadata?.controllers ?
        [] : metadata.controllers.map(controllerConstructor => controllerCreator(controllerConstructor));

    app.set("etag", "strong");
    app.set("query parser", (query: string) => Qs.parse(query, {
        depth: !options?.queryParser?.depth || options.queryParser.depth < 0 ? 10 : options.queryParser.depth,
        arrayLimit: !options?.queryParser?.arrayLimit || options.queryParser.arrayLimit < 0 ? 50 : options.queryParser.arrayLimit
    }));

    app.use(
        urlencoded({
            extended: true,
            inflate: true,
            limit: "1mb",
            parameterLimit: 20,
            type: "application/x-www-form-urlencoded",
            verify: undefined
        }),
        json({
            inflate: true,
            limit: "5mb",
            reviver: undefined,
            strict: true,
            type: "application/json",
            verify: undefined
        }),
        // Headers parser
        (req: Request, res: Response, next: NextFunction) => {
            for (const [key, value] of Object.entries(req.headers)) {
                req.headers[key] = typeof value !== "string" ? value : decodeURI(value)
            }

            next();
        },
        // Body parser
        (req: Request, res: Response, next: NextFunction) => {
            if (typeof req.body !== "object" || !req.body) {
                req.body = Object.freeze({});
            }

            next();
        },
        // Response time log
        ResponseTime.default((req: Request, res: Response, time: number) => {
            const requestMethod = req.method.toUpperCase();

            if (!factoryOptions.allowLogsMethods.includes(requestMethod)) {
                return;
            }

            const convertedMethod = `${requestMethod.yellow}`.bgBlue;
            const convertedPID = `${process.pid}`.yellow;
            const convertedReqIp = `${req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || req.ip || "<Unknown>"}`.yellow;
            const convertedTime = `${Math.round((time + Number.EPSILON) * 10 ** 2) / 10 ** 2}ms`.yellow;

            console.info(`PID: ${convertedPID} - Method: ${convertedMethod} - IP: ${convertedReqIp} - ${req.originalUrl.blue} - Time: ${convertedTime}`);
        })
    );

    app.use((req: Request, res: Response, next: NextFunction) => {
        if (!allowOrigins.includes("*")) {
            if (!allowOrigins.includes(req.headers.origin || "*")) {
                return res.status(403).json({
                    httpCode: 403,
                    data: {
                        origin: {
                            code: "origin:invalid:0x00001",
                            message: "Invalid origin."
                        }
                    }
                });
            }
        }

        res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
        res.header("Access-Control-Allow-Headers", "*");
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Access-Control-Allow-Methods", allowMethods.join(", "));

        next();
    });

    if (routers.length > 0) {
        !metadata?.prefix ?
            app.use(routers) : app.use(!metadata.prefix.startsWith("/") ?
                `/${metadata.prefix}` : metadata.prefix, routers);
    }

    // Register error catcher
    app.use(
        // Error catcher
        (err: Errback, req: Request, res: Response, next: NextFunction) => {
            errorInfer(res, err);

            if (!options?.debug) {
                return;
            }

            console.error("Headers:", JSON.stringify(req.headers), "\nBody:", JSON.stringify(req.body), "\nError:", JSON.stringify(err));
        }
    );

    return app;
}

export default BoolFactory;
