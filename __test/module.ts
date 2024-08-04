import { Module } from "../src";
import { TestController } from "./controller";
// import { TestRepository } from "./repository";
import { TestService } from "./service";

@Module({
    allowOrigins: ["http://localhost:7000"],
    controllers: [TestController],
    dependencies: [
        // TestService,
        // TestRepository
    ]
})
export class TestModule {}

export default TestModule;
