import type { IService } from "./interfaces";
export declare class TestController {
    private readonly testService;
    constructor(testService: IService);
    private _get;
    private _post;
    private _put;
    private _patch;
    private _delete;
    private _options;
}
