import type { IService } from "./interfaces";

import { Controller, Delete, Get, Inject, Options, Patch, Post, Put } from "../src";
import { TestService } from "./service";
import { Request, Response } from "express";


@Controller("test")
export class TestController {
    constructor(
        @Inject(TestService) private readonly testService: IService
    ) { }

    @Get("abc")
    private _get(
        req: Request,
        res: Response
    ) {
        console.log("this.testService", this.testService.exec())
        res.json({ test: "success" }).send();
    }

    @Post("abc")
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

    @Patch("abc/:id")
    private _patch(
        req: Request,
        res: Response
    ) {
        console.log(req.params)
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
