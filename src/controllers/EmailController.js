import {db} from "../services/database.js";

export function insertEmail (received_time, to, from, subject, body) {
    return db("emails").insert({
        received_time,
        to,
        from,
        subject,
        body
    });
}

export function getEmail (id) {
    return db("emails").where(
        "id",
        id
    ).
        first();
}

export function getEmails (newer_than, limit) {
    return db("emails").where(
        "received_time",
        ">",
        newer_than
    ).
        orderBy(
            "received_time",
            "desc"
        ).
        limit(limit).
        select();
}

export function deleteEmailsOlderThan (timestamp) {
    return db("emails").where(
        "received_time",
        "<",
        timestamp
    ).
        delete();
}
