import NodeCache from "node-cache";
import * as HeartbeatController from "../controllers/HeartbeatController.js";
import logger from "../logger.js";

const matcherCache = new NodeCache();

HeartbeatController.HeartbeatUpdateEventEmitter.
    on(
        "update",
        (email_name) => matcherCache.del(email_name)
    ).
    on(
        "delete",
        (email_name) => matcherCache.del(email_name)
    );


/**
 * Get the matcher for the given email name
 * @param email_name
 * @returns {Promise<null|{subject: RegExp[], from: RegExp[], body: RegExp[]}>}
 */
export async function getMatcher (email_name) {
    const cachedMatcher = matcherCache.get(email_name);
    if (cachedMatcher) {
        return cachedMatcher;
    }

    const heartbeat = await HeartbeatController.getHeartbeat(email_name);

    if (!heartbeat) {
        return null;
    }

    const matcher = typeof heartbeat.matching_criteria === "object"
        ? heartbeat.matching_criteria
        : JSON.parse(heartbeat.matching_criteria);

    const compiledMatcher = {
        "from": [],
        "subject": [],
        "body": []
    };

    for (const from_matcher of matcher.from ?? []) {
        const match = from_matcher.match(/^\/(.*?)\/([gimsuy]*)$/);
        if (!match) {
            logger.warn(`Heartbeat ${email_name} has an invalid from matcher: ${from_matcher}`);
        } else {
            const [
                , pattern,
                flags
            ] = match;
            compiledMatcher.from.push(new RegExp(
                pattern,
                flags
            ));
        }
    }

    for (const subject_matcher of matcher.subject ?? []) {
        const match = subject_matcher.match(/^\/(.*?)\/([gimsuy]*)$/);
        if (!match) {
            logger.warn(`Heartbeat ${email_name} has an invalid subject matcher: ${subject_matcher}`);
        } else {
            const [
                , pattern,
                flags
            ] = match;
            compiledMatcher.subject.push(new RegExp(
                pattern,
                flags
            ));
        }
    }

    for (const body_matcher of matcher.from ?? []) {
        const match = body_matcher.match(/^\/(.*?)\/([gimsuy]*)$/);
        if (!match) {
            logger.warn(`Heartbeat ${email_name} has an invalid body matcher: ${body_matcher}`);
        } else {
            const [
                , pattern,
                flags
            ] = match;
            compiledMatcher.body.push(new RegExp(
                pattern,
                flags
            ));
        }
    }

    matcherCache.set(
        email_name,
        compiledMatcher
    );
    return compiledMatcher;
}
