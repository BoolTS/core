"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoolFactory = void 0;
require("reflect-metadata");
require("colors");
const Qs = __importStar(require("qs"));
const ResponseTime = __importStar(require("response-time"));
const decorators_1 = require("../decorators");
const express_1 = __importStar(require("express"));
const injector_1 = require("./injector");
const http_1 = require("../http");
/**
 *
 * @param target
 * @param router
 */
const controllerCreator = (controllerConstructor, parentRouter = (0, express_1.Router)()) => {
    if (!Reflect.getOwnMetadataKeys(controllerConstructor).includes(decorators_1.controllerKey)) {
        throw Error(`${controllerConstructor.name} is not a controller.`);
    }
    const controller = injector_1.Injector.get(controllerConstructor);
    if (!controller) {
        throw Error("Can not initialize controller.");
    }
    const controllerMetadata = Reflect.getOwnMetadata(decorators_1.controllerKey, controllerConstructor) || "/";
    const routesMetadata = (Reflect.getOwnMetadata(decorators_1.controllerRoutesKey, controllerConstructor) || []);
    const router = (0, express_1.Router)();
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
};
/**
 *
 * @param target
 */
const BoolFactory = (target, options) => {
    if (!Reflect.getOwnMetadataKeys(target).includes(decorators_1.moduleKey)) {
        throw Error(`${target.name} is not a module.`);
    }
    const metadata = Reflect.getOwnMetadata(decorators_1.moduleKey, target);
    const allowOrigins = !metadata?.allowOrigins ?
        ["*"] : typeof metadata.allowOrigins !== "string" ?
        metadata.allowOrigins : [metadata.allowOrigins];
    const allowMethods = !metadata?.allowMethods ?
        ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"] : metadata.allowMethods;
    const app = (0, express_1.default)();
    const factoryOptions = Object.freeze({
        allowLogsMethods: !options?.log?.methods ? ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"] : options.log.methods
    });
    const routers = !metadata?.controllers ?
        [] : metadata.controllers.map(controllerConstructor => controllerCreator(controllerConstructor));
    app.set("etag", "strong");
    app.set("query parser", (query) => Qs.parse(query, {
        depth: !options?.queryParser?.depth || options.queryParser.depth < 0 ? 10 : options.queryParser.depth,
        arrayLimit: !options?.queryParser?.arrayLimit || options.queryParser.arrayLimit < 0 ? 50 : options.queryParser.arrayLimit
    }));
    app.use((0, express_1.urlencoded)({
        extended: true,
        inflate: true,
        limit: "1mb",
        parameterLimit: 20,
        type: "application/x-www-form-urlencoded",
        verify: undefined
    }), (0, express_1.json)({
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
        !metadata?.prefix ?
            app.use(routers) : app.use(!metadata.prefix.startsWith("/") ?
            `/${metadata.prefix}` : metadata.prefix, routers);
    }
    // Register error catcher
    app.use(
    // Error catcher
    (err, req, res, next) => {
        (0, http_1.errorInfer)(res, err);
        if (!options?.debug) {
            return;
        }
        console.error("Headers:", JSON.stringify(req.headers), "\nBody:", JSON.stringify(req.body), "\nError:", JSON.stringify(err));
    });
    return app;
};
exports.BoolFactory = BoolFactory;
exports.default = exports.BoolFactory;
