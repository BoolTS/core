import type { IService, IRepository } from "./interfaces";
export declare class TestService implements IService {
    private readonly testRepository;
    constructor(testRepository: IRepository);
    /**
     *
     */
    exec(): void;
}
