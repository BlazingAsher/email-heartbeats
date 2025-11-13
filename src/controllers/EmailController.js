import {db} from "../services/database.js";

export function insertEmail (received_time, to, from, subject, body, email_name) {
    return db("emails").insert({
        received_time,
        to,
        from,
        subject,
        body,
        email_name
    });
}

export function getEmail (id) {
    return db("emails").where(
        "id",
        id
    ).
        first();
}

export function getEmails (newer_than, limit, email_name) {
    let query = db("emails").where(
        "received_time",
        ">",
        newer_than
    );

    if (email_name !== undefined) {
        query = query.andWhere(
            "email_name",
            "=",
            email_name
        );
    }

    return query.
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
