import type { IRepository, IService } from "./interfaces";

import { Inject, Injectable } from "@dist";
import { TestRepository } from "./repository";

@Injectable()
export class TestService implements IService {
    constructor(@Inject(TestRepository) private readonly testRepository: IRepository) {}

    /**
     *
     */
    exec() {
        console.log("This is test service.", this.testRepository);
        this.testRepository.exec();
    }
}
