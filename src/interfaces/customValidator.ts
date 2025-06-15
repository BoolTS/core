import type { ValidationFailed } from "../entities";

export interface ICustomValidator<TValidData = unknown, TValidationSchema = unknown> {
    validate(
        data: unknown,
        validationSchema: TValidationSchema,
        argumentIndex: number,
        funcName: string | symbol
    ): (TValidData | ValidationFailed) | Promise<TValidData | ValidationFailed>;
}
