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

@Module({
    options: {
        allowOrigins: ["*"]
    },
    middlewares: [FirstMiddleware, SecondMiddleware],
    guards: [FirstGuard, SecondGuard],
    beforeDispatchers: [BeforeDispatcher],
    afterDispatchers: [AfterDispatcher],
    controllers: [TestController],
    dependencies: [TestService, TestRepository]
})
export class TestModule {}

export default TestModule;
