import type { IService, IRepository } from "./interfaces";

import { Inject, Injectable } from "../src";
import { TestRepository } from "./repository";


@Injectable()
export class TestService implements IService {
    constructor(
        @Inject(TestRepository) private readonly testRepository: IRepository
    ) { }

    /**
     * 
     */
    exec() {
        console.log("This is test service.", this.testRepository);
        this.testRepository.exec();
    }
}
