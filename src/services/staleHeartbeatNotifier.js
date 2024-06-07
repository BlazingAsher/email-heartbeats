import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import * as HeartbeatController from "../controllers/heartbeatController";
import * as PushoverController from "../controllers/pushoverController";
import {sendPushoverMessage} from "../connectors/PushoverConnector.js";
import logger from "../logger.js";

dayjs.extend(utc);
dayjs.extend(timezone);

function formatSeconds (seconds) {
    const days = Math.floor(seconds / 86400);
    seconds -= days * 86400;
    const hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

async function staleHeartbeatNotifier () {
    const startTime = Date.now() / 1000;
    const staleHeartbeats = await HeartbeatController.getStaleHeartbeats();

    const notificationsByEndpoint = {};

    for (const heartbeat of staleHeartbeats) {
        const lastStaleNotify = heartbeat.last_stale_notify ?? 0;

        if (lastStaleNotify < heartbeat.last_heartbeat || startTime - lastStaleNotify > 86400) {
            if (!notificationsByEndpoint[heartbeat.endpoint_id]) {
                notificationsByEndpoint[heartbeat.endpoint_id] = [];
            }

            notificationsByEndpoint[heartbeat.endpoint_id].push(heartbeat);
        }
    }

    for (const [
        endpointId,
        heartbeats
    ] of Object.entries(notificationsByEndpoint)) {
        const endpoint = await PushoverController.getEndpoint(endpointId);

        let notificationMessage = "The following heartbeats are stale:\n\n";

        for (const heartbeat of heartbeats) {
            const overdueTimeFormatted = formatSeconds(startTime - heartbeat.last_heartbeat - heartbeat.max_heartbeat_interval_seconds);
            const lastHeartbeatFormatted = dayjs.unix(heartbeat.last_heartbeat).tz(endpoint.timezone).
                format("YYYY-MM-DD HH:mm:ss Z");
            notificationMessage += `${heartbeat.email_name} - ${overdueTimeFormatted} overdue - Last heartbeat: ${lastHeartbeatFormatted}\n`;
        }

        await sendPushoverMessage(
            endpoint.user_key,
            notificationMessage
        );
        await HeartbeatController.recordHeartbeatStaleNotifications(heartbeats.map((h) => h.email_name));
    }
}

setInterval(
    () => {
        staleHeartbeatNotifier().catch((err) => {
            logger.error(
                "Error in staleHeartbeatNotifier:",
                err
            );
        });
    },
    60000
);
