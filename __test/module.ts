import { Module } from "../src";
import { TestController } from "./controller";
// import { TestRepository } from "./repository";
import { TestService } from "./service";

@Module({
    controllers: [
        TestController
    ],
    dependencies: [
        // TestService,
        // TestRepository
    ]
})
export class TestModule { }

export default TestModule;
