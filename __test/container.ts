import { Container } from "@dist";
import { mongodbKey } from "_constants";
import { FirstModule } from "firstModule";
import { SecondModule } from "secondModule";
import { FirstGuard } from "./firstGuard";
import { FirstMiddleware } from "./firstMiddleware";
import { TestRepository } from "./repository";
import { SecondGuard } from "./secondGuard";
import { SecondMiddleware } from "./secondMiddleware";
import { TestService } from "./service";

@Container<{
    mongodb: string;
}>({
    config: {
        mongodb: "123"
    },
    loaders: {
        mongodb: ({ config }) => {
            return [mongodbKey, { hehe: "435345" }];
        }
    },
    modules: [FirstModule, SecondModule],
    middlewares: [FirstMiddleware, SecondMiddleware],
    guards: [FirstGuard, SecondGuard],
    dependencies: [TestService, TestRepository]
})
export class AppContainer {}
