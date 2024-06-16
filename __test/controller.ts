import type { IService } from "./interfaces";

import * as Zod from "zod";

import { Controller, Delete, Get, Inject, Options, Patch, Post, Put, ZodSchema } from "../src";
import { TestService } from "./service";
import { Request, Response } from "express";


const getAbcSchema = Zod.object({
    headers: Zod.object({
        authorization: Zod.string().min(10)
    })
});

const stringSchema = Zod.object({}).refine(async (val) => {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    await delay(10000);

    return val;
});

@Controller("test")
export class TestController {
    constructor(
        @Inject(TestService) private readonly testService: IService
    ) { }

    @Get("abc")
    private _get(
        @ZodSchema(getAbcSchema) req: Request,
        res: Response
    ) {
        console.log("this.testService", this.testService.exec())
        res.json({ test: "success" }).send();
    }

    @Post("abc")
    private _post(
        @ZodSchema(getAbcSchema) req: Request,
        res: Response
    ) {
        console.log("req.body", req.body);
        res.json({ test: "success" }).send();
    }

    @Put()
    private _put(
        @ZodSchema(getAbcSchema) req: Request,
        res: Response
    ) {
        res.json({ test: "success" }).send();
    }

    @Patch("abc/:id")
    private _patch(
        @ZodSchema(getAbcSchema) req: Request,
        res: Response
    ) {
        console.log(req.params)
        res.json({ test: "success" }).send();
    }

    @Delete()
    private _delete(
        req: Request,
        @ZodSchema(stringSchema) res: Response
    ) {
        res.json({ test: "success" }).send();
    }

    @Options()
    private _options(
        @ZodSchema(getAbcSchema) req: Request,
        res: Response
    ) {
        res.json({ test: "success" }).send();
    }
}
