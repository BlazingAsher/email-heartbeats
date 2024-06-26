import short from "short-uuid";
import {EventEmitter} from "events";

import {db} from "../services/database.js";

export const ApiTokenUpdateEventEmitter = new EventEmitter();

export async function getAllApiTokens () {
    return db("api_tokens");
}

export async function getApiToken (id) {
    return db("api_tokens").where(
        "id",
        id
    ).
        first();
}

export async function tokenExists (id) {
    return await getApiToken(id) !== undefined;
}

export async function createApiToken (description) {
    const id = short.uuid();
    const insertData = {
        id
    };

    if (description !== undefined) {
        insertData.description = description;
    }

    await db("api_tokens").insert(insertData);

    return getApiToken(id);
}

export async function updateApiToken (id, description) {
    const updateData = {};

    if (description !== undefined) {
        updateData.description = description;
    }

    if (Object.keys(updateData).length !== 0) {
        await db("api_tokens").where(
            "id",
            id
        ).
            update(updateData);
        ApiTokenUpdateEventEmitter.emit(
            "update",
            id
        );
    }

    return getApiToken(id);
}

export async function deleteApiToken (id) {
    const res = await db("api_tokens").where(
        "id",
        id
    ).
        delete();
    ApiTokenUpdateEventEmitter.emit(
        "delete",
        id
    );

    return res > 0;
}
