import type { IService } from "./interfaces";

import * as Zod from "zod";

import {
    Controller,
    Delete,
    Get,
    Inject,
    Options,
    Param,
    Params,
    Patch,
    Post,
    Put,
    Query,
    RequestBody,
    RequestHeaders
} from "@src";
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

const headersSchema = Zod.object({
    "content-type": Zod.string()
});

@Controller("test")
export class TestController {
    constructor(
        @Inject(Symbol.for("etst")) private readonly testInject: any,
        @Inject(TestService) private readonly testService: IService
    ) {
        console.log("testInject", testInject);
    }

    @Get("abc/:id.xml")
    public get(@Param("id") id: string) {
        console.log("HEHE", id, typeof id);
        console.log("this.testService", this.testService.exec());
    }

    @Post("abc/:id/provider/:providerId.xml")
    public async post(
        @RequestHeaders(headersSchema)
        headers: Zod.infer<typeof headersSchema>,
        @Params()
        params: any,
        @Query()
        query: any,
        @RequestBody(bodySchema)
        body: Zod.infer<typeof bodySchema>
    ) {
        console.log("req.headers", params);
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
