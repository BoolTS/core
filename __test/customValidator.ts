import type { ICustomValidator } from "@src";
import type { Schema } from "zod";

import { ValidationFailed } from "../src";

export const customValidator: ICustomValidator<unknown, Schema> = {
    validate: async (data, schema, index, funcName) => {
        console.log("HEHEHE");

        const validation = await schema.safeParseAsync(data);

        if (!validation.success) {
            return new ValidationFailed(validation.error.issues);
        }

        return validation.data;
    }
};
