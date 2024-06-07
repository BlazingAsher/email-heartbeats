import * as HeartbeatController from "../controllers/HeartbeatController.js";
import * as PushoverController from "../controllers/PushoverController.js";
import * as EmailController from "../controllers/EmailController.js";
import * as ApiTokenController from "../controllers/ApiTokenController.js";

export const resolvers = {
    "Query": {
        "heartbeat": async (parent, args) => {
            return HeartbeatController.getHeartbeat(args.email_name);
        },
        "heartbeats": async () => {
            return HeartbeatController.getAllHeartbeats();
        },
        "staleHeartbeats": async () => {
            return HeartbeatController.getStaleHeartbeats();
        },
        "neverTriggeredHeartbeats": async () => {
            return HeartbeatController.getNeverTriggeredHeartbeats();
        },
        "pushoverEndpoints": async () => {
            return PushoverController.getEndpoints();
        },
        "pushoverEndpoint": async (parent, args) => {
            return PushoverController.getEndpoint(args.id);
        },
        "apiTokens": async () => {
            return ApiTokenController.getAllApiTokens();
        },
        "apiToken": async (parent, args) => {
            return ApiTokenController.getApiToken(args.id);
        }
    },
    "Mutation": {
        "createHeartbeat": async (parent, args) => {
            await HeartbeatController.createHeartbeat(
                args.email_name,
                args.max_heartbeat_interval_seconds,
                args.matching_criteria,
                args.endpoint_id,
                args.forwarding_token
            );
            return HeartbeatController.getHeartbeat(args.email_name);
        },
        "recordHeartbeat": async (parent, args) => {
            return HeartbeatController.recordHeartbeat(args.email_name);
        },
        "updateHeartbeat": async (parent, args) => {
            await HeartbeatController.updateHeartbeat(
                args.email_name,
                args.max_heartbeat_interval_seconds,
                args.matching_criteria,
                args.endpoint_id,
                args.forwarding_token
            );
            return HeartbeatController.getHeartbeat(args.email_name);
        },
        "deleteHeartbeat": async (parent, args) => {
            return HeartbeatController.deleteHeartbeat(args.email_name);
        },
        "createPushoverEndpoint": async (parent, args) => {
            return PushoverController.createEndpoint(
                args.user_key,
                args.description
            );
        },
        "updatePushoverEndpoint": async (parent, args) => {
            return PushoverController.updateEndpoint(
                args.id,
                args.user_key,
                args.description
            );
        },
        "deleteEmailsOlderThan": async (parent, args) => {
            return EmailController.deleteEmailsOlderThan(args.timestamp);
        },
        "createApiToken": async (parent, args) => {
            return ApiTokenController.createApiToken(args.description);
        },
        "updateApiToken": async (parent, args) => {
            return ApiTokenController.updateApiToken(
                args.id,
                args.description
            );
        },
        "deleteApiToken": async (parent, args) => {
            return ApiTokenController.deleteApiToken(args.id);
        }
    },
    "Heartbeat": {
        "endpoint": async (parent) => {
            return PushoverController.getEndpoint(parent.endpoint_id);
        }
    }
};
