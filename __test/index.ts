import "reflect-metadata";

import { BoolFactory } from "../src";
import { TestModule } from "./module";

BoolFactory(TestModule, {
    port: 3000,
    log: {
        methods: ["GET", "POST"]
    }
});
