export declare const injectKey = "design:paramtypes";
export declare const Inject: <T extends Object>(classDefinition: {
    new (...args: any[]): T;
}) => (target: Object, parameterName: string | Symbol | undefined, parameterIndex: number) => void;
export default Inject;
