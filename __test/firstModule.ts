import { Module } from "@dist";
import { TestController } from "./controller";
import { TestRepository } from "./repository";
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
    // middlewares: [FirstMiddleware, SecondMiddleware],
    // guards: [FirstGuard, SecondGuard],
    // dispatchers: [CustomDispatcher],
    controllers: [TestController],
    dependencies: [TestService, TestRepository],
    webSockets: [TestWebSocket]
})
export class FirstModule {}
