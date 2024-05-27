import "reflect-metadata";
import "colors";
import * as Qs from "qs";
import * as ResponseTime from "response-time";
import { controllerKey, controllerRoutesKey, moduleKey } from "../decorators";
import { default as ExpressApp, Router, json, urlencoded } from "express";
import { Injector } from "./injector";
import { errorInfer } from "../http";
/**
 *
 * @param target
 * @param router
 */
const controllerCreator = (target, router = Router()) => {
    if (!Reflect.getOwnMetadataKeys(target).includes(controllerKey)) {
        throw Error(`${target.name} is not a controller.`);
    }
    const controller = Injector.get(target);
    if (!controller) {
        throw Error("Can not initialize controller.");
    }
    const controllerMetadata = Reflect.getOwnMetadata(controllerKey, target) || "/";
    const routesMetadata = (Reflect.getOwnMetadata(controllerRoutesKey, target) || []);
    const innerRouter = router.route(controllerMetadata);
    routesMetadata.forEach(route => {
        if (typeof route.descriptor.value !== "function") {
            return;
        }
        switch (route.httpMethod) {
            case "GET":
                return innerRouter.get(route.descriptor.value.bind(controller));
            case "POST":
                return innerRouter.post(route.descriptor.value.bind(controller));
            case "PUT":
                return innerRouter.put(route.descriptor.value.bind(controller));
            case "PATCH":
                return innerRouter.patch(route.descriptor.value.bind(controller));
            case "DELETE":
                return innerRouter.delete(route.descriptor.value.bind(controller));
            case "OPTIONS":
                return innerRouter.options(route.descriptor.value.bind(controller));
        }
    });
    return router;
};
/**
 *
 * @param target
 */
export const BoolFactory = (target, options) => {
    if (!Reflect.getOwnMetadataKeys(target).includes(moduleKey)) {
        throw Error(`${target.name} is not a module.`);
    }
    const metadata = Reflect.getOwnMetadata(moduleKey, target);
    const routers = !metadata?.controllers ? [] : metadata.controllers.map(controllerConstructor => controllerCreator(controllerConstructor));
    const allowOrigins = !metadata?.allowOrigins ?
        ["*"] : typeof metadata.allowOrigins !== "string" ?
        metadata.allowOrigins : [metadata.allowOrigins];
    const allowMethods = !metadata?.allowMethods ?
        ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"] : metadata.allowMethods;
    const app = ExpressApp();
    const factoryOptions = Object.freeze({
        allowLogsMethods: !options?.log?.methods ? ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"] : options.log.methods
    });
    app.set("etag", "strong");
    app.set("query parser", (query) => Qs.parse(query, {
        depth: !options?.queryParser?.depth || options.queryParser.depth < 0 ? 10 : options.queryParser.depth,
        arrayLimit: !options?.queryParser?.arrayLimit || options.queryParser.arrayLimit < 0 ? 50 : options.queryParser.arrayLimit
    }));
    app.use(urlencoded({
        extended: true,
        inflate: true,
        limit: "1mb",
        parameterLimit: 20,
        type: "application/x-www-form-urlencoded",
        verify: undefined
    }), json({
        inflate: true,
        limit: "5mb",
        reviver: undefined,
        strict: true,
        type: "application/json",
        verify: undefined
    }), 
    // Headers parser
    (req, res, next) => {
        for (const [key, value] of Object.entries(req.headers)) {
            req.headers[key] = typeof value !== "string" ? value : decodeURI(value);
        }
        next();
    }, 
    // Body parser
    (req, res, next) => {
        if (typeof req.body !== "object" || !req.body) {
            req.body = Object.freeze({});
        }
        next();
    }, 
    // Error catcher
    (err, req, res, next) => {
        errorInfer(res, err);
        if (!options?.debug) {
            return;
        }
        console.error("Headers:", JSON.stringify(req.headers), "\nBody:", JSON.stringify(req.body), "\nError:", JSON.stringify(err));
    }, 
    // Response time log
    ResponseTime.default((req, res, time) => {
        const requestMethod = req.method.toUpperCase();
        if (!factoryOptions.allowLogsMethods.includes(requestMethod)) {
            return;
        }
        const convertedMethod = `${requestMethod.yellow}`.bgBlue;
        const convertedPID = `${process.pid}`.yellow;
        const convertedReqIp = `${req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || req.ip || "<Unknown>"}`.yellow;
        const convertedTime = `${Math.round((time + Number.EPSILON) * 10 ** 2) / 10 ** 2}ms`.yellow;
        console.info(`PID: ${convertedPID} - Method: ${convertedMethod} - IP: ${convertedReqIp} - ${req.originalUrl.blue} - Time: ${convertedTime}`);
    }));
    app.use((req, res, next) => {
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
        app.use(routers);
    }
    return app;
};
export default BoolFactory;
