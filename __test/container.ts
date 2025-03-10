import { Container } from "@dist";
import { mongodbKey } from "_constants";
import { FirstModule } from "firstModule";
import { SecondModule } from "secondModule";
import { TestRepository } from "./repository";
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
    dependencies: [TestService, TestRepository]
})
export class AppContainer {}
