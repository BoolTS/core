import "reflect-metadata";
import "colors";
/**
 *
 * @param target
 */
export declare const BoolFactory: (target: new (...args: any[]) => unknown) => import("express-serve-static-core").Express;
export default BoolFactory;
