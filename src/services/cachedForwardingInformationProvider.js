import NodeCache from "node-cache";
import * as HeartbeatController from "../controllers/heartbeatController.js";
import * as PushoverController from "../controllers/PushoverController.js";

import logger from "../logger.js";

const forwardingCache = new NodeCache();

HeartbeatController.HeartbeatUpdateEventEmitter
    .on('update', email_name => forwardingCache.del(email_name))
    .on('delete', email_name => forwardingCache.del(email_name));

PushoverController.EndpointUpdateEventEmitter
    .on('update', endpoint_id => {
        HeartbeatController.getAllHeartbeatsByEndpointId(endpoint_id)
            .then(heartbeats => {
                for (const heartbeat of heartbeats) {
                    forwardingCache.del(heartbeat.email_name);
                }
            })
            .catch(err => {
                logger.error('Error flushing endpoint cache:', err);
                forwardingCache.flushAll()
            })
    });


/**
 * Get the forwarding information for the given email name
 * @param email_name
 * @returns {Promise<{forwarding_token: string, user_key: string}>}
 */
export async function getForwardingInformation(email_name) {
    const cachedForwardingInfo = forwardingCache.get(email_name);
    if (cachedForwardingInfo) {
        return cachedForwardingInfo;
    }

    let forwardingInfo = {
        forwarding_token: "",
        user_key: ""
    }

    const heartbeat = await HeartbeatController.getHeartbeat(email_name);
    const endpoint = await PushoverController.getEndpoint(heartbeat.endpoint_id);

    forwardingInfo.user_key = endpoint.user_key;

    if (!heartbeat || !heartbeat.forwarding_token) {
        forwardingInfo.forwarding_token = process.env.PUSHOVER_TOKEN;
    }
    else {
        forwardingInfo.forwarding_token = heartbeat.forwarding_token;
    }

    forwardingCache.set(email_name, forwardingInfo);
    return forwardingInfo;
}