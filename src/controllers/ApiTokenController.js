import short from "short-uuid";
import {EventEmitter} from "events";

import {db} from "../services/database.js";

export const ApiTokenUpdateEventEmitter = new EventEmitter();

function validateAccessControls(access_controls) {
    for (const access_control of access_controls) {
        if (!["read", "write", "email:write", "heartbeat:write"].includes(access_control)) {
            throw new Error("Invalid access control: " + access_control);
        }
    }

    return true;
}

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

export async function createApiToken (description, access_controls) {
    validateAccessControls(access_controls.split(","));

    const id = short.uuid();
    const insertData = {
        id,
        access_controls: access_controls
    };

    if (description !== undefined) {
        insertData.description = description;
    }

    await db("api_tokens").insert(insertData);

    return getApiToken(id);
}


export async function updateApiToken (id, description, access_controls) {
    const updateData = {};

    if (description !== undefined) {
        updateData.description = description;
    }

    if(access_controls !== undefined){
        validateAccessControls(access_controls.split(","));
        updateData.access_controls = access_controls;
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
