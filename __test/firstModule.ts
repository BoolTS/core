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
    config: {
        key: Symbol("firstModuleConfig"),
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
export class FirstModule {}
