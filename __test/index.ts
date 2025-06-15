import { BoolFactory } from "@dist";
import { AppContainer } from "container";

const bootstrap = async () => {
    const app = await BoolFactory(AppContainer, {
        debug: true,
        port: 3000,
        log: {
            methods: ["GET", "POST"]
        }
    });

    // app.useValidator(customValidator);

    app.listen();
};

bootstrap();
