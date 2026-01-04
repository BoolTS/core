import { Objects } from "../constants";

export const inferStatusText = (httpCode: number): string => {
    for (const [_key, value] of Object.entries(Objects.httpStatuses)) {
        if (value.status !== httpCode) {
            continue;
        }

        return value.statusText;
    }

    return "Unknown error";
};
