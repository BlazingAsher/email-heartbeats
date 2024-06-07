import {db} from "../services/database.js";
import {EventEmitter} from "events";

export const HeartbeatUpdateEventEmitter = new EventEmitter();

export function validateHeartbeatName (name) {
    if (name.length < 3) {
        throw new Error("Heartbeat name must be at least 3 characters long");
    }

    if (name.length > 100) {
        throw new Error("Heartbeat name must be at most 100 characters long");
    }

    if (!(/^[a-zA-Z0-9._+-]+$/).test(name)) {
        throw new Error("Heartbeat name must be a valid email mailbox name");
    }

    return true;
}

export function validateHeartbeatMatchingCriteria (matching_criteria) {
    try {
        var criteria = JSON.parse(matching_criteria);
    } catch (ignored) {
        throw new Error("Matching criteria must be a valid JSON object");
    }

    if (typeof criteria !== "object") {
        throw new Error("Matching criteria must be a valid JSON object");
    }

    if (criteria["from"] !== undefined && !Array.isArray(criteria["from"])) {
        throw new Error("Matching criteria \"from\" must be an array");
    }

    if (criteria["subject"] !== undefined && !Array.isArray(criteria["subject"])) {
        throw new Error("Matching criteria \"subject\" must be an array");
    }

    if (criteria["body"] !== undefined && !Array.isArray(criteria["body"])) {
        throw new Error("Matching criteria \"body\" must be an array");
    }

    for (const matcher_string of [].concat(
        criteria["from"] ?? [],
        criteria["subject"] ?? [],
        criteria["body"] ?? []
    )) {
        const match = matcher_string.match(/^\/(.*?)\/([gimsuy]*)$/);
        if (!match) {
            throw new Error(`Invalid matcher: ${matcher_string}`);
        }
    }

    return true;
}

export async function createHeartbeat (email_name, maximum_interval_seconds, matching_criteria, endpoint_id, forwarding_token, description) {
    validateHeartbeatName(email_name);
    validateHeartbeatMatchingCriteria(matching_criteria);

    await db("heartbeats").insert({
        email_name,
        "max_heartbeat_interval_seconds": maximum_interval_seconds,
        matching_criteria,
        endpoint_id,
        forwarding_token,
        description
    });

    return getHeartbeat(email_name);
}

export async function updateHeartbeat (email_name, maximum_interval_seconds, matching_criteria, endpoint_id, forwarding_token, description) {
    let updater = {};

    if (maximum_interval_seconds !== undefined) {
        updater.max_heartbeat_interval_seconds = maximum_interval_seconds;
    }

    if (matching_criteria !== undefined) {
        validateHeartbeatMatchingCriteria(matching_criteria);
        updater.matching_criteria = matching_criteria;
    }

    if (endpoint_id !== undefined) {
        updater.endpoint_id = endpoint_id;
    }

    if (forwarding_token !== undefined) {
        updater.forwarding_token = forwarding_token;
    }

    if (description !== undefined) {
        updater.description = description;
    }

    if (Object.keys(updater).length !== 0) {
        await db("heartbeats").where({email_name}).
            update(updater);
        HeartbeatUpdateEventEmitter.emit(
            "update",
            email_name
        );
    }

    return getHeartbeat(email_name);
}

export async function deleteHeartbeat (email_name) {
    const res = await db("heartbeats").where({email_name}).
        delete();
    HeartbeatUpdateEventEmitter.emit(
        "delete",
        email_name
    );

    return res > 0;
}

export async function getHeartbeat (email_name) {
    return db("heartbeats").where({email_name}).
        first();
}

export async function getAllHeartbeats () {
    return db("heartbeats").select();
}

export async function getStaleHeartbeats () {
    const staleHeartbeats = [];

    // heartbeats are stale only if we have a last_heartbeat
    const allHeartbeats = await db("heartbeats").
        whereNotNull("last_heartbeat");

    const nowTime = Math.floor(new Date().getTime() / 1000);

    for (const row of allHeartbeats) {
        if (nowTime - row.last_heartbeat > row.max_heartbeat_interval_seconds) {
            staleHeartbeats.push(row);
        }
    }

    return staleHeartbeats;
}

export async function getAllHeartbeatsByEndpointId (endpoint_id) {
    return db("heartbeats").where({endpoint_id});
}

export async function getNeverTriggeredHeartbeats () {
    return db("heartbeats").where({"last_heartbeat": null});
}

export async function recordHeartbeat (email_name) {
    // check if the email_name exists
    const exists = await db("heartbeats").where({email_name}).
        first();
    if (!exists) {
        throw new Error(`Email name ${email_name} does not exist`);
    }

    const res = await db("heartbeats").
        where({email_name}).
        update(
            {
                "last_heartbeat": Math.floor(Date.now() / 1000)
            },
            [
                "email_name",
                "last_heartbeat"
            ]
        ).
        limit(1);

    return res[0];
}

export function recordHeartbeatStaleNotifications (email_names, time) {
    return db("heartbeats").
        whereIn(
            "email_name",
            email_names
        ).
        update({
            "last_stale_notify": time
        });
}
