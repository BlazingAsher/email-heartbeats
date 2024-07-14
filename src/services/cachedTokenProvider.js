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

export async function getTokenAccessControls (token) {
    const cachedToken = tokenCache.get(token);
    if (cachedToken) {
        return cachedToken;
    }

    const tokenData = await ApiTokenController.getApiToken(token);

    if(tokenData === undefined){
        tokenCache.set(
            token,
            new Set()
        )
    }
    else {
        tokenCache.set(
            token,
            new Set(tokenData.access_controls.split(","))
        );
    }


    return tokenCache.get(token);
}
