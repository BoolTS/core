import { Container } from "@dist";
import { mongodbKey } from "_constants";
import { FirstModule } from "firstModule";
import { TestRepository } from "./repository";
import { TestService } from "./service";

@Container<{
    mongodb: string;
}>({
    config: {
        mongodb: "123"
    },
    loaders: {
        mongodb: ({ config }) => [mongodbKey, { hehe: "435345" }]
    },
    modules: [FirstModule],
    dependencies: [TestService, TestRepository]
})
export class AppContainer {}
