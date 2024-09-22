import { dispatcherKey } from "../keys";
export const Dispatcher = () => (target) => {
    const metadata = undefined;
    Reflect.defineMetadata(dispatcherKey, metadata, target);
};
export default Dispatcher;
