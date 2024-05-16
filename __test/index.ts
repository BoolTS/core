import "reflect-metadata";

import { BoolFactory } from "../src";
import { TestModule } from "./module";


const app = BoolFactory(TestModule);

app.listen(3000, () => {
    console.log(`Listening on port ${3000}...`);
});
