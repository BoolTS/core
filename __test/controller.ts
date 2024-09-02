import type { IService } from "./interfaces";

import * as Zod from "zod";

import { Body, Controller, Delete, Get, Inject, Options, Params, Patch, Post, Put, Param, Query } from "../src";
import { TestService } from "./service";

const postParamsSchema = Zod.object({
    id: Zod.string(),
    providerId: Zod.string().uuid()
});

const bodySchema = Zod.object({
    data: Zod.object({
        name: Zod.string(),
        age: Zod.number()
    })
});

const requestSchema = Zod.object({
    headers: Zod.object({
        authorization: Zod.string().min(10)
    }),
    body: bodySchema
});

const stringSchema = Zod.object({}).refine(async (val) => {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(10000);

    return val;
});

@Controller("test")
export class TestController {
    constructor(
        @Inject(Symbol.for("etst")) private readonly testInject: any,
        @Inject(TestService) private readonly testService: IService
    ) {
        console.log("testInject", testInject);
    }

    @Get("abc/:id")
    public get(@Param("id") id: string) {
        console.log("HEHE", id, typeof id);
        console.log("this.testService", this.testService.exec());
    }

    @Post("abc/:id/provider/:providerId")
    public async post(
        @Params()
        params: any,
        @Query()
        query: any,
        @Body(bodySchema)
        body: Zod.infer<typeof bodySchema>
    ) {
        console.log("req.headers", query);
        console.log("===========================");
    }

    @Put()
    public put(req: any) {}

    @Patch("abc/:testId")
    public patch(req: Request) {}

    @Delete()
    public delete(req: Request) {}

    @Options()
    public options(req: Request) {}
}
