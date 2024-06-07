import {schedule} from "node-cron";

import * as HeartbeatController from "../controllers/HeartbeatController.js";
import * as PushoverController from "../controllers/PushoverController.js";
import {sendPushoverMessage} from "../connectors/PushoverConnector.js";
import logger from "../logger.js";

async function neverTriggeredHeartbeatNotifier () {
    const neverTriggeredHeartbeats = await HeartbeatController.getNeverTriggeredHeartbeats();

    const notificationsByEndpoint = {};

    for (const heartbeat of neverTriggeredHeartbeats) {
        if (!notificationsByEndpoint[heartbeat.endpoint_id]) {
            notificationsByEndpoint[heartbeat.endpoint_id] = [];
        }

        notificationsByEndpoint[heartbeat.endpoint_id].push(heartbeat);
    }

    for (const [
        endpointId,
        heartbeats
    ] of Object.entries(notificationsByEndpoint)) {
        const endpoint = await PushoverController.getEndpoint(endpointId);

        let notificationMessage = "The following heartbeats have never been triggered:\n\n";

        for (const heartbeat of heartbeats) {
            notificationMessage += `${heartbeat.email_name}`;

            if (heartbeat.description) {
                notificationMessage += ` (${heartbeat.description})`;
            }

            notificationMessage += "\n";
        }

        await sendPushoverMessage(
            endpoint.user_key,
            notificationMessage
        );
    }
}

schedule(
    "0 8 * * 1",
    () => {
        neverTriggeredHeartbeatNotifier().catch((err) => {
            logger.error(
                "Error in neverTriggerdHeartbeatNotifier:",
                err
            );
        });
    }
);
