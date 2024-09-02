import { Module } from "../src";
import { AfterDispatcher } from "./afterDispatcher";
import { BeforeDispatcher } from "./beforeDispatcher";
import { TestController } from "./controller";
import { FirstGuard } from "./firstGuard";
import { FirstMiddleware } from "./firstMiddleware";
import { SecondMiddleware } from "./secondMiddleware";
import { TestRepository } from "./repository";
import { TestService } from "./service";
import { SecondGuard } from "./secondGuard";

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
    beforeDispatchers: [BeforeDispatcher],
    afterDispatchers: [AfterDispatcher],
    controllers: [TestController],
    dependencies: [TestService, TestRepository]
})
export class TestModule {}
