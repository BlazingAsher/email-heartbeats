import * as HeartbeatController from '../controllers/HeartbeatController.js';
import * as PushoverController from '../controllers/PushoverController.js';

export const resolvers = {
    Query: {
        heartbeat: async (parent, args, context, info) => {
            return HeartbeatController.getHeartbeat(args.email_name);
        },
        heartbeats: async (parent, args, context, info) => {
            return HeartbeatController.getAllHeartbeats();
        },
        staleHeartbeats: async (parent, args, context, info) => {
            return HeartbeatController.getStaleHeartbeats();
        },
        neverTriggeredHeartbeats: async (parent, args, context, info) => {
            return HeartbeatController.getNeverTriggeredHeartbeats();
        },
        pushoverEndpoints: async (parent, args, context, info) => {
            return PushoverController.getEndpoints();
        },
        pushoverEndpoint: async (parent, args, context, info) => {
            return PushoverController.getEndpoint(args.id);
        }
    },
    Mutation: {
        createHeartbeat: async (parent, args, context, info) => {
            await HeartbeatController.createHeartbeat(args.email_name, args.maximum_interval_seconds, args.matching_criteria);
            return HeartbeatController.getHeartbeat(args.email_name);
        },
        recordHeartbeat: async (parent, args, context, info) => {
            return HeartbeatController.recordHeartbeat(args.email_name);
        },
        updateHeartbeat: async (parent, args, context, info) => {
            await HeartbeatController.updateHeartbeat(args.email_name, args.maximum_interval_seconds, args.matching_criteria);
            return HeartbeatController.getHeartbeat(args.email_name);
        },
        deleteHeartbeat: async (parent, args, context, info) => {
            return HeartbeatController.deleteHeartbeat(args.email_name);
        },
        createPushoverEndpoint: async (parent, args, context, info) => {
            return PushoverController.createEndpoint(args.user_key, args.description);
        }
    },
    Heartbeat: {
        endpoint: async (parent, args, context, info) => {
            return PushoverController.getEndpoint(parent.endpoint_id);
        }
    }
}