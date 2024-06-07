import NodeCache from "node-cache";
import * as ApiTokenController from "../controllers/ApiTokenController.js";

const tokenCache = new NodeCache();

ApiTokenController.ApiTokenUpdateEventEmitter.
    on(
        "update",
        (token_id) => tokenCache.del(token_id)
    ).
    on(
        "delete",
        (token_id) => tokenCache.del(token_id)
    );

export async function tokenExists (token) {
    const cachedToken = tokenCache.get(token);
    if (cachedToken) {
        return cachedToken;
    }

    const tokenExists = await ApiTokenController.tokenExists(token);

    tokenCache.set(
        token,
        tokenExists
    );

    return tokenExists;
}
