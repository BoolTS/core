import type { IService } from "./interfaces";

import * as Zod from "zod";

import { Controller, Delete, Get, Inject, Options, Patch, Post, Put, ZodSchema } from "../src";
import { TestService } from "./service";

const getAbcSchema = Zod.object({
    headers: Zod.object({
        authorization: Zod.string().min(10)
    })
});

const stringSchema = Zod.object({}).refine(async (val) => {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(10000);

    return val;
});

@Controller("test")
export class TestController {
    constructor(@Inject(TestService) private readonly testService: IService) {}

    @Get("abc")
    public get(@ZodSchema(getAbcSchema) req: Request) {
        console.log("HEHE");
        console.log("this.testService", this.testService.exec());
    }

    @Post("abc")
    public post(@ZodSchema(getAbcSchema) req: Request) {
        console.log("req.body", req.body);
    }

    @Put()
    public put(@ZodSchema(getAbcSchema) req: Request) {}

    @Patch("abc/:id")
    public patch(@ZodSchema(getAbcSchema) req: Request) {}

    @Delete()
    public delete(req: Request) {}

    @Options()
    public options(@ZodSchema(getAbcSchema) req: Request) {}
}
