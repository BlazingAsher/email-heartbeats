import {getMatcher} from "./cachedMatcherProvider.js";
import {recordHeartbeat} from "../controllers/HeartbeatController.js";
import {getForwardingInformation} from "./cachedForwardingInformationProvider.js";
import logger from "../logger.js";
import {sendPushoverMessage} from "../connectors/PushoverConnector.js";
import {insertEmail} from "../controllers/EmailController.js";

export async function processHeartbeatContent (email_name, from, subject, body, to, requireExistingHeartbeat = false) {
    const normalizedSubject = subject ?? "(no subject)";

    const matcher = await getMatcher(email_name);

    try {
        if (body !== undefined) {
            await insertEmail(
                Math.floor(Date.now() / 1000),
                to,
                from ?? "(unknown sender)",
                normalizedSubject,
                body,
                matcher ? email_name : null
            );
        }
    } catch (e) {
        logger.error(
            "Unable to store email.",
            e
        );
    }

    if (!matcher) {
        logger.warn("No heartbeat found for email: " + email_name);
        if (requireExistingHeartbeat) {
            throw new Error(`Email name ${email_name} does not exist`);
        }
        return;
    }

    let matched = false;

    for (const from_matcher of matcher.from) {
        from_matcher.lastIndex = 0;
        if (from_matcher.test(from ?? "")) {
            matched = true;
            break;
        }
    }

    if (!matched) {
        for (const subject_matcher of matcher.subject) {
            subject_matcher.lastIndex = 0;
            if (subject_matcher.test(normalizedSubject)) {
                matched = true;
                break;
            }
        }
    }

    if (!matched && body !== undefined) {
        for (const body_matcher of matcher.body) {
            body_matcher.lastIndex = 0;
            if (body_matcher.test(body)) {
                matched = true;
                break;
            }
        }
    }

    if (matched) {
        await recordHeartbeat(email_name);
    } else if (body !== undefined) {
        // send to pushover
        logger.info("No matches, forwarding to Pushover.");
        const forwardingInfo = await getForwardingInformation(email_name);
        await sendPushoverMessage(
            forwardingInfo.forwarding_token,
            forwardingInfo.user_key,
            body,
            normalizedSubject
        );
    } else {
        logger.info("No matches, no body, skipping.");
    }
}

export async function processEmail (email) {
    const destination = email.to?.value?.[0]?.address;

    if (!destination) {
        logger.warn(
            "Email has no destination.",
            {
                "body": email.text
            }
        );
        return;
    }

    const from = email.from?.value?.[0]?.address ?? "(unknown sender)";
    const subject = email.subject ?? "(no subject)";
    const body = email.text.trim() === ""
        ? "(empty body)"
        : email.text;

    const email_name = destination.split("@")[0];

    await processHeartbeatContent(
        email_name,
        from,
        subject,
        body,
        destination,
        false
    );
}
