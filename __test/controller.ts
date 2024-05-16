import type { IService } from "./interfaces";

import { Controller, Delete, Get, Inject, Options, Patch, Post, Put } from "../src";
import { TestService } from "./service";
import { Request, Response } from "express";


@Controller("test")
export class TestController {
    constructor(
        @Inject(TestService) private readonly testService: IService
    ) { }

    @Get()
    private _get(
        req: Request,
        res: Response
    ) {
        res.json({ test: "success" }).send();
    }

    @Post()
    private _post(
        req: Request,
        res: Response
    ) {
        console.log("req.body", req.body);
        res.json({ test: "success" }).send();
    }

    @Put()
    private _put(
        req: Request,
        res: Response
    ) {
        res.json({ test: "success" }).send();
    }

    @Patch()
    private _patch(
        req: Request,
        res: Response
    ) {
        res.json({ test: "success" }).send();
    }

    @Delete()
    private _delete(
        req: Request,
        res: Response
    ) {
        res.json({ test: "success" }).send();
    }

    @Options()
    private _options(
        req: Request,
        res: Response
    ) {
        res.json({ test: "success" }).send();
    }
}
