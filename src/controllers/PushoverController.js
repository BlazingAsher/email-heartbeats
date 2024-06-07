import {EventEmitter} from "events";
import {db} from "../services/database.js";

export const EndpointUpdateEventEmitter = new EventEmitter();

export async function getEndpoints () {
    return db("pushover_endpoints").select();
}

export async function getEndpoint (id) {
    return db("pushover_endpoints").where({id}).
        first();
}

export async function createEndpoint (user_token, timezone, description) {
    await db("pushover_endpoints").insert({
        user_token,
        timezone,
        description
    });

    return getEndpoint(user_token);
}

export async function updateEndpoint (id, user_key, timezone, description) {
    let updater = {};

    if (user_key !== undefined) {
        updater.user_key = user_key;
    }

    if (timezone !== undefined) {
        updater.timezone = timezone;
    }

    if (description !== undefined) {
        updater.description = description;
    }

    if (Object.keys(updater).length !== 0) {
        await db("pushover_endpoints").where({id}).
            update(updater);
        EndpointUpdateEventEmitter.emit(
            "update",
            id
        );
    }

    return getEndpoint(user_key);
}
