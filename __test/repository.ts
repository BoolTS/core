import type { IRepository } from "./interfaces";

import { Injectable } from "../src";


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
