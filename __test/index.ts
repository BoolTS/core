import { BoolFactory } from "@dist";
import { AppContainer } from "container";

BoolFactory(AppContainer, {
    port: 3000,
    log: {
        methods: ["GET", "POST"]
    }
});
