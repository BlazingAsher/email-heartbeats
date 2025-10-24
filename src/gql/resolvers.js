import * as HeartbeatController from "../controllers/HeartbeatController.js";
import * as PushoverController from "../controllers/PushoverController.js";
import * as EmailController from "../controllers/EmailController.js";
import * as ApiTokenController from "../controllers/ApiTokenController.js";

export const resolvers = {
    "Query": {
        "heartbeat": async (parent, args, context) => {
            if(!context.privileges.has("read")){
                throw new Error("Unauthorized");
            }

            return HeartbeatController.getHeartbeat(args.email_name);
        },
        "heartbeats": async (_, __, context) => {
            if(!context.privileges.has("read")){
                throw new Error("Unauthorized");
            }

            return HeartbeatController.getAllHeartbeats();
        },
        "staleHeartbeats": async (_, __, context) => {
            if(!context.privileges.has("read")){
                throw new Error("Unauthorized");
            }

            return HeartbeatController.getStaleHeartbeats();
        },
        "neverTriggeredHeartbeats": async (_, __, context) => {
            if(!context.privileges.has("read")){
                throw new Error("Unauthorized");
            }

            return HeartbeatController.getNeverTriggeredHeartbeats();
        },
        "pushoverEndpoints": async (_, __, context) => {
            if(!context.privileges.has("read")){
                throw new Error("Unauthorized");
            }

            return PushoverController.getEndpoints();
        },
        "pushoverEndpoint": async (parent, args, context) => {
            if(!context.privileges.has("read")){
                throw new Error("Unauthorized");
            }

            return PushoverController.getEndpoint(args.id);
        },
        "apiTokens": async (_, __, context) => {
            if(!context.privileges.has("read")){
                throw new Error("Unauthorized");
            }

            return ApiTokenController.getAllApiTokens();
        },
        "apiToken": async (parent, args, context) => {
            if(!context.privileges.has("read")){
                throw new Error("Unauthorized");
            }

            return ApiTokenController.getApiToken(args.id);
        },
        "emails": async (parent, args, context) => {
            if(!context.privileges.has("read")){
                throw new Error("Unauthorized");
            }

            return EmailController.getEmails(
                args.newer_than ?? 0,
                args.limit
            );
        },
        "email": async (parent, args, context) => {
            if(!context.privileges.has("read")){
                throw new Error("Unauthorized");
            }

            return EmailController.getEmail(args.id);
        }
    },
    "Mutation": {
        "createHeartbeat": async (parent, args, context) => {
            if(!context.privileges.has("write")){
                throw new Error("Unauthorized");
            }

            await HeartbeatController.createHeartbeat(
                args.email_name,
                args.max_heartbeat_interval_seconds,
                args.matching_criteria,
                args.endpoint_id,
                args.forwarding_token,
                args.description,
                args.disabled_until
            );
            return HeartbeatController.getHeartbeat(args.email_name);
        },
        "recordHeartbeat": async (parent, args, context) => {
            if(!context.privileges.has("write")){
                throw new Error("Unauthorized");
            }

            return HeartbeatController.recordHeartbeat(args.email_name);
        },
        "updateHeartbeat": async (parent, args, context) => {
            if(!context.privileges.has("write")){
                throw new Error("Unauthorized");
            }

            await HeartbeatController.updateHeartbeat(
                args.email_name,
                args.max_heartbeat_interval_seconds,
                args.matching_criteria,
                args.endpoint_id,
                args.forwarding_token,
                args.description,
                args.disabled_until
            );
            return HeartbeatController.getHeartbeat(args.email_name);
        },
        "deleteHeartbeat": async (parent, args, context) => {
            if(!context.privileges.has("write")){
                throw new Error("Unauthorized");
            }

            return HeartbeatController.deleteHeartbeat(args.email_name);
        },
        "createPushoverEndpoint": async (parent, args, context) => {
            if(!context.privileges.has("write")){
                throw new Error("Unauthorized");
            }

            return PushoverController.createEndpoint(
                args.user_key,
                args.description
            );
        },
        "updatePushoverEndpoint": async (parent, args, context) => {
            if(!context.privileges.has("write")){
                throw new Error("Unauthorized");
            }

            return PushoverController.updateEndpoint(
                args.id,
                args.user_key,
                args.description
            );
        },
        "deleteEmailsOlderThan": async (parent, args, context) => {
            if(!context.privileges.has("write")){
                throw new Error("Unauthorized");
            }

            return EmailController.deleteEmailsOlderThan(args.timestamp);
        },
        "createApiToken": async (parent, args, context) => {
            if(!context.privileges.has("write")){
                throw new Error("Unauthorized");
            }

            return ApiTokenController.createApiToken(args.description, args.access_controls);
        },
        "updateApiToken": async (parent, args, context) => {
            if(!context.privileges.has("write")){
                throw new Error("Unauthorized");
            }

            return ApiTokenController.updateApiToken(
                args.id,
                args.description,
                args.access_controls
            );
        },
        "deleteApiToken": async (parent, args, context) => {
            if(!context.privileges.has("write")){
                throw new Error("Unauthorized");
            }

            return ApiTokenController.deleteApiToken(args.id);
        }
    },
    "Heartbeat": {
        "endpoint": async (parent) => {
            return PushoverController.getEndpoint(parent.endpoint_id);
        },
        "matching_criteria": (parent) => {
            return JSON.stringify(parent.matching_criteria);
        }
    },
    "Email": {
        "heartbeat": async (parent) => {
            return HeartbeatController.getHeartbeat(parent.email_name);
        }
    }
};
