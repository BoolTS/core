import type { IRepository } from "./interfaces";

import { Injectable } from "@dist";

@Injectable()
export class TestRepository implements IRepository {
    /**
     *
     */
    exec() {
        console.log("This is test repository.");
    }
}

export default TestRepository;
