import "reflect-metadata";
import "colors";
export type TBoolFactoryOptions = Partial<{
    debug: boolean;
    log: Partial<{
        methods: Array<"GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS">;
    }>;
    queryParser: Partial<{
        depth: 10;
        arrayLimit: 50;
    }>;
    prefix: string;
}>;
/**
 *
 * @param target
 */
export declare const BoolFactory: (target: new (...args: any[]) => unknown, options?: TBoolFactoryOptions) => import("express-serve-static-core").Express;
export default BoolFactory;
