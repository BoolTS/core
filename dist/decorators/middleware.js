import { middlewareKey } from "../keys";
export const Middleware = () => (target) => {
    const metadata = undefined;
    Reflect.defineMetadata(middlewareKey, metadata, target);
};
export default Middleware;
