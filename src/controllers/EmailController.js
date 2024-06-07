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

export function deleteEmailsOlderThan (timestamp) {
    return db("emails").where(
        "received_time",
        "<",
        timestamp
    ).
        delete();
}
