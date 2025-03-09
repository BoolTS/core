import { Module } from "@dist";
import { TestController } from "./controller";
import { CustomDispatcher } from "./dispatcher";
import { FirstGuard } from "./firstGuard";
import { FirstMiddleware } from "./firstMiddleware";
import { TestRepository } from "./repository";
import { SecondGuard } from "./secondGuard";
import { SecondMiddleware } from "./secondMiddleware";
import { TestService } from "./service";
import { TestWebSocket } from "./webSocket";

@Module<{
    mongodb: string;
}>({
    prefix: "/second-module",
    config: {
        key: Symbol.for("secondModuleConfig"),
        value: {
            mongodb: "123"
        }
    },
    middlewares: [FirstMiddleware, SecondMiddleware],
    guards: [FirstGuard, SecondGuard],
    dispatchers: [CustomDispatcher],
    controllers: [TestController],
    dependencies: [TestService, TestRepository],
    webSockets: [TestWebSocket]
})
export class SecondModule {}
