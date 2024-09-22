import { Module } from "../src";
import { TestController } from "./controller";
import { CustomDispatcher } from "./dispatcher";
import { FirstGuard } from "./firstGuard";
import { FirstMiddleware } from "./firstMiddleware";
import { TestRepository } from "./repository";
import { SecondGuard } from "./secondGuard";
import { SecondMiddleware } from "./secondMiddleware";
import { TestService } from "./service";

@Module<{
    mongodb: string;
}>({
    config: {
        mongodb: "123"
    },
    loaders: {
        mongodb: ({ config }) => {
            return [Symbol.for("etst"), { hehe: "435345" }];
        }
    },
    middlewares: [FirstMiddleware, SecondMiddleware],
    guards: [FirstGuard, SecondGuard],
    dispatchers: [CustomDispatcher],
    controllers: [TestController],
    dependencies: [TestService, TestRepository]
})
export class TestModule {}
